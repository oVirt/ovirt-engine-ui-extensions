import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import {
  Grid,
  Form,
  FormControl,
  Checkbox,
} from 'patternfly-react'
import BaseFormGroup from '_/components/forms/BaseFormGroup'

/**
 * Display the set of options that may be user configured for the cluster upgrade.
 *
 * This is a purely controlled input component.
 */
class UpgradeOptions extends React.Component {
  constructor (props) {
    super(props)
    this.onFieldChange = this.onFieldChange.bind(this)
  }

  onFieldChange ({ target }) {
    const id = target.id
    const value =
      target.type === 'checkbox'
        ? target.checked
        : target.type === 'number'
          ? Number.parseInt(target.value, 10)
          : target.value

    const idToName = {
      'upgrade-options-stop-pinned-vms': 'stopPinnedVms',
      'upgrade-options-upgrade-timeout': 'upgradeTimeoutInMin',
      'upgrade-options-check-upgrade': 'checkForUpgradesOnHosts',
      'upgrade-options-reboot-after': 'rebootAfterUpgrade',
      'upgrade-options-use-maintenance': 'useMaintenanceClusterPolicy',
    }

    const optionName = idToName[id] || undefined

    if (!optionName) {
      throw Error(`Unknown field was changed, id: ${id}`)
    }

    this.props.onChange(optionName, value)
  }

  render () {
    const {
      stopPinnedVms,
      upgradeTimeoutInMin,
      checkForUpgradesOnHosts,
      rebootAfterUpgrade,
      useMaintenanceClusterPolicy,
    } = this.props

    return (
      <Grid fluid className='clusterUpgradeWizard-UpgradeOptions'>
        <Form horizontal>
          <BaseFormGroup
            id='upgrade-options-stop-pinned-vms'
            label={msg.clusterUpgradeStopPinnedLabel()}
            fieldHelpPlacement='right'
            fieldHelp={msg.clusterUpgradeStopPinnedFieldHelp()}
            labelCols={4}
            fieldCols={8}
          >
            <Checkbox
              id='upgrade-options-stop-pinned-vms'
              checked={stopPinnedVms}
              onChange={this.onFieldChange}
            >
              {msg.clusterUpgradeStopPinnedDescription()}
            </Checkbox>
          </BaseFormGroup>

          <BaseFormGroup
            id='upgrade-options-upgrade-timeout'
            label={msg.clusterUpgradeUpgradeTimeoutLabel()}
            fieldHelpPlacement='right'
            fieldHelp={msg.clusterUpgradeUpgradeTimeoutFieldHelp()}
            labelCols={4}
            fieldCols={8}
          >
            <FormControl
              type='number'
              min='0'
              className='timeoutInput'
              value={Number.isNaN(upgradeTimeoutInMin) ? '' : upgradeTimeoutInMin}
              onChange={this.onFieldChange}
            />
          </BaseFormGroup>

          <BaseFormGroup
            id='upgrade-options-check-upgrade'
            label={msg.clusterUpgradeCheckUpgradeLabel()}
            fieldHelpPlacement='right'
            fieldHelp={msg.clusterUpgradeCheckUpgradeFieldHelp()}
            labelCols={4}
            fieldCols={8}
          >
            <Checkbox
              id='upgrade-options-check-upgrade'
              checked={checkForUpgradesOnHosts}
              onChange={this.onFieldChange}
            >
              {msg.clusterUpgradeCheckUpgradeDescription()}
            </Checkbox>
          </BaseFormGroup>

          <BaseFormGroup
            id='upgrade-options-reboot-after'
            label={msg.clusterUpgradeRebootAfterLabel()}
            fieldHelpPlacement='right'
            fieldHelp={msg.clusterUpgradeRebootAfterFieldHelp()}
            labelCols={4}
            fieldCols={8}
          >
            <Checkbox
              id='upgrade-options-reboot-after'
              checked={rebootAfterUpgrade}
              onChange={this.onFieldChange}
            >
              {msg.clusterUpgradeRebootAfterDescription()}
            </Checkbox>
          </BaseFormGroup>

          <BaseFormGroup
            id='upgrade-options-use-maintenance'
            label={msg.clusterUpgradeUseMaintenancePolicyLabel()}
            fieldHelpPlacement='right'
            fieldHelp={msg.clusterUpgradeUseMaintenancePolicyFieldHelp()}
            labelCols={4}
            fieldCols={8}
          >
            <Checkbox
              id='upgrade-options-use-maintenance'
              checked={useMaintenanceClusterPolicy}
              onChange={this.onFieldChange}
            >
              {msg.clusterUpgradeUseMaintenancePolicyDescription()}
            </Checkbox>
          </BaseFormGroup>
        </Form>
      </Grid>
    )
  }
}

UpgradeOptions.propTypes = {
  stopPinnedVms: PropTypes.bool,
  upgradeTimeoutInMin: PropTypes.number,
  checkForUpgradesOnHosts: PropTypes.bool,
  rebootAfterUpgrade: PropTypes.bool,
  useMaintenanceClusterPolicy: PropTypes.bool,

  onChange: PropTypes.func.isRequired,
}

UpgradeOptions.defaultProps = {
  stopPinnedVms: true,
  upgradeTimeoutInMin: 60,
  checkForUpgradesOnHosts: false,
  rebootAfterUpgrade: true,
  useMaintenanceClusterPolicy: true,
}

export default UpgradeOptions
