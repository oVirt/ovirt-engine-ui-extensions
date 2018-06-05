import React from 'react'
import PropTypes from 'prop-types'
import { hostAutoSelectItemValue } from './VmMigrateModalBody'
import DataProvider from '../../helper/DataProvider'
import { useFakeData } from '../../../constants'
import { engineGet, enginePost } from '../../../utils/fetch'
import { msg } from '../../../intl-messages'

const fetchVmsFakeData = {
  vm: [
    // VM with host assigned
    { id: 'abc123', name: 'test-vm-1', host: { id: 'xyz789' } },
    // VM without a host
    { id: 'def456', name: 'test-vm-2' }
  ]
}

const fetchTargetHostsFakeData = {
  host: [
    { id: 'xyz789', name: 'test-host-1' },
    { id: 'foo123', name: 'test-host-2' },
    { id: 'bar456', name: 'test-host-3' }
  ]
}

function migrateToHostFakeResult () {
  return Math.random() < 1 ? {
    status: 'failed',
    fault: {
      detail: 'Error: too many hamsters detected!'
    }
  } : {}
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
  const currentHostIds = vms
    .filter(vm => vm.host && vm.host.id)
    .map(vm => vm.host.id)

  const json = (useFakeData && fetchTargetHostsFakeData) ||
    await engineGet(`api/hosts?migration_target_of=${vms.map(vm => vm.id).join(',')}`)
  const targetHosts = json.host

  if (!Array.isArray(targetHosts)) {
    throw new Error('VmMigrateDataProvider: Failed to fetch target hosts')
  }

  if (currentHostIds.length === 1) {
    // filter out the current host
    return targetHosts.filter(host => host.id !== currentHostIds[0])
  } else {
    // multiple source hosts, don't filter
    return targetHosts
  }
}

/**
 * Migrate VMs to the target host.
 *
 * Returns an array of error messages (strings) if one or more VMs failed
 * to migrate, or an empty array if all VMs were migrated successfully.
 */
async function migrateToHost (targetHostId, vms) {
  const targetHost = targetHostId === hostAutoSelectItemValue
    ? {} // any host
    : { host: { id: targetHostId } }
  const targetHostBody = JSON.stringify(targetHost)
  const errors = []

  for (const vm of vms) {
    if (!vm.host || vm.host.id !== targetHostId) {
      const json = (useFakeData && migrateToHostFakeResult()) ||
        await enginePost(`api/vms/${vm.id}/migrate`, targetHostBody)

      if (json.status === 'failed') {
        errors.push(msg.migrateVmErrorTemplate({
          vmName: vm.name,
          message: json.fault.detail
        }))
      }
    }
  }

  return errors
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
          return React.cloneElement(child, {
            errorMessage: msg.migrateVmDataError()
          })
        } else if (fetchInProgress || !data) {
          return React.cloneElement(child, {
            isLoading: true
          })
        }

        // unwrap data
        const { vms, targetHosts } = data

        // check if there are any target hosts available
        if (targetHosts.length === 0) {
          return React.cloneElement(child, {
            errorMessage: msg.migrateVmNoAvailableHost()
          })
        }

        // pass relevant data and operations to child component
        return React.cloneElement(child, {
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
