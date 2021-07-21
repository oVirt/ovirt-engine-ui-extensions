import React from 'react'
import { renderComponent } from '_/utils/react-modals'

import HostCopyNetworksDataProvider from '_/modals/host-copy-network/HostCopyNetworksDataProvider'
import HostCopyNetworksModal from '_/modals/host-copy-network/HostCopyNetworksModal'

export function showHostCopyNetworksModal (sourceHost) {
  renderComponent(
    ({ unmountComponent }) => (
      <HostCopyNetworksDataProvider sourceHostId={sourceHost.id}>
        {({ isLoading, hostNames, targetHostItems, onRefreshHosts, onCopyNetworksToHost }) => (
          <HostCopyNetworksModal
            isLoading={isLoading}
            hostNames={hostNames}
            targetHostItems={targetHostItems}
            onClose={unmountComponent}
            onCopyNetworksToHost={onCopyNetworksToHost}
            onRefreshHosts={onRefreshHosts}
          />
        )}
      </HostCopyNetworksDataProvider>
    ),
    'host-copy-networks-modal'
  )
}
