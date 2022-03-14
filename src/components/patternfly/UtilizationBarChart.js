import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { msg } from '_/intl-messages'
import { formatPercent0D, formatNumber1D } from '_/utils/intl'

import { Progress, ProgressMeasureLocation, ProgressSize } from '@patternfly/react-core'
import './styles.css'

const UtilizationBarChart = ({
  used,
  total,
  unit,
  thresholds = { enabled: true, warning: 60, error: 90 },
  footerLabel = 'actual',
  footerLabelWidth,
}) => {
  const percentUsed = Math.round(used / total * 100)

  // percent used can be >100% but we render only up to 100% (anything longer will be clipped)
  const barUsedWidth = Math.min(100, percentUsed)

  const progressThresholdClass = thresholds.enabled
    ? classNames({
      'bar-chart-success': (percentUsed < thresholds.warning),
      'bar-chart-warning': (percentUsed >= thresholds.warning && percentUsed <= thresholds.error),
      'bar-chart-danger': (percentUsed > thresholds.error),
    })
    : ''

  return (
    <>
      <div className='bar-chart'>
        <Progress
          size={ProgressSize.lg}
          value={barUsedWidth}
          measureLocation={ProgressMeasureLocation.none}
          className={progressThresholdClass}
          height={30}
        />
      </div>
      { footerLabel === 'actual' && (
        <div className='bar-chart-label' style={{ maxWidth: footerLabelWidth }}>
          <strong>{formatNumber1D(used)} {unit}</strong> {msg.used()}
        </div>
      )}
      { footerLabel === 'percent' && (
        <div className='bar-chart-label' style={{ maxWidth: footerLabelWidth }}>
          <strong>{formatPercent0D(percentUsed)}</strong> {msg.used()}
        </div>
      )}
      { typeof footerLabel === 'function' && (
        <div className='bar-chart-label' style={{ maxWidth: footerLabelWidth }}>
          {footerLabel(used, total, unit)}
        </div>
      )}
    </>
  )
}

UtilizationBarChart.propTypes = {
  used: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  thresholds: PropTypes.shape({
    enabled: PropTypes.bool,
    warning: PropTypes.number,
    error: PropTypes.number,
  }),
  footerLabel: PropTypes.oneOfType([
    PropTypes.oneOf(['actual', 'percent']),
    PropTypes.func, // (used:number, total:number, unit:string) => void
  ]),
  footerLabelWidth: PropTypes.string, // used with 'inline' layout
}

export default UtilizationBarChart
