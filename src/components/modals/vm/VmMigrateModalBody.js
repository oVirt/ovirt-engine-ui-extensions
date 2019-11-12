import React from 'react'
import PropTypes from 'prop-types'
import { noop, Form, Grid, Checkbox } from 'patternfly-react'
import { msg } from '_/intl-messages'
import config from '_/plugin-config'

import BaseFormGroup from '../../forms/BaseFormGroup'
import SelectFormGroup, { selectItemShape } from '../../forms/SelectFormGroup'
import VmListFormGroup from '../../forms/VmListFormGroup'

const NO_HOST_AVAILABLE_HOST_ITEMS = [{
  text: msg.migrateVmNoAvailableHost(),
  value: '__NO_HOST__'
}]

export const AUTO_SELECT_ITEM = {
  text: msg.migrateVmAutoSelectHost(),
  value: '_AutoSelect_'
}

const VmMigrateModalBody = ({
  vmNames,
  targetHostItems,
  migrateVmsInAffinity,

  onHostSelectionChange,
  onMigrateVmsInAffinityChange
}) => {
  const items = [ AUTO_SELECT_ITEM, ...targetHostItems ]
  const migrationDisabled = targetHostItems.length === 0

  return (
    <Grid fluid>
      <Grid.Row>
        <Grid.Col sm={12}>
          <div className={'form-group'}>
            {msg.migrateVmInfoLabel({ value: config.useFakeData ? 1337 : vmNames.length })}
          </div>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col sm={12}>
          <Form horizontal>
            <SelectFormGroup
              id='vm-migrate-select-target-host'
              label={msg.migrateVmSelectHostLabel()}
              fieldHelp={msg.migrateVmSelectHostFieldHelp()}
              fieldHelpPlacement={'right'}
              items={migrationDisabled ? NO_HOST_AVAILABLE_HOST_ITEMS : items}
              defaultValue={AUTO_SELECT_ITEM.value}
              disabled={migrationDisabled}
              usePlaceholder={false}
              onChange={event => { onHostSelectionChange(event.target.value) }}
            />

            <BaseFormGroup
              id='vm-migrate-vms-in-affinity'
              label={msg.migrateVmAffinityLabel()}
              fieldHelp={msg.migrateVmAffinityLabelHelp()}
              fieldHelpPlacement='right'
            >
              <Checkbox
                id='vm-migrate-vms-in-affinity'
                checked={migrateVmsInAffinity}
                onChange={event => { onMigrateVmsInAffinityChange(event.target.checked) }}
              >
                {msg.migrateVmAffinityCheckbox()}
              </Checkbox>
            </BaseFormGroup>

            <VmListFormGroup
              id='vm-migrate-vm-list'
              label={msg.migrateVmListLabel()}
              vmNames={vmNames}
              showAllThreshold={10}
              showAllLabel={msg.migrateVmListShowAllLabel()}
              showLessLabel={msg.migrateVmListShowLessLabel()}
            />
          </Form>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  )
}

VmMigrateModalBody.propTypes = {
  vmNames: PropTypes.arrayOf(PropTypes.string),
  targetHostItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  migrateVmsInAffinity: PropTypes.bool,

  onHostSelectionChange: PropTypes.func,
  onMigrateVmsInAffinityChange: PropTypes.func
}

VmMigrateModalBody.defaultProps = {
  vmNames: [],
  targetHostItems: [],
  migrateVmsInAffinity: false,

  onHostSelectionChange: noop,
  onMigrateVmsInAffinityChange: noop
}

export default VmMigrateModalBody
