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
 * For a cluster plus a list of hosts in the cluster, render one of the loading,
 * cluster in maintenance confirm, or the upgrade wizard on a modal.
 */
const ClusterUpgradeModal = ({
  isLoading = false,
  cluster,
  clusterHosts,
  correlationId,
  upgradeCluster = () => {}, // only needed for the wizard
  jumpToEvents = () => {}, // only needed for the wizard
  onClose,
}) => {
  const [isOpen, setOpen] = useState(true)
  const [confirmedClusterPolicy, setConfirmedClusterPolicy] = useState(false)

  if (!isOpen) {
    return null
  }

  const close = () => {
    setOpen(false)
    onClose()
  }

  const onJumpToEvents = () => {
    jumpToEvents()
    close()
  }

  /*
    If we're loading data still, just show a spinner.  We need to check the cluster's
    scheduling_policy before deciding if the Wizard should be displayed.
  */
  if (isLoading) {
    return (
      <PluginApiModal
        id='cluster-upgrade-modal'
        className='clusterUpgradeWizardModal'
        title={msg.clusterUpgradeLoadingTitle()}
        variant='small'
        isOpen={isOpen}
        onClose={close}
      >
        <EmptyState>
          <EmptyStateIcon variant='container' component={Spinner} />
          <Title size='lg' headingLevel='h3'>
            {msg.clusterUpgradeLoadingTitle()}
          </Title>
          <EmptyStateBody>
            {msg.clusterUpgradeLoadingMessage()}
          </EmptyStateBody>
        </EmptyState>
      </PluginApiModal>
    )
  }

  /*
    Look at the Cluster, and check its policy status.  If the policy is set to
    maintenance the user needs to be warned before showing the cluster upgrade
    wizard.  If the user assumes all risk they may continue.
  */
  const isClusterInMaintenace = cluster?.scheduling_policy?.name === 'cluster_maintenance'
  if (isClusterInMaintenace && !confirmedClusterPolicy) {
    return (
      <PluginApiModal
        id='cluster-upgrade-modal'
        className='clusterUpgradeWizardModal'
        title={msg.clusterUpgradeTitle({ clusterName: cluster.name })}
        variant='small'
        isOpen={isOpen}
        onClose={close}
        actions={[
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
        ]}
      >
        <Split hasGutter>
          <SplitItem>
            <ExclamationTriangleIcon size='xl' />
          </SplitItem>
          <SplitItem>
            <p className='lead'>{msg.clusterUpgradeClusterInMaintenaceTitle()}</p>
            <p>{msg.clusterUpgradeClusterInMaintenaceMessage({ clusterName: cluster.name })}</p>
          </SplitItem>
        </Split>
      </PluginApiModal>
    )
  }

  // Modal is open, all data is loaded, and the cluster is available to be upgraded
  return (
    <PluginApiModal
      id='cluster-upgrade-modal'
      className='clusterUpgradeWizardModal'
      variant='large'
      isOpen={isOpen}
      onClose={close}
      showClose={false}
      hasNoBodyWrapper
    >
      <ClusterUpgradeWizard
        cluster={cluster}
        clusterHosts={clusterHosts}
        correlationId={correlationId}
        upgradeCluster={upgradeCluster}
        onClose={close}
        onJumpToEvents={onJumpToEvents}
      />
    </PluginApiModal>
  )
}

ClusterUpgradeModal.propTypes = {
  // data input
  isLoading: PropTypes.bool,
  cluster: PropTypes.object,
  clusterHosts: PropTypes.arrayOf(PropTypes.object),
  correlationId: PropTypes.string,

  // callbacks
  upgradeCluster: PropTypes.func,
  jumpToEvents: PropTypes.func,
  onClose: PropTypes.func.isRequired,
}

export default ClusterUpgradeModal
