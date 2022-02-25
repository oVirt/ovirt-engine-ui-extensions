import React from 'react'
import { showModal } from '_/utils/react-modals'

import ClusterUpgradeDataProvider from '_/modals/cluster-upgrade/ClusterUpgradeDataProvider'
import ClusterUpgradeWizard from '_/modals/cluster-upgrade/ClusterUpgradeWizard'

/*
 * The Cluster Upgrade Wizard is using the patternfly-react v3 Wizard component.  This
 * component manages its own PF3 Modal and therefore we cannot convert it to use the
 * `PluginApiModal` component that all of the other PF4 modals are using.  The entire
 * wizard would need to be converted to PF4 to do the swap.
 */
export function showClusterUpgradeWizard ({ id, name }) {
  showModal(({ container, destroyModal }) => (
    <ClusterUpgradeDataProvider cluster={{ id, name }}>
      <ClusterUpgradeWizard
        show
        container={container}
        onExited={destroyModal}
      />
    </ClusterUpgradeDataProvider>
  ))
}
