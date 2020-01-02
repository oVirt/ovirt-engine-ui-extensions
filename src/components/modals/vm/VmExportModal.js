import React from 'react'
import PropTypes from 'prop-types'
import { excludeKeys, Spinner } from 'patternfly-react'
import StatefulModalPattern from '../StatefulModalPattern'
import { msg } from '_/intl-messages'
import {
  Alert,
  Button,
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
      onChange={onChange}
      isValid={!storageDomainsEmpty}
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

class VmExportModal extends StatefulModalPattern {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      shouldCollapseSnapshots: false,
      selectedStorageDomain: '',
      vmName: props.vm.name + '-export',
      storageDomains: props.storageDomains,
      error: ''
    }

    this.onFieldChange = this.onFieldChange.bind(this)
    this.onExportVm = this.onExportVm.bind(this)
  }

  static getDerivedStateFromProps (props, state) {
    if (
      state.selectedStorageDomain === '' &&
      props.storageDomains &&
      props.storageDomains.length > 0
    ) {
      return {
        ...super.getDerivedStateFromProps(props, state),
        selectedStorageDomain: props.storageDomains[0].id
      }
    }

    return super.getDerivedStateFromProps(props, state)
  }

  render () {
    const { isLoading, vm, storageDomains } = this.props
    const storageDomainsEmpty =
      storageDomains == null || storageDomains.length === 0

    const modalBody = (
      <Spinner loading={isLoading}>
        <Stack gutter='md'>
          <StackItem>
            {this.state.error && (
              <Alert variant='danger' isInline title={msg.exportVmErrorTitle()}>
                {this.state.error}
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
                  value={vm.name}
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
                  name='vmName'
                  value={this.state.vmName}
                  onChange={this.onFieldChange}
                  isValid={this.state.vmName.length > 0}
                />
              </FormGroup>
              <FormGroup
                label={msg.storageDomains()}
                fieldId='storage-domain-list'
              >
                <StorageDomainList
                  storageDomains={storageDomains}
                  onChange={this.onFieldChange}
                  storageDomainsEmpty={storageDomainsEmpty}
                  selectedStorageDomain={this.state.selectedStorageDomain}
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
                  isChecked={this.state.shouldCollapseSnapshots}
                  onChange={this.onFieldChange}
                  label={msg.collapseSnapshots()}
                />
              </FormGroup>
            </Form>
          </StackItem>
        </Stack>
      </Spinner>
    )

    const modalButtons = (
      <React.Fragment>
        <Button variant='link' onClick={this.close}>
          {msg.cancelButton()}
        </Button>
        <Button
          variant='primary'
          onClick={this.onExportVm}
          isDisabled={storageDomainsEmpty || this.state.vmName.length === 0}
        >
          {msg.exportVmButton()}
        </Button>
      </React.Fragment>
    )

    return React.cloneElement(super.render(), {
      children: modalBody,
      footer: modalButtons
    })
  }

  onFieldChange (value, { target }) {
    this.setState({ [target.name]: value })
  }

  onExportVm () {
    this.props.exportVm(
      this.props.vm.id,
      this.state.vmName,
      this.state.selectedStorageDomain,
      this.state.shouldCollapseSnapshots
    ).then(res => {
      console.log(JSON.stringify(res))
      if (res.status === 'failed') {
        this.setState({ error: res['fault']['detail'] })
      } else {
        this.close()
      }
    }).catch(e => {
      this.setState({ error: e.message })
      throw new Error(this.state.error)
    })
  }
}

VmExportModal.propTypes = {
  ...excludeKeys(StatefulModalPattern.propTypes, ['children', 'footer']),
  isLoading: PropTypes.bool,
  cancelButtonLabel: PropTypes.string,
  storageDomains: PropTypes.array,
  exportVm: PropTypes.func
}

VmExportModal.defaultProps = {
  ...excludeKeys(StatefulModalPattern.defaultProps, ['children', 'footer']),
  dialogClassName: 'modal-lg',
  title: 'Export VM',
  isLoading: false,
  cancelButtonLabel: 'Cancel'
}

export default VmExportModal
