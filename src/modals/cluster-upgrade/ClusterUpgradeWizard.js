import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import { Wizard } from '@patternfly/react-core'
import SelectHosts from './SelectHosts'
import UpgradeOptions from './UpgradeOptions'
import UpgradeReview from './UpgradeReview'

/**
 * Injest a cluster plus a list of hosts in the cluster (plus a summary list of VMs on
 * each host), render the Cluster Upgrade Wizard and upon confirmation of the action,
 * invoke the `upgradeCluster` call back with all of the information necessary to run
 * the `ovirt-ansible-cluster-upgrade` ansible role.
 */
const ClusterUpgradeWizard = ({
  cluster,
  clusterHosts,
  upgradeCluster = () => {},
  onClose = () => {},
}) => {
  //
  // hosts
  //
  const [hostIdToName, setHostIdToName] = useState({})
  const [selectedHostIds, setSelectedHostIds] = useState([])

  useEffect(() => {
    if (clusterHosts?.length > 0) {
      setHostIdToName(clusterHosts.reduce((idMap, host) => { idMap[host.id] = host.name; return idMap }, {}))
    } else {
      setHostIdToName({})
    }
  }, [clusterHosts])

  const onHostSelectionChange = (newSelectedHostIds = []) => {
    setSelectedHostIds(newSelectedHostIds.filter(hostId => hostIdToName[hostId]))
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
      setOptions({ ...options, [option]: value })
    }
  }

  //
  // upgrade
  //
  const onWizardSave = async () => {
    // build the cluster upgrade request parameters
    const data = {
      clusterId: cluster.id,
      clusterName: cluster.name,

      hostNames: clusterHosts.filter(host => selectedHostIds[host.id]).map(host => hostIdToName[host.id]),

      stopPinnedVms: options.stopPinnedVms,
      upgradeTimeoutInMin: Number.isNaN(options.upgradeTimeoutInMin) ? 0 : options.upgradeTimeoutInMin,
      checkForUpgradesOnHosts: options.checkForUpgradesOnHosts,
      rebootAfterUpgrade: options.rebootAfterUpgrade,
      useMaintenanceClusterPolicy: options.useMaintenanceClusterPolicy,
      executionTimeoutInMin: Number.isNaN(options.upgradeTimeoutInMin) || options.upgradeTimeoutInMin <= 0
        ? undefined
        : (selectedHostIds.length + 1) * options.upgradeTimeoutInMin,
    }

    // fire the callback with the request parameters
    try {
      await upgradeCluster(data)
      onClose()
    } catch (error) {
      console.error('UpgradeCluster call failed. data:', data, 'error:', error)
    }
  }

  //
  // wizard
  //
  const isAHostSelected = selectedHostIds.length > 0
  const wizardSteps = [
    {
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
  ]

  return (
    <Wizard
      className='clusterUpgradeWizard'

      title={msg.clusterUpgradeTitle({ clusterName: cluster.name })}
      hideClose={false}

      backButtonText={msg.clusterUpgradeBackButtonText()}
      cancelButtonText={msg.clusterUpgradeCancelButtonText()}
      nextButtonText={msg.clusterUpgradeNextButtonText()}

      steps={wizardSteps}

      onSave={onWizardSave}
      onClose={onClose}
    />
  )
}

ClusterUpgradeWizard.propTypes = {
  // data input
  cluster: PropTypes.object,
  clusterHosts: PropTypes.arrayOf(PropTypes.object),

  // operation callback
  upgradeCluster: PropTypes.func,

  // wizard props
  onClose: PropTypes.func,
}

export default ClusterUpgradeWizard
