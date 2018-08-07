import React from 'react'
import ReactDOM from 'react-dom'
import { entityTypes, vmUpStates } from '../constants'
import getPluginApi from '../plugin-api'
import config from '../plugin-config'
import { msg, l10n } from '../intl-messages'
import { showModal } from '../utils/react-modals'
import VmMigrateModal from '../components/modals/vm/VmMigrateModal'
import { hostAutoSelectItemValue } from '../components/modals/vm/VmMigrateModalBody'
import VmMigrateDataProvider from '../components/modals/vm/VmMigrateDataProvider'
import ClusterUpgradeDataProvider from '../components/modals/cluster/ClusterUpgradeDataProvider'
import ClusterUpgradeWizard from '../components/modals/cluster/ClusterUpgradeWizard'

import { getWebAdminWindow } from '../utils/webadmin-dom'

function isVmUp (vm) {
  return vmUpStates.includes(vm.status)
}

let lastSelectedMainVms = []
let lastSelectedHostVms = []

function showVmMigrateModal (upVms) {
  showModal(({ container, destroyModal }) => (
    <VmMigrateDataProvider vmIds={upVms.map(vm => vm.id)}>
      <VmMigrateModal
        title={msg.migrateVmDialogTitle()}
        vmInfoLabel={msg.migrateVmInfoLabel({
          value: config.useFakeData ? 1337 : upVms.length
        })}
        vmListLabel={msg.migrateVmListLabel()}
        vmListShowAllLabel={msg.migrateVmListShowAllLabel()}
        vmListShowLessLabel={msg.migrateVmListShowLessLabel()}
        hostSelectLabel={msg.migrateVmSelectHostLabel()}
        hostSelectFieldHelp={msg.migrateVmSelectHostFieldHelp()}
        hostAutoSelectItem={{
          value: hostAutoSelectItemValue,
          text: msg.migrateVmAutoSelectHost()
        }}
        migrateButtonLabel={msg.migrateVmButton()}
        cancelButtonLabel={msg.cancelButton()}
        show
        container={container}
        onExited={destroyModal}
      />
    </VmMigrateDataProvider>
  ))
}

function addVmMigrateButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      showVmMigrateModal(lastSelectedMainVms.filter(isVmUp))
    },

    isEnabled: function () {
      lastSelectedMainVms = Array.from(arguments)
      return lastSelectedMainVms.filter(isVmUp).length > 0 || config.useFakeData
    },

    index: 8

  })
}

function addHostVmMigrateButton () {
  getPluginApi().addDetailPlaceActionButton(entityTypes.host, entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      showVmMigrateModal(lastSelectedHostVms.filter(isVmUp))
    },

    isEnabled: function () {
      lastSelectedHostVms = Array.from(arguments)
      return lastSelectedHostVms.filter(isVmUp).length > 0 || config.useFakeData
    },

    index: 5

  })
}

/**
 * Portal the ClusterUpgradeWizard to webadmin's document.
 *
 * (patternfly-react Modals auto portal when provided a container)
 */
export function showClusterUpgradeWizard ({ id, name }, targetWindow = getWebAdminWindow()) {
  // TODO: Push this stuff up to `showModal` or something similarly named
  const targetHead = targetWindow.document.querySelector('head')
  const targetId = 'target-ClusterUpgradeWizard'
  const target = document.createElement('div')

  target.setAttribute('id', targetId)
  targetWindow.document.body.appendChild(target)

  const clonedStyles = []
  if (window !== targetWindow) {
    for (let style of window.document.querySelectorAll('head style, head link[type="text/css"]')) {
      const cloned = style.cloneNode(true)
      cloned.setAttribute('data-style-for', targetId)
      clonedStyles.push(cloned)
      targetHead.appendChild(cloned)
    }
  }

  const destroyModal = () => {
    ReactDOM.unmountComponentAtNode(target)
    targetWindow.document.body.removeChild(target)

    for (let style of clonedStyles) {
      targetHead.removeChild(style)
    }
  }

  const component = (
    <ClusterUpgradeDataProvider cluster={{ id, name }}>
      <ClusterUpgradeWizard
        show
        container={target}
        onExited={destroyModal}

        title={msg.clusterUpgradeTitle({ clusterName: name })}
        loadingTitle={l10n.clusterUpgradeLoadingTitle()}
        loadingMessage={l10n.clusterUpgradeLoadingMessage()}
        cancelButtonText={l10n.clusterUpgradeCancelButtonText()}
        backButtonText={l10n.clusterUpgradeBackButtonText()}
        nextButtonText={l10n.clusterUpgradeNextButtonText()}
        upgradeButtonText={l10n.clusterUpgradeUpgradeButtonText()}
        stepSelectHostsLabel={l10n.clusterUpgradeStepSelectHostsLabel()}
        stepUpgradeOptionsLabel={l10n.clusterUpgradeStepUpgradeOptionsLabel()}
        stepReviewLabel={l10n.clusterUpgradeStepReviewLabel()}

        noHostsMessage={l10n.clusterUpgradeNoHostsMessage()}
        selectHostsMessage={l10n.clusterUpgradeSelectHostsMessage()}
        hostTableHeaderStatus={l10n.clusterUpgradeHostTableHeaderStatus()}
        hostTableHeaderName={l10n.clusterUpgradeHostTableHeaderName()}
        hostTableHeaderHostname={l10n.clusterUpgradeHostTableHeaderHostname()}
        hostTableHeaderVMs={l10n.clusterUpgradeHostTableHeaderVMs()}

        stopPinnedLabel={l10n.clusterUpgradeStopPinnedLabel()}
        stopPinnedFieldHelp={l10n.clusterUpgradeStopPinnedFieldHelp()}
        stopPinnedDescription={l10n.clusterUpgradeStopPinnedDescription()}
        upgradeTimeoutLabel={l10n.clusterUpgradeUpgradeTimeoutLabel()}
        upgradeTimeoutFieldHelp={l10n.clusterUpgradeUpgradeTimeoutFieldHelp()}
        checkUpgradeLabel={l10n.clusterUpgradeCheckUpgradeLabel()}
        checkUpgradeFieldHelp={l10n.clusterUpgradeCheckUpgradeFieldHelp()}
        checkUpgradeDescription={l10n.clusterUpgradeCheckUpgradeDescription()}
        rebootAfterLabel={l10n.clusterUpgradeRebootAfterLabel()}
        rebootAfterFieldHelp={l10n.clusterUpgradeRebootAfterFieldHelp()}
        rebootAfterDescription={l10n.clusterUpgradeRebootAfterDescription()}
        useMaintenancePolicyLabel={l10n.clusterUpgradeUseMaintenancePolicyLabel()}
        useMaintenancePolicyFieldHelp={l10n.clusterUpgradeUseMaintenancePolicyFieldHelp()}
        useMaintenancePolicyDescription={l10n.clusterUpgradeUseMaintenancePolicyDescription()}

        hostsLabel={l10n.clusterUpgradeHostsLabel()}
        hostsDescription={l10n.clusterUpgradeHostsDescription()}
        nonMigratableLabel={l10n.clusterUpgradeNonMigratableLabel()}
        nonMigratableDescription={l10n.clusterUpgradeNonMigratableDescription()}
        migrateLabel={l10n.clusterUpgradeMigrateLabel()}
        migrateDescription={l10n.clusterUpgradeMigrateDescription()}
      />
    </ClusterUpgradeDataProvider>
  )

  ReactDOM.render(component, target)
}

/**
 * Add an "Upgrade" button to the Cluster main view.  It will be enabled when exactly
 * 1 cluster is selected.
 */
function addClusterUpgradeButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.cluster, msg.clusterUpgradeButton(), {

    onClick: function (selectedCluster) {
      if (selectedCluster && selectedCluster.id && selectedCluster.name) {
        showClusterUpgradeWizard(selectedCluster)
      }
    },

    isEnabled: function (...selectedClusters) {
      return selectedClusters && selectedClusters.length === 1
    },

    index: 3

  })
}

export function addButtons () {
  addVmMigrateButton()
  addHostVmMigrateButton()
  addClusterUpgradeButton()
}
