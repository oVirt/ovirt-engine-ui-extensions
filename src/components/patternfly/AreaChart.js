import React from 'react'
import PropTypes from 'prop-types'
import { storageUnitTable } from '_/constants'
import { formatNumber1D, formatPercent1D, formatDateTime } from '_/utils/intl'
import { convertValue } from '_/utils/unit-conversion'

import {
  ChartArea,
  ChartGroup,
  ChartTooltip,
  ChartVoronoiContainer
} from '@patternfly/react-charts'

import './styles.css'

/*
Reference: Patternfly 4 area chart documentation
https://www.patternfly.org/v4/documentation/react/charts/chartarea/
*/

function formatTooltip (tooltipType, total, unit, { date, value }) {
  const percentUsed = total === 0 ? 0 : value / total
  const labelPercentUsed =
    (percentUsed === 0 || percentUsed >= 0.001) ? formatPercent1D(percentUsed) : `<${formatPercent1D(0.001)}`

  switch (tooltipType) {
    case 'percent':
      return `${labelPercentUsed}`

    case 'percentPerDate':
      return `${formatDateTime(date)}\n${labelPercentUsed}`

    case 'valuePerDate':
      const { unit: newUnit, value: newUsed } = convertValue(storageUnitTable, unit, value)
      return `${formatDateTime(date)}\n${formatNumber1D(newUsed)} ${newUnit}`

    default:
      return `${formatNumber1D(value)} ${unit}`
  }
}

const AreaChart = ({
  data,
  total,
  unit,
  tooltipType = 'default'
}) => {
  const chartData = data.map((item, index) => ({ ...item, x: index, y: item.value }))

  return (
    <ChartGroup
      containerComponent={<ChartVoronoiContainer />}
      height={100}
      padding={{ top: 40, bottom: 25, right: 25, left: 25 }}
    >
      <ChartArea
        data={chartData}
        labels={({ datum }) => formatTooltip(tooltipType, total, unit, datum)}
        labelComponent={<ChartTooltip renderInPortal />}
      />
    </ChartGroup>
  )
}

AreaChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    date: PropTypes.instanceOf(Date)
  })).isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  tooltipType: PropTypes.oneOf(['default', 'percent', 'percentPerDate', 'valuePerDate'])
}

export default AreaChart
