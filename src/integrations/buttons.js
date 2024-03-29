import { entityTypes, vmUpStates } from '_/constants'
import getPluginApi from '_/plugin-api'
import config from '_/plugin-config'
import { msg } from '_/intl-messages'
import { showVmCpuPinningModal, showHostCpuPinningModal } from './showCpuPinning'
import { showVmManageGpuModal } from './showVmManageGpu'
import { showVmMigrateModal } from './showVmMigrate'
import { showClusterUpgradeWizard } from './showClusterUpgrade'
import { showVmExportModal } from './showVmExport'
import { showHostCopyNetworksModal } from './showHostCopyNetworks'
import { showStorageConnectionsModal } from './showStorageConnectionsModal'

function isVmUp (vm) {
  return vmUpStates.includes(vm.status)
}

// for the time being the vGPU dialog will be available on both, vm devices tab and host devices tab
function addVmManageGpuButton () {
  getPluginApi().addDetailPlaceActionButton(entityTypes.vm, entityTypes.hostDevices, msg.vmManageGpuButton(), {
    onClick: function (_selectedItems, parent) {
      showVmManageGpuModal(parent)
    },

    index: 2,
    id: 'VmManageGpu',
  })

  getPluginApi().addDetailPlaceActionButton(entityTypes.vm, entityTypes.vmDevices, msg.vmManageGpuButton(), {
    onClick: function (_selectedItems, parent) {
      showVmManageGpuModal(parent)
    },
    id: 'VmManageGpuVmDevicesView',
  })
}

function addVmCpuPinningButton () {
  getPluginApi().addDetailPlaceActionButton(entityTypes.vm, entityTypes.hostDevices, msg.cpuPinningModalButton(), {
    onClick: function (_selectedItems, parent) {
      showVmCpuPinningModal(parent)
    },

    index: 3,
    id: 'VmCpuPinning',
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
    id: 'VmMigrate',
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
    id: 'HostVmMigrate',
  })
}

/**
 * "Export" button to VMs List.  Enabled when 1 down VM is selected.
 */
function addVmExportButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.vm, msg.exportVmButton(), {
    onClick: function ([selectedDownVm]) {
      showVmExportModal(selectedDownVm)
    },

    isEnabled: function (selectedVms) {
      return (
        selectedVms.length === 1 &&
        selectedVms[0] &&
        selectedVms[0].status === 'Down' &&
        selectedVms[0].managed
      )
    },

    index: 13,
    id: 'VmExport',
    moreMenu: true,
  })
}

/**
 * "Upgrade" button to Cluster List.  Enabled when exactly 1 cluster is selected.
 */
function addClusterUpgradeButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.cluster, msg.clusterUpgradeButton(), {
    onClick: function ([selectedCluster]) {
      if (selectedCluster.id && selectedCluster.name) {
        showClusterUpgradeWizard(selectedCluster)
      }
    },

    isEnabled: function (selectedClusters) {
      return selectedClusters.length === 1 && selectedClusters[0].managed
    },

    index: 3,
    id: 'ClusterUpgrade',
  })
}

/**
 * "Copy Host Networks" button in Host List.  Enabled when exactly 1 host is selected.
 */
function addHostCopyNetworksButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.host, msg.hostCopyNetworksButton(), {
    onClick: function ([selectedHost]) {
      if (selectedHost.id && selectedHost.name) {
        showHostCopyNetworksModal(selectedHost)
      }
    },

    isEnabled: function (selectedHosts) {
      return selectedHosts.length === 1 && selectedHosts[0].managed
    },

    index: 9,
    id: 'HostCopyNetworksButton',
  })
}

function addHostCpuPinningButton () {
  getPluginApi().addDetailPlaceActionButton(entityTypes.host, entityTypes.hostDevices, msg.cpuPinningModalButton(), {

    onClick: function (_selectedItems, parent) {
      showHostCpuPinningModal(parent)
    },

    id: 'HostCpuPinning',
  })
}

/**
 * "Connections" button in the Storage Domains list. Enabled when exactly 1 iSCSI domain is selected
 */
function addManageStorageConnectionsButton () {
  getPluginApi().addMenuPlaceActionButton(entityTypes.storage, msg.storageConnectionsManageButton(), {
    onClick: function ([selectedDomain]) {
      showStorageConnectionsModal(selectedDomain)
    },

    isEnabled: function (selectedDomains) {
      return (
        selectedDomains.length === 1 &&
        selectedDomains[0]?.type?.toLowerCase() === 'iscsi'
      )
    },

    index: 4,
    id: 'StorageConnectionsButton',
  })
}

export function addButtons () {
  addVmManageGpuButton()
  addVmCpuPinningButton()
  addVmMigrateButton()
  addHostVmMigrateButton()
  addVmExportButton()
  addClusterUpgradeButton()
  addHostCopyNetworksButton()
  addHostCpuPinningButton()
  addManageStorageConnectionsButton()
}
