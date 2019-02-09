import React from 'react'
import ReactDOM from 'react-dom'
import { msg, l10n } from '_/intl-messages'

import ClusterUpgradeDataProvider from '_/components/modals/cluster/ClusterUpgradeDataProvider'
import ClusterUpgradeWizard from '_/components/modals/cluster/ClusterUpgradeWizard'
import { getWebAdminWindow } from '_/utils/webadmin-dom'

/**
 * Portal the ClusterUpgradeWizard to webadmin's document.
 *
 * (patternfly-react Modals auto portal when provided a container)
 */
function showClusterUpgradeWizard ({ id, name }, targetWindow = getWebAdminWindow()) {
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
        clusterInMaintenaceTitle={l10n.clusterUpgradeClusterInMaintenaceTitle()}
        clusterInMaintenaceMessage={msg.clusterUpgradeClusterInMaintenaceMessage({ clusterName: name })}
        clusterInMaintenaceContinue={l10n.clusterUpgradeClusterInMaintenaceContinue()}
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

export {
  showClusterUpgradeWizard
}
