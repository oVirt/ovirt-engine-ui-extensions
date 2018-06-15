import React from 'react'
import PropTypes from 'prop-types'
import getPluginApi from '../../../plugin-api'
import { hostAutoSelectItemValue } from './VmMigrateModalBody'
import DataProvider from '../../helper/DataProvider'
import { useFakeData, webadminToastTypes } from '../../../constants'
import { engineGet, enginePost } from '../../../utils/fetch'
import { randomId } from '../../../utils/random'
import { msg } from '../../../intl-messages'

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

const fetchTargetHostsFakeData = {
  host: [
    { id: 'xyz789', name: 'test-host-1' },
    { id: 'foo123', name: 'test-host-2' },
    { id: 'bar456', name: 'test-host-3' }
  ]
}

/**
 * Fetch Engine VMs based on their IDs.
 */
async function fetchVms (vmIds) {
  const json = (useFakeData && fetchVmsFakeData) ||
    await engineGet(`api/vms/?search=id=${vmIds.join(' OR id=')}`)
  const vms = json.vm

  if (!Array.isArray(vms)) {
    throw new Error('VmMigrateDataProvider: Failed to fetch VMs')
  }

  return vms
}

/**
 * Resolve migration target hosts for the given VMs.
 */
async function fetchTargetHosts (vms) {
  let currentHostIds = vms
    .filter(vm => vm.host && vm.host.id)
    .map(vm => vm.host.id)

  // remove duplicate values
  currentHostIds = [...new Set(currentHostIds)]

  const json = (useFakeData && fetchTargetHostsFakeData) ||
    await engineGet(`api/hosts?migration_target_of=${vms.map(vm => vm.id).join(',')}`)
  const targetHosts = json.host

  if (!Array.isArray(targetHosts)) {
    throw new Error('VmMigrateDataProvider: Failed to fetch target hosts')
  }

  // TODO(vs) we need to clarify this filter logic
  if (currentHostIds.length === 1) {
    // filter out the current host
    return targetHosts.filter(host => !currentHostIds.includes(host.id))
  } else {
    // multiple source hosts, don't filter
    return targetHosts
  }
}

/**
 * Migrate VMs to the target host.
 *
 * This function doesn't need to be async, since `VmMigrateModal` is closed
 * (no further interaction available) once the "Migrate" button is clicked.
 */
function migrateToHost (targetHostId, vms) {
  if (!targetHostId || useFakeData) {
    if (useFakeData) {
      getPluginApi().showToast(webadminToastTypes.info, 'Using fake data, nothing to migrate.')
    }
    return
  }

  const targetHost = targetHostId === hostAutoSelectItemValue
    ? {} // let the server select host automatically
    : { host: { id: targetHostId } }
  const targetHostBody = JSON.stringify(targetHost)

  vms.forEach(vm => {
    if (!vm.host || vm.host.id !== targetHostId) {
      // request VM migration but don't wait for response
      enginePost(`api/vms/${vm.id}/migrate`, targetHostBody)
    }
  })
}

const VmMigrateDataProvider = ({ children, vmIds }) => {
  async function fetchData () {
    const vms = await fetchVms(vmIds)
    const targetHosts = await fetchTargetHosts(vms)
    return { vms, targetHosts }
  }

  return (
    <DataProvider fetchData={fetchData}>

      {({ data, fetchError, fetchInProgress }) => {
        // expecting single child component
        const child = React.Children.only(children)

        // handle data loading and error scenarios
        if (fetchError) {
          getPluginApi().showToast(webadminToastTypes.danger, msg.migrateVmDataError())
          return React.cloneElement(child, { show: false })
        } else if (fetchInProgress || !data) {
          return React.cloneElement(child, { isLoading: true })
        }

        // unwrap data
        const { vms, targetHosts } = data

        // check if there are any target hosts available
        if (targetHosts.length === 0) {
          getPluginApi().showToast(webadminToastTypes.danger, msg.migrateVmNoAvailableHost())
          return React.cloneElement(child, { show: false })
        }

        // pass relevant data and operations to child component
        return React.cloneElement(child, {
          vmNames: vms.map(vm => vm.name),
          hostSelectItems: targetHosts.map(host => ({
            value: host.id,
            text: host.name
          })),
          migrateToHost: (hostId) => migrateToHost(hostId, vms)
        })
      }}

    </DataProvider>
  )
}

VmMigrateDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  vmIds: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default VmMigrateDataProvider
