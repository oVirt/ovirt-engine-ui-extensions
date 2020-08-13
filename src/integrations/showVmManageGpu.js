import React from 'react'
import { renderComponent } from '_/utils/react-modals'

import GpuDataProvider from '_/components/modals/vm/gpu/GpuDataProvider'
import ManageGpuModal from '_/components/modals/vm/gpu/ManageGpuModal'

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
