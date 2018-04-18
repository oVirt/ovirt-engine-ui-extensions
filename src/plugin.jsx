import React from 'react'
import { pluginBasePath, useFakeData, dashboardPlaceToken, entityTypes, vmUpStates } from './constants'
import getPluginApi from './plugin-api'
import { msg } from './intl-messages'
import appInit from './services/app-init'
import { showModal } from './utils/react-modals'
import VmMigrateModal from './components/modals/vm/VmMigrateModal'
import { hostAutoSelectItemValue } from './components/modals/vm/VmMigrateModalBody'
import VmMigrateDataProvider from './components/modals/vm/VmMigrateDataProvider'

function isVmUp (vm) {
  return vmUpStates.includes(vm.status)
}

let lastSelectedVms

// register event handlers
getPluginApi().register({

  UiInit () {
    // add Dashboard place
    getPluginApi().addPrimaryMenuPlace(msg.dashboardTitle(), dashboardPlaceToken, `${pluginBasePath}/dashboard.html`, {
      // place the menu item before existing ones
      priority: -1,
      // customize the prefix displayed in search bar
      searchPrefix: 'Dashboard',
      // make users land on this place by default
      defaultPlace: true,
      icon: 'fa-tachometer'
    })

    // add VM migrate button
    getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.migrateVmButton(), {

      onClick: function () {
        showModal(({ container, destroyModal }) => (
          <VmMigrateDataProvider vmIds={lastSelectedVms.filter(isVmUp).map(vm => vm.id)}>
            <VmMigrateModal
              title={msg.migrateVmDialogTitle()}
              hostSelectLabel={msg.migrateVmSelectHostLabel()}
              hostAutoSelectItem={{
                value: hostAutoSelectItemValue,
                text: msg.migrateVmAutomaticallySelectHost()
              }}
              okButtonLabel={msg.okButton()}
              cancelButtonLabel={msg.cancelButton()}
              show
              container={container}
              onExited={destroyModal}
            />
          </VmMigrateDataProvider>
        ))
      },

      isEnabled: function (...selectedVms) {
        // We need this when the user navigates directly to VM details place.
        // In such case, the VirtualMachineSelectionChange event is not fired.
        // TODO(vs): Try to fix this in UI plugin infra code.
        if (!lastSelectedVms) {
          lastSelectedVms = selectedVms.slice()
        }
        return useFakeData ? true : lastSelectedVms.filter(isVmUp).length > 0
      },

      index: 8

    })
  },

  VirtualMachineSelectionChange: function (...selectedVms) {
    lastSelectedVms = selectedVms.slice()
  }

})

appInit.run().then(() => {
  // proceed with plugin initialization (UI plugin infra will call UiInit)
  getPluginApi().ready()
})
