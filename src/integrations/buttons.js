import { entityTypes, vmUpStates } from '_/constants'
import getPluginApi from '_/plugin-api'
import config from '_/plugin-config'
import { msg } from '_/intl-messages'
import { showVmManageGpuModal } from './showVmManageGpu'
import { showVmMigrateModal } from './showVmMigrate'
import { showClusterUpgradeWizard } from './showClusterUpgrade'
import { showVmExportModal } from './showVmExport'

function isVmUp (vm) {
  return vmUpStates.includes(vm.status)
}

function addVmManageGpuButton () {
  getPluginApi().addDetailPlaceActionButton(entityTypes.vm, entityTypes.hostDevices, msg.vmManageGpuButton(), {
    onClick: function (_selectedItems, parent) {
      showVmManageGpuModal(parent)
    },

    index: 2,

    id: 'VmManageGpu'
  })
}

/**
 * "Migrate" button to VMs List.  Enabled when at least 1 running VM is selected.
 */
function addVmMigrateButton () {
  let selectedUpVms = []

  getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      showVmMigrateModal(selectedUpVms)
    },

    isEnabled: function (selectedVms) {
      selectedUpVms = selectedVms.filter(isVmUp)
      return selectedUpVms.length > 0 || config.useFakeData
    },

    index: 8,

    id: 'VmMigrate'

  })
}

/**
 * "Migrate" button to Host Detail / VMs List.  Enabled when at least 1 running VM is selected.
 */
function addHostVmMigrateButton () {
  let selectedUpVms = []

  getPluginApi().addDetailPlaceActionButton(entityTypes.host, entityTypes.vm, msg.migrateVmButton(), {

    onClick: function () {
      showVmMigrateModal(selectedUpVms)
    },

    isEnabled: function (selectedVms) {
      selectedUpVms = selectedVms.filter(isVmUp)
      return selectedUpVms.length > 0 || config.useFakeData
    },

    index: 5,

    id: 'HostVmMigrate'
  })
}

/**
 * "Export" button to VMs List.  Enabled when 1 down VM is selected.
 */
function addVmExportButton () {
  let selectedDownVm

  getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.exportVmButton(), {
    onClick: function () {
      showVmExportModal(selectedDownVm)
    },

    isEnabled: function (selectedVms) {
      const enable = selectedVms.length === 1 && selectedVms[0] && selectedVms[0].status === 'Down'
      selectedDownVm = enable ? selectedVms[0] : undefined
      return enable
    },

    index: 4,

    id: 'VmExport'

  })
}

/**
 * "Upgrade" button to Cluster List.  Enabled when exactly 1 cluster is selected.
 */
function addClusterUpgradeButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.cluster, msg.clusterUpgradeButton(), {

    onClick: function ([ selectedCluster ]) {
      if (selectedCluster.id && selectedCluster.name) {
        showClusterUpgradeWizard(selectedCluster)
      }
    },

    isEnabled: function (selectedClusters) {
      return selectedClusters.length === 1
    },

    index: 3,

    id: 'ClusterUpgrade'

  })
}

export function addButtons () {
  addVmManageGpuButton()
  addVmMigrateButton()
  addHostVmMigrateButton()
  addVmExportButton()
  addClusterUpgradeButton()
}
