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

let lastSelectedMainVms = []
let lastSelectedHostVms = []

function showVmMigrateModal (upVms) {
  showModal(({ container, destroyModal }) => (
    <VmMigrateDataProvider vmIds={upVms.map(vm => vm.id)}>
      <VmMigrateModal
        title={msg.migrateVmDialogTitle()}
        vmInfoLabel={msg.migrateVmInfoLabel({
          value: useFakeData ? 1337 : upVms.length
        })}
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
}

function addVmMigrateButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      showVmMigrateModal(lastSelectedMainVms.filter(isVmUp))
    },

    isEnabled: function () {
      lastSelectedMainVms = Array.from(arguments)
      return lastSelectedMainVms.filter(isVmUp).length > 0 || useFakeData
    },

    index: 8

  })
}

function addHostVmMigrateButton () {
  getPluginApi().addDetailPlaceActionButton(entityTypes.host, entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      showVmMigrateModal(lastSelectedHostVms.filter(isVmUp))
    },

    isEnabled: function () {
      lastSelectedHostVms = Array.from(arguments)
      return lastSelectedHostVms.filter(isVmUp).length > 0 || useFakeData
    },

    index: 5

  })
}

export function addButtons () {
  addVmMigrateButton()
  addHostVmMigrateButton()
}
