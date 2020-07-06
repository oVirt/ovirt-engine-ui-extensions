import React from 'react'
import PropTypes from 'prop-types'
import getPluginApi from '../../../plugin-api'
import DataProvider from '../../helper/DataProvider'
import { webadminToastTypes } from '../../../constants'
import config from '../../../plugin-config'
import { engineGet, enginePost } from '../../../utils/fetch'
import { msg } from '../../../intl-messages'

const fetchTargetHostsFakeData = {
  host: [
    { id: 'src123', name: 'src-host-1', cluster: { id: 'xyz789' } },
    { id: 'dst111', name: 'dest-host-1', cluster: { id: 'xyz789' } },
    { id: 'dst222', name: 'dest-host-2', cluster: { id: 'xyz789' } },
    { id: 'dst333', name: 'dest-host-3', cluster: { id: 'xyz789' } }
  ]
}

/**
 * Fetch valid target hosts
 * @returns all hosts in same cluster as source host except source host
 */
async function fetchTargetHosts (sourceHostId) {
  const json = (config.useFakeData && fetchTargetHostsFakeData) ||
    await engineGet('api/hosts')
  let allHosts = Array.isArray(json.host) ? json.host : []
  const sourceHost = allHosts.find(host => host.id === sourceHostId)
  return allHosts
    .filter(host => host.id !== sourceHostId)
    .filter(host => host.cluster.id === sourceHost.cluster.id)
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

  requestBody['source_host'] = { id: sourceHostId }
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
            text: host.name
          })),
          onRefreshHosts: () => { fetchAndUpdateData() },
          onCopyNetworksToHost: (targetHostId) => copyNetworksToHost(sourceHostId, targetHostId)
        })
      }}
    </DataProvider>
  )
}

HostCopyNetworksDataProvider.propTypes = {
  sourceHostId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
}

export default HostCopyNetworksDataProvider
