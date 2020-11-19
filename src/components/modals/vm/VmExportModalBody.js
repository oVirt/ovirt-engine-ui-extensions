import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import {
  Alert,
  Form,
  Checkbox,
  TextInput,
  Stack,
  StackItem,
  FormSelect,
  FormSelectOption,
  FormGroup
} from '@patternfly/react-core'

const StorageDomainList = ({
  selectedStorageDomain,
  storageDomains,
  onChange,
  storageDomainsEmpty
}) => {
  return (
    <FormSelect
      name='selectedStorageDomain'
      value={selectedStorageDomain}
      id='storage-domain-list'
      onChange={value => onChange(value)}
      validated={storageDomainsEmpty ? 'error' : 'default'}
    >
      {storageDomains.map((storageDomain, index) => (
        <FormSelectOption
          label={storageDomain.name}
          key={index}
          value={storageDomain.id}
        />
      ))}
    </FormSelect>
  )
}

StorageDomainList.propTypes = {
  selectedStorageDomain: PropTypes.string,
  storageDomains: PropTypes.array,
  storageDomainsEmpty: PropTypes.bool,
  onChange: PropTypes.func
}

const VmExportModalBody = ({
  sourceVmName,
  exportVmName,
  error,
  shouldCollapseSnapshots,
  selectedStorageDomain,
  storageDomains,
  onExportVmNameChange,
  onShouldCollapseSnapshotsChange,
  onSelectedStorageDomainChange
}) => {
  const storageDomainsEmpty = !storageDomains || storageDomains.length === 0

  return (
    <Stack gutter='md'>
      <StackItem>
        {error && (
          <Alert variant='danger' isInline title={msg.exportVmErrorTitle()}>
            {error}
          </Alert>
        )}
      </StackItem>
      <StackItem>
        <Form horizontal='true'>
          <FormGroup
            label={msg.exportVmOriginalVmLabel()}
            fieldId='original-vm-name'
          >
            <TextInput
              isRequired
              isDisabled
              type='text'
              id='original-vm-name'
              value={sourceVmName}
            />
          </FormGroup>
          <FormGroup
            label={msg.exportedVmNameTextFieldLabel()}
            fieldId='export-vm-name'
          >
            <TextInput
              isRequired
              type='text'
              id='export-vm-name'
              name='exportVmName'
              value={exportVmName}
              onChange={value => onExportVmNameChange(value)}
              validated={exportVmName.length > 0 ? 'default' : 'error'}
            />
          </FormGroup>
          <FormGroup
            label={msg.storageDomains()}
            fieldId='storage-domain-list'
          >
            <StorageDomainList
              storageDomains={storageDomains}
              storageDomainsEmpty={storageDomainsEmpty}
              selectedStorageDomain={selectedStorageDomain}
              onChange={value => onSelectedStorageDomainChange(value)}
            />
            {storageDomainsEmpty && (
              <div className='error-message'>
                {msg.exportVmNoStorageDomainsError()}
              </div>
            )}
          </FormGroup>
          <FormGroup fieldId='collapse-snapshots-checkbox'>
            <Checkbox
              id='collapse-snapshots'
              name='shouldCollapseSnapshots'
              isChecked={shouldCollapseSnapshots}
              onChange={value => onShouldCollapseSnapshotsChange(value)}
              label={msg.collapseSnapshots()}
            />
          </FormGroup>
        </Form>
      </StackItem>
    </Stack>
  )
}

VmExportModalBody.propTypes = {
  // data input
  sourceVmName: PropTypes.string,
  exportVmName: PropTypes.string,
  error: PropTypes.string,
  shouldCollapseSnapshots: PropTypes.bool,
  selectedStorageDomain: PropTypes.string,
  storageDomains: PropTypes.array,

  // callbacks
  onExportVmNameChange: PropTypes.func.isRequired,
  onShouldCollapseSnapshotsChange: PropTypes.func.isRequired,
  onSelectedStorageDomainChange: PropTypes.func.isRequired
}

export default VmExportModalBody
