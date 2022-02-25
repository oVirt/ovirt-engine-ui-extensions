import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import { Icon } from 'patternfly-react'

import MessageDialog from '_/components/patternfly/MessageDialog'
import WizardPattern from '_/components/patternfly-react-overrides/WizardPattern'
import SelectHosts from './SelectHosts'
import UpgradeOptions from './UpgradeOptions'
import UpgradeReview from './UpgradeReview'
import SpinnerDialog from './SpinnerDialog'

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
      lastPropShow: props.show,

      confirmedClusterPolicy: false,
      activeStepIndex: 0,

      mapIdToHost: {}, // hostListToMapById(props.clusterHosts),
      selectedHostsInSortOrder: [],

      options: { // match defaults with: https://github.com/oVirt/ovirt-ansible-collection/tree/master/roles/cluster_upgrade
        stopPinnedVms: true,
        upgradeTimeoutInMin: 60,
        checkForUpgradesOnHosts: false,
        rebootAfterUpgrade: true,
        useMaintenanceClusterPolicy: true,
      },
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
        title: msg.clusterUpgradeStepSelectHostsLabel(),
        isInvalid: true,
        preventExit: true,
        render: () => (
          <SelectHosts
            hosts={this.props.clusterHosts}
            selectedHosts={this.state.selectedHostsInSortOrder}
            onChange={this.onHostSelectionChange}
          />
        ),
      },
      {
        title: msg.clusterUpgradeStepUpgradeOptionsLabel(),
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
          />
        ),
      },
      {
        title: msg.clusterUpgradeStepReviewLabel(),
        wizardRowClassName: 'clusterUpgradeWizard-UpgradeReview-Row',
        isInvalid: false,
        preventExit: false,
        render: () => (
          <UpgradeReview
            hostCount={this.state.selectedHostsInSortOrder.length}
          />
        ),
      },
    ]
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const updates = {}

    updates.mapIdToHost = hostListToMapById(nextProps.clusterHosts)
    if (prevState.lastPropShow !== nextProps.show) {
      updates.show = nextProps.show
      updates.lastPropShow = nextProps.show
    }

    return updates
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
      selectedHostsInSortOrder: !hasSelection ? [] : hostIdsInOrder.map(hostId => state.mapIdToHost[hostId]),
    }))
    this.wizardSteps[0].isInvalid = !hasSelection
    this.wizardSteps[0].preventExit = !hasSelection
  }

  onOptionsChange (option, value) {
    if (option in this.state.options) {
      this.setState(state => ({
        options: {
          ...state.options,
          [option]: value,
        },
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
      useMaintenanceClusterPolicy: options.useMaintenanceClusterPolicy,
      executionTimeoutInMin: Number.isNaN(options.upgradeTimeoutInMin) || options.upgradeTimeoutInMin <= 0
        ? undefined
        : (selectedHostsInSortOrder.length + 1) * options.upgradeTimeoutInMin,
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
      cluster,
      container,
      isLoading,
      onExited,
    } = this.props
    const {
      activeStepIndex,
      show,
      confirmedClusterPolicy,
    } = this.state

    const currentStep = this.wizardSteps[activeStepIndex]

    /*
      If we're loading data still, just show a normal spinner instead of relying
      on the Wizard's spinner. We need to check the cluster's scheduling_policy
      before deciding if the Wizard should be displayed.
    */
    if (isLoading) {
      return (
        <SpinnerDialog
          id='clusterUpgradeWizard-spinner'
          show
          container={container}
          title={msg.clusterUpgradeLoadingTitle()}
          message={msg.clusterUpgradeLoadingMessage()}
          onHide={() => {}} // Future enhancement: Closing the spinner could cancel the fetch from data provider
        />
      )
    }

    /*
      Look at the Cluster, and check its policy status.  If the policy is set to
      maintenance the user needs to be warned before showing the cluster upgrade
      wizard.  If the user assumes all risk they may continue.
    */
    const isClusterInMaintenace =
      cluster &&
      cluster.scheduling_policy &&
      cluster.scheduling_policy.name &&
      cluster.scheduling_policy.name === 'cluster_maintenance'

    if (isClusterInMaintenace && !confirmedClusterPolicy) {
      return (
        <MessageDialog
          show={show}
          container={container}
          onHide={this.close}
          primaryAction={() => { this.setState({ confirmedClusterPolicy: true }) }}
          secondaryAction={this.close}

          icon={<Icon type='pf' name='warning-triangle-o' />}
          title={msg.clusterUpgradeTitle({ clusterName: cluster.name })}
          primaryContent={<p className='lead'>{msg.clusterUpgradeClusterInMaintenaceTitle()}</p>}
          secondaryContent={<p>{msg.clusterUpgradeClusterInMaintenaceMessage({ clusterName: cluster.name })}</p>}

          primaryActionButtonContent={msg.clusterUpgradeClusterInMaintenaceContinue()}
          secondaryActionButtonContent={msg.clusterUpgradeCancelButtonText()}

          accessibleName='warningDialog'
          accessibleDescription='warningDialogContent'
        />
      )
    }

    return (
      <WizardPattern
        id='clusterUpgradeWizard'
        show={show}
        container={container}
        loading={isLoading}

        title={msg.clusterUpgradeTitle({ clusterName: cluster.name })}
        loadingTitle={msg.clusterUpgradeLoadingTitle()}
        loadingMessage={msg.clusterUpgradeLoadingMessage()}
        cancelText={msg.clusterUpgradeCancelButtonText()}
        backText={msg.clusterUpgradeBackButtonText()}
        nextText={msg.clusterUpgradeNextButtonText()}
        closeText={msg.clusterUpgradeUpgradeButtonText()}

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

ClusterUpgradeWizard.propTypes = {
  // data input
  cluster: PropTypes.object,
  clusterHosts: PropTypes.arrayOf(PropTypes.object),

  // operation callback
  upgradeCluster: PropTypes.func,

  // wizard props
  show: PropTypes.bool,
  isLoading: PropTypes.bool,
  container: WizardPattern.propTypes.container,
  onExited: WizardPattern.propTypes.onExited,
}

ClusterUpgradeWizard.defaultProps = {
  upgradeCluster: () => {},

  show: true,
  isLoading: false,
  onExited: WizardPattern.defaultProps.onExited,
}

export default ClusterUpgradeWizard
