import React from 'react'
import PropTypes from 'prop-types'
import { selectProps, propNamesToType } from '../../../utils/react'

import {
  selectKeys,
  propOrState,
  noop
} from 'patternfly-react'

import WizardPattern from '../../patternfly-react-overrides/WizardPattern'
import SelectHosts from './SelectHosts'
import UpgradeOptions from './UpgradeOptions'
import UpgradeReview from './UpgradeReview'

import './shim-styles.css' // TODO: Replace with proper sass namespace imports at the plugin level
import './styles.css' // no module for CSS so import onces for all of the Wizard's components

function hostListToMapById (hostList) {
  if (!hostList || hostList.length === 0) {
    return {}
  }

  return hostList.reduce((hostMap, host) => { hostMap[host.id] = host; return hostMap }, {})
}

/**
 * Injest a cluster plus a list of hosts in the cluster (plus a summary list of VMs on
 * each host), render the Cluster Upgrade Wizard and upon confirmation of the action,
 * invoke the `upgradeCluster` call back with all of the information necessary to run
 * the `ovirt-ansible-cluster-upgrade` ansible role.
 *
 * The open/close of the Wizard will not reset the Wizard's state.  Consumers of this
 * component should destroy it once it is no longer needed so the state doesn't get
 * reused in future.
 *
 * The `Wizard` creates a `Modal`(react-bootstrap) which creates a `Portal`(react-overlays)
 * which does the actual work of `ReactDOM.createPortal()` to the provided `container`.
 */
class ClusterUpgradeWizard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: props.show,
      activeStepIndex: 0,

      mapIdToHost: {}, // hostListToMapById(props.clusterHosts),
      selectedHostsInSortOrder: [],

      options: { // match defaults with: https://github.com/oVirt/ovirt-ansible-cluster-upgrade
        stopPinnedVms: true,
        upgradeTimeoutInMin: 60,
        checkForUpgradesOnHosts: false,
        rebootAfterUpgrade: true,
        useMaintenanceClusterPolicy: true
      }
    }

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.stepChange = this.stepChange.bind(this)
    this.onHostSelectionChange = this.onHostSelectionChange.bind(this)
    this.onOptionsChange = this.onOptionsChange.bind(this)

    this.collectData = this.collectData.bind(this)
    this.onUpgradeClick = this.onUpgradeClick.bind(this)

    this.wizardSteps = [
      {
        title: this.props.stepSelectHostsLabel,
        isInvalid: true,
        preventExit: true,
        render: () => (
          <SelectHosts
            hosts={this.props.clusterHosts}
            selectedHosts={this.state.selectedHostsInSortOrder}
            onChange={this.onHostSelectionChange}
            {...selectProps(this.props, SelectHosts.i18nProps)}
          />
        )
      },
      {
        title: this.props.stepUpgradeOptionsLabel,
        isInvalid: false,
        preventExit: false,
        render: () => (
          <UpgradeOptions
            stopPinnedVms={this.state.options.stopPinnedVms}
            upgradeTimeoutInMin={this.state.options.upgradeTimeoutInMin}
            checkForUpgradesOnHosts={this.state.options.checkForUpgradesOnHosts}
            rebootAfterUpgrade={this.state.options.rebootAfterUpgrade}
            useMaintenanceClusterPolicy={this.state.options.useMaintenanceClusterPolicy}
            onChange={this.onOptionsChange}
            {...selectProps(this.props, UpgradeOptions.i18nProps)}
          />
        )
      },
      {
        title: this.props.stepReviewLabel,
        wizardRowClassName: 'clusterUpgradeWizard-UpgradeReview-Row',
        isInvalid: false,
        preventExit: false,
        render: () => (
          <UpgradeReview
            hostCount={this.state.selectedHostsInSortOrder.length}
            // nonMigratableVmCount={0}
            // migrateVmCount={0}
            {...selectProps(this.props, UpgradeReview.i18nProps)}
          />
        )
      }
    ]
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    return {
      show: propOrState(nextProps, prevState, 'show'),
      mapIdToHost: hostListToMapById(nextProps.clusterHosts)
    }
  }

  open () {
    this.setState({ show: true })
  }

  close () {
    this.setState({ show: false })
  }

  /**
   * Allow changing the step only if the current step is valid.
   */
  stepChange (newActiveStepIndex) {
    const currentStep = this.wizardSteps[this.state.activeStepIndex]

    if (!currentStep.isInvalid && !currentStep.preventExit) {
      this.setState({ activeStepIndex: newActiveStepIndex })
    }
  }

  onHostSelectionChange (hostIdsInOrder) {
    const hasSelection = hostIdsInOrder && hostIdsInOrder.length > 0

    this.setState(state => ({
      selectedHostsInSortOrder: !hasSelection ? [] : hostIdsInOrder.map(hostId => state.mapIdToHost[hostId])
    }))
    this.wizardSteps[0].isInvalid = !hasSelection
    this.wizardSteps[0].preventExit = !hasSelection
  }

  onOptionsChange (option, value) {
    if (this.state.options.hasOwnProperty(option)) {
      this.setState(state => ({
        options: {
          ...state.options,
          [option]: value
        }
      }))
    }
  }

  //
  //
  collectData () {
    const { cluster } = this.props
    const { selectedHostsInSortOrder, options } = this.state

    return {
      clusterId: cluster.id,
      clusterName: cluster.name,

      hostNames: selectedHostsInSortOrder.map(host => host.name),

      stopPinnedVms: options.stopPinnedVms,
      upgradeTimeoutInMin: Number.isNaN(options.upgradeTimeoutInMin) ? 0 : options.upgradeTimeoutInMin,
      checkForUpgradesOnHosts: options.checkForUpgradesOnHosts,
      rebootAfterUpgrade: options.rebootAfterUpgrade,
      useMaintenanceClusterPolicy: options.useMaintenanceClusterPolicy
    }
  }

  async onUpgradeClick () {
    const data = this.collectData()
    try {
      await this.props.upgradeCluster(data)
      this.close()
    } catch (error) {
      console.error('UpgradeCluster call failed. data:', data, 'error:', error)
    }
  }
  //
  //

  render () {
    const {
      container,
      isLoading,
      onExited,

      title,
      loadingTitle,
      loadingMessage,
      cancelButtonText,
      backButtonText,
      nextButtonText,
      upgradeButtonText
    } = this.props
    const {
      activeStepIndex,
      show
    } = this.state

    const currentStep = this.wizardSteps[activeStepIndex]

    return (
      <WizardPattern
        show={show}
        container={container}
        title={title}

        loading={isLoading}
        loadingTitle={loadingTitle}
        loadingMessage={loadingMessage}

        cancelText={cancelButtonText}
        backText={backButtonText}
        nextText={nextButtonText}
        closeText={upgradeButtonText}

        steps={this.wizardSteps}
        activeStepIndex={activeStepIndex}
        onStepChanged={this.stepChange}

        nextStepDisabled={currentStep.isInvalid}
        stepButtonsDisabled={currentStep.isInvalid}

        onFinalStepClick={this.onUpgradeClick} // NOTE: Not a pf-react WizardPattern option
        onHide={this.close}
        onExited={onExited}
      />
    )
  }
}

ClusterUpgradeWizard.i18nProps = {
  title: 'Upgrade Cluster',
  loadingTitle: 'Loading Cluster Data...',
  loadingMessage: 'This may take a few moments.',

  cancelButtonText: 'Cancel',
  backButtonText: 'Back',
  nextButtonText: 'Next',
  upgradeButtonText: 'Upgrade',

  stepSelectHostsLabel: 'Select Hosts',
  stepUpgradeOptionsLabel: 'Upgrade Options',
  stepReviewLabel: 'Cluster Upgrade Review',

  ...SelectHosts.i18nProps,
  ...UpgradeOptions.i18nProps,
  ...UpgradeReview.i18nProps
}

ClusterUpgradeWizard.propTypes = {
  // data input
  cluster: PropTypes.object,
  clusterHosts: PropTypes.arrayOf(PropTypes.object),

  // operation callback
  upgradeCluster: PropTypes.func,

  // wizard props
  show: PropTypes.bool,
  isLoading: PropTypes.bool,
  ...selectKeys(WizardPattern.propTypes, [
    'container',
    'onExited'
  ]),

  // i18n strings
  ...propNamesToType(ClusterUpgradeWizard.i18nProps, PropTypes.string)
}

ClusterUpgradeWizard.defaultProps = {
  upgradeCluster: noop,

  show: true,
  isLoading: false,
  ...selectKeys(WizardPattern.defaultProps, [
    'onExited'
  ]),

  ...ClusterUpgradeWizard.i18nProps
}

export default ClusterUpgradeWizard
