import React from 'react'
import { renderComponent } from '_/utils/react-modals'
import { msg } from '_/intl-messages'
import { CpuIcon, VirtualMachineIcon } from '@patternfly/react-icons'
import CpuPinningModal from '_/modals/cpu-pinning/CpuPinningModal'
import CpuPinningDataProvider from '_/modals/cpu-pinning/CpuPinningDataProvider'

export function showVmCpuPinningModal (vm) {
  renderComponent(
    ({ unmountComponent }) => (
      <CpuPinningDataProvider vmId={vm.id}>
        <CpuPinningModal
          cpuTopologyDescription={msg.cpuTopologyDescriptionForVmView()}
          socketLabelProvider={createSocketLabel}
          coreLabelProvider={createCoreLabel}
          cpuLabelProvider={createCpuLabelForVm}
          pinnedCpuLabelProvider={createPinnedCpuLabelForVm}
          pinnedEntityIcon={<CpuIcon />}
          onClose={unmountComponent}
        />
      </CpuPinningDataProvider>
    ),
    'vm-cpu-pinning'
  )
}

export function showHostCpuPinningModal (host) {
  renderComponent(
    ({ unmountComponent }) => (
      <CpuPinningDataProvider hostId={host.id}>
        <CpuPinningModal
          cpuTopologyDescription={msg.cpuTopologyDescriptionForHostView()}
          socketLabelProvider={createSocketLabel}
          coreLabelProvider={createCoreLabel}
          cpuLabelProvider={createCpuLabelForHost}
          pinnedCpuLabelProvider={createPinnedCpuLabelForHost}
          pinnedEntityIcon={<VirtualMachineIcon />}
          variant='medium'
          onClose={unmountComponent}
        />
      </CpuPinningDataProvider>
    ),
    'vm-cpu-pinning'
  )
}

function createSocketLabel (socketId) {
  return msg.cpuTopologySocket({ id: socketId })
}

function createCoreLabel (coreId) {
  return msg.cpuTopologyCore({ id: coreId })
}

function createCpuLabelForVm (cpuId) {
  return msg.cpuPinningModalvCpuId({ id: cpuId })
}

function createCpuLabelForHost (cpuId) {
  return msg.cpuPinningModalCpuId({ id: cpuId })
}

function createPinnedCpuLabelForVm (pinnedCpuId) {
  return msg.cpuPinningModalPinnedCpu({ id: pinnedCpuId })
}

function createPinnedCpuLabelForHost (cpuPolicy) {
  return cpuPolicy
}
