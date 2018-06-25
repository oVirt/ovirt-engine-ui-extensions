/*
 * Defines all of the Strings for the application.  Every key will become a function
 * that will format the text in the currently configured locale at runtime.
 *
 * Valid format for this Object literal is:
 *   {
 *     stringName: {
 *       id: 'locationUsed.stringName',
 *       defaultMessage: 'English text',
 *       description: 'Hint for the translators to understand where _stringName_ is used in the app'
 *     },
 *     stringName2: { ... },
 *     ...
 *     stringNameN: { ... }
 *   }
 */
module.exports = exports = {

  // common strings

  closeButton: {
    id: 'common.closeButton',
    defaultMessage: 'Close',
    description: 'label of `Close` button used in dialogs'
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

  // context-specific strings

  mainTabTitle: {
    id: 'mainTab.title',
    defaultMessage: 'Dashboard',
    description: 'title of the Dashboard main tab'
  },

  dataLoading: {
    id: 'mainTab.dataLoading',
    defaultMessage: 'Loading data...',
    description: 'title shown when Dashboard main tab is currently loading data'
  },

  dataError: {
    id: 'mainTab.dataError',
    defaultMessage: 'Error!',
    description: 'title shown when Dashboard main tab failed to load data'
  },

  dataErrorDetail: {
    id: 'mainTab.dataErrorDetail',
    defaultMessage: 'Could not fetch dashboard data. Please ensure that data warehouse is properly installed and configured.',
    description: 'detail shown when Dashboard main tab failed to load data'
  },

  refreshButtonTooltip: {
    id: 'mainTab.refreshButtonTooltip',
    defaultMessage:
      'Manually refresh dashboard. With default server settings, status card' +
      ' data is updated once a minute and utilization data is updated once every 5 minutes.',
    description: 'tooltip on the refresh button to explain it is manual update and with what frequency the data is updated'
  },

  lastUpdated: {
    id: 'mainTab.lastUpdated',
    defaultMessage: 'Last Updated',
    description: 'label that indicates date/time of last dashboard data update'
  },

  globalUtilizationHeading: {
    id: 'mainTab.globalUtilizationHeading',
    defaultMessage: 'Global Utilization',
    description: 'heading of `Global Utilization` section'
  },

  clusterUtilizationHeading: {
    id: 'mainTab.clusterUtilizationHeading',
    defaultMessage: 'Cluster Utilization',
    description: 'heading of `Cluster Utilization` section'
  },

  storageUtilizationHeading: {
    id: 'mainTab.storageUtilizationHeading',
    defaultMessage: 'Storage Utilization',
    description: 'heading of `Storage Utilization` section'
  },

  statusCardDataCenterTitle: {
    id: 'mainTab.statusCardDataCenterTitle',
    defaultMessage: 'Data Centers',
    description: 'title of `Data Centers` status card'
  },

  statusCardClusterTitle: {
    id: 'mainTab.statusCardClusterTitle',
    defaultMessage: 'Clusters',
    description: 'title of `Clusters` status card'
  },

  statusCardHostTitle: {
    id: 'mainTab.statusCardHostTitle',
    defaultMessage: 'Hosts',
    description: 'title of `Hosts` status card'
  },

  statusCardStorageTitle: {
    id: 'mainTab.statusCardStorageTitle',
    defaultMessage: 'Data Storage Domains',
    description: 'title of `Data Storage Domains` status card'
  },

  statusCardGlusterVolumeTitle: {
    id: 'mainTab.statusCardGlusterVolumeTitle',
    defaultMessage: 'Gluster Volumes',
    description: 'title of `Gluster Volumes` status card'
  },

  statusCardVmTitle: {
    id: 'mainTab.statusCardVmTitle',
    defaultMessage: 'Virtual Machines',
    description: 'title of `Virtual Machines` status card'
  },

  statusCardEventTitle: {
    id: 'mainTab.statusCardEventTitle',
    defaultMessage: 'Events',
    description: 'title of `Events` status card'
  },

  statusTypeUp: {
    id: 'mainTab.statusTypeUp',
    defaultMessage: 'Up',
    description: 'text shown for `Up` status'
  },

  statusTypeDown: {
    id: 'mainTab.statusTypeDown',
    defaultMessage: 'Down',
    description: 'text shown for `Down` status'
  },

  statusTypeError: {
    id: 'mainTab.statusTypeError',
    defaultMessage: 'Error',
    description: 'text shown for `Error` status'
  },

  statusTypeWarning: {
    id: 'mainTab.statusTypeWarning',
    defaultMessage: 'Warning',
    description: 'text shown for `Warning` status'
  },

  statusTypeAlert: {
    id: 'mainTab.statusTypeAlert',
    defaultMessage: 'Alert',
    description: 'text shown for `Alert` status'
  },

  statusTypeUnknown: {
    id: 'mainTab.statusTypeUnknown',
    defaultMessage: 'Unknown status',
    description: 'text shown for status not recognized by Dashboard'
  },

  utilizationCardAvailableOfPercent: {
    id: 'mainTab.utilizationCardAvailableOfPercent',
    defaultMessage: 'of {total, number}%',
    description: 'part of utilization card\'s summary'
  },

  utilizationCardAvailableOfUnit: {
    id: 'mainTab.utilizationCardAvailableOfUnit',
    defaultMessage: 'of {total, number} {unit}',
    description: 'part of utilization card\'s summary'
  },

  utilizationCardOverCommit: {
    id: 'mainTab.utilizationCardOverCommit',
    defaultMessage: 'Virtual resources - Committed: {overcommit, number}%, Allocated: {allocated, number}%',
    description: 'shown below utilization card\'s summary'
  },

  utilizationCardOverCommitTooltip: {
    id: 'mainTab.utilizationCardOverCommitTooltip',
    defaultMessage:
      'The committed and allocated virtual resources are percentages indicating the running virtual resource' +
      ' compared to actual resources.',
    description: 'tooltip for the virtual resource over commit below utilization card\'s summary'
  },

  utilizationCardDialogHostListTitle: {
    id: 'mainTab.utilizationCardDialogHostListTitle',
    defaultMessage: 'Hosts ({hostCount, number})',
    description: 'title of `Hosts` list in utilization card\'s dialog'
  },

  utilizationCardDialogEmptyHostList: {
    id: 'mainTab.utilizationCardDialogEmptyHostList',
    defaultMessage: 'There are currently no utilized hosts',
    description: 'shown when `Hosts` list in utilization card\'s dialog is empty'
  },

  utilizationCardDialogStorageListTitle: {
    id: 'mainTab.utilizationCardDialogStorageListTitle',
    defaultMessage: 'Storage Domains ({storageCount, number})',
    description: 'title of `Storage Domains` list in utilization card\'s dialog'
  },

  utilizationCardDialogEmptyStorageList: {
    id: 'mainTab.utilizationCardDialogEmptyStorageList',
    defaultMessage: 'There are currently no utilized storage domains',
    description: 'shown when `Storage Domains` list in utilization card\'s dialog is empty'
  },

  utilizationCardDialogVmListTitle: {
    id: 'mainTab.utilizationCardDialogVmListTitle',
    defaultMessage: 'Virtual Machines ({vmCount, number})',
    description: 'title of `Virtual Machines` list in utilization card\'s dialog'
  },

  utilizationCardDialogEmptyVmList: {
    id: 'mainTab.utilizationCardDialogEmptyVmList',
    defaultMessage: 'There are currently no utilized virtual machines',
    description: 'shown when `Virtual Machines` list in utilization card\'s dialog is empty'
  },

  utilizationCardCpuDialogTitle: {
    id: 'mainTab.utilizationCardCpuDialogTitle',
    defaultMessage: 'Top Utilized Resources (CPU)',
    description: 'title of resource utilization dialog for `CPU` utilization card'
  },

  utilizationCardMemoryDialogTitle: {
    id: 'mainTab.utilizationCardMemoryDialogTitle',
    defaultMessage: 'Top Utilized Resources (Memory)',
    description: 'title of resource utilization dialog for `Memory` utilization card'
  },

  utilizationCardStorageDialogTitle: {
    id: 'mainTab.utilizationCardStorageDialogTitle',
    defaultMessage: 'Top Utilized Resources (Storage)',
    description: 'title of resource utilization dialog for `Storage` utilization card'
  }

}
