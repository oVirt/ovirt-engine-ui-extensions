import React from 'react'
import { msg } from '_/intl-messages'
import { showModal } from '_/utils/react-modals'

import VmExportModal from '_/components/modals/vm/VmExportModal'
import VmExportDataProvider from '_/components/modals/vm/VmExportDataProvider'

export function showVmExportModal (vm) {
  showModal(({ container, destroyModal }) => (
    <VmExportDataProvider vmId={vm.id}>
      <VmExportModal
        show
        container={container}
        onExited={destroyModal}
        title={msg.exportVmTitle()}
        vm={vm}
      />
    </VmExportDataProvider>
  ))
}
