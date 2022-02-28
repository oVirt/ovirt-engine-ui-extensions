import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import { isNumber } from '_/utils/type-validation'

import {
  Form,
  FormGroup,
  TextInput,
  Title,
  Checkbox,
} from '@patternfly/react-core'

import FieldLevelHelp from '_/components/helper/FieldLevelHelp'

/**
 * Display the set of options that may be user configured for the cluster upgrade.
 *
 * This is a purely controlled input component.
 */
const UpgradeOptions = ({
  heading,
  stopPinnedVms = true,
  upgradeTimeoutInMin = 60,
  checkForUpgradesOnHosts = false,
  rebootAfterUpgrade = true,
  useMaintenanceClusterPolicy = true,
  onChange = () => {},
}) => {
  const postChange = (fieldId, value) => {
    const idToName = {
      'upgrade-options-stop-pinned-vms': 'stopPinnedVms',
      'upgrade-options-upgrade-timeout': 'upgradeTimeoutInMin',
      'upgrade-options-check-upgrade': 'checkForUpgradesOnHosts',
      'upgrade-options-reboot-after': 'rebootAfterUpgrade',
      'upgrade-options-use-maintenance': 'useMaintenanceClusterPolicy',
    }

    const optionName = idToName[fieldId] || undefined

    if (!optionName) {
      throw Error(`Unknown field was changed, id: ${fieldId}`)
    }

    onChange(optionName, value)
  }

  const onCheckChange = (checked, { target: { id } }) => {
    postChange(id, checked)
  }

  const onNumberChange = (value, { target: { id } }) => {
    if (isNumber(value) && value > 0) {
      postChange(id, Number.parseInt(value, 10))
    } else {
      return false
    }
  }

  return (
    <div className='clusterUpgradeWizard-UpgradeOptions'>
      <Title headingLevel='h2'>{heading}</Title>
      <Form isHorizontal>
        <FormGroup
          fieldId='upgrade-options-stop-pinned-vms'
          label={(
            <div>
              {msg.clusterUpgradeStopPinnedLabel()}
              <FieldLevelHelp content={msg.clusterUpgradeStopPinnedFieldHelp()} />
            </div>
          )}
        >
          <Checkbox
            id='upgrade-options-stop-pinned-vms'
            label={msg.clusterUpgradeStopPinnedDescription()}
            isChecked={stopPinnedVms}
            onChange={onCheckChange}
          />
        </FormGroup>

        <FormGroup
          fieldId='upgrade-options-upgrade-timeout'
          label={(
            <div>
              {msg.clusterUpgradeUpgradeTimeoutLabel()}
              <FieldLevelHelp content={msg.clusterUpgradeUpgradeTimeoutFieldHelp()} />
            </div>
          )}
        >
          <TextInput
            id='upgrade-options-upgrade-timeout'
            className='timeoutInput'
            type='number'
            value={isNumber(upgradeTimeoutInMin) ? upgradeTimeoutInMin : ''}
            onChange={onNumberChange}
          />
        </FormGroup>

        <FormGroup
          fieldId='upgrade-options-check-upgrade'
          label={(
            <div>
              {msg.clusterUpgradeCheckUpgradeLabel()}
              <FieldLevelHelp content={msg.clusterUpgradeCheckUpgradeFieldHelp()} />
            </div>
          )}
        >
          <Checkbox
            id='upgrade-options-check-upgrade'
            label={msg.clusterUpgradeCheckUpgradeDescription()}
            isChecked={checkForUpgradesOnHosts}
            onChange={onCheckChange}
          />
        </FormGroup>

        <FormGroup
          fieldId='upgrade-options-reboot-after'
          label={(
            <div>
              {msg.clusterUpgradeRebootAfterLabel()}
              <FieldLevelHelp content={msg.clusterUpgradeRebootAfterFieldHelp()} />
            </div>
          )}
        >
          <Checkbox
            id='upgrade-options-reboot-after'
            label={msg.clusterUpgradeRebootAfterDescription()}
            isChecked={rebootAfterUpgrade}
            onChange={onCheckChange}
          />
        </FormGroup>

        <FormGroup
          fieldId='upgrade-options-use-maintenance'
          label={(
            <div>
              {msg.clusterUpgradeUseMaintenancePolicyLabel()}
              <FieldLevelHelp content={msg.clusterUpgradeUseMaintenancePolicyFieldHelp()} />
            </div>
          )}
        >
          <Checkbox
            id='upgrade-options-use-maintenance'
            label={msg.clusterUpgradeUseMaintenancePolicyDescription()}
            isChecked={useMaintenanceClusterPolicy}
            onChange={onCheckChange}
          />
        </FormGroup>
      </Form>
    </div>
  )
}

UpgradeOptions.propTypes = {
  heading: PropTypes.string.isRequired,
  stopPinnedVms: PropTypes.bool,
  upgradeTimeoutInMin: PropTypes.number,
  checkForUpgradesOnHosts: PropTypes.bool,
  rebootAfterUpgrade: PropTypes.bool,
  useMaintenanceClusterPolicy: PropTypes.bool,

  onChange: PropTypes.func.isRequired,
}

export default UpgradeOptions
