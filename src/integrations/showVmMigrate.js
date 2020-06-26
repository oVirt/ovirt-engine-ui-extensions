import React from 'react'
import { showModal } from '_/utils/react-modals'

import VmMigrateModal from '_/components/modals/vm/VmMigrateModal'

function showVmMigrateModal (upVms) {
  showModal(({ container, destroyModal }) => (
    <VmMigrateModal
      vmIds={upVms.map(vm => vm.id)}
      appendTo={container}
      onClose={destroyModal}
    />

  ))
}

export {
  showVmMigrateModal
}
