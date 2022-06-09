import React from 'react'
import PropTypes from 'prop-types'
import getPluginApi from '_/plugin-api'
import DataProvider from '_/components/helper/DataProvider'
import { webadminToastTypes } from '_/constants'
import config from '_/plugin-config'
import { engineGet, enginePost } from '_/utils/fetch'
import { resultAfterSleep } from '_/utils/fake-data'
import { msg } from '_/intl-messages'

const fetchFakeData = async () => {
  return await resultAfterSleep(
    [
      { id: 'dst111', name: 'dest-host-1', cluster: { id: 'xyz789' } },
      { id: 'dst222', name: 'dest-host-2', cluster: { id: 'xyz789' } },
      { id: 'dst333', name: 'dest-host-3', cluster: { id: 'xyz789' } },
    ]
  )
}

/**
 * Fetch valid target hosts in the same cluster as source host, excluding the source host.
 */
async function fetchTargetHosts (sourceHostId) {
  if (config.useFakeData) {
    return await fetchFakeData()
  }

  const apiHosts = await engineGet('api/hosts')
  const allHosts = Array.isArray(apiHosts.host) ? apiHosts.host : []

  const sourceHost = allHosts.find(host => host.id === sourceHostId)
  return !sourceHost
    ? []
    : allHosts.filter(host => host.id !== sourceHost.id && host.cluster.id === sourceHost.cluster.id)
}

/**
 * Copy networks to the target host.
 *
 * This function doesn't need to be async, since `HostCopyNetworksModal` is closed
 * (no further interaction available) once the "Copy" button is clicked.
 */
function copyNetworksToHost (sourceHostId, targetHostId) {
  const requestBody = {}

  if (config.useFakeData) {
    getPluginApi().showToast(webadminToastTypes.info, 'Using fake data, nothing to copy.')
    return
  }

  requestBody.source_host = { id: sourceHostId }
  if (targetHostId) {
    enginePost(`api/hosts/${targetHostId}/copyhostnetworks`, JSON.stringify(requestBody))
  }
}

const HostCopyNetworksDataProvider = ({ sourceHostId, children }) => {
  return (
    <DataProvider fetchData={() => fetchTargetHosts(sourceHostId)}>
      {({ data, fetchError, fetchInProgress, fetchAndUpdateData }) => {
        // handle data loading and error scenarios
        if (fetchError) {
          getPluginApi().showToast(webadminToastTypes.danger, msg.hostCopyNetworksDataError())
          return null
        }
        if (fetchInProgress || !data) {
          return children({ isLoading: true })
        }

        const targetHosts = data
        return children({
          hostNames: targetHosts.map(host => host.name),
          targetHostItems: targetHosts.map(host => ({
            value: host.id,
            text: host.name,
          })),
          onRefreshHosts: () => { fetchAndUpdateData() },
          onCopyNetworksToHost: (targetHostId) => copyNetworksToHost(sourceHostId, targetHostId),
        })
      }}
    </DataProvider>
  )
}

HostCopyNetworksDataProvider.propTypes = {
  sourceHostId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
}

export default HostCopyNetworksDataProvider
