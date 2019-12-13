import React from 'react'
import { msg } from '_/intl-messages'
import { showModal } from '_/utils/react-modals'

import GpuDataProvider from '_/components/modals/vm/gpu/GpuDataProvider'
import ManageGpuModal from '_/components/modals/vm/gpu/ManageGpuModal'

function showVmManageGpuModal (vm) {
  showModal(({ container, destroyModal }) => (
    <GpuDataProvider vmId={vm.id}>
      <ManageGpuModal
        show
        container={container}
        onExited={destroyModal}
        title={msg.vmManageGpuDialogTitle()}
        className='vgpu-modal'
      />
    </GpuDataProvider>
  ))
}

export { showVmManageGpuModal }
