import PropTypes from 'prop-types'

export const inventoryStatus = PropTypes.shape({
  totalCount: PropTypes.number,
  statuses: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string, // should be unique within the array
      count: PropTypes.number
    })
  )
})

export const objectUtilization = PropTypes.shape({
  name: PropTypes.string,
  used: PropTypes.number,
  total: PropTypes.number,
  trend: PropTypes.oneOf(['up', 'down', 'same'])
})

export const utilizationTrend = PropTypes.shape({
  used: PropTypes.number,
  total: PropTypes.number,
  overcommit: PropTypes.number,
  allocated: PropTypes.number,
  history: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    date: PropTypes.instanceOf(Date)
  })),
  utilization: PropTypes.shape({
    hosts: PropTypes.arrayOf(objectUtilization),
    storage: PropTypes.arrayOf(objectUtilization),
    vms: PropTypes.arrayOf(objectUtilization)
  })
})

export const heatMapDataArray = PropTypes.arrayOf(PropTypes.shape({
  value: PropTypes.number, // from range <0, 1>
  name: PropTypes.string
}))

export const dashboardDataShape = {
  inventory: PropTypes.shape({
    dc: inventoryStatus,
    cluster: inventoryStatus,
    host: inventoryStatus,
    storage: inventoryStatus,
    volume: inventoryStatus,
    vm: inventoryStatus,
    event: inventoryStatus
  }),
  globalUtilization: PropTypes.shape({
    cpu: utilizationTrend,
    memory: utilizationTrend,
    storage: utilizationTrend
  }),
  heatMapData: PropTypes.shape({
    cpu: heatMapDataArray,
    memory: heatMapDataArray,
    storage: heatMapDataArray,
    vdoSavings: heatMapDataArray
  })
}
