import React from 'react'
import { element } from 'prop-types'
import $ from 'jquery'
import getPluginApi from '../plugin-api'

// TODO(vs) extract data fetch logic into services/data-fetch

class DashboardDataProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: NO_DATA }
  }

  componentDidMount () {
    this._fetchData()
  }

  componentWillUnmount () {
    this._jqXHR.abort()
  }

  render () {
    const child = React.Children.only(this.props.children)

    switch (this.state.data) {
      case NO_DATA:
        return this.props.loading
      case DATA_ERROR:
        return this.props.error
      default:
        return React.cloneElement(child, {
          data: this.state.data,
          lastUpdated: this.state.lastUpdated,
          onRefreshData: () => {
            this._fetchData()
          }
        })
    }
  }

  _fetchData () {
    const request = this._jqXHR = $.ajax({
      method: 'GET',
      url: `${getPluginApi().engineBaseUrl()}webadmin/dashboard_data`,
      dataType: 'json',
      headers: {
        'Accept': 'application/json'
        // For testing purposes you can uncomment either of these.
        // 'Prefer': 'fake_data' // returns randomly generated data
        // 'Prefer': 'error'     // triggers HTTP error response
      }
    })

    request.done((data) => {
      this._updateData({ data: this._transformData({ data }) })
    })

    request.fail(() => {
      console.error('Request failed', request)
      this._updateData({ data: DATA_ERROR })
    })
  }

  _updateData ({ data }) {
    this.setState({
      data,
      lastUpdated: new Date()
    })
  }

  /*
   * Take the object returned from the data fetch and clean it up as needed for GlobalDashboard.
   */
  _transformData ({ data }) {
    const inventoryStatusOrder = ['alert', 'error', 'warning', 'down', 'up']

    // transform data.inventory
    ;['dc', 'cluster', 'host', 'storage', 'vm', 'event'].forEach((category) => {
      const inventoryData = data.inventory[category]

      // sort object statuses
      inventoryData.statuses.sort((a, b) => {
        return inventoryStatusOrder.indexOf(a.type) - inventoryStatusOrder.indexOf(b.type)
      })

      // define additional search constraints for events
      if (category === 'event') {
        inventoryData.statuses.forEach((obj) => {
          if (obj.type === 'error' || obj.type === 'warning') {
            obj.searchSince = 'Today'
          }
        })
      }
    })

    // transform data.globalUtilization
    ;['cpu', 'memory', 'storage'].forEach((category) => {
      const globalUtilizationData = data.globalUtilization[category]

      // make sure that used never exceeds total
      if (globalUtilizationData.used > globalUtilizationData.total) {
        globalUtilizationData.used = globalUtilizationData.total
      }

      // sparkline chart works with Date objects on X axis
      globalUtilizationData.history.forEach((obj) => {
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
    ;['cpu', 'memory', 'storage'].forEach((category) => {
      const heatMapData = data.heatMapData[category]

      // heat map component expects values in range <0, 1>
      heatMapData.forEach((obj) => {
        obj.value = obj.value / 100
      })

      // sort heat map data
      heatMapData.sort((a, b) => {
        return b.value - a.value
      })
    })

    return data
  }
}

const NO_DATA = null
const DATA_ERROR = 'error'

DashboardDataProvider.propTypes = {
  children: element.isRequired,
  loading: element.isRequired,
  error: element.isRequired
}

export default DashboardDataProvider
