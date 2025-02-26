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
    description: 'label of `Close` button used in dialogs',
  },

  okButton: {
    id: 'common.okButton',
    defaultMessage: 'OK',
    description: 'label of `OK` button used in dialogs',
  },

  saveButton: {
    id: 'common.saveButton',
    defaultMessage: 'Save',
    description: 'label of `Save` button used in dialogs',
  },

  cancelButton: {
    id: 'common.cancelButton',
    defaultMessage: 'Cancel',
    description: 'label of `Cancel` button used in dialogs',
  },

  cpuTitle: {
    id: 'common.cpuTitle',
    defaultMessage: 'CPU',
    description: 'title `CPU` used in various components',
  },

  loadingSpinnerAriaLabel: {
    id: 'common.loadingSpinnerAriaLabel',
    defaultMessage: 'Loading contents',
    description: 'accessible label (aria-label) for the the Spinner on the modal loading box',
  },

  memoryTitle: {
    id: 'common.memoryTitle',
    defaultMessage: 'Memory',
    description: 'title `Memory` used in various components',
  },

  storageTitle: {
    id: 'common.storageTitle',
    defaultMessage: 'Storage',
    description: 'title `Storage` used in various components',
  },

  vdoSavingsTitle: {
    id: 'common.vdoSavingsTitle',
    defaultMessage: 'Storage Savings',
    description: 'title `VDO Savings` used in various components',
  },

  used: {
    id: 'common.used',
    defaultMessage: 'Used',
    description: 'label that indicates current usage in various components',
  },

  unitUsed: {
    id: 'common.unitUsed',
    defaultMessage: '{unit} Used',
    description: 'label that indicates current usage in various components',
  },

  available: {
    id: 'common.available',
    defaultMessage: 'Available',
    description: 'label that indicates available (total - used) value in various components',
  },

  unitAvailable: {
    id: 'common.unitAvailable',
    defaultMessage: '{unit} Available',
    description: 'label that indicates available (total - used) value in various components',
  },

  nonAvailableValue: {
    id: 'common.nonAvailableValue',
    defaultMessage: 'N/A',
    description: 'text shown when a value is not available',
  },

  // dashboard related strings

  dashboardTitle: {
    id: 'dashboard.title',
    defaultMessage: 'Dashboard',
    description: 'title of the Dashboard place',
  },

  dashboardDataLoading: {
    id: 'dashboard.dataLoading',
    defaultMessage: 'Loading data...',
    description: 'title shown when Dashboard place is currently loading data',
  },

  dashboardDataError: {
    id: 'dashboard.dataError',
    defaultMessage: 'Error!',
    description: 'title shown when Dashboard place failed to load data',
  },

  dashboardDataErrorDetail: {
    id: 'dashboard.dataErrorDetail',
    defaultMessage: 'Could not fetch dashboard data. Please ensure that data warehouse is properly installed and configured.',
    description: 'detail shown when Dashboard place failed to load data',
  },

  dashboardRefreshButtonTooltip: {
    id: 'dashboard.refreshButtonTooltip',
    defaultMessage:
      'Manually refresh dashboard. With default server settings, status card' +
      ' data is updated once a minute and utilization data is updated once every 5 minutes.',
    description: 'tooltip on the refresh button to explain it is manual update and with what frequency the data is updated',
  },

  dashboardLastUpdated: {
    id: 'dashboard.lastUpdated',
    defaultMessage: 'Last Updated',
    description: 'label that indicates date/time of last dashboard data update',
  },

  dashboardLinkMonitoringPortal: {
    id: 'dashboard.linkMonitoringPortal',
    defaultMessage: 'Monitoring Portal',
    description: 'if Grafana is installed, show a link to Grafana portal, same as on the engine welcome page',
  },

  dashboardGlobalUtilizationHeading: {
    id: 'dashboard.globalUtilizationHeading',
    defaultMessage: 'Global Utilization',
    description: 'heading of `Global Utilization` section',
  },

  dashboardClusterUtilizationHeading: {
    id: 'dashboard.clusterUtilizationHeading',
    defaultMessage: 'Cluster Utilization',
    description: 'heading of `Cluster Utilization` section',
  },

  dashboardStorageUtilizationHeading: {
    id: 'dashboard.storageUtilizationHeading',
    defaultMessage: 'Storage Utilization',
    description: 'heading of `Storage Utilization` section',
  },
  dashboardVdoSavingsHeading: {
    id: 'dashboard.vdoSavingsHeading',
    defaultMessage: 'Storage Savings',
    description: 'heading of `VDO Savings` section',
  },
  dashboardStatusCardDataCenterTitle: {
    id: 'dashboard.statusCardDataCenterTitle',
    defaultMessage: 'Data Centers',
    description: 'title of `Data Centers` status card',
  },

  dashboardStatusCardClusterTitle: {
    id: 'dashboard.statusCardClusterTitle',
    defaultMessage: 'Clusters',
    description: 'title of `Clusters` status card',
  },

  dashboardStatusCardHostTitle: {
    id: 'dashboard.statusCardHostTitle',
    defaultMessage: 'Hosts',
    description: 'title of `Hosts` status card',
  },

  dashboardStatusCardStorageTitle: {
    id: 'dashboard.statusCardStorageTitle',
    defaultMessage: 'Data Storage Domains',
    description: 'title of `Data Storage Domains` status card',
  },

  dashboardStatusCardGlusterVolumeTitle: {
    id: 'dashboard.statusCardGlusterVolumeTitle',
    defaultMessage: 'Gluster Volumes',
    description: 'title of `Gluster Volumes` status card',
  },

  dashboardStatusCardVmTitle: {
    id: 'dashboard.statusCardVmTitle',
    defaultMessage: 'Virtual Machines',
    description: 'title of `Virtual Machines` status card',
  },

  dashboardStatusCardEventTitle: {
    id: 'dashboard.statusCardEventTitle',
    defaultMessage: 'Events',
    description: 'title of `Events` status card',
  },

  dashboardStatusTypeUp: {
    id: 'dashboard.statusTypeUp',
    defaultMessage: 'Up',
    description: 'text shown for `Up` status',
  },

  dashboardStatusTypeDown: {
    id: 'dashboard.statusTypeDown',
    defaultMessage: 'Down',
    description: 'text shown for `Down` status',
  },

  dashboardStatusTypeError: {
    id: 'dashboard.statusTypeError',
    defaultMessage: 'Error',
    description: 'text shown for `Error` status',
  },

  dashboardStatusTypeWarning: {
    id: 'dashboard.statusTypeWarning',
    defaultMessage: 'Warning',
    description: 'text shown for `Warning` status',
  },

  dashboardStatusTypeAlert: {
    id: 'dashboard.statusTypeAlert',
    defaultMessage: 'Alert',
    description: 'text shown for `Alert` status',
  },

  dashboardStatusTypeUnknown: {
    id: 'dashboard.statusTypeUnknown',
    defaultMessage: 'Unknown status',
    description: 'text shown for status not recognized by Dashboard',
  },

  dashboardUtilizationCardAvailableOfPercent: {
    id: 'dashboard.utilizationCardAvailableOfPercent',
    defaultMessage: 'of {percent, number, :: scale/0.01 % .  0 ,_ }',
    description: 'part of utilization card\'s summary',
  },

  dashboardUtilizationCardAvailableOfUnit: {
    id: 'dashboard.utilizationCardAvailableOfUnit',
    defaultMessage: 'of {total, number, :: .0 0 ,_ } {unit}',
    description: 'part of utilization card\'s summary',
  },

  dashboardUtilizationCardAmountAvailableTooltip: {
    id: 'dashboard.utilizationCardAmountAvailableTooltip',
    defaultMessage: '{percent, number, :: % .0 0 ,_ } Available',
    description: 'tooltip for amount available on the utilization donut chart',
  },

  dashboardUtilizationCardAmountUsedTooltip: {
    id: 'dashboard.utilizationCardAmountUsedTooltip',
    defaultMessage: '{percent, number, :: % .0 0 ,_ } Used',
    description: 'tooltip for amount used on the utilization donut chart',
  },

  dashboardUtilizationCardOverCommit: {
    id: 'dashboard.utilizationCardOverCommit',
    defaultMessage: 'Virtual resources - Committed: {overcommit, number, :: scale/0.01 . % ,_}, Allocated: {allocated, number, :: scale/0.01 . % ,_}',
    description: 'shown below utilization card\'s summary',
  },

  dashboardUtilizationCardOverCommitTooltip: {
    id: 'dashboard.utilizationCardOverCommitTooltip',
    defaultMessage:
      'The committed and allocated virtual resources are percentages indicating the running virtual resource' +
      ' compared to actual resources.',
    description: 'tooltip for the virtual resource over commit below utilization card\'s summary',
  },

  dashboardUtilizationCardDialogHostListTitle: {
    id: 'dashboard.utilizationCardDialogHostListTitle',
    defaultMessage: 'Hosts ({hostCount, number, ::. })',
    description: 'title of `Hosts` list in utilization card\'s dialog',
  },

  dashboardUtilizationCardDialogEmptyHostList: {
    id: 'dashboard.utilizationCardDialogEmptyHostList',
    defaultMessage: 'There are currently no utilized hosts',
    description: 'shown when `Hosts` list in utilization card\'s dialog is empty',
  },

  dashboardUtilizationCardDialogStorageListTitle: {
    id: 'dashboard.utilizationCardDialogStorageListTitle',
    defaultMessage: 'Storage Domains ({storageCount, number, ::. })',
    description: 'title of `Storage Domains` list in utilization card\'s dialog',
  },

  dashboardUtilizationCardDialogEmptyStorageList: {
    id: 'dashboard.utilizationCardDialogEmptyStorageList',
    defaultMessage: 'There are currently no utilized storage domains',
    description: 'shown when `Storage Domains` list in utilization card\'s dialog is empty',
  },

  dashboardUtilizationCardDialogVmListTitle: {
    id: 'dashboard.utilizationCardDialogVmListTitle',
    defaultMessage: 'Virtual Machines ({vmCount, number, ::. })',
    description: 'title of `Virtual Machines` list in utilization card\'s dialog',
  },

  dashboardUtilizationCardDialogEmptyVmList: {
    id: 'dashboard.utilizationCardDialogEmptyVmList',
    defaultMessage: 'There are currently no utilized virtual machines',
    description: 'shown when `Virtual Machines` list in utilization card\'s dialog is empty',
  },

  dashboardUtilizationCardCpuDialogTitle: {
    id: 'dashboard.utilizationCardCpuDialogTitle',
    defaultMessage: 'Top Utilized Resources (CPU)',
    description: 'title of resource utilization dialog for `CPU` utilization card',
  },

  dashboardUtilizationCardMemoryDialogTitle: {
    id: 'dashboard.utilizationCardMemoryDialogTitle',
    defaultMessage: 'Top Utilized Resources (Memory)',
    description: 'title of resource utilization dialog for `Memory` utilization card',
  },

  dashboardUtilizationCardStorageDialogTitle: {
    id: 'dashboard.utilizationCardStorageDialogTitle',
    defaultMessage: 'Top Utilized Resources (Storage)',
    description: 'title of resource utilization dialog for `Storage` utilization card',
  },

  // migrate VM modal dialog related strings

  migrateVmDialogTitle: {
    id: 'migrate.vm.dialogTitle',
    defaultMessage: 'Migrate VM(s)',
    description: 'title of VM migrate dialog',
  },

  migrateVmButton: {
    id: 'migrate.vm.buttonLabel',
    defaultMessage: 'Migrate',
    description: 'label of `Migrate` button in VM migrate dialog',
  },

  migrateVmDataError: {
    id: 'migrate.vm.dataError',
    defaultMessage: 'Could not fetch data needed for VM migrate operation',
    description: 'notification shown when VM migrate dialog failed to load its data',
  },

  migrateVmNoAvailableHost: {
    id: 'migrate.vm.noAvailableHost',
    defaultMessage: 'No available host to migrate VMs to',
    description: 'notification shown when there are no hosts the VMs can migrate to',
  },

  migrateVmInfoLabel: {
    id: 'migrate.vm.vmInfoLabel',
    defaultMessage: 'Select a host to migrate {value, number, ::. } virtual machine(s) to:',
    description: 'label shown above the target host dropdown, informing the user about VMs that are about to be migrated',
  },

  migrateVmListLabel: {
    id: 'migrate.vm.vmListLabel',
    defaultMessage: 'Virtual machines',
    description: 'label for the VM list shown below the target host dropdown',
  },

  migrateVmListShowAllLabel: {
    id: 'migrate.vm.vmListShowAllLabel',
    defaultMessage: 'Show all Virtual Machines',
    description: 'text of the link that allows showing all VMs in the VM list',
  },

  migrateVmListShowLessLabel: {
    id: 'migrate.vm.vmListShowLessLabel',
    defaultMessage: 'Show less Virtual Machines',
    description: 'text of the link that allows showing less (up to 10) VMs in the VM list',
  },

  migrateVmSelectHostLabel: {
    id: 'migrate.vm.selectHostLabel',
    defaultMessage: 'Destination host',
    description: 'label for the dropdown used to select migration target host',
  },

  migrateVmSelectHostFieldHelp: {
    id: 'migrate.vm.selectHostFieldHelp',
    defaultMessage: 'Select \'Automatically Choose Host\' to allow the application to select the best suited Host for these Virtual Machines to migrate to.',
    description: 'field help for the dropdown used to select migration target host',
  },

  migrateVmAutoSelectHost: {
    id: 'migrate.vm.autoSelectHost',
    defaultMessage: 'Automatically Choose Host',
    description: 'label for the default migration target host dropdown option',
  },

  migrateVmAffinityLabelHelp: {
    id: 'migrate.vm.affinityLabelHelp',
    defaultMessage: 'VMs that are not listed below may also be migrated. VMs that are grouped by affinity may have log errors because of multiple migration attempts.',
    description: 'help for the checkbox used to indicate that all VMs in affinity will be migrated',
  },

  migrateVmAffinityCheckbox: {
    id: 'migrate.vm.affinityCheckbox',
    defaultMessage: 'Migrate all VMs in positive enforcing affinity with selected VMs.',
    description: 'checkbox used to indicate that all VMs in affinity will be migrated',
  },

  migrateVmSuggestEnablingAffinity: {
    id: 'migrate.vm.suggestEnablingAffinity',
    defaultMessage: 'Some of the selected VMs are in positive enforcing affinity with other VMs and therefore cannot be migrated individually. In order to migrate VMs grouped by affinity, enable the option below.',
    description: 'helper text below host dropdown - it should suggest that enabling migrate-with-affinity checkbox can make a difference',
  },

  clusterUpgradeButton: {
    id: 'cluster.upgrade.button',
    defaultMessage: 'Upgrade',
    description: 'label for the cluster upgrade button on webadmin',
  },

  clusterUpgradeClusterInMaintenaceTitle: {
    id: 'cluster.upgrade.ClusterInMaintenaceTitle',
    defaultMessage: 'The cluster is currently in maintenance mode!',
    description: 'cluster upgrade, warn user Cluster is in maintenance mode Confirm Dialog title',
  },

  clusterUpgradeClusterInMaintenaceMessage: {
    id: 'cluster.upgrade.ClusterInMaintenaceMessage',
    defaultMessage:
      'The scheduling policy for cluster {clusterName} is currently set to' +
      ' "cluster_maintenance".  This typically indicates maintenance is currently' +
      ' in progress.  It is not recommeneded to run the cluster upgrade operation' +
      ' in this situation.',
    description: 'cluster upgrade, warn user Cluster is in maintenance mode Confirm Dialog descriptive message',
  },

  clusterUpgradeClusterInMaintenaceContinue: {
    id: 'cluster.upgrade.ClusterInMaintenaceContinue',
    defaultMessage: 'Continue',
    description: 'cluster upgrade, warn user Cluster is in maintenance mode Confirm Dialog button',
  },

  clusterUpgradeTitle: {
    id: 'cluster.upgrade.Title',
    defaultMessage: 'Upgrade Cluster {clusterName}',
    description: 'cluster upgrade Modal Wizard title text',
  },

  clusterUpgradeLoadingTitle: {
    id: 'cluster.upgrade.LoadingTitle',
    defaultMessage: 'Loading Cluster Data...',
    description: 'cluster upgrade Wizard title displayed while initial data is being loaded',
  },

  clusterUpgradeLoadingMessage: {
    id: 'cluster.upgrade.LoadingMessage',
    defaultMessage: 'This may take a few moments.',
    description: 'cluster upgrade Wizard message displayed while initial data is being loaded',
  },

  clusterUpgradeCancelButtonText: {
    id: 'cluster.upgrade.CancelButtonText',
    defaultMessage: 'Cancel',
    description: 'cluster upgrade Wizard Cancel button text',
  },

  clusterUpgradeBackButtonText: {
    id: 'cluster.upgrade.BackButtonText',
    defaultMessage: 'Back',
    description: 'cluster upgrade Wizard Back/Previous step button text',
  },

  clusterUpgradeNextButtonText: {
    id: 'cluster.upgrade.NextButtonText',
    defaultMessage: 'Next',
    description: 'cluster upgrade Wizard Next step button text',
  },

  clusterUpgradeUpgradeButtonText: {
    id: 'cluster.upgrade.UpgradeButtonText',
    defaultMessage: 'Upgrade',
    description: 'cluster upgrade Wizard final step/Upgrade button text',
  },

  clusterUpgradeStepSelectHostsLabel: {
    id: 'cluster.upgrade.StepSelectHostsLabel',
    defaultMessage: 'Select Hosts',
    description: 'cluster upgrade Wizard Step 1 title - Select Hosts',
  },

  clusterUpgradeStepUpgradeOptionsLabel: {
    id: 'cluster.upgrade.StepUpgradeOptionsLabel',
    defaultMessage: 'Upgrade Options',
    description: 'cluster upgrade Wizard Step 2 title - Upgrade Options',
  },

  clusterUpgradeStepReviewLabel: {
    id: 'cluster.upgrade.StepReviewLabel',
    defaultMessage: 'Cluster Upgrade Review',
    description: 'cluster upgrade Wizard Step 3 title - Upgrade Review',
  },

  clusterUpgradeNoHostsMessage: {
    id: 'cluster.upgrade.NoHostsMessage',
    defaultMessage: 'There are no hosts in this cluster.  A cluster without hosts cannot be upgraded.',
    description: 'cluster upgrade Wizard error message when a cluster has no hosts to upgrade',
  },

  clusterUpgradeSelectHostsMessage: {
    id: 'cluster.upgrade.SelectHostsMessage',
    defaultMessage: 'If a host has a down status, it can cause the cluster upgrade to fail.',
    description: 'cluster upgrade Wizard Step 1 - info message above the host selection table',
  },

  clusterUpgradeHostTableHeaderStatus: {
    id: 'cluster.upgrade.HostTableHeaderStatus',
    defaultMessage: 'Status',
    description: 'cluster upgrade Wizard Step 1 - Host Selection Table, Status column header',
  },

  clusterUpgradeHostTableHeaderName: {
    id: 'cluster.upgrade.HostTableHeaderName',
    defaultMessage: 'Name',
    description: 'cluster upgrade Wizard Step 1 - Host Selection Table, Name column header',
  },

  clusterUpgradeHostTableHeaderHostname: {
    id: 'cluster.upgrade.HostTableHeaderHostname',
    defaultMessage: 'Hostname/IP Address',
    description: 'cluster upgrade Wizard Step 1 - Host Selection Table, Hostname column header',
  },

  clusterUpgradeHostTableHeaderVMs: {
    id: 'cluster.upgrade.HostTableHeaderVMs',
    defaultMessage: 'Virtual Machines',
    description: 'cluster upgrade Wizard Step 1 - Host Selection Table, VM count column header',
  },

  clusterUpgradeStopPinnedLabel: {
    id: 'cluster.upgrade.StopPinnedLabel',
    defaultMessage: 'Stop Pinned VMs',
    description: 'cluster upgrade Wizard Step 2 - stop pinned vms field label',
  },

  clusterUpgradeStopPinnedFieldHelp: {
    id: 'cluster.upgrade.StopPinnedFieldHelp',
    defaultMessage:
      'Specify whether to stop virtual machines pinned to the host being' +
      ' upgraded. If checked, the pinned non-migratable virtual machines will' +
      ' be stopped and host will be upgraded, otherwise the host will be skipped.',
    description: 'cluster upgrade Wizard Step 2 - stop pinned vms field help',
  },

  clusterUpgradeStopPinnedDescription: {
    id: 'cluster.upgrade.StopPinnedDescription',
    defaultMessage: 'Stop Virtual Machines pinned to Hosts',
    description: 'cluster upgrade Wizard Step 2 - stop pinned vms field checkbox description',
  },

  clusterUpgradeUpgradeTimeoutLabel: {
    id: 'cluster.upgrade.UpgradeTimeoutLabel',
    defaultMessage: 'Upgrade Timeout (Minutes)',
    description: 'cluster upgrade Wizard Step 2 - upgrade timeout field label',
  },

  clusterUpgradeUpgradeTimeoutFieldHelp: {
    id: 'cluster.upgrade.UpgradeTimeoutFieldHelp',
    defaultMessage:
      'Timeout in minutes to wait for an individual host to be upgraded.' +
      ' The default is 60 minutes (1 hour).',
    description: 'cluster upgrade Wizard Step 2 - upgrade timeout field help',
  },

  clusterUpgradeCheckUpgradeLabel: {
    id: 'cluster.upgrade.CheckUpgradeLabel',
    defaultMessage: 'Check Upgrade',
    description: 'cluster upgrade Wizard Step 2 - check upgrade field label',
  },

  clusterUpgradeCheckUpgradeFieldHelp: {
    id: 'cluster.upgrade.CheckUpgradeFieldHelp',
    defaultMessage:
      'If checked, run check_for_upgrade action on all hosts before executing' +
      ' upgrade on them. If unchecked, run upgrade only for hosts with available' +
      ' upgrades and ignore all other hosts.',
    description: 'cluster upgrade Wizard Step 2 - check upgrade field help',
  },

  clusterUpgradeCheckUpgradeDescription: {
    id: 'cluster.upgrade.CheckUpgradeDescription',
    defaultMessage: 'Check for upgrades on all Hosts (If not, only upgrade Hosts with known upgrades)',
    description: 'cluster upgrade Wizard Step 2 - check upgrade field checkbox description',
  },

  clusterUpgradeRebootAfterLabel: {
    id: 'cluster.upgrade.RebootAfterLabel',
    defaultMessage: 'Reboot After Upgrade',
    description: 'cluster upgrade Wizard Step 2 - reboot host after upgrade field label',
  },

  clusterUpgradeRebootAfterFieldHelp: {
    id: 'cluster.upgrade.RebootAfterFieldHelp',
    defaultMessage: 'If checked reboot hosts after successful upgrade.',
    description: 'cluster upgrade Wizard Step 2 - reboot host after upgrade field help',
  },

  clusterUpgradeRebootAfterDescription: {
    id: 'cluster.upgrade.RebootAfterDescription',
    defaultMessage: 'Reboot Hosts after upgrade',
    description: 'cluster upgrade Wizard Step 2 - reboot host after upgrade field checkbox description',
  },

  clusterUpgradeUseMaintenancePolicyLabel: {
    id: 'cluster.upgrade.UseMaintenancePolicyLabel',
    defaultMessage: 'Use Maintenance Policy',
    description: 'cluster upgrade Wizard Step 2 - use maintenance policy field label',
  },

  clusterUpgradeUseMaintenancePolicyFieldHelp: {
    id: 'cluster.upgrade.UseMaintenancePolicyFieldHelp',
    defaultMessage:
      'If checked the cluster\'s policy will be switched to "maintenance" during' +
      ' the upgrade. If not checked the policy will be unchanged.',
    description: 'cluster upgrade Wizard Step 2 - use maintenance policy field help',
  },

  clusterUpgradeUseMaintenancePolicyDescription: {
    id: 'cluster.upgrade.UseMaintenancePolicyDescription',
    defaultMessage: 'Switch Cluster policy to Cluster Maintenance during upgrade',
    description: 'cluster upgrade Wizard Step 2 - use maintenance policy field checkbox description',
  },

  clusterUpgradeHostsLabel: {
    id: 'cluster.upgrade.HostsLabel',
    defaultMessage: '{count,number, ::.} {count, plural, one {Host} other {Hosts}}',
    description: 'cluster upgrade Wizard Step 3 - host count title (ICU formatted message)',
  },

  clusterUpgradeHostsDescription: {
    id: 'cluster.upgrade.HostsDescription',
    defaultMessage: 'Will be upgraded one at a time during Cluster upgrade',
    description: 'cluster upgrade Wizard Step 3 - host count description',
  },

  clusterUpgradeNonMigratableLabel: {
    id: 'cluster.upgrade.NonMigratableLabel',
    defaultMessage: '{count,number, ::.} Pinned VMs',
    description: 'cluster upgrade Wizard Step 3 - pinned VM (non-migratable VM) count title (ICU formatted message)',
  },

  clusterUpgradeNonMigratableDescription: {
    id: 'cluster.upgrade.NonMigratableDescription',
    defaultMessage: 'Will be stopped before Cluster upgrade',
    description: 'cluster upgrade Wizard Step 3 - pinned VM (non-migratable VM) count description',
  },

  clusterUpgradeMigrateLabel: {
    id: 'cluster.upgrade.MigrateLabel',
    defaultMessage: '{count,number, ::.} VMs',
    description: 'cluster upgrade Wizard Step 3 - count of VMs to be migrated during upgrade title (ICU formatted message)',
  },

  clusterUpgradeMigrateDescription: {
    id: 'cluster.upgrade.MigrateDescription',
    defaultMessage: 'Will be migrated to a new Host before Cluster upgrade',
    description: 'cluster upgrade Wizard Step 3 - count of VMs to be migrated during upgrade description',
  },

  clusterUpgradeOperationPending: {
    id: 'cluster.upgrade.OperationPending',
    defaultMessage: 'Waiting for upgrade to start',
    description: 'progress tracking cluster upgrade final step title when operation is pending start',
  },

  clusterUpgradeOperationStarted: {
    id: 'cluster.upgrade.OperationStarted',
    defaultMessage: 'Upgrade of cluster {clusterName} is in progress...',
    description: 'progress tracking cluster upgrade final step title when operation has been started',
  },

  clusterUpgradeOperationComplete: {
    id: 'cluster.upgrade.OperationComplete',
    defaultMessage: 'Upgrade complete',
    description: 'progress tracking cluster upgrade final step title when operation completes',
  },

  clusterUpgradeOperationFailed: {
    id: 'cluster.upgrade.OperationFailed',
    defaultMessage: 'Failed to start the upgrade for {clusterName}.',
    description: 'cluster upgrade operation failed toast notification text',
  },

  clusterUpgradeGoToEventLog: {
    id: 'cluster.upgrade.GoToEventLog',
    defaultMessage: 'Go to Event Log',
    description: 'Button on the progress tracking final step of the upgrade wizard.',
  },

  clusterUpgradeTrackProgressInfo: {
    id: 'cluster.upgrade.TrackProgressInfo',
    defaultMessage: 'The upgrade is running in the background and will continue if this wizard is closed before completion.',
    description: 'Info alter that the track progress step cannot stop the upgrade.  Upgrade will not stop if the wizard is closed.',
  },

  exportVmTitle: {
    id: 'export.vm.Title',
    defaultMessage: 'Export VM',
    description: 'Title for the Export VM dialog',
  },
  exportVmOriginalVmLabel: {
    id: 'export.vm.originalVmName',
    defaultMessage: 'VM name',
    description: 'Label for the original VM name',
  },
  exportVmDataError: {
    id: 'export.vm.dataError',
    defaultMessage: 'Could not fetch data needed for VM export operation',
    description: 'notification shown when VM export dialog failed to load its data',
  },
  exportVmNoStorageDomainsError: {
    id: 'export.vm.noStorageDomainsError',
    defaultMessage: 'No storage domains currently available',
    description: 'message shown when no storage domain are available to export the VM',
  },
  exportVmButton: {
    id: 'export.vm.buttonLabel',
    defaultMessage: 'Export to Data Domain',
    description: 'label of `Export` button in VM export dialog',
  },
  exportedVmNameTextFieldLabel: {
    id: 'export.vm.exportedVm',
    defaultMessage: 'Exported VM name',
    description: 'label of `Export VM name` text field',
  },
  collapseSnapshots: {
    id: 'export.vm.collapseSnapshotsLabel',
    defaultMessage: 'Collapse snapshots',
    description: 'label for the checkbox used to indicate snapshots will be collapsed',
  },
  storageDomains: {
    id: 'export.vm.storageDomainsLabel',
    defaultMessage: 'Storage domain',
    description: 'label for the storage domain list box used to choose a storage domain',
  },
  exportVmTemplateNotOnStorageDomainError: {
    id: 'export.vm.noTemplateOnStorageDomainError',
    defaultMessage: '{vmName} is based on a thin template, make sure the template\'s disks are present on the target storage domain',
    description: 'message shown when thin template disk are not present on target SD',
  },
  exportVmErrorTitle: {
    id: 'export.vm.exportFailedTitle',
    defaultMessage: 'Export VM Failed',
    description: 'title for the alert box shown when ovirt-engine returns an error',
  },
  // manage VM's vGPU modal dialog related strings

  vmManageGpuDataError: {
    id: 'vm.gpu.dataError',
    defaultMessage: 'Could not fetch data needed for Manage vGPU operation',
    description: 'notification shown when Manage vGPU dialog failed to load its data',
  },

  vmManageGpuSaveDataOK: {
    id: 'vm.gpu.save.data.ok',
    defaultMessage: 'VM vGPU data saved successfully',
    description: 'notification shown when Manage vGPU dialog saved data successfully',
  },

  vmManageGpuSaveDataError: {
    id: 'vm.gpu.save.data.error',
    defaultMessage: 'Error while saving VM vGPU data. See console log for details',
    description: 'notification shown when Manage vGPU dialog save data operation failed',
  },

  vmManageGpuDialogTitle: {
    id: 'vm.gpu.dialogTitle',
    defaultMessage: 'Manage vGPU',
    description: 'title of Manage vGPU dialog',
  },

  vmManageGpuDialogMissingMDevWarningTitle: {
    id: 'vm.gpu.warningTitle.missing.mdevs',
    defaultMessage: 'Unsupported MDev Type(s)',
    description: 'title of warning about the missing mdev type in Manage vGPU dialog',
  },

  vmManageGpuDialogMissingMDevWarning: {
    id: 'vm.gpu.warning.missing.mdevs',
    defaultMessage: 'The current configuration of the VM specifies a MDev Type(s) that are not provided by any host in the cluster ({ mdevs }). If you save the dialog, the existing configuration will be overwritten..',
    description: 'warning about the missing mdev type in Manage vGPU dialog',
  },

  vmManageGpuDialogInconsistentNodisplayWarningTitle: {
    id: 'vm.gpu.warningTitle.inconsistent.nodisplay',
    defaultMessage: 'Inconsistent Secondary display adapter for VNC settings',
    description: 'title of warning about the inconsistent nodisplay in Manage vGPU dialog',
  },

  vmManageGpuDialogInconsistentNodisplayWarning: {
    id: 'vm.gpu.warning.inconsistent.nodisplay',
    defaultMessage: 'The current configuration of the VM specifies MDev devices with various configurations of the Secondary display adapter for VNC. The Manage vGPU dialog requires the MDev devices to have the same configurations. If you save the dialog, the existing configuration will be overwritten.',
    description: 'warning about the inconsistent nodisplay in Manage vGPU dialog',
  },

  vmManageGpuDialogInconsistentDriverParamsWarningTitle: {
    id: 'vm.gpu.warningTitle.inconsistent.driver.params',
    defaultMessage: 'Inconsistent Driver parameters settings',
    description: 'title of warning about the inconsistent driver params in Manage vGPU dialog',
  },

  vmManageGpuDialogInconsistentDriverParamsWarning: {
    id: 'vm.gpu.warning.inconsistent.driver.params',
    defaultMessage: 'The current configuration of the VM specifies MDev devices with various configurations of the Driver parameters. The Manage vGPU dialog requires the MDev devices to have the same configurations. If you save the dialog, the existing configuration will be overwritten.',
    description: 'warning about the inconsistent driver params in Manage vGPU dialog',
  },

  vmManageGpuEmptyStateTitle: {
    id: 'vm.gpu.emptyState.title',
    defaultMessage: 'No hosts with vGPUs attached',
    description: 'title of the empty state component',
  },

  vmManageGpuEmptyStateBody: {
    id: 'vm.gpu.emptyState.body',
    defaultMessage: 'There are currently no hosts with vGPUs attached in this cluster.',
    description: 'body of the empty state component',
  },

  vmManageGpuBodyDescription: {
    id: 'vm.gpu.body.descrption',
    defaultMessage: 'Select vGPU type and the number of instances that you would like to use with this VM.',
    description: 'Manage vGPU dialog body description',
  },

  vmManageGpuBodyDisplaySwitchLabel: {
    id: 'vm.gpu.body.display.switch.label',
    defaultMessage: 'Secondary display adapter for VNC',
    description: 'Manage vGPU dialog Display on switch label`',
  },

  vmManageGpuBodyDisplaySwitchOn: {
    id: 'vm.gpu.body.display.switch.on',
    defaultMessage: 'On',
    description: 'Manage vGPU dialog Display on switch on`',
  },

  vmManageGpuBodyDisplaySwitchOff: {
    id: 'vm.gpu.body.display.switch.off',
    defaultMessage: 'Off',
    description: 'Manage vGPU dialog Display on switch off`',
  },

  vmManageGpuBodyDriverParams: {
    id: 'vm.gpu.body.driver.properties',
    defaultMessage: 'Optional driver parameters',
    description: 'Manage vGPU dialog Optional driver parameters label`',
  },

  vmManageGpuBodyDriverParamsHelperText: {
    id: 'vm.gpu.body.driver.properties.helper.text',
    defaultMessage: 'Available since 4.7 compatibility version',
    description: 'Manage vGPU dialog Optional driver parameters helper text`',
  },

  vmManageGpuBodySubTitleSelectionsCards: {
    id: 'vm.gpu.body.selections.cards.label',
    defaultMessage: 'Selected vGPU Type Instances',
    description: 'Manage vGPU dialog body label `Card name(s)`',
  },

  vmManageGpuBodySubTitleSelectionsCardsEmpty: {
    id: 'vm.gpu.body.subtitle.selections.cards.empty',
    defaultMessage: 'No vGPU type selected',
    description: 'Manage vGPU dialog body empty message `Card name(s)`',
  },

  vmManageGpuSearchButtonPlaceholder: {
    id: 'vm.gpu.body.search.placeholder',
    defaultMessage: 'Search for a vGPU type id or host',
    description: 'Manage vGPU dialog search field placeholder',
  },

  vmManageGpuButton: {
    id: 'vm.gpu.buttonLabel',
    defaultMessage: 'Manage vGPU',
    description: 'label of `Manage vGPU` button in VM Manage vGPU dialog',
  },

  vmManageGpuAddActionButton: {
    id: 'vm.gpu.addActionLabel',
    defaultMessage: 'Add instance',
    description: 'label of `Add instance` action in VM Manage vGPU dialog table row',
  },

  vmManageGpuRemoveActionButton: {
    id: 'vm.gpu.removeActionLabel',
    defaultMessage: 'Remove instance',
    description: 'label of `Remove instance` action in VM Manage vGPU dialog table row',
  },

  vmManageGpuTableMDevType: {
    id: 'vm.gpu.table.mDevType',
    defaultMessage: 'MDev Type',
    description: 'label of `MDev Type` table column in VM Manage vGPU dialog',
  },

  vmManageGpuTableCardName: {
    id: 'vm.gpu.table.cardName',
    defaultMessage: 'Name',
    description: 'label of `Name` table column in VM Manage vGPU dialog',
  },

  vmManageGpuTableMaxResolution: {
    id: 'vm.gpu.table.maxResolution',
    defaultMessage: 'Max resolution',
    description: 'label of `Max resolution` table column in VM Manage vGPU dialog',
  },

  vmManageGpuTableMaxInstances: {
    id: 'vm.gpu.table.maxInstances',
    defaultMessage: 'Max instances',
    description: 'label of `Max instances` int VM Manage vGPU dialog table',
  },

  vmManageGpuTableRequestedInstances: {
    id: 'vm.gpu.table.requestedInstances',
    defaultMessage: 'Requested instances',
    description: 'label of `Requested instances` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableHostName: {
    id: 'vm.gpu.table.hostName',
    defaultMessage: 'Host',
    description: 'label of `Host` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableProduct: {
    id: 'vm.gpu.table.product',
    defaultMessage: 'Product',
    description: 'label of `Product` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableAddress: {
    id: 'vm.gpu.table.address',
    defaultMessage: 'Address',
    description: 'label of `Address` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableNumberOfHeads: {
    id: 'vm.gpu.table.numberOfHeads',
    defaultMessage: 'Number of heads',
    description: 'label of `Number of heads` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableFrameRateLimiter: {
    id: 'vm.gpu.table.frameRateLimiter',
    defaultMessage: 'Frame rate limiter',
    description: 'label of `Frame rate limiter` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableFrameBuffer: {
    id: 'vm.gpu.table.frameBuffer',
    defaultMessage: 'Frame buffer',
    description: 'label of `Frame buffer` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableAvailableInstances: {
    id: 'vm.gpu.table.availableInstances',
    defaultMessage: 'Available instances',
    description: 'label of `Available instances` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableVendor: {
    id: 'vm.gpu.table.vendor',
    defaultMessage: 'Vendor',
    description: 'label of `Vendor` in VM Manage vGPU dialog table',
  },

  vmManageGpuTableEmptyStateTitle: {
    id: 'vm.gpu.table.emptyState.title',
    defaultMessage: 'No results found',
    description: 'title of the table empty state component',
  },

  vmManageGpuTableEmptyStateBody: {
    id: 'vm.gpu.table.emptyState.body',
    defaultMessage: 'No results match the filter criteria. Clear all filters to show results.',
    description: 'body of the table empty state component',
  },

  hostCopyNetworksDataError: {
    id: 'host.copy.networks.dataError',
    defaultMessage: 'Could not fetch data needed for Host Copy Networks operation',
    description: 'notification shown when Host Copy Networks dialog failed to load its data',
  },

  hostCopyNetworksDialogTitle: {
    id: 'host.copy.networks.dialogTitle',
    defaultMessage: 'Copy Host Networks',
    description: 'title of Host Copy Networks dialog',
  },

  hostCopyNetworksButton: {
    id: 'host.copy.networks.buttonLabel',
    defaultMessage: 'Copy Host Networks',
    description: 'label of `Copy` button in Host Copy Networks dialog',
  },

  hostCopyNetworksNoAvailableHost: {
    id: 'host.copy.networks.noAvailableHost',
    defaultMessage: 'No target hosts for copy networks found',
    description: 'notification shown when there are no hosts to copy networks to',
  },

  hostCopyNetworksSelectHost: {
    id: 'host.copy.networks.selectHost',
    defaultMessage: 'Choose Host',
    description: 'label for the target host dropdown option',
  },

  hostCopyNetworksInfoLabel: {
    id: 'host.copy.networks.targetHostsInfoLabel',
    defaultMessage: 'Select a target host to copy network(s) to:',
    description: 'label shown above the target host dropdown, informing the user about target hosts',
  },

  hostCopyNetworksSelectHostLabel: {
    id: 'host.copy.networks.selectHostLabel',
    defaultMessage: 'Target host',
    description: 'label for the dropdown used to select migration target host',
  },

  hostCopyNetworksSelectHostFieldHelp: {
    id: 'host.copy.networks.selectHostFieldHelp',
    defaultMessage: 'Select a target host to which the source host networks will be copied. ' +
      'A target host must be in the same cluster and have at least the same number of NICs ' +
      'as the source host. The management network configuration is not copied.',
    description: 'field help for the dropdown used to select copy networks target host',
  },

  // CPU pinning modal dialog related strings

  cpuPinningModalButton: {
    id: 'cpu.pinning.buttonLabel',
    defaultMessage: 'View CPU Pinning',
    description: 'label of `View CPU Pinning` button',
  },

  cpuPinningDataError: {
    id: 'cpu.pinning.dataError',
    defaultMessage: 'Could not fetch data needed for the CPU Pinning dialog',
    description: 'notification shown when CPU Pinning dialog failed to load its data',
  },

  cpuPinningModalTitle: {
    id: 'cpu.pinning.modal.title',
    defaultMessage: 'CPU Pinning',
    description: 'title of the CPU Pinning dialog',
  },

  cpuPinningModalVmPinningPolicyField: {
    id: 'cpu.pinning.modal.field.cpupinning.policy',
    defaultMessage: 'CPU Pinning Policy',
    description: 'cpu pinning policy field in the CPU Pinning dialog',
  },

  cpuPinningModalVmPinningPolicyFieldNone: {
    id: 'cpu.pinning.modal.field.cpupinning.policy.none',
    defaultMessage: 'None',
    description: 'None cpu pinning policy field in the CPU Pinning dialog',
  },

  cpuPinningModalVmPinningPolicyFieldManual: {
    id: 'cpu.pinning.modal.field.cpupinning.policy.manual',
    defaultMessage: 'Manual',
    description: 'Manual cpu pinning policy field in the CPU Pinning dialog',
  },

  cpuPinningModalVmPinningPolicyFieldResizeAndPin: {
    id: 'cpu.pinning.modal.field.cpupinning.policy.resize.and.pin',
    defaultMessage: 'Resize and Pin Numa',
    description: 'Resize and Pin Numa cpu pinning policy field in the CPU Pinning dialog',
  },

  cpuPinningModalVmPinningPolicyFieldDedicated: {
    id: 'cpu.pinning.modal.field.cpupinning.policy.dedicated',
    defaultMessage: 'Dedicated',
    description: 'Dedicated cpu pinning policy field in the CPU Pinning dialog',
  },

  cpuPinningModalVmPinningPolicyFieldIsolateThreads: {
    id: 'cpu.pinning.modal.field.cpupinning.policy.isolate-threads',
    defaultMessage: 'Isolate Threads',
    description: 'Isolate threads cpu pinning policy field in the CPU Pinning dialog',
  },

  cpuPinningModalVmPinningField: {
    id: 'cpu.pinning.modal.field.cpupinning',
    defaultMessage: 'CPU Pinning',
    description: 'cpu pinning field in the CPU Pinning dialog',
  },

  cpuPinningModalVmPinningFieldPlaceholder: {
    id: 'cpu.pinning.modal.field.cpupinning.placeholder',
    defaultMessage: 'No CPU Pinning specified for the VM',
    description: 'cpu pinning field placeholder in the CPU Pinning dialog',
  },

  cpuPinningModalHostField: {
    id: 'cpu.pinning.modal.field.host',
    defaultMessage: 'Host',
    description: 'host field in the CPU Pinning dialog',
  },

  cpuPinningModalRunsOnHostField: {
    id: 'cpu.pinning.modal.field.host.runson',
    defaultMessage: 'Runs On',
    description: 'runs on host field in the CPU Pinning dialog',
  },

  cpuPinningModalRunsOnHostFieldPlaceholder: {
    id: 'cpu.pinning.modal.field.host.runson.placeholder',
    defaultMessage: 'The VM is currently not running',
    description: 'runs on host placeholder in the CPU Pinning dialog',
  },

  cpuPinningModalEmptyState: {
    id: 'cpu.pinning.modal.empty.title',
    defaultMessage: 'No CPU topology found',
    description: 'title of the empty state in the CPU Pinning dialog',
  },

  cpuPinningModalAlertInvalidPinningTitle: {
    id: 'cpu.pinning.modal.alert.pinning.title',
    defaultMessage: 'Invalid pinning',
    description: 'alert title for the invalid pinning in the CPU Pinning dialog',
  },

  cpuPinningModalAlertInvalidPinningText: {
    id: 'cpu.pinning.modal.alert.pinning.text',
    defaultMessage: 'The pinning is not valid for the selected host. Some pinned CPU IDs do not map to host CPU IDs.',
    description: 'alert text for the invalid pinning in the CPU Pinning dialog',
  },

  cpuTopologyDescriptionForVmView: {
    id: 'cpu.pinning.modal.cputopology.description.vm',
    defaultMessage: 'The CPU Topology shows mapping from the VM\'s vCPU to the host physical CPU',
    description: 'description text for the cpu topology',
  },

  cpuTopologyDescriptionForHostView: {
    id: 'cpu.pinning.modal.cputopology.description.host',
    defaultMessage: 'The CPU Topology shows mapping from the host physical CPU to the VM that has its vCPU pinned to the host physical CPU',
    description: 'description text for the cpu topology',
  },

  cpuPinningModalCpuId: {
    id: 'cpu.pinning.modal.cpuId',
    defaultMessage: 'CPU {id, number, ::.}',
    description: 'label of the CPU in the CPU Pinning dialog',
  },

  cpuPinningModalvCpuId: {
    id: 'cpu.pinning.modal.vcpuId',
    defaultMessage: 'vCPU {id, number, ::.}',
    description: 'label of the vCPU in the CPU Pinning dialog',
  },

  cpuPinningModalPinnedCpu: {
    id: 'cpu.pinning.modal.pinnedCpu',
    defaultMessage: 'pCPU {id, number, ::.}',
    description: 'label of the pCPU in the CPU Pinning dialog',
  },

  cpuPinningModalExclusivePinning: {
    id: 'cpu.pinning.modal.exclusive.pinning',
    defaultMessage: 'Exclusive pinning',
    description: 'exclusive pinning in the CPU Pinning dialog',
  },

  cpuTopology: {
    id: 'cpu.topology',
    defaultMessage: 'CPU Topology',
    description: 'cpu topology',
  },

  cpuTopologySocket: {
    id: 'cpu.topology.socket',
    defaultMessage: 'Socket {id, number, ::.}',
    description: 'socket',
  },

  cpuTopologyCore: {
    id: 'cpu.topology.core',
    defaultMessage: 'Core {id, number, ::.}',
    description: 'core',
  },

  // Storage Connections modal dialog related strings

  storageConnectionsManageButton: {
    id: 'storage.domains.connections.buttonLabel',
    defaultMessage: 'Connections',
    description: 'label for Storage Connections management dialog button',
  },

  storageConnectionsDataError: {
    id: 'storage.domains.connections.dataError',
    defaultMessage: 'Could not fetch data needed for showing Storage Connections',
    description: 'notification shown when Storage Connections dialog failed to load its data',
  },

  storageConnectionsTitle: {
    id: 'storage.domains.connections.title',
    defaultMessage: 'Manage Storage Connections',
    description: 'title of Storage Connections dialog',
  },

  storageConnectionsTitleWithName: {
    id: 'storage.domains.connections.title.withName',
    defaultMessage: 'Manage Storage Connections - {sdName}',
    description: 'title of Storage Connections dialog with name',
  },

  storageConnectionsTableColAddress: {
    id: 'storage.domains.connections.table.column.address',
    defaultMessage: 'Address',
    description: 'address column of Storage Connections Table',
  },

  storageConnectionsTableColPort: {
    id: 'storage.domains.connections.table.column.port',
    defaultMessage: 'Port',
    description: 'port column of Storage Connections Table',
  },

  storageConnectionsTableColTarget: {
    id: 'storage.domains.connections.table.column.target',
    defaultMessage: 'Target',
    description: 'target column of Storage Connections Table',
  },

  storageConnectionsTableColPath: {
    id: 'storage.domains.connections.table.column.path',
    defaultMessage: 'Path',
    description: 'path column of Storage Connections Table',
  },

  storageConnectionsTableColAttached: {
    id: 'storage.domains.connections.table.column.attached',
    defaultMessage: 'Attached',
    description: 'attached column of Storage Connections Table',
  },

  storageConnectionsTableAttachedStr: {
    id: 'storage.domains.connections.table.connection.attached',
    defaultMessage: 'ATTACHED',
    description: 'attached string in Storage Connections Table',
  },

  storageConnectionsRemoveConnectionButton: {
    id: 'storage.domains.connections.connection.remove.button',
    defaultMessage: 'Remove',
    description: 'remove Connection button',
  },

  storageConnectionsAddConnectionButton: {
    id: 'storage.domains.connections.connection.add.button',
    defaultMessage: 'Add',
    description: 'add Connection button',
  },

  storageConnectionsAttachConnectionButton: {
    id: 'storage.domains.connections.connection.attach.button',
    defaultMessage: 'Attach',
    description: 'attach Connection button',
  },

  storageConnectionsDetachConnectionButton: {
    id: 'storage.domains.connections.connection.detach.button',
    defaultMessage: 'Detach',
    description: 'detach Connection button',
  },

  storageConnectionsDomainNotInMaintenanceWarning: {
    id: 'storage.domains.connections.domain.maintenance.warning',
    defaultMessage: 'Storage Domain is not in Maintenance mode',
    description: 'storage Domain is not in Maintenance mode Warning',
  },

  storageConnectionsDomainNotInMaintenanceWarningDetail: {
    id: 'storage.domains.connections.domain.maintenance.warning.detail',
    defaultMessage: 'Connections cannot be attached or detached, cannot edit attached connections',
    description: 'storage Domain is not in Maintenance mode Warning Detail',
  },

  storageConnectionsShowAllConnectionsSwitchOn: {
    id: 'storage.domains.connections.showAll.switch.on',
    defaultMessage: 'On',
    description: 'show all connections switch on',
  },

  storageConnectionsShowAllConnectionsSwitchOff: {
    id: 'storage.domains.connections.showAll.switch.off',
    defaultMessage: 'Off',
    description: 'show all connections switch off',
  },

  storageConnectionsShowAllConnectionsLabel: {
    id: 'storage.domains.connections.showAll.label',
    defaultMessage: 'Show all connections',
    description: 'show all connections label',
  },

  storageConnectionsOperationFailedTitle: {
    id: 'storage.domains.connections.operation.failed.title',
    defaultMessage: 'Operation Failed',
    description: 'storage Connection operation failed title',
  },

  storageConnectionsFieldRequiredError: {
    id: 'storage.domains.connections.field.required.error',
    defaultMessage: 'This field is required',
    description: 'field required error message',
  },

  storageConnectionsFieldPortError: {
    id: 'storage.domains.connections.field.port.error',
    defaultMessage: 'Invalid port value',
    description: 'invalid port field value error',
  },
}

module.exports = exports = messageDescriptors
