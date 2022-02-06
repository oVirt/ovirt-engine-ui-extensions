import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PluginApiModal from '_/components/modals/PluginApiModal'
import getPluginApi from '_/plugin-api'
import { msg } from '_/intl-messages'
import { Spinner } from 'patternfly-react'
import { Button } from '@patternfly/react-core'
import StorageConnectionsModalBody from './StorageConnectionsModalBody'
import { createErrorMessage } from '_/utils/error-message'
import './connections.css'

const StorageConnectionsModal = ({
  isLoading = false,
  storageDomain,
  connections,
  onClose,
  doConnectionCreate = () => { },
  doConnectionEdit = () => { },
  doConnectionDelete = () => { },
  doConnectionAttach = () => { },
  doConnectionDetach = () => { },
  doRefreshConnections = () => { },
}) => {
  const [isOpen, setOpen] = useState(true)
  const [error, setError] = useState(null)
  const [isShowAll, setShowAll] = useState(false)
  const [shownConnections, setShownConnections] = useState(null)

  useEffect(() => {
    setShownConnections(isShowAll || !connections ? connections : connections.filter(conn => conn.isAttachedToDomain))
  }, [isShowAll, connections])

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
      <Spinner loading={isLoading}>
        <StorageConnectionsModalBody
          storageDomain={storageDomain}
          connections={shownConnections}
          isShowAll={isShowAll}
          setShowAll={setShowAll}
          error={error}
          setError={setError}
          onCreate={onConnectionCreate}
          onEdit={onConnectionEdit}
          onDelete={onConnectionDelete}
          onAttach={onConnectionAttach}
          onDetach={onConnectionDetach}
        />
      </Spinner>
    </PluginApiModal>
  )
}

StorageConnectionsModal.propTypes = {
  isLoading: PropTypes.bool,
  storageDomain: PropTypes.object,
  connections: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  doConnectionCreate: PropTypes.func,
  doConnectionEdit: PropTypes.func,
  doConnectionDelete: PropTypes.func,
  doConnectionAttach: PropTypes.func,
  doConnectionDetach: PropTypes.func,
  doRefreshConnections: PropTypes.func,
}

export default StorageConnectionsModal
