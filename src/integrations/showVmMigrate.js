import React from 'react'
import { showModal } from '_/utils/react-modals'

import VmMigrateDataProvider from '_/components/modals/vm/VmMigrateDataProvider'
import VmMigrateModal from '_/components/modals/vm/VmMigrateModal'

function showVmMigrateModal (upVms) {
  showModal(({ container, destroyModal }) => (
    <VmMigrateDataProvider vmIds={upVms.map(vm => vm.id)}>
      {({ isLoading, vmNames, targetHostItems, refreshHosts, migrateToHost }) =>
        <VmMigrateModal
          show
          container={container}
          onExited={destroyModal}
          isLoading={isLoading}
          vmNames={vmNames}
          targetHostItems={targetHostItems}

          onRefreshHosts={refreshHosts}
          onMigrateToHost={migrateToHost}
        />
      }
    </VmMigrateDataProvider>
  ))
}

export {
  showVmMigrateModal
}
