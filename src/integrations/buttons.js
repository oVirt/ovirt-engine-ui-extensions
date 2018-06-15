import React from 'react'
import { useFakeData, entityTypes, vmUpStates } from '../constants'
import getPluginApi from '../plugin-api'
import { msg } from '../intl-messages'
import { showModal } from '../utils/react-modals'
import VmMigrateModal from '../components/modals/vm/VmMigrateModal'
import { hostAutoSelectItemValue } from '../components/modals/vm/VmMigrateModalBody'
import VmMigrateDataProvider from '../components/modals/vm/VmMigrateDataProvider'

function isVmUp (vm) {
  return vmUpStates.includes(vm.status)
}

let lastSelectedVms = []

function addVmMigrateButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      const upVms = lastSelectedVms.filter(isVmUp)
      const upVmCount = useFakeData ? 1337 : upVms.length

      showModal(({ container, destroyModal }) => (
        <VmMigrateDataProvider vmIds={upVms.map(vm => vm.id)}>
          <VmMigrateModal
            title={msg.migrateVmDialogTitle()}
            vmInfoLabel={msg.migrateVmInfoLabel({ value: upVmCount })}
            vmListLabel={msg.migrateVmListLabel()}
            vmListShowAllLabel={msg.migrateVmListShowAllLabel()}
            vmListShowLessLabel={msg.migrateVmListShowLessLabel()}
            hostSelectLabel={msg.migrateVmSelectHostLabel()}
            hostSelectFieldHelp={msg.migrateVmSelectHostFieldHelp()}
            hostAutoSelectItem={{
              value: hostAutoSelectItemValue,
              text: msg.migrateVmAutoSelectHost()
            }}
            migrateButtonLabel={msg.migrateVmButton()}
            cancelButtonLabel={msg.cancelButton()}
            show
            container={container}
            onExited={destroyModal}
          />
        </VmMigrateDataProvider>
      ))
    },

    isEnabled: function () {
      // We need this when the user navigates directly to VM details place.
      // In such case, the VirtualMachineSelectionChange event is not fired.
      // TODO(vs): Try to fix this in UI plugin infra code.
      lastSelectedVms = Array.from(arguments)
      return useFakeData ? true : lastSelectedVms.filter(isVmUp).length > 0
    },

    index: 8

  })
}

export function addButtons () {
  addVmMigrateButton()
}

addButtons.VirtualMachineSelectionChange = function () {
  lastSelectedVms = Array.from(arguments)
}
