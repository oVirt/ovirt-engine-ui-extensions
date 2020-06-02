import React from 'react'
import { showModal } from '_/utils/react-modals'

import HostCopyNetworksDataProvider from '_/components/modals/host/HostCopyNetworksDataProvider'
import HostCopyNetworksModal from '_/components/modals/host/HostCopyNetworksModal'

function showHostCopyNetworksModal (sourceHost) {
  showModal(({ container, destroyModal }) => (
    <HostCopyNetworksDataProvider sourceHostId={sourceHost.id}>
      {({ isLoading, hostNames, targetHostItems, onRefreshHosts, onCopyNetworksToHost }) =>
        <HostCopyNetworksModal
          isLoading={isLoading}
          hostNames={hostNames}
          targetHostItems={targetHostItems}
          appendTo={container}
          onClose={destroyModal}
          onCopyNetworksToHost={onCopyNetworksToHost}
          onRefreshHosts={onRefreshHosts}
        />
      }
    </HostCopyNetworksDataProvider>
  ))
}

export {
  showHostCopyNetworksModal
}
