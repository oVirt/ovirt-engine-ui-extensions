import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import getPluginApi from '_/plugin-api'
import { createErrorMessage } from '_/utils/error-message'

import { Button } from '@patternfly/react-core'
import PluginApiModal from '_/components/modals/PluginApiModal'
import LoadingSpinner from '_/components/helper/LoadingSpinner'
import StorageConnectionsModalBody from './StorageConnectionsModalBody'

import './connections.css'

const StorageConnectionsModal = ({
  isLoading = false,
  storageDomain,
  connections,
  onClose,
  hosts,
  doConnectionCreate = () => { },
  doConnectionEdit = () => { },
  doConnectionDelete = () => { },
  doConnectionAttach = () => { },
  doConnectionDetach = () => { },
  doRefreshConnections = () => { },
  doConnectionSearch = () => { },
  doConnectionCreateAndAttach = () => { },
}) => {
  const [isOpen, setOpen] = useState(true)
  const [error, setError] = useState(null)
  const [isShowAll, setShowAll] = useState(false)
  const [shownConnections, setShownConnections] = useState(null)
  const [discoveredConnections, setDiscoveredConnections] = useState(null)
  const [shownHosts, setShownHosts] = useState(null)

  useEffect(() => {
    setShownHosts(hosts)
    setShownConnections(isShowAll || !connections ? connections : connections.filter(conn => conn.isAttachedToDomain))
  }, [isShowAll, connections, hosts])

  if (!connections) {
    return null
  }

  const close = () => {
    setOpen(false)
    onClose()
  }

  const modalActions = [
    <Button
      key='storage-connections-modal-cancel-button'
      variant='primary'
      onClick={close}
    >
      {msg.closeButton()}
    </Button>,
  ]

  const onConnectionCreate = async (connection) => {
    try {
      await doConnectionCreate(connection)
      doRefreshConnections()
      setShowAll(true)
    } catch (e) {
      getPluginApi().logger().severe('Error while creating connection. ' + createErrorMessage(e))
      setError(e.detail)
    }
  }

  const onConnectionSearch = async (ip, hostId, port) => {
    try {
      setDiscoveredConnections(null)
      const allConnections = await doConnectionSearch(ip, hostId, port)
      const filtered = allConnections.filter(item => {
        const match = connections.find(secondItem => secondItem.address === item.address)
        return !match || (match && !match.isAttachedToDomain)
      })
      setDiscoveredConnections(filtered)
    } catch (e) {
      setError(e.detail)
    }
  }

  const onConnectionCreateAndAttach = async (connection, domainId) => {
    await doConnectionCreateAndAttach(connection, domainId)
    doRefreshConnections()
    const newdiscoveredList = discoveredConnections.filter(con => con.address !== connection.address)
    setDiscoveredConnections(newdiscoveredList)
  }

  const onConnectionEdit = async (connection, connectionId) => {
    try {
      await doConnectionEdit(connection, connectionId)
      doRefreshConnections()
    } catch (e) {
      getPluginApi().logger().severe('Error while editing connection. ' + createErrorMessage(e))
      setError(e.detail)
    }
  }

  const onConnectionDelete = async (connectionId) => {
    try {
      await doConnectionDelete(connectionId)
      doRefreshConnections()
    } catch (e) {
      getPluginApi().logger().severe('Error while deleting connection. ' + createErrorMessage(e))
      setError(e.detail)
    }
  }

  const onConnectionAttach = async (connectionId, domainId) => {
    try {
      await doConnectionAttach(connectionId, domainId)
      doRefreshConnections()
    } catch (e) {
      getPluginApi().logger().severe('Error while attaching connection. ' + createErrorMessage(e))
      setError(e.detail)
    }
  }

  const onConnectionDetach = async (connectionId, domainId) => {
    try {
      await doConnectionDetach(connectionId, domainId)
      doRefreshConnections()
    } catch (e) {
      getPluginApi().logger().severe('Error while detaching connection. ' + createErrorMessage(e))
      setError(e.detail)
    }
  }

  return (
    <PluginApiModal
      id='storage-connections-modal'
      className='storage-connections-modal'
      variant='large'
      title={
        storageDomain
          ? msg.storageConnectionsTitleWithName({ sdName: storageDomain.name })
          : msg.storageConnectionsTitle()
      }
      isOpen={isOpen}
      onClose={close}
      actions={modalActions}
    >
      <LoadingSpinner isLoading={isLoading}>
        <StorageConnectionsModalBody
          storageDomain={storageDomain}
          hosts={shownHosts}
          connections={shownConnections}
          foundConnections={discoveredConnections}
          isShowAll={isShowAll}
          setShowAll={setShowAll}
          error={error}
          setError={setError}
          onCreate={onConnectionCreate}
          onEdit={onConnectionEdit}
          onDelete={onConnectionDelete}
          onAttach={onConnectionAttach}
          onDetach={onConnectionDetach}
          onSearch={onConnectionSearch}
          onCreateAndAttach={onConnectionCreateAndAttach}
        />
      </LoadingSpinner>
    </PluginApiModal>
  )
}

StorageConnectionsModal.propTypes = {
  isLoading: PropTypes.bool,
  storageDomain: PropTypes.object,
  hosts: PropTypes.array,
  connections: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  doConnectionCreate: PropTypes.func,
  doConnectionEdit: PropTypes.func,
  doConnectionDelete: PropTypes.func,
  doConnectionAttach: PropTypes.func,
  doConnectionDetach: PropTypes.func,
  doConnectionSearch: PropTypes.func,
  doRefreshConnections: PropTypes.func,
  doConnectionCreateAndAttach: PropTypes.func,
}

export default StorageConnectionsModal
