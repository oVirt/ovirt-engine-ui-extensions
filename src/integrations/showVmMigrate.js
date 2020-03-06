import React from 'react'
import { showModal } from '_/utils/react-modals'

import VmMigrateDataProvider from '_/components/modals/vm/VmMigrateDataProvider'
import VmMigrateModal from '_/components/modals/vm/VmMigrateModal'

function showVmMigrateModal (upVms) {
  showModal(({ container, destroyModal }) => (
    <VmMigrateDataProvider vmIds={upVms.map(vm => vm.id)}>
      {({ isLoading, vmNames, targetHostItems, onRefreshHosts, onMigrateToHost }) =>
        <VmMigrateModal
          isLoading={isLoading}
          vmNames={vmNames}
          targetHostItems={targetHostItems}
          appendTo={container}
          onClose={destroyModal}
          onMigrateToHost={onMigrateToHost}
          onRefreshHosts={onRefreshHosts}
        />
      }
    </VmMigrateDataProvider>
  ))
}

export {
  showVmMigrateModal
}
