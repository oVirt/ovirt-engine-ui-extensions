import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Text,
  Button,
  Stack,
  StackItem,
  Flex,
  FlexItem,
  Alert,
  Switch,
  AlertActionCloseButton,
  TextInput,
  Form,
  FormGroup,
} from '@patternfly/react-core'
import StorageConnectionsTable from './StorageConnectionsTable'
import { msg } from '_/intl-messages'
import './connections.css'
import { Thead, Tbody, Th, Tr, Td, Table } from '@patternfly/react-table'

const StorageConnectionsModalBody = ({
  storageDomain,
  connections,
  hosts,
  foundConnections,
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
  onSearch,
  onCreateAndAttach,
}) => {
  const [isNewConnectionOpened, setNewConnectionOpened] = useState(false)
  const [ipSearchString, setIpSearchString] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [host, setHost] = useState(null)
  const [port, setPort] = useState(3260)
  const columns = {
    address: msg.storageConnectionsTableColAddress(),
    port: msg.storageConnectionsTableColPort(),
    target: msg.storageConnectionsTableColTarget(),
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleSwitchShowAll = (checked) => {
    setShowAll(checked)
  }

  const handleAddNewConnectionButtonClick = () => {
    setNewConnectionOpened(true)
  }

  const handleSearchForConnectionClick = () => {
    onSearch(ipSearchString, host.id, parseInt(port))
  }

  const handleNewConDirectAttach = (value, domainId) => {
    const conn = {
      address: value.address,
      port: value.port,
      target: value.target,
      type: 'iscsi',
    }
    onCreateAndAttach(conn, domainId)
  }

  const onDropDownSelected = () => {
    setIsDropdownOpen(false)
  }

  const changeIpSearchString = (value) => {
    setIpSearchString(value)
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
        <Flex>
          <Form isHorizontal>
            <FormGroup
              label={(
                <div>
                  {msg.storageConnectionsHostSelectionLabel()}
                </div>
              )}
            >
              <Dropdown id="hostDropdown" isOpen={isDropdownOpen} toggle={<DropdownToggle onToggle={toggleDropdown}>{host == null ? '----' : host.name}</DropdownToggle>} onSelect={onDropDownSelected}>
                <DropdownMenu>
                  {hosts.map((value, index) => (
                    <DropdownItem onClick={() => setHost(value)} key={index}>{value.name}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </FormGroup>
            <FormGroup
              label={(
                <div>
                  {msg.storageConnectionAddressSelectionLabel()}
                </div>
              )}
            >
              <TextInput
                id="ipSearch"
                type="text"
                value={ipSearchString}
                onChange={changeIpSearchString}
              />
            </FormGroup>
            <FormGroup
              label={(
                <div>
                  {msg.storageConnectionPortSelectionLabel()}
                </div>
              )}
            >
              <TextInput
                id="portNumber"
                type="number"
                value={port}
                onChange={(value) => setPort(value)}
              />
            </FormGroup>
            <Button
              isDisabled={ipSearchString === '' ||
                host == null ||
                storageDomain?.status !== 'maintenance'
              }
              onClick={handleSearchForConnectionClick}
            >
              {msg.storageConnectionsDiscoverTargets()}
            </Button>
          </Form>
        </Flex>
      </StackItem>
      {(foundConnections != null && foundConnections.length !== 0) && (
        <StackItem>
          <Text>{msg.storageConnectionsFoundTitle()}</Text>
          <Table aria-label='Storage Connections Table'
            variant='compact'
          >
            <Thead>
              <Tr>
                <Th>{columns.address}</Th>
                <Th>{columns.port}</Th>
                <Th>{columns.target}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {foundConnections.map((value, index) => (
                <Tr key={index}>
                  <Td>{value.address}</Td>
                  <Td>{value.port}</Td>
                  <Td>{value.target}</Td>
                  <Td>
                    <Button
                      onClick={() => handleNewConDirectAttach(value, storageDomain.id)}
                    >
                      {msg.storageConnectionsAttachConnectionButton()}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </StackItem>
      )}
      {(foundConnections !== null && foundConnections.length === 0) && (
        <StackItem>
          <Text>{msg.storageConnectionsEmptyList()}</Text>
        </StackItem>
      )}
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
  hosts: PropTypes.array,
  foundConnections: PropTypes.array,
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
  onSearch: PropTypes.func,
  onCreateAndAttach: PropTypes.func,
}

export default StorageConnectionsModalBody
