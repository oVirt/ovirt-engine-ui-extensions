import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import getPluginApi from '../../../plugin-api'
import { webadminToastTypes } from '../../../constants'
import config from '../../../plugin-config'
import { engineGet, enginePost } from '../../../utils/fetch'
import { randomId } from '../../../utils/random'
import { msg } from '../../../intl-messages'
import { useDataProvider } from '../../helper/DataProviderHook'

function randomVms (vmCount) {
  return Array.from(Array(vmCount), (element, index) => ({
    id: randomId(),
    name: `random-vm-${index}`,
    host: { id: 'foo123' }
  }))
}

const fetchVmsFakeData = {
  vm: [
    // VM with a host => this VM is running on that host
    { id: 'abc123', name: 'test-vm-1', host: { id: 'xyz789' } },
    // VM without a host => this VM is not running
    { id: 'def456', name: 'test-vm-2' },
    // add some more randomly generated VMs
    ...randomVms(20)
  ]
}

const fetchTargetHostsFakeData = (function * () {
  const firstResponse = {
    host: [
      { id: 'xyz789', name: 'test-host-1' },
      { id: 'foo123', name: 'test-host-2' },
      { id: 'bar456', name: 'test-host-3' }
    ]
  }
  const secondResponse = {}
  while (true) {
    yield secondResponse
    yield firstResponse
  }
})()

/**
 * Fetch Engine VMs based on their IDs.
 */
export async function fetchVms (vmIds) {
  const json = (config.useFakeData && fetchVmsFakeData) ||
    await engineGet(`api/vms/?search=id=${vmIds.join(' OR id=')}`)

  if (!json || !Array.isArray(json.vm)) {
    throw new Error('VmMigrateDataProvider: Failed to fetch VMs')
  }

  return json.vm
}

/**
 * Resolve migration target hosts for the given VMs.
 */
export async function fetchTargetHosts (vms, checkVmAffinity) {
  if (!vms) {
    return []
  }
  let currentHostIds = vms
    .filter(vm => vm.host && vm.host.id)
    .map(vm => vm.host.id)

  // remove duplicate values
  currentHostIds = [...new Set(currentHostIds)]

  const json = (config.useFakeData && fetchTargetHostsFakeData.next().value) ||
    await engineGet(`api/hosts?check_vms_in_affinity_closure=${!!checkVmAffinity}&migration_target_of=${vms.map(vm => vm.id).join(',')}`)

  // API returns either:
  // { host: [...]} OR
  // {} (empty object) when there are no host available
  // treat other payload as error
  if (!json || (json && json.host && !Array.isArray(json.host))) {
    throw new Error('VmMigrateDataProvider: Failed to fetch target hosts')
  }

  let targetHosts = json.host || []

  // If all VMs are currently running on the same host (currentHostIds.length === 1),
  // this particular host cannot be used as a migration target to any of the selected
  // VMs (since those VMs are already running on it). Otherwise, don't filter target
  // hosts, since each of them is a potential migration target to each of the VMs.
  const res = (currentHostIds.length === 1)
    ? targetHosts.filter(host => !currentHostIds.includes(host.id))
    : targetHosts
  return res
}

/**
 * Migrate VMs to the target host.
 *
 * This function doesn't need to be async, since `VmMigrateModal` is closed
 * (no further interaction available) once the "Migrate" button is clicked.
 */
function migrateToHost (targetHostId, migrateVmsInAffinity, vms) {
  const requestBody = { force: true }

  if (targetHostId) {
    requestBody['host'] = { id: targetHostId }
  }
  if (migrateVmsInAffinity) {
    requestBody['migrate_vms_in_affinity_closure'] = true
  }

  if (config.useFakeData) {
    getPluginApi().showToast(webadminToastTypes.info, 'Using fake data, nothing to migrate.')
    console.info('migrateToHost, requestBody:', requestBody)
    return
  }

  vms.forEach(vm => {
    if (!vm.host || vm.host.id !== targetHostId) {
      // request VM migration but don't wait for response
      enginePost(`api/vms/${vm.id}/migrate`, JSON.stringify(requestBody))
    }
  })
}

export function useVmMigrateDataProvider (checkVmAffinity, vmIds) {
  const memoIds = useMemo(() => ([vmIds]), [...vmIds])
  const vms = useDataProvider({ fetchData: fetchVms, parameters: memoIds })
  const hosts = useDataProvider({ fetchData: fetchTargetHosts, parameters: [vms.data, false], trigger: checkVmAffinity })
  const hostsWithAffinity = useDataProvider({ fetchData: fetchTargetHosts, parameters: [vms.data, true], trigger: checkVmAffinity })

  const error = vms.fetchError ||
    (checkVmAffinity && hostsWithAffinity.fetchError) ||
     (!checkVmAffinity && hosts.fetchError)
  const targetHosts = checkVmAffinity ? hostsWithAffinity.data : hosts.data
  const dataLoaded = !!vms.data && !!targetHosts
  const targetHostItems = (targetHosts || []).map(host => ({
    value: host.id,
    text: host.name
  }))
  const vmNames = (vms.data || []).map(vm => vm.name)

  const suggestAffinity = !hostsWithAffinity.fetchError && !hosts.fetchError &&
    !!hosts.data && !!hostsWithAffinity.data &&
    !hosts.data.length && !!hostsWithAffinity.data.length

  return useMemo(() => ({
    vmNames,
    targetHostItems,
    error,
    dataLoaded,
    vms: vms.data,
    suggestAffinity
  }), [
    error,
    dataLoaded,
    vms.data,
    targetHosts,
    suggestAffinity
  ])
}

const withTargetHosts = (WrappedComponent) => {
  const enhancedComponent = (props) => {
    // state
    const {vmIds, ...otherProps} = props
    const [checkVmAffinity, setCheckVmAffinity] = useState(false)
    const {
      vmNames,
      targetHostItems,
      error,
      dataLoaded,
      vms,
      suggestAffinity
    } = useVmMigrateDataProvider(checkVmAffinity, vmIds)

    useEffect(() => {
      if (error) {
        getPluginApi().showToast(webadminToastTypes.danger, msg.migrateVmDataError())
      }
    }, [error])

    if (error) {
      return null
    }

    return (
      <WrappedComponent
        {...otherProps}
        isLoading={!dataLoaded}
        suggestAffinity={suggestAffinity}
        targetHostItems={targetHostItems}
        vmNames={vmNames}
        checkVmAffinity={checkVmAffinity}
        onRefreshHosts={(checkVmAffinity) => setCheckVmAffinity(checkVmAffinity)}
        onMigrateToHost={(hostId, migrateVmsInAffinity) => migrateToHost(hostId, migrateVmsInAffinity, vms)}
      />)
  }
  enhancedComponent.propTypes = {
    vmIds: PropTypes.arrayOf(PropTypes.string).isRequired
  }
  return enhancedComponent
}

export default withTargetHosts
