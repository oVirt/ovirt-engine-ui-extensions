import PropTypes from 'prop-types'
import React from 'react'
import DataProvider from '_/components/helper/DataProvider'
import { webadminToastTypes } from '_/constants'
import { msg } from '_/intl-messages'
import getPluginApi from '_/plugin-api'
import { engineGet } from '_/utils/fetch'

const fetchVm = async (vmId) => {
  return engineGet(`api/vms/${vmId}`)
}

const fetchHost = async (hostId) => {
  return engineGet(`api/hosts/${hostId}`)
}

const fetchHosts = async (hostsIds) => {
  return Promise.all(hostsIds.map((hostId) => fetchHost(hostId)))
}

const getSockets = (vm) => {
  if (vm.dynamic_cpu?.topology) {
    return vm.dynamic_cpu.topology.sockets
  } else {
    return vm.cpu.topology.sockets
  }
}

const getCores = (vm) => {
  if (vm.dynamic_cpu?.topology) {
    return vm.dynamic_cpu.topology.cores
  } else {
    return vm.cpu.topology.cores
  }
}

const getThreads = (vm) => {
  if (vm.dynamic_cpu?.topology) {
    return vm.dynamic_cpu.topology.threads
  } else {
    return vm.cpu.topology.threads
  }
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

const getCpus = (host) => {
  const topology = host.cpu?.topology
  if (topology) {
    return topology.sockets * topology.cores * topology.threads
  }
  return 0
}

const mapVmToModel = (vm) => {
  return {
    id: vm.id,
    name: vm.name,
    cpuTopology: {
      sockets: parseInt(getSockets(vm)),
      cores: parseInt(getCores(vm)),
      threads: parseInt(getThreads(vm)),
    },
    cpuPinningPolicy: vm.cpu_pinning_policy,
    cpuPinnings: getPinnings(vm),
  }
}

const mapHostToModel = (host) => {
  return {
    id: host.id,
    name: host.name,
    cpus: getCpus(host),
  }
}

const mapHostsToModel = (hosts) => {
  return hosts.map((host) => mapHostToModel(host))
}

const CpuPinningDataProvider = ({ children, vmId }) => {
  const fetchData = async () => {
    const vm = await fetchVm(vmId)
    const hosts = await fetchHosts(getHostIds(vm))
    return {
      vm: mapVmToModel(vm),
      hosts: mapHostsToModel(hosts),
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
          vm: data.vm,
          hosts: data.hosts,
        })
      }}
    </DataProvider>
  )
}

CpuPinningDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  vmId: PropTypes.string.isRequired,
}

export default CpuPinningDataProvider
