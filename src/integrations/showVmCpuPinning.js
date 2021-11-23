import React from 'react'
import { renderComponent } from '_/utils/react-modals'

import CpuPinningModal from '_/modals/cpu-pinning/CpuPinningModal'
import CpuPinningDataProvider from '_/modals/cpu-pinning/CpuPinningDataProvider'

export function showCpuPinningModal (vm) {
  renderComponent(
    ({ unmountComponent }) => (
      <CpuPinningDataProvider vmId={vm.id}>
        <CpuPinningModal
          onClose={unmountComponent}
        />
      </CpuPinningDataProvider>
    ),
    'vm-cpu-pinning'
  )
}
