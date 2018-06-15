/**
 * Defines all of the localized strings used in the application.
 *
 * Every key becomes a function that will format the text in the currently configured
 * locale at runtime.
 *
 * Example common message (key has no prefix):
 * ```
 * stringName: {
 *   id: 'common.stringName',
 *   defaultMessage: 'English text',
 *   description: 'Hint for translators to understand where the string is used in the app'
 * }
 * ```
 *
 * Example context-specific message (key has context-specific prefix):
 * ```
 * dashboardStringName: {
 *   id: 'dashboard.stringName',
 *   defaultMessage: 'English text',
 *   description: 'Hint for translators to understand where the string is used in the app'
 * }
 * ```
 */
const messageDescriptors = {

  // common strings

  closeButton: {
    id: 'common.closeButton',
    defaultMessage: 'Close',
    description: 'label of `Close` button used in dialogs'
  },

  okButton: {
    id: 'common.okButton',
    defaultMessage: 'OK',
    description: 'label of `OK` button used in dialogs'
  },

  cancelButton: {
    id: 'common.cancelButton',
    defaultMessage: 'Cancel',
    description: 'label of `Cancel` button used in dialogs'
  },

  notAvailableShort: {
    id: 'common.notAvailableShort',
    defaultMessage: 'N/A',
    description: 'shorthand for `Not Available`'
  },

  cpuTitle: {
    id: 'common.cpuTitle',
    defaultMessage: 'CPU',
    description: 'title `CPU` used in various components'
  },

  memoryTitle: {
    id: 'common.memoryTitle',
    defaultMessage: 'Memory',
    description: 'title `Memory` used in various components'
  },

  storageTitle: {
    id: 'common.storageTitle',
    defaultMessage: 'Storage',
    description: 'title `Storage` used in various components'
  },

  used: {
    id: 'common.used',
    defaultMessage: 'Used',
    description: 'label that indicates current usage in various components'
  },

  unitUsed: {
    id: 'common.unitUsed',
    defaultMessage: '{unit} Used',
    description: 'label that indicates current usage in various components'
  },

  percentUsed: {
    id: 'common.percentUsed',
    defaultMessage: '{value, number}% Used',
    description: 'label that indicates current usage in various components'
  },

  available: {
    id: 'common.available',
    defaultMessage: 'Available',
    description: 'label that indicates available (total - used) value in various components'
  },

  unitAvailable: {
    id: 'common.unitAvailable',
    defaultMessage: '{unit} Available',
    description: 'label that indicates available (total - used) value in various components'
  },

  percentAvailable: {
    id: 'common.percentAvailable',
    defaultMessage: '{value, number}% Available',
    description: 'label that indicates available (total - used) value in various components'
  },

  usedOfTotal: {
    id: 'common.usedOfTotal',
    defaultMessage: '{used, number} of {total, number}',
    description: 'text shown to compare currently used vs. total value'
  },

  // dashboard related strings

  dashboardTitle: {
    id: 'dashboard.title',
    defaultMessage: 'Dashboard',
    description: 'title of the Dashboard place'
  },

  dashboardDataLoading: {
    id: 'dashboard.dataLoading',
    defaultMessage: 'Loading data...',
    description: 'title shown when Dashboard place is currently loading data'
  },

  dashboardDataError: {
    id: 'dashboard.dataError',
    defaultMessage: 'Error!',
    description: 'title shown when Dashboard place failed to load data'
  },

  dashboardDataErrorDetail: {
    id: 'dashboard.dataErrorDetail',
    defaultMessage: 'Could not fetch dashboard data. Please ensure that data warehouse is properly installed and configured.',
    description: 'detail shown when Dashboard place failed to load data'
  },

  dashboardRefreshButtonTooltip: {
    id: 'dashboard.refreshButtonTooltip',
    defaultMessage:
      'Manually refresh dashboard. With default server settings, status card' +
      ' data is updated once a minute and utilization data is updated once every 5 minutes.',
    description: 'tooltip on the refresh button to explain it is manual update and with what frequency the data is updated'
  },

  dashboardLastUpdated: {
    id: 'dashboard.lastUpdated',
    defaultMessage: 'Last Updated',
    description: 'label that indicates date/time of last dashboard data update'
  },

  dashboardGlobalUtilizationHeading: {
    id: 'dashboard.globalUtilizationHeading',
    defaultMessage: 'Global Utilization',
    description: 'heading of `Global Utilization` section'
  },

  dashboardClusterUtilizationHeading: {
    id: 'dashboard.clusterUtilizationHeading',
    defaultMessage: 'Cluster Utilization',
    description: 'heading of `Cluster Utilization` section'
  },

  dashboardStorageUtilizationHeading: {
    id: 'dashboard.storageUtilizationHeading',
    defaultMessage: 'Storage Utilization',
    description: 'heading of `Storage Utilization` section'
  },

  dashboardStatusCardDataCenterTitle: {
    id: 'dashboard.statusCardDataCenterTitle',
    defaultMessage: 'Data Centers',
    description: 'title of `Data Centers` status card'
  },

  dashboardStatusCardClusterTitle: {
    id: 'dashboard.statusCardClusterTitle',
    defaultMessage: 'Clusters',
    description: 'title of `Clusters` status card'
  },

  dashboardStatusCardHostTitle: {
    id: 'dashboard.statusCardHostTitle',
    defaultMessage: 'Hosts',
    description: 'title of `Hosts` status card'
  },

  dashboardStatusCardStorageTitle: {
    id: 'dashboard.statusCardStorageTitle',
    defaultMessage: 'Data Storage Domains',
    description: 'title of `Data Storage Domains` status card'
  },

  dashboardStatusCardGlusterVolumeTitle: {
    id: 'dashboard.statusCardGlusterVolumeTitle',
    defaultMessage: 'Gluster Volumes',
    description: 'title of `Gluster Volumes` status card'
  },

  dashboardStatusCardVmTitle: {
    id: 'dashboard.statusCardVmTitle',
    defaultMessage: 'Virtual Machines',
    description: 'title of `Virtual Machines` status card'
  },

  dashboardStatusCardEventTitle: {
    id: 'dashboard.statusCardEventTitle',
    defaultMessage: 'Events',
    description: 'title of `Events` status card'
  },

  dashboardStatusTypeUp: {
    id: 'dashboard.statusTypeUp',
    defaultMessage: 'Up',
    description: 'text shown for `Up` status'
  },

  dashboardStatusTypeDown: {
    id: 'dashboard.statusTypeDown',
    defaultMessage: 'Down',
    description: 'text shown for `Down` status'
  },

  dashboardStatusTypeError: {
    id: 'dashboard.statusTypeError',
    defaultMessage: 'Error',
    description: 'text shown for `Error` status'
  },

  dashboardStatusTypeWarning: {
    id: 'dashboard.statusTypeWarning',
    defaultMessage: 'Warning',
    description: 'text shown for `Warning` status'
  },

  dashboardStatusTypeAlert: {
    id: 'dashboard.statusTypeAlert',
    defaultMessage: 'Alert',
    description: 'text shown for `Alert` status'
  },

  dashboardStatusTypeUnknown: {
    id: 'dashboard.statusTypeUnknown',
    defaultMessage: 'Unknown status',
    description: 'text shown for status not recognized by Dashboard'
  },

  dashboardUtilizationCardAvailableOfPercent: {
    id: 'dashboard.utilizationCardAvailableOfPercent',
    defaultMessage: 'of {total, number}%',
    description: 'part of utilization card\'s summary'
  },

  dashboardUtilizationCardAvailableOfUnit: {
    id: 'dashboard.utilizationCardAvailableOfUnit',
    defaultMessage: 'of {total, number} {unit}',
    description: 'part of utilization card\'s summary'
  },

  dashboardUtilizationCardOverCommit: {
    id: 'dashboard.utilizationCardOverCommit',
    defaultMessage: 'Virtual resources - Committed: {overcommit, number}%, Allocated: {allocated, number}%',
    description: 'shown below utilization card\'s summary'
  },

  dashboardUtilizationCardOverCommitTooltip: {
    id: 'dashboard.utilizationCardOverCommitTooltip',
    defaultMessage:
      'The committed and allocated virtual resources are percentages indicating the running virtual resource' +
      ' compared to actual resources.',
    description: 'tooltip for the virtual resource over commit below utilization card\'s summary'
  },

  dashboardUtilizationCardDialogHostListTitle: {
    id: 'dashboard.utilizationCardDialogHostListTitle',
    defaultMessage: 'Hosts ({hostCount, number})',
    description: 'title of `Hosts` list in utilization card\'s dialog'
  },

  dashboardUtilizationCardDialogEmptyHostList: {
    id: 'dashboard.utilizationCardDialogEmptyHostList',
    defaultMessage: 'There are currently no utilized hosts',
    description: 'shown when `Hosts` list in utilization card\'s dialog is empty'
  },

  dashboardUtilizationCardDialogStorageListTitle: {
    id: 'dashboard.utilizationCardDialogStorageListTitle',
    defaultMessage: 'Storage Domains ({storageCount, number})',
    description: 'title of `Storage Domains` list in utilization card\'s dialog'
  },

  dashboardUtilizationCardDialogEmptyStorageList: {
    id: 'dashboard.utilizationCardDialogEmptyStorageList',
    defaultMessage: 'There are currently no utilized storage domains',
    description: 'shown when `Storage Domains` list in utilization card\'s dialog is empty'
  },

  dashboardUtilizationCardDialogVmListTitle: {
    id: 'dashboard.utilizationCardDialogVmListTitle',
    defaultMessage: 'Virtual Machines ({vmCount, number})',
    description: 'title of `Virtual Machines` list in utilization card\'s dialog'
  },

  dashboardUtilizationCardDialogEmptyVmList: {
    id: 'dashboard.utilizationCardDialogEmptyVmList',
    defaultMessage: 'There are currently no utilized virtual machines',
    description: 'shown when `Virtual Machines` list in utilization card\'s dialog is empty'
  },

  dashboardUtilizationCardCpuDialogTitle: {
    id: 'dashboard.utilizationCardCpuDialogTitle',
    defaultMessage: 'Top Utilized Resources (CPU)',
    description: 'title of resource utilization dialog for `CPU` utilization card'
  },

  dashboardUtilizationCardMemoryDialogTitle: {
    id: 'dashboard.utilizationCardMemoryDialogTitle',
    defaultMessage: 'Top Utilized Resources (Memory)',
    description: 'title of resource utilization dialog for `Memory` utilization card'
  },

  dashboardUtilizationCardStorageDialogTitle: {
    id: 'dashboard.utilizationCardStorageDialogTitle',
    defaultMessage: 'Top Utilized Resources (Storage)',
    description: 'title of resource utilization dialog for `Storage` utilization card'
  },

  // modal dialog related strings

  migrateVmDialogTitle: {
    id: 'migrate.vm.dialogTitle',
    defaultMessage: 'Migrate VM(s)',
    description: 'title of VM migrate dialog'
  },

  migrateVmButton: {
    id: 'migrate.vm.buttonLabel',
    defaultMessage: 'Migrate',
    description: 'label of `Migrate` button in VM migrate dialog'
  },

  migrateVmDataError: {
    id: 'migrate.vm.dataError',
    defaultMessage: 'Could not fetch data needed for VM migrate operation',
    description: 'notification shown when VM migrate dialog failed to load its data'
  },

  migrateVmNoAvailableHost: {
    id: 'migrate.vm.noAvailableHost',
    defaultMessage: 'No available host to migrate VMs to',
    description: 'notification shown when there are no hosts the VMs can migrate to'
  },

  migrateVmInfoLabel: {
    id: 'migrate.vm.vmInfoLabel',
    defaultMessage: 'Migrate {value, number} Virtual Machines to the selected Host.',
    description: 'label shown above the target host dropdown, informing the user about VMs that are about to be migrated'
  },

  migrateVmListLabel: {
    id: 'migrate.vm.vmListLabel',
    defaultMessage: 'Virtual Machines',
    description: 'label for the VM list shown below the target host dropdown'
  },

  migrateVmListShowAllLabel: {
    id: 'migrate.vm.vmListShowAllLabel',
    defaultMessage: 'Show all Virtual Machines',
    description: 'text of the link that allows showing all VMs in the VM list'
  },

  migrateVmListShowLessLabel: {
    id: 'migrate.vm.vmListShowLessLabel',
    defaultMessage: 'Show less Virtual Machines',
    description: 'text of the link that allows showing less (up to 10) VMs in the VM list'
  },

  migrateVmSelectHostLabel: {
    id: 'migrate.vm.selectHostLabel',
    defaultMessage: 'Destination Host',
    description: 'label for the dropdown used to select migration target host'
  },

  migrateVmSelectHostFieldHelp: {
    id: 'migrate.vm.selectHostFieldHelp',
    defaultMessage: 'Select \'Automatically Choose Host\' to allow the application to select the best suited Host for these Virtual Machines to migrate to.',
    description: 'field help for the dropdown used to select migration target host'
  },

  migrateVmAutoSelectHost: {
    id: 'migrate.vm.autoSelectHost',
    defaultMessage: 'Automatically Choose Host',
    description: 'label for the default migration target host dropdown option'
  }

}

module.exports = exports = messageDescriptors
