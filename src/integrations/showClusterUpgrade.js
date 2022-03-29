import React from 'react'
import { renderComponent } from '_/utils/react-modals'

import ClusterUpgradeDataProvider from '_/modals/cluster-upgrade/ClusterUpgradeDataProvider'
import ClusterUpgradeModal from '_/modals/cluster-upgrade/ClusterUpgradeModal'

export function showClusterUpgradeWizard ({ id, name }) {
  renderComponent(
    ({ unmountComponent }) => (
      <ClusterUpgradeDataProvider cluster={{ id, name }}>
        <ClusterUpgradeModal
          onClose={unmountComponent}
        />
      </ClusterUpgradeDataProvider>
    ),
    'cluster-upgrade-modal'
  )
}
