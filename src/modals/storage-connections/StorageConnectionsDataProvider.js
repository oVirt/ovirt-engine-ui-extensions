import React from 'react'
import PropTypes from 'prop-types'
import getPluginApi from '_/plugin-api'
import { engineGet, enginePost, enginePut, engineDelete } from '_/utils/fetch'
import DataProvider from '_/components/helper/DataProvider'
import { webadminToastTypes } from '_/constants'
import { msg } from '_/intl-messages'

const createConnection = async (connection) => {
  return await enginePost(
    'api/storageconnections',
    JSON.stringify(connection)
  )
}

const createAndAttachConnection = async (connection, domainId) => {
  const allConnections = await engineGet('api/storageconnections')
  const connectionsInList = allConnections.storage_connection.filter((con) => con.address === connection.address)
  if (connectionsInList.length === 1) {
    await attachConnection(connectionsInList[0].id, domainId)
  } else {
    const createdConnection = await createConnection(connection)
    await attachConnection(createdConnection.id, domainId)
  }
}

const findConnections = async (ip, hostId, port) => {
  const connectionsFoundJson = await enginePost(
    `api/hosts/${hostId}/discoveriscsi`,
    JSON.stringify({ iscsi: { address: ip, port: port } })
  )
  return connectionsFoundJson.discovered_targets.iscsi_details
}

const editConnection = async (connection, connectionId) => {
  return await enginePut(
    `api/storageconnections/${connectionId}`,
    JSON.stringify(connection)
  )
}

const deleteConnection = async (connectionId) => {
  return await engineDelete(`api/storageconnections/${connectionId}`)
}

const attachConnection = async (connectionId, domainId) => {
  return await enginePost(
    `api/storagedomains/${domainId}/storageconnections`,
    JSON.stringify({ id: connectionId })
  )
}

const detachConnection = async (connectionId, domainId) => {
  return await engineDelete(`api/storagedomains/${domainId}/storageconnections/${connectionId}`)
}

const fetchData = async (stgDomain) => {
  const headers = {
    'Cache-Control': 'no-cache',
  }
  if (!stgDomain?.id || !stgDomain?.dataCenterId) {
    throw new Error('StorageConnectionsDataProvider: invalid Storage Domain')
  }
  const [allConnectionsJson, storageDomain, domainConnectionsJson, hostsJson] = await Promise.all([
    engineGet('api/storageconnections'),
    engineGet(`api/datacenters/${stgDomain.dataCenterId}/storagedomains/${stgDomain.id}`),
    engineGet(`api/storagedomains/${stgDomain.id}/storageconnections`),
    engineGet('api/hosts', headers),
  ])

  if (!storageDomain) {
    throw new Error('StorageConnectionsDataProvider: failed to fetch storage domain')
  }

  const allConnections = allConnectionsJson?.storage_connection
  const domainConnections = domainConnectionsJson?.storage_connection
  const hosts = hostsJson?.host.filter(host => host.status === 'up')

  if (!allConnections || allConnections.error) {
    throw new Error('StorageConnectionsDataProvider: failed to fetch storage connections')
  }

  if (!domainConnections || domainConnections.error) {
    throw new Error('StorageConnectionsDataProvider: failed to fetch storage connections' +
      'for storage domain ' + stgDomain.id)
  }

  const domainConnectionsIds = new Set(domainConnections.map(connection => connection.id))
  const allConnectionsByTypeSorted = allConnections
    .filter(connection => connection.type === storageDomain.storage?.type)
    .map((connection) => {
      return { ...connection, isAttachedToDomain: domainConnectionsIds.has(connection.id) }
    })
    .sort((firstConnection, secondConnection) => {
      return (firstConnection.isAttachedToDomain === secondConnection.isAttachedToDomain) ? 0 : firstConnection.isAttachedToDomain ? -1 : 1
    })

  return {
    storageDomain: storageDomain,
    connections: allConnectionsByTypeSorted,
    hosts: hosts,
  }
}

const StorageConnectionsDataProvider = ({ children, storageDomain }) => (
  <DataProvider fetchData={() => fetchData(storageDomain)}>
    {({ data, fetchError, lastUpdated, fetchAndUpdateData }) => {
      // expecting single child component
      const child = React.Children.only(children)

      // handle data loading and error scenarios
      if (fetchError) {
        getPluginApi().showToast(webadminToastTypes.danger, msg.storageConnectionsDataError())
        return null
      }

      if (!data) {
        return React.cloneElement(child, { isLoading: true })
      }

      const { storageDomain, connections, hosts } = data

      return React.cloneElement(child, {
        storageDomain,
        connections,
        hosts,
        lastUpdated,
        doConnectionCreate: createConnection,
        doConnectionCreateAndAttach: createAndAttachConnection,
        doConnectionEdit: editConnection,
        doConnectionDelete: deleteConnection,
        doConnectionAttach: attachConnection,
        doConnectionDetach: detachConnection,
        doConnectionSearch: findConnections,
        doRefreshConnections: () => { fetchAndUpdateData() },
      })
    }}
  </DataProvider>
)

StorageConnectionsDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  storageDomain: PropTypes.object.isRequired,
}

export default StorageConnectionsDataProvider
