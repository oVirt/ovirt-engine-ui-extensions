import React from 'react'
import { renderComponent } from '_/utils/react-modals'

import GpuDataProvider from '_/modals/vm-manage-gpu/GpuDataProvider'
import ManageGpuModal from '_/modals/vm-manage-gpu/ManageGpuModal'

export function showVmManageGpuModal (vm) {
  renderComponent(
    ({ unmountComponent }) => (
      <GpuDataProvider vmId={vm.id}>
        <ManageGpuModal
          onClose={unmountComponent}
        />
      </GpuDataProvider>
    ),
    'vm-manage-gpu-modal'
  )
}
