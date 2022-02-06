import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Stack,
  StackItem,
  Flex,
  FlexItem,
  Alert,
  Switch,
  AlertActionCloseButton,
} from '@patternfly/react-core'
import StorageConnectionsTable from './StorageConnectionsTable'
import { msg } from '_/intl-messages'
import './connections.css'

const StorageConnectionsModalBody = ({
  storageDomain,
  connections,
  isShowAll,
  setShowAll,
  error,
  setError,
  warning,
  onCreate,
  onEdit,
  onDelete,
  onAttach,
  onDetach,
}) => {
  const [isNewConnectionOpened, setNewConnectionOpened] = useState(false)

  const handleSwitchShowAll = (checked) => {
    setShowAll(checked)
  }

  const handleAddNewConnectionButtonClick = () => {
    setNewConnectionOpened(true)
  }

  return (
    <Stack hasGutter>
      {error && (
        <StackItem>
          <Alert
            variant='danger'
            isInline
            title={msg.storageConnectionsOperationFailedTitle()}
            actionClose={<AlertActionCloseButton onClose={() => setError(null)} />}
          >
            {error}
          </Alert>
        </StackItem>
      )}
      {(storageDomain?.status !== 'maintenance') && (
        <StackItem>
          <Alert variant='warning' isInline title={msg.storageConnectionsDomainNotInMaintenanceWarning()}>
            {msg.storageConnectionsDomainNotInMaintenanceWarningDetail()}
          </Alert>
        </StackItem>
      )}
      <StackItem>
        <Flex>
          <FlexItem>
            <Switch
              id='connections-show-all-switch'
              label={msg.storageConnectionsShowAllConnectionsLabel()}
              isChecked={isShowAll}
              onChange={value => handleSwitchShowAll(value)}
            />
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }}>
            <Button
              variant='secondary'
              onClick={handleAddNewConnectionButtonClick}
              isDisabled={isNewConnectionOpened}
            >
              {msg.storageConnectionsAddConnectionButton()}
            </Button>
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <StorageConnectionsTable
          type={storageDomain.storage.type}
          connections={connections}
          isNewConnectionOpened={isNewConnectionOpened}
          setNewConnectionOpened={setNewConnectionOpened}
          storageDomain={storageDomain}
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
          onAttach={onAttach}
          onDetach={onDetach}
        />
      </StackItem>
    </Stack>
  )
}

StorageConnectionsModalBody.propTypes = {
  storageDomain: PropTypes.object,
  connections: PropTypes.array,
  isShowAll: PropTypes.bool,
  setShowAll: PropTypes.func,
  error: PropTypes.string,
  setError: PropTypes.func,
  warning: PropTypes.bool,
  onCreate: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAttach: PropTypes.func,
  onDetach: PropTypes.func,
}

export default StorageConnectionsModalBody
