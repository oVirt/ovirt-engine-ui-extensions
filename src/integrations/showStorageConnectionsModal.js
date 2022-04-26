import React from 'react'
import { renderComponent } from '_/utils/react-modals'

import StorageConnectionsModal from '_/modals/storage-connections/StorageConnectionsModal'
import StorageConnectionsDataProvider from '_/modals/storage-connections/StorageConnectionsDataProvider'

export function showStorageConnectionsModal (storageDomain) {
  renderComponent(
    ({ unmountComponent }) => (
      <StorageConnectionsDataProvider storageDomain={storageDomain}>
        <StorageConnectionsModal
          onClose={unmountComponent}
        />
      </StorageConnectionsDataProvider>
    ),
    'show-storage-connections-modal'
  )
}
