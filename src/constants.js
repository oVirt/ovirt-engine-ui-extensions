export const pluginName = 'ui-extensions'

export const pluginBasePath = `plugin/${pluginName}`

// This flag is a hint to components that normally work with remote data. If set to true,
// such components should use fake data instead of communicating with remote endpoint(s).
export const useFakeData = false

export const defaultLocale = 'en-US'

export const supportedLocales = [
  defaultLocale,
  'cs-CZ',
  'de-DE',
  'es-ES',
  'fr-FR',
  'it-IT',
  'ja-JP',
  'ko-KR',
  'pt-BR',
  'zh-CN'
]

// per ECMA-402, undefined means "runtime's default time zone"
export const defaultTimeZone = undefined

// per ECMA-402, browsers only need to support undefined and 'UTC' so that's what is expected
export const supportedTimeZones = [
  undefined,
  'UTC'
]

export const dashboardPlaceToken = 'dashboard-main'

export const searchPrefixes = {
  dc: 'DataCenter',
  cluster: 'Cluster',
  host: 'Host',
  storage: 'Storage',
  vm: 'Vms',
  event: 'Events',
  volume: 'Volumes'
}

export const searchFields = {
  name: 'name',
  status: 'status',
  severity: 'severity',
  time: 'time',
  cluster: 'cluster'
}

export const webadminPlaces = {
  dc: 'dataCenters',
  cluster: 'clusters',
  host: 'hosts',
  storage: 'storage',
  vm: 'vms',
  event: 'events',
  volume: 'volumes'
}

export const webadminToastTypes = {
  info: 'info',
  danger: 'danger'
}

export const heatMapThresholds = {
  domain: [0.65, 0.75, 0.9],
  colors: ['#D4F0FA', '#F9D67A', '#EC7A08', '#CE0000']
}

export const heatMapLegendLabels = ['< 65%', '65-75%', '75-90%', '> 90%']

export const storageUnitTable = [
  { unit: 'TiB' },
  { unit: 'GiB', factor: 1024 },
  { unit: 'MiB', factor: 1024 }
]

// number of characters before giving more space to bar chart labels
export const utilizationListGridNameThreshold = 30

export const entityTypes = {
  vm: 'VirtualMachine'
}

export const vmUpStates = ['Up', 'PoweringUp', 'RebootInProgress', 'Paused']
