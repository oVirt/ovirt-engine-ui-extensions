import config from '_/plugin-config'
import getPluginApi from '_/plugin-api'
import * as C from '_/constants'
import { msg } from '_/intl-messages'
import { engineGet, ansiblePlaybookPost } from '_/utils/fetch'
import { sleep } from '_/utils/fake-data'
import { applySearch } from '_/utils/webadmin-search'

const fakeHost = (clusterId, hostName, status, updateAvailable, active) => ({
  id: `1111-${hostName}-2222`,
  name: hostName,
  cluster: { id: clusterId },
  address: `${hostName}.ovirt`,
  status,
  summary: { active, migrating: '0', total: active },
  update_available: updateAvailable,
})

const randomHosts = (clusterId, count) => {
  const hosts = []
  for (let i = 0; i < count; i++) {
    hosts[i] = fakeHost(
      clusterId,
      `hostR${i}`,
      Math.round(Math.random() * 10 % 1) ? 'up' : 'down',
      Math.round(Math.random() * 10 % 1) ? 'true' : 'false',
      Math.round(Math.random() * 100 % 25)
    )
  }
  return hosts
}

const fakeHosts = (clusterId) => Promise.resolve([
  fakeHost(clusterId, 'host1', 'up', 'true', '4'),
  fakeHost(clusterId, 'host2', 'up', 'true', '12'),
  fakeHost(clusterId, 'host3', 'down', 'true', '0'),
  fakeHost(clusterId, 'host4', 'up', 'true', '7'),
  fakeHost(clusterId, 'host5', 'down', 'false', '0'),
  ...randomHosts(clusterId, 2 + (Math.random() * 100 % 20)),
])

const fetchFakeData = async (clusterId) => {
  const [
    cluster,
    hosts,
  ] = await Promise.all([
    fetchCluster(clusterId),
    fakeHosts(clusterId),
    sleep(5000), // make sure the fetch takes at least 5 seconds to finish
  ])

  return { cluster, hosts }
}
//
//

/**
 * Fetch the selected Engine clusters.
 */
async function fetchCluster (id) {
  const json = await engineGet(`api/clusters/${id}?follow=scheduling_policy`)

  if (!json.id || json.id !== id) {
    throw new Error(`ClusterUpgradeDataProvider: Failed to fetch cluster ${id}`)
  }

  return json
}

/**
 * Fetch the Hosts attached to a given Engine cluster.
 */
async function fetchClusterHosts (clusterId, clusterName) {
  const search = `cluster="${clusterName}"`
  const json = await engineGet(`api/hosts?search=${encodeURIComponent(search)}`)

  if (json.error) {
    throw new Error(`ClusterUpgradeDataProvider: Failed to fetch cluster hosts: ${json.error}`)
  }

  if (!json.host) {
    return []
  }

  return json.host
}

/**
 * Fetch all data needed by `ClusterUpgradeModal`.
 */
export async function fetchData ({ id: clusterId, name: clusterName }) {
  if (config.useFakeData) {
    return fetchFakeData(clusterId, clusterName)
  }

  const [
    cluster,
    hosts,
  ] = await Promise.all([
    fetchCluster(clusterId),
    fetchClusterHosts(clusterId, clusterName),
  ])

  return { cluster, hosts }
}

/**
 * If an ansbile execution timeout is not provided by the Wizard, default to 1 day.
 */
const DEFAULT_EXECUTION_TIMEOUT_IN_MIN = 1440

/**
 * Upgrade the given cluster.
 *
 * Errors in forming or calling the upgrade operation are currently handled here.
 */
export async function upgradeCluster ({
  clusterName,
  engineCorrelationId,
  executionTimeoutInMin = DEFAULT_EXECUTION_TIMEOUT_IN_MIN,
  ...rest
}) {
  const ansiblePayload = { clusterName, ...rest }

  // https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#passing-variables-on-the-command-line
  const ansibleVariables = JSON.stringify({
    engine_correlation_id: engineCorrelationId,
    cluster_name: ansiblePayload.clusterName,
    stop_non_migratable_vms: ansiblePayload.stopPinnedVms,
    upgrade_timeout: ansiblePayload.upgradeTimeoutInMin * 60,
    host_names: ansiblePayload.hostNames,
    check_upgrade: ansiblePayload.checkForUpgradesOnHosts,
    reboot_after_upgrade: ansiblePayload.rebootAfterUpgrade,
    use_maintenance_policy: ansiblePayload.useMaintenanceClusterPolicy,
  })
  const playbookName = config.clusterUpgradePlaybook

  if (config.useFakeData) {
    console.info('**upgradeCluster**\nplaybook: "%s",\nansibleVariables:---\n%s\n---',
      playbookName, ansibleVariables)
    return true
  }

  try {
    await ansiblePlaybookPost(playbookName, ansibleVariables, executionTimeoutInMin)
    return true
  } catch (error) {
    console.error(
      'upgradeCluster: the ansible service failed\n\nplaybook: %s\nansibleVariables:\n%s',
      playbookName,
      ansibleVariables)
    getPluginApi().showToast(
      C.webadminToastTypes.danger,
      msg.clusterUpgradeOperationFailed({ clusterName })
    )
    return false
  }
}

/**
 * Push the user to the webadmin events tab with a filter set to show only events with
 * the given correlation id (that is generated for calling `upgradeCluster()`).
 */
export function jumpToEvents (correlationId) {
  applySearch(C.webadminPlaces.event, C.searchPrefixes.event, [{
    name: 'correlation_id',
    values: [correlationId],
  }])
}

//
// Functions to handle progress tracking by looking at the event log
//
export const ProgressStatus = {
  PENDING: 'pending',
  STARTED: 'started',
  COMPLETE: 'complete',
  FAILED: 'failed',
}

const trackerByCorrelation = {}

function scheduleTrackTick (timeout, correlationId, track) {
  const id = setTimeout(track, timeout)
  trackerByCorrelation[correlationId] = id
}

export function cancelTracker (correlationId) {
  const id = trackerByCorrelation[correlationId]
  if (id) {
    clearTimeout(id)
  }
}

let fakeIdCounter = 1
let fakeProgress = 0
function fakeFetchNextEvents (correlationId, lastEventId) {
  if (lastEventId <= 0) {
    fakeProgress = 0
  }

  const events = []
  const eventsToFake = 1 + Math.floor(Math.random() * 5)
  for (let i = 0; i < eventsToFake; i++) {
    let description = 'fake data cluster upgrade work log entry'

    const isProgressEvent = Math.floor(Math.random() * 10) < 5
    if (isProgressEvent) {
      description = `Cluster upgrade progress: ${fakeProgress}% [fake data progress event]`
      fakeProgress += 10 + Math.floor(Math.random() * 18)
    }

    events.push({
      id: fakeIdCounter++,
      correlation_id: correlationId,
      description,
      time: Date.now(),
    })
  }

  return events
}

/**
 * Fetch event for the given correlationId, optionally starting at the given last event
 * id.  Use the last event id to skip loading events we've already seen.
 *
 * @returns Latest set of events sorted oldest to newest
 */
async function fetchNextEvents (correlationId, lastEventId) {
  if (config.useFakeData) return fakeFetchNextEvents(correlationId, lastEventId)

  let events = []
  try {
    const search = `correlation_id="${correlationId}"`
    const from = lastEventId > 0 ? `from=${lastEventId}&` : ''
    const json = await engineGet(`api/events?${from}search=${encodeURIComponent(search)}`)
    if (json.event) {
      events = json.event
      events.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
    }
  } catch (e) {
    console.error('unexpected event fetch: ', e)
  }
  return events
}

const TRACK_FREQUENCY_MS = config.useFakeData ? 1500 : 2500

function formatEventAsLogEntry ({ id, description, time }) {
  return { id, description, time }
}

export async function trackUpgradeProgress (correlationId, tick) {
  const progressRegEx = /^Cluster upgrade progress: (\d+)%(, Cluster: (.*?))?(, Host: (.*?))? \[(.*)\]$/
  let lastEventId = -1
  let lastPercent = 0

  const track = async () => {
    // figure out data for the tick from the current set of events
    const nextEvents = await fetchNextEvents(correlationId, lastEventId)
    lastEventId = nextEvents.length === 0 ? lastEventId : nextEvents[nextEvents.length - 1].id

    const eventsForLog = nextEvents.map(formatEventAsLogEntry)
    const maxPercentInEvents = nextEvents.reduce((maxPercent, event) => {
      let currentPercent = 0
      const res = progressRegEx.exec(event?.description)
      if (res) {
        currentPercent = res[1]
      }
      return Math.max(maxPercent, currentPercent)
    }, lastPercent)
    lastPercent = maxPercentInEvents

    // run the appropriate tick
    if (maxPercentInEvents < 100) {
      tick({
        isRunning: true,
        percent: maxPercentInEvents,
        log: eventsForLog,
      })
      scheduleTrackTick(TRACK_FREQUENCY_MS, correlationId, track)
    } else {
      tick({
        isRunning: false,
        percent: 100,
        log: eventsForLog,
      })
    }
  }

  track()
}
