import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TextContent,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core'

import { msg } from '_/intl-messages'

import FieldLevelHelp from '_/components/helper/FieldLevelHelp'

import { noHostValue, selectHostValue } from '_/constants'

export const selectItemShape = {
  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

const HostCopyNetworksModalBody = ({
  selectedHostId,
  targetHostItems = [],
  hostNames = [],
  onHostSelectionChange = () => {},
}) => {
  const copyDisabled = targetHostItems.length === 0
  const items = copyDisabled
    ? [
      {
        text: msg.hostCopyNetworksNoAvailableHost(),
        value: noHostValue,
      },
    ]
    : [
      {
        text: msg.hostCopyNetworksSelectHost(),
        value: selectHostValue,
      },
      ...targetHostItems,
    ]

  return (
    <>
      <TextContent>
        <Text>{msg.hostCopyNetworksInfoLabel() }</Text>
      </TextContent>

      <Form isHorizontal>
        <FormGroup
          fieldId='host-copy-networks-select-target-host'
          label={(
            <div>
              {msg.hostCopyNetworksSelectHostLabel()}
              <FieldLevelHelp content={msg.hostCopyNetworksSelectHostFieldHelp()} />
            </div>
          )}
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
    </>
  )
}

HostCopyNetworksModalBody.propTypes = {
  selectedHostId: PropTypes.string,
  targetHostItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  hostNames: PropTypes.arrayOf(PropTypes.string),
  onHostSelectionChange: PropTypes.func,
}

export default HostCopyNetworksModalBody
