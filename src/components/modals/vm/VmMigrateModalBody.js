import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TextContent,
  Form,
  Checkbox,
  FormGroup,
  FormHelperText,
  FormSelect,
  FormSelectOption
} from '@patternfly/react-core'

import { msg } from '_/intl-messages'

import FieldLevelHelp from '_/components/helper/FieldLevelHelp'
import VmList from './VmList'

const NO_HOST_AVAILABLE_HOST_ITEMS = [{
  text: msg.migrateVmNoAvailableHost(),
  value: '__NO_HOST__'
}]

export const AUTO_SELECT_ITEM = {
  text: msg.migrateVmAutoSelectHost(),
  value: '_AutoSelect_'
}

export const selectItemShape = {
  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

const VmMigrateModalBody = ({
  suggestAffinity,
  selectedHostId,
  targetHostItems = [],
  migrateVmsInAffinity = false,
  vmNames = [],
  onHostSelectionChange = () => {},
  onMigrateVmsInAffinityChange = () => {}
}) => {
  const migrationDisabled = targetHostItems.length === 0
  const items = migrationDisabled
    ? NO_HOST_AVAILABLE_HOST_ITEMS
    : [ AUTO_SELECT_ITEM, ...targetHostItems ]

  return (
    <React.Fragment>
      <TextContent>
        <Text>{msg.migrateVmInfoLabel({ value: vmNames.length }) }</Text>
      </TextContent>

      <Form isHorizontal>
        <FormGroup
          fieldId='vm-migrate-select-target-host'
          label={
            <div>
              {msg.migrateVmSelectHostLabel()}
              <FieldLevelHelp content={msg.migrateVmSelectHostFieldHelp()} />
            </div>
          }
          helperText={suggestAffinity && !migrateVmsInAffinity &&
            <FormHelperText isHidden={false}>
              {msg.migrateVmSuggestEnablingAffinity()}
            </FormHelperText>
          }
        >
          <FormSelect
            id='vm-migrate-select-target-host'
            value={selectedHostId}
            onChange={(value) => { onHostSelectionChange(value) }}
            isDisabled={migrationDisabled}
          >
            {items.map((option, index) => (
              <FormSelectOption key={index} label={option.text} value={option.value} />
            ))}
          </FormSelect>
        </FormGroup>

        <FormGroup
          fieldId='vm-migrate-vms-in-affinity'
        >
          <Checkbox
            id='vm-migrate-vms-in-affinity'
            label={
              <div>
                {msg.migrateVmAffinityCheckbox()}
                <FieldLevelHelp content={msg.migrateVmAffinityLabelHelp()} />
              </div>
            }
            isChecked={migrateVmsInAffinity}
            onChange={(checked) => { onMigrateVmsInAffinityChange(checked) }}
          />
        </FormGroup>

        <FormGroup
          fieldId='vm-migrate-vm-list'
          label={
            <div style={{ whiteSpace: 'nowrap' }}>
              {msg.migrateVmListLabel()}
            </div>
          }
        >
          <VmList
            id='vm-migrate-vm-list'
            vmNames={vmNames}
            showAllThreshold={10}
            showAllLabel={msg.migrateVmListShowAllLabel()}
            showLessLabel={msg.migrateVmListShowLessLabel()}
          />
        </FormGroup>
      </Form>
    </React.Fragment>
  )
}

VmMigrateModalBody.propTypes = {
  selectedHostId: PropTypes.string,
  targetHostItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  migrateVmsInAffinity: PropTypes.bool,
  vmNames: PropTypes.arrayOf(PropTypes.string),
  suggestAffinity: PropTypes.bool.isRequired,

  onHostSelectionChange: PropTypes.func,
  onMigrateVmsInAffinityChange: PropTypes.func
}

export default VmMigrateModalBody
