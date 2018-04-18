import React from 'react'
import PropTypes from 'prop-types'
import DataProvider from './helper/DataProvider'
import { useFakeData } from '../constants'
import { engineGet } from '../utils/fetch'

/**
 * Fetch dashboard data from Engine server.
 */
async function fetchData () {
  // Engine dashboard data endpoint supports following headers:
  // 'Prefer': 'fake_data' // returns randomly generated data
  // 'Prefer': 'error'     // triggers HTTP error response
  const extraHeaders = useFakeData ? { 'Prefer': 'fake_data' } : {}
  const data = await engineGet('webadmin/dashboard_data', extraHeaders)
  return transformData(data)
}

/**
 * Transform data for consumption by `GlobalDashboard` component.
 */
function transformData (data) {
  const inventoryStatusOrder = ['alert', 'error', 'warning', 'down', 'up']

  // transform data.inventory
  ;['dc', 'cluster', 'host', 'storage', 'vm', 'event'].forEach(category => {
    const inventoryData = data.inventory[category]

    // sort object statuses
    inventoryData.statuses.sort((a, b) => {
      return inventoryStatusOrder.indexOf(a.type) - inventoryStatusOrder.indexOf(b.type)
    })

    // define additional search constraints for events
    if (category === 'event') {
      inventoryData.statuses.forEach(obj => {
        if (obj.type === 'error' || obj.type === 'warning') {
          obj.searchSince = 'Today'
        }
      })
    }
  })

  // transform data.globalUtilization
  ;['cpu', 'memory', 'storage'].forEach(category => {
    const globalUtilizationData = data.globalUtilization[category]

    // make sure that used never exceeds total
    if (globalUtilizationData.used > globalUtilizationData.total) {
      globalUtilizationData.used = globalUtilizationData.total
    }

    // sparkline chart works with Date objects on X axis
    globalUtilizationData.history.forEach(obj => {
      obj.date = new Date(obj.date)
    })

    // sort object utilization lists as needed
    function sortByUsedPercentDesc (list) {
      list.sort((a, b) => (b.used / b.total) - (a.used / a.total))
    }

    const utilization = globalUtilizationData.utilization
    if (utilization.hosts) {
      sortByUsedPercentDesc(utilization.hosts)
    }
    if (utilization.storage) {
      sortByUsedPercentDesc(utilization.storage)
    }
    if (utilization.vms && !utilization.storage) {
      sortByUsedPercentDesc(utilization.vms)
    }
  })

  // transform data.heatMapData
  ;['cpu', 'memory', 'storage'].forEach(category => {
    const heatMapData = data.heatMapData[category]

    // heat map component expects values in range <0, 1>
    heatMapData.forEach(obj => {
      obj.value = obj.value / 100
    })

    // sort heat map data
    heatMapData.sort((a, b) => {
      return b.value - a.value
    })
  })

  return data
}

const DashboardDataProvider = ({ children, loading, error }) => (
  <DataProvider fetchData={fetchData}>

    {({ data, fetchError, fetchInProgress, lastUpdated, fetchAndUpdateData }) => {
      // expecting single child component
      const child = React.Children.only(children)

      // handle data loading and error scenarios
      if (fetchError) {
        return error
      } else if (fetchInProgress || !data) {
        return loading
      }

      // return new child component with additional props
      return React.cloneElement(child, {
        data,
        lastUpdated,
        onRefreshData: fetchAndUpdateData
      })
    }}

  </DataProvider>
)

DashboardDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  loading: PropTypes.element.isRequired,
  error: PropTypes.element.isRequired
}

export default DashboardDataProvider
