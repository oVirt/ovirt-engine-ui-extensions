import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core'
import { ExclamationTriangleIcon } from '@patternfly/react-icons'

import PluginApiModal from '_/components/modals/PluginApiModal'
import ClusterUpgradeWizard from './ClusterUpgradeWizard'

import './styles.css' // no module for CSS so import onces for all of the Wizard's components

/**
 * Injest a cluster plus a list of hosts in the cluster (plus a summary list of VMs on
 * each host), render the Cluster Upgrade Wizard and upon confirmation of the action,
 * invoke the `upgradeCluster` call back with all of the information necessary to run
 * the `ovirt-ansible-cluster-upgrade` ansible role.
 */
const ClusterUpgradeModal = ({
  isLoading = false,
  cluster,
  clusterHosts,
  upgradeCluster = () => {},
  onClose = () => {},
}) => {
  const [isOpen, setOpen] = useState(true)
  const [confirmedClusterPolicy, setConfirmedClusterPolicy] = useState(false)

  if (!isOpen) {
    return null
  }

  console.log(`isLoading: ${isLoading}, cluster.name: ${cluster?.name}, clusterHosts.length: ${clusterHosts?.length}`)

  const close = () => {
    setOpen(false)
    onClose()
  }

  const modalProps = {
    title: undefined,
    variant: 'small',
    actions: undefined,
  }
  let modalBody

  /*
    If we're loading data still, just show a spinner.  We need to check the cluster's
    scheduling_policy before deciding if the Wizard should be displayed.
  */
  if (isLoading) {
    modalProps.title = msg.clusterUpgradeLoadingTitle()
    modalBody = (
      <EmptyState>
        <EmptyStateIcon variant='container' component={Spinner} />
        <Title size='lg' headingLevel='h3'>
          {modalProps.title}
        </Title>
        <EmptyStateBody>
          {msg.clusterUpgradeLoadingMessage()}
        </EmptyStateBody>
      </EmptyState>
    )
  }

  /*
    Look at the Cluster, and check its policy status.  If the policy is set to
    maintenance the user needs to be warned before showing the cluster upgrade
    wizard.  If the user assumes all risk they may continue.
  */
  const isClusterInMaintenace = cluster?.scheduling_policy?.name === 'cluster_maintenance'
  if (isClusterInMaintenace && !confirmedClusterPolicy) {
    modalProps.title = msg.clusterUpgradeTitle({ clusterName: cluster.name })
    modalProps.actions = [
      <Button
        key='cluster-upgrade-maintenace-continue-button'
        variant='primary'
        onClick={() => { setConfirmedClusterPolicy(true) }}
      >
        {msg.clusterUpgradeClusterInMaintenaceContinue()}
      </Button>,
      <Button
        key='cluster-upgrade-maintenace-cancel-button'
        variant='link'
        onClick={close}
      >
        {msg.clusterUpgradeCancelButtonText()}
      </Button>,
    ]
    modalBody = (
      <Split hasGutter>
        <SplitItem>
          <ExclamationTriangleIcon size='xl' />
        </SplitItem>
        <SplitItem>
          <p className='lead'>{msg.clusterUpgradeClusterInMaintenaceTitle()}</p>
          <p>{msg.clusterUpgradeClusterInMaintenaceMessage({ clusterName: cluster.name })}</p>
        </SplitItem>
      </Split>
    )
  }

  // Modal is open, all data is loaded, and the cluster is available to be upgraded
  if (!modalBody) {
    modalProps.variant = 'large'
    modalProps.showClose = false
    modalProps.hasNoBodyWrapper = true
    modalBody = (
      <ClusterUpgradeWizard
        cluster={cluster}
        clusterHosts={clusterHosts}
        upgradeCluster={upgradeCluster}
        onClose={close}
      />
    )
  }

  return (
    <PluginApiModal
      className='clusterUpgradeWizardModal'
      {...modalProps}
      isOpen={isOpen}
      onClose={close}
    >
      {modalBody}
    </PluginApiModal>
  )
}

ClusterUpgradeModal.propTypes = {
  // data input
  isLoading: PropTypes.bool,
  cluster: PropTypes.object,
  clusterHosts: PropTypes.arrayOf(PropTypes.object),

  // operation callback
  upgradeCluster: PropTypes.func,

  // modal props
  onClose: PropTypes.func,
}

export default ClusterUpgradeModal
