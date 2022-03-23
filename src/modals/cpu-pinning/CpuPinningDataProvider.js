import PropTypes from 'prop-types'
import React from 'react'
import DataProvider from '_/components/helper/DataProvider'
import { webadminToastTypes } from '_/constants'
import { msg } from '_/intl-messages'
import { isExclusive } from './CpuPinningPolicy'
import getPluginApi from '_/plugin-api'
import { engineGet } from '_/utils/fetch'
import { parse } from './cpuPinningParser'
import PinnedEntity from './PinnedEntity'
import { Topology } from './PinnedEntityTopology'

const fetchVm = async (vmId) => {
  return engineGet(`api/vms/${vmId}`)
}

const fetchHost = async (hostId) => {
  return engineGet(`api/hosts/${hostId}`)
}

const fetchHostCpuUnits = async (hostId) => {
  return engineGet(`api/hosts/${hostId}/cpuunits`)
}

const fetchHosts = async (hostsIds) => {
  return Promise.all(hostsIds.map((hostId) => fetchHost(hostId)))
}

const getSockets = (vm) => {
  if (vm.dynamic_cpu?.topology) {
    return +vm.dynamic_cpu.topology.sockets
  } else {
    return +vm.cpu.topology.sockets
  }
}

const getCores = (vm) => {
  if (vm.dynamic_cpu?.topology) {
    return +vm.dynamic_cpu.topology.cores
  } else {
    return +vm.cpu.topology.cores
  }
}

const getThreads = (vm) => {
  if (vm.dynamic_cpu?.topology) {
    return +vm.dynamic_cpu.topology.threads
  } else {
    return +vm.cpu.topology.threads
  }
}

const getCpuPinningString = (vm) => {
  // e.g 0#0_1#1-4,^2
  return getPinnings(vm)
    .map(({ vcpu, cpuSet }) => `${vcpu}#${cpuSet}`)
    .join('_')
}

const getCpuToPinnedCpuMapForVm = (vm) => {
  return getPinnings(vm).reduce(
    (mapping, pinning) => {
      const [vcpu, pcpus] = parse(pinning)
      mapping.set(vcpu, [...pcpus])
      return mapping
    },
    new Map()
  )
}

const getPinnings = (vm) => {
  if (vm.cpu_pinning_policy === 'manual') {
    return getPinningsFromProperty('cpu', vm)
  } else {
    return getPinningsFromProperty('dynamic_cpu', vm)
  }
}

const getPinningsFromProperty = (property, vm) => {
  const cpuPinnings = []
  if (vm[property]?.cpu_tune?.vcpu_pins?.vcpu_pin?.length > 0) {
    vm[property].cpu_tune.vcpu_pins.vcpu_pin.forEach((pinning) =>
      cpuPinnings.push({
        vcpu: pinning.vcpu,
        cpuSet: pinning.cpu_set,
      })
    )
  }
  return cpuPinnings
}

const getHostIds = (vm) => {
  if (vm.cpu_pinning_policy === 'manual') {
    return getPlacementPolicyHostsIds(vm)
  } else if (vm.cpu_pinning_policy !== 'none' && vm.host?.id) {
    return [vm.host?.id]
  } else {
    return []
  }
}

const getPlacementPolicyHostsIds = (vm) => {
  const hostsIds = []
  if (vm.placement_policy?.hosts?.host?.length > 0) {
    vm.placement_policy.hosts.host.forEach((host) => {
      hostsIds.push(host.id)
    })
  }
  return hostsIds
}

const mapVmToPinnedEntity = (vm) => {
  const sockets = getSockets(vm)
  const cores = getCores(vm)
  const threads = getThreads(vm)
  const cpuToPinnedCpuMap = getCpuToPinnedCpuMapForVm(vm)
  const topology = new Topology()
  if (sockets && cores && threads) {
    // cpuId is globally unique and is counted incrementally through sockets, cores and threads
    let currentCpuId = 0
    for (let s = 0; s < sockets; s++) {
      for (let c = 0; c < cores; c++) {
        for (let t = 0; t < threads; t++) {
          topology.add(s, c, currentCpuId, cpuToPinnedCpuMap.get(currentCpuId))
          currentCpuId++
        }
      }
    }
  }
  return new PinnedEntity({
    id: vm.id,
    name: vm.name,
    cpuCount: sockets * cores * threads,
    cpuPinningTopology: topology,
    cpuPinningPolicy: vm.cpu_pinning_policy,
    cpuPinningString: getCpuPinningString(vm),
  })
}

const getCpuCount = (host) => {
  let cpuCount = 0
  if (host.cpu?.topology) {
    const topology = host.cpu.topology
    cpuCount = topology.sockets * topology.cores * topology.threads
  }
  return cpuCount
}

const createCpuPinningTopology = (cpuUnits) => {
  const cpuPinningTopology = new Topology()

  cpuUnits?.host_cpu_unit?.forEach(({
    socket_id: socketId,
    core_id: coreId,
    cpu_id: cpuId,
    runs_vdsm: runsVDSM,
    vms,
  }) => {
    const exclusivelyPinned = vms?.vm.some(vm => isExclusive(vm.cpu_pinning_policy))
    const pinnedEntities = (vms?.vm.map(vm => vm.name) || []).sort()
    if (runsVDSM) {
      pinnedEntities.unshift('VDS Manager')
    }

    cpuPinningTopology.add(socketId, coreId, cpuId, pinnedEntities, exclusivelyPinned)
  })

  return cpuPinningTopology
}

const mapHostToPinnedEntity = (host, cpuUnits) => {
  return new PinnedEntity({
    id: host.id,
    name: host.name,
    cpuCount: getCpuCount(host),
    cpuPinningTopology: createCpuPinningTopology(cpuUnits),
  })
}

const mapHostsToPinnedEntities = (hosts) => {
  return hosts.map((host) => mapHostToPinnedEntity(host))
}

const CpuPinningDataProvider = ({ children, vmId, hostId }) => {
  const fetchData = async () => {
    if (vmId) {
      return fetchDataVmView()
    } else if (hostId) {
      return fetchDataHostView()
    } else {
      throw new Error('At least one of vmId, hostId needs to be specified')
    }
  }

  const fetchDataVmView = async () => {
    const vm = await fetchVm(vmId)
    const hosts = await fetchHosts(getHostIds(vm))
    return {
      mainEntity: mapVmToPinnedEntity(vm),
      pinnedEntities: mapHostsToPinnedEntities(hosts),
    }
  }

  const fetchDataHostView = async () => {
    const host = await fetchHost(hostId)
    const cpuUnits = await fetchHostCpuUnits(hostId)
    return {
      mainEntity: mapHostToPinnedEntity(host, cpuUnits),
      pinnedEntities: [],
    }
  }

  return (
    <DataProvider fetchData={fetchData}>
      {({ data, fetchError, fetchInProgress, fetchAndUpdateData }) => {
        // expecting single child component
        const child = React.Children.only(children)

        // handle data loading and error scenarios
        if (fetchError) {
          getPluginApi().showToast(
            webadminToastTypes.danger,
            msg.cpuPinningDataError()
          )
          return null
        }

        if (fetchInProgress || !data) {
          return React.cloneElement(child, { isLoading: true })
        }

        // pass relevant data and operations to child component
        return React.cloneElement(child, {
          mainEntity: data.mainEntity,
          pinnedEntities: data.pinnedEntities,
        })
      }}
    </DataProvider>
  )
}

CpuPinningDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  vmId: PropTypes.string,
  hostId: PropTypes.string,
}

export default CpuPinningDataProvider
