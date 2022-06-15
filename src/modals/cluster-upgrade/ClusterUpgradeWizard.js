import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import { Wizard } from '@patternfly/react-core'
import SelectHosts from './SelectHosts'
import UpgradeOptions from './UpgradeOptions'
import UpgradeReview from './UpgradeReview'
import TrackProgress from './TrackProgress'

/**
 * Using a cluster, a list of hosts in the cluster, and upgrade progress, render the
 * Cluster Upgrade Wizard.  Host selection and option updates are handled in this
 * component.  Upon confirmation of the update,  invoke the `upgradeCluster` call back
 * with all of the information necessary to run the `ovirt-ansible-cluster-upgrade`
 * ansible role.  The last `TrackProgress` step will show the progress of the upgrade
 * as detailed in the `progress` data.
 */
const ClusterUpgradeWizard = ({
  cluster,
  clusterHosts,
  correlationId,
  upgradeCluster,
  onJumpToEvents,
  onClose,
}) => {
  //
  // hosts
  //
  const [selectedHostIds, setSelectedHostIds] = useState([])

  const onHostSelectionChange = (newSelectedHostIds = []) => {
    setSelectedHostIds(clusterHosts.filter(host => newSelectedHostIds.includes(host.id)).map(host => host.id))
  }

  //
  // options
  //
  const [options, setOptions] = useState({
    // match defaults with: https://github.com/oVirt/ovirt-ansible-collection/tree/master/roles/cluster_upgrade
    stopPinnedVms: true,
    upgradeTimeoutInMin: 60,
    checkForUpgradesOnHosts: false,
    rebootAfterUpgrade: true,
    useMaintenanceClusterPolicy: true,
  })

  const onOptionsChange = (option, value) => {
    if (option in options) {
      setOptions(options => ({ ...options, [option]: value }))
    }
  }

  //
  // upgrade
  //
  const doUpgradeCluster = () => {
    const selectedHosts = clusterHosts.filter(host => selectedHostIds.includes(host.id))

    // build the cluster upgrade request parameters
    const data = {
      clusterId: cluster.id,
      clusterName: cluster.name,

      hostNames: selectedHosts.map(host => host.name),

      stopPinnedVms: options.stopPinnedVms,
      upgradeTimeoutInMin: Number.isNaN(options.upgradeTimeoutInMin) ? 0 : options.upgradeTimeoutInMin,
      checkForUpgradesOnHosts: options.checkForUpgradesOnHosts,
      rebootAfterUpgrade: options.rebootAfterUpgrade,
      useMaintenanceClusterPolicy: options.useMaintenanceClusterPolicy,
      executionTimeoutInMin: Number.isNaN(options.upgradeTimeoutInMin) || options.upgradeTimeoutInMin <= 0
        ? undefined
        : (selectedHosts.length + 1) * options.upgradeTimeoutInMin,
    }

    // fire the callback with the request parameters
    if (!upgradeCluster(data)) {
      onClose()
    }
  }

  //
  // wizard
  //
  const isAHostSelected = selectedHostIds.length > 0
  const wizardSteps = [
    {
      id: 0,
      name: msg.clusterUpgradeStepSelectHostsLabel(),
      component: (
        <SelectHosts
          hosts={clusterHosts}
          selectedHostIds={selectedHostIds}
          onChange={onHostSelectionChange}
        />
      ),

      canJumpTo: true,
      enableNext: isAHostSelected,
    },
    {
      id: 1,
      name: msg.clusterUpgradeStepUpgradeOptionsLabel(),
      component: (
        <UpgradeOptions
          heading={msg.clusterUpgradeStepUpgradeOptionsLabel()}
          stopPinnedVms={options.stopPinnedVms}
          upgradeTimeoutInMin={options.upgradeTimeoutInMin}
          checkForUpgradesOnHosts={options.checkForUpgradesOnHosts}
          rebootAfterUpgrade={options.rebootAfterUpgrade}
          useMaintenanceClusterPolicy={options.useMaintenanceClusterPolicy}
          onChange={onOptionsChange}
        />
      ),

      canJumpTo: isAHostSelected,
      enableNext: true,
    },
    {
      id: 2,
      name: msg.clusterUpgradeStepReviewLabel(),
      component: (
        <UpgradeReview
          heading={msg.clusterUpgradeStepReviewLabel()}
          hostCount={selectedHostIds.length}
        />
      ),

      canJumpTo: isAHostSelected,
      enableNext: true,
      nextButtonText: msg.clusterUpgradeUpgradeButtonText(),
    },
    {
      id: 3,
      component: (
        <TrackProgress
          cluster={cluster}
          correlationId={correlationId}
          onClose={onClose}
          onJumpToEvents={onJumpToEvents}
        />
      ),
      isFinishedStep: true,
    },
  ]

  return (
    <Wizard
      className='clusterUpgradeWizard'
      height={400}

      title={msg.clusterUpgradeTitle({ clusterName: cluster.name })}
      hideClose={false}

      backButtonText={msg.clusterUpgradeBackButtonText()}
      cancelButtonText={msg.clusterUpgradeCancelButtonText()}
      nextButtonText={msg.clusterUpgradeNextButtonText()}

      steps={wizardSteps}

      onNext={({ id, name }, { prevId, prevName }) => {
        if (prevId === 2 && id === 3) {
          doUpgradeCluster()
        }
      }}
      onClose={onClose}
    />
  )
}

ClusterUpgradeWizard.propTypes = {
  // data input
  cluster: PropTypes.object,
  clusterHosts: PropTypes.arrayOf(PropTypes.object),
  correlationId: PropTypes.string,

  // operation callback
  upgradeCluster: PropTypes.func.isRequired,

  // wizard props
  onClose: PropTypes.func.isRequired,
  onJumpToEvents: PropTypes.func.isRequired,
}

export default ClusterUpgradeWizard
