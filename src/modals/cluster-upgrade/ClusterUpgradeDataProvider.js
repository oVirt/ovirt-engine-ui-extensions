import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import * as C from '_/constants'
import { msg } from '_/intl-messages'
import getPluginApi from '_/plugin-api'
import { randomHexString } from '_/utils/random'

import { useDataProvider } from '_/components/helper/DataProviderHook'

import {
  fetchData,
  upgradeCluster,
  jumpToEvents,
  trackUpgradeProgress,
  cancelTracker,
  ProgressStatus,
} from './data'

/**
 * Using `useDataProvider` and `fetchData`, fetch any data necessary to start a cluster
 * upgrade wizard operation. The `DataProvider` will change props as the fetch goes
 * through inProgress, potentially an error, and then the resulting JSON data. The child
 * component is re-rendered at each step.
 *
 * The callback function `upgradeCluster` is provided to the child component to allow
 * execution of the cluster upgrade operation.
 */
const ClusterUpgradeDataProvider = ({ children, cluster }) => {
  const { data, fetchError, fetchInProgress } = useDataProvider({
    fetchData: fetchData,
    parameters: [cluster],
    // Note: Use and change the value of `trigger` for `fetchAndUpdateData` / refetch support
  })

  const [correlationId, setCorrelationId] = useState()
  const [upgradeStatus, setUpgradeStatus] = useState(ProgressStatus.PENDING)
  const [upgradePercent, setUpgradePercent] = useState(0)
  const [upgradeLog, setUpgradeLog] = useState([])

  // track status once a correlation id is set (or changed)
  useEffect(() => {
    if (!correlationId) {
      return
    }

    trackUpgradeProgress(correlationId, ({ isRunning, percent, log }) => {
      setUpgradeStatus(isRunning ? ProgressStatus.STARTED : ProgressStatus.COMPLETE)
      setUpgradePercent(percent)
      setUpgradeLog(currentLog => [...currentLog, ...log])
    })
    return () => {
      cancelTracker(correlationId)
    }
  }, [correlationId])

  const upgradeAndTrack = (upgradePayload) => {
    const cid = randomHexString(10)
    if (upgradeCluster({ ...upgradePayload, engineCorrelationId: cid })) {
      setCorrelationId(cid)
      return true
    }
    return false
  }

  // expecting single child component
  const child = React.Children.only(children)

  // handle data loading and error scenarios
  if (fetchError) {
    getPluginApi().showToast(C.webadminToastTypes.danger, msg.clusterUpgradeDataError())
    return null
  }
  if (fetchInProgress || !data) {
    return React.cloneElement(child, { isLoading: true })
  }

  // pass relevant data and operations to child component
  return React.cloneElement(child, {
    cluster: data.cluster,
    clusterHosts: data.hosts,
    upgradeStatus,
    upgradePercent,
    upgradeLog,

    upgradeCluster: (upgradePayload) => upgradeAndTrack(upgradePayload),
    jumpToEvents: () => { if (correlationId) jumpToEvents(correlationId) },
  })
}

ClusterUpgradeDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  cluster: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
}

export default ClusterUpgradeDataProvider
