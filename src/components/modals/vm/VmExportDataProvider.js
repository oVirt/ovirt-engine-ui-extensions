import React from 'react'
import PropTypes from 'prop-types'
import getPluginApi from '_/plugin-api'
import DataProvider from '_/components/helper/DataProvider'
import { webadminToastTypes } from '_/constants'
import { currentLocale } from '_/utils/intl'
import { engineGet, enginePost } from '_/utils/fetch'
import { msg } from '_/intl-messages'

async function fetchDataCenterForVm (vmId) {
  const vm = await engineGet(`api/vms/${vmId}?follow=cluster`)

  if (!vm || vm.error) {
    throw new Error('VmExportDataProvider: Failed to fetch vm data')
  }

  return vm.cluster.data_center.id
}

async function fetchUpStorageDomains (vmId) {
  const datacenter = await fetchDataCenterForVm(vmId)
  const json = await engineGet(`api/datacenters/${datacenter}/storagedomains`)
  const storageDomains = json.storage_domain

  if (!Array.isArray(storageDomains)) {
    throw new Error('VmExportDataProvider: Failed to fetch Storage Domains')
  }

  return storageDomains
    .filter(sd => sd.status === 'active' && sd.type === 'data')
    .map(sd => {
      return { id: sd.id, name: sd.name }
    })
    .sort((a, b) => a.name.localeCompare(b.name, currentLocale(), { numeric: true }))
}

async function validateThinVm (vmId, sdId) {
  const emptyGuid = '00000000-0000-0000-0000-000000000000'

  const vm = await engineGet(`api/vms/${vmId}`)

  // If a VM has both attributes set it's thin/dependent
  if (vm.original_template.id === emptyGuid || vm.template.id === emptyGuid) {
    return true
  }

  const templateDisks = await engineGet(
    `api/templates/${vm.template.id}/diskattachments?follow=disk`
  )

  return templateDisks.disk_attachment.every(td => {
    const storageDomains = td.disk.storage_domains.storage_domain
    return storageDomains.some(sd => sd.id === sdId)
  })
}

async function exportVm (vmId, exportName, sdId, collapseSnapshots) {
  const validateResponse = await validateThinVm(vmId, sdId)
  if (!validateResponse) {
    throw new Error(
      msg.exportVmTemplateNotOnStorageDomainError({exportName})
    )
  }

  const requestBody = {
    discard_snapshots: !!collapseSnapshots,
    storage_domain: {
      id: sdId
    },
    vm: {
      name: exportName
    }
  }

  const response = await enginePost(
    `api/vms/${vmId}/clone`,
    JSON.stringify(requestBody)
  )

  return response
}

const VmExportDataProvider = ({ children, vm }) => {
  const fetchData = async () => {
    const storageDomains = await fetchUpStorageDomains(vm.id)
    return { storageDomains }
  }

  return (
    <DataProvider fetchData={fetchData}>
      {({ data, fetchError, fetchInProgress }) => {
        // expecting single child component
        const child = React.Children.only(children)

        // handle data loading and error scenarios
        if (fetchError) {
          getPluginApi().showToast(webadminToastTypes.danger, msg.exportVmDataError())
          return null
        }

        if (fetchInProgress || !data) {
          return React.cloneElement(child, { isLoading: true })
        }

        // unwrap data
        const { storageDomains } = data

        // pass relevant data and operations to child component
        return React.cloneElement(child, {
          storageDomains,
          onExportVm: exportVm
        })
      }}
    </DataProvider>
  )
}

VmExportDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  vm: PropTypes.object.isRequired
}

export default VmExportDataProvider
