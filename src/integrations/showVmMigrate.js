import React from 'react'
import { renderComponent } from '_/utils/react-modals'

import VmMigrateModal from '_/modals/vm-migrate/VmMigrateModal'

export function showVmMigrateModal (upVms) {
  renderComponent(
    ({ unmountComponent }) => (
      <VmMigrateModal
        vmIds={upVms.map(vm => vm.id)}
        onClose={unmountComponent}
      />
    ),
    'vm-migrate-modal'
  )
}
