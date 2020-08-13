import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TextContent,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption
} from '@patternfly/react-core'

import { msg } from '_/intl-messages'

import FieldLevelHelp from '_/components/helper/FieldLevelHelp'

const NO_HOST_AVAILABLE_HOST_ITEMS = [{
  text: msg.hostCopyNetworksNoAvailableHost(),
  value: '__NO_HOST__'
}]

export const CHOOSE_MSG = {
  text: msg.hostCopyNetworksSelectHost(),
  value: '_None_'
}

export const selectItemShape = {
  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

const HostCopyNetworksModalBody = ({
  selectedHostId,
  targetHostItems = [],
  hostNames = [],
  onHostSelectionChange = () => {}
}) => {
  const copyDisabled = targetHostItems.length === 0
  const items = copyDisabled
    ? NO_HOST_AVAILABLE_HOST_ITEMS
    : [ CHOOSE_MSG, ...targetHostItems ]

  return (
    <React.Fragment>
      <TextContent>
        <Text>{msg.hostCopyNetworksInfoLabel() }</Text>
      </TextContent>

      <Form isHorizontal>
        <FormGroup
          fieldId='host-copy-networks-select-target-host'
          label={
            <div>
              {msg.hostCopyNetworksSelectHostLabel()}
              <FieldLevelHelp content={msg.hostCopyNetworksSelectHostFieldHelp()} />
            </div>
          }
        >
          <FormSelect
            id='host-copy-networks-select-target-host'
            value={selectedHostId}
            onChange={value => onHostSelectionChange(value)}
            isDisabled={copyDisabled}
          >
            {items.map((option, index) => (
              <FormSelectOption key={index} label={option.text} value={option.value} />
            ))}
          </FormSelect>
        </FormGroup>
      </Form>
    </React.Fragment>
  )
}

HostCopyNetworksModalBody.propTypes = {
  selectedHostId: PropTypes.string,
  targetHostItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  hostNames: PropTypes.arrayOf(PropTypes.string),
  onHostSelectionChange: PropTypes.func
}

export default HostCopyNetworksModalBody
