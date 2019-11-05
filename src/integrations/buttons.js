import { entityTypes, vmUpStates } from '_/constants'
import getPluginApi from '_/plugin-api'
import config from '_/plugin-config'
import { msg } from '_/intl-messages'

import { showVmMigrateModal } from './showVmMigrate'
import { showClusterUpgradeWizard } from './showClusterUpgrade'
import { showVmExportModal } from './showVmExport'

function isVmUp (vm) {
  return vmUpStates.includes(vm.status)
}

let lastSelectedMainVms = []
let lastSelectedHostVms = []

function addVmMigrateButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      showVmMigrateModal(lastSelectedMainVms.filter(isVmUp))
    },

    isEnabled: function () {
      lastSelectedMainVms = Array.from(arguments)
      return lastSelectedMainVms.filter(isVmUp).length > 0 || config.useFakeData
    },

    index: 8

  })
}

function addVmExportButton () {
  let selectedVms = []

  getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.exportVmButton(), {
    onClick: function () {
      showVmExportModal(selectedVms[0])
    },

    isEnabled: function () {
      selectedVms = Array.from(arguments)
      const enable = selectedVms.length === 1 && selectedVms[0] && selectedVms[0].status === 'Down'
      return enable
    },

    index: 4
  })
}

function addHostVmMigrateButton () {
  getPluginApi().addDetailPlaceActionButton(entityTypes.host, entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      showVmMigrateModal(lastSelectedHostVms.filter(isVmUp))
    },

    isEnabled: function () {
      lastSelectedHostVms = Array.from(arguments)
      return lastSelectedHostVms.filter(isVmUp).length > 0 || config.useFakeData
    },

    index: 5

  })
}

/**
 * Add an "Upgrade" button to the Cluster main view.  It will be enabled when exactly
 * 1 cluster is selected.
 */
function addClusterUpgradeButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.cluster, msg.clusterUpgradeButton(), {

    onClick: function (selectedCluster) {
      if (selectedCluster && selectedCluster.id && selectedCluster.name) {
        showClusterUpgradeWizard(selectedCluster)
      }
    },

    isEnabled: function (...selectedClusters) {
      return selectedClusters && selectedClusters.length === 1
    },

    index: 3

  })
}

export function addButtons () {
  addVmMigrateButton()
  addHostVmMigrateButton()
  addClusterUpgradeButton()
  addVmExportButton()
}
