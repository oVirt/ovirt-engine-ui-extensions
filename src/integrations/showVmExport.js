import React from 'react'
import { renderComponent } from '_/utils/react-modals'

import VmExportModal from '_/components/modals/vm/VmExportModal'
import VmExportDataProvider from '_/components/modals/vm/VmExportDataProvider'

export function showVmExportModal (vm) {
  renderComponent(
    ({ unmountComponent }) => (
      <VmExportDataProvider vm={vm}>
        <VmExportModal
          vm={vm}
          onClose={unmountComponent}
        />
      </VmExportDataProvider>
    ),
    'vm-export-modal'
  )
}
