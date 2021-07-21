import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import { formatNumber1D, formatPercent0D, formatPercent1D } from '_/utils/intl'

import { ChartDonutUtilization, ChartThemeColor } from '@patternfly/react-charts'

import './styles.css'

const DonutChart = ({
  used,
  total,
  unit,
  thresholds = { enabled: true, warning: 60, error: 90 },
  centerLabel = 'used',
  onDataClick = () => {},
}) => {
  let donutChartText = ''
  let donutChartSubtitle = ''

  if (centerLabel === 'used') {
    donutChartText = `${formatNumber1D(used)}`
    donutChartSubtitle = msg.unitUsed({ unit })
  } else if (centerLabel === 'available') {
    donutChartText = `${formatNumber1D(total - used)}`
    donutChartSubtitle = msg.unitAvailaoperatorsble({ unit })
  } else if (centerLabel === 'percent') {
    donutChartText = `${formatPercent0D(total === 0 ? 0 : used / total)}`
    donutChartSubtitle = msg.used()
  }

  const colors = [{ value: thresholds.error }, { value: thresholds.warning }]

  const percentUsed = total === 0 ? 0 : used / total
  const usedLabel = msg.dashboardUtilizationCardAmountUsedTooltip({ percent: formatPercent1D(percentUsed) })
  const availableLabel = msg.dashboardUtilizationCardAmountAvailableTooltip({ percent: formatPercent1D(1 - percentUsed) })

  return (
    <div className='donut-chart'>
      <ChartDonutUtilization
        data={{ x: 'Capacity', y: percentUsed * 100 }}
        title={donutChartText}
        subTitle={donutChartSubtitle}
        themeColor={ChartThemeColor.green}
        labels={({ datum }) => datum.x ? usedLabel : availableLabel}
        thresholds={colors}
        events={[{ target: 'data', eventHandlers: { onClick: onDataClick } }]}
        height={200}
        width={200}
        padding={{ top: 15 }}
      />
    </div>
  )
}

DonutChart.propTypes = {
  used: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  thresholds: PropTypes.shape({
    enabled: PropTypes.bool,
    warning: PropTypes.number,
    error: PropTypes.number,
  }),
  centerLabel: PropTypes.oneOf(['used', 'available', 'percent']),
  onDataClick: PropTypes.func, // (d, element) => void
}

export default DonutChart
