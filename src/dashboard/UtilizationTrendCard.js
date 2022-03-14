import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { utilizationTrend as utilizationTrendShape } from './dataShapes'
import { storageUnitTable } from '_/constants'
import { msg } from '_/intl-messages'
import { formatPercent0D, formatNumber1D } from '_/utils/intl'
import { convertValue } from '_/utils/unit-conversion'

import { Flex, FlexItem, Tooltip } from '@patternfly/react-core'
import AreaChart from '_/components/patternfly/AreaChart'
import DonutChart from '_/components/patternfly/DonutChart'
import UtilizationDialog from './UtilizationDialog'

const UtilizationTrendCard = ({
  data: { used, total, overcommit, allocated, history, utilization },
  title,
  unit,
  utilizationDialogTitle,
  showValueAsPercentage = false,
  donutCenterLabel = DonutChart.defaultProps.centerLabel,
  historyTooltipType = AreaChart.defaultProps.tooltipType,
  utilizationFooterLabel,
}) => {
  const [showUtilizationDialog, setShowUtilizationDialog] = useState(false)

  const available = total - used
  const thresholds = { enabled: true, warning: 75, error: 90 }

  // for non-percentage values summary - scale the available and total unit values together
  const { unit: summaryUnit, value: [summaryAvailable, summaryTotal] } = convertValue(storageUnitTable, unit, [available, total])

  // for the donut chart - want to adjust the used and total values together so they stay balanced
  const { unit: newUnit, value: [newUsed, newTotal] } = convertValue(storageUnitTable, unit, [used, total])

  return (
    <div className='utilization-trend-card'>

      {/* title */}
      <div className='title'>{title}</div>

      {/* summary */}
      <div className='current-values'>
        <Flex
          spaceItems={{ default: 'spaceItemsSm' }}
          flexWrap={{ default: 'nowrap' }}
        >
          <FlexItem
            alignSelf={{ default: 'alignSelfCenter' }}
            className='current-value'
          >
            {showValueAsPercentage ? formatPercent0D(available / 100) : formatNumber1D(summaryAvailable)}
          </FlexItem>
          <FlexItem className='current-available'>
            <div>{msg.available().toLowerCase()}</div>
            <div>
              {showValueAsPercentage
                ? msg.dashboardUtilizationCardAvailableOfPercent({ percent: total })
                : msg.dashboardUtilizationCardAvailableOfUnit({ total: summaryTotal, unit: summaryUnit })
              }
            </div>
          </FlexItem>
        </Flex>

        <Tooltip content={msg.dashboardUtilizationCardOverCommitTooltip()} distance={5}>
          <div className='overcommit-text'>
            {msg.dashboardUtilizationCardOverCommit({
              overcommit,
              allocated,
            })}
          </div>
        </Tooltip>
      </div>

      {/* donut chart */}
      <DonutChart
        used={newUsed}
        total={newTotal === 0 && newUsed === 0 ? 1 : newTotal}
        unit={newUnit}
        thresholds={thresholds}
        centerLabel={donutCenterLabel}
        onDataClick={() => { setShowUtilizationDialog(true) }}
      />

      {/* area chart - display historic data */}
      <AreaChart
        data={history}
        total={total}
        unit={unit}
        tooltipType={historyTooltipType}
      />

      {/* dialog triggered by a click on the donut chart */}
      <UtilizationDialog
        show={showUtilizationDialog}
        onClose={() => { setShowUtilizationDialog(false) }}

        title={utilizationDialogTitle}
        utilizationFooterLabel={utilizationFooterLabel}
        unit={unit}
        thresholds={thresholds}

        hosts={utilization.hosts}
        vms={utilization.vms}
        storage={utilization.storage}
      />
    </div>
  )
}

UtilizationTrendCard.propTypes = {
  data: utilizationTrendShape.isRequired,
  title: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  utilizationDialogTitle: PropTypes.string.isRequired,
  showValueAsPercentage: PropTypes.bool,
  donutCenterLabel: DonutChart.propTypes.centerLabel,
  historyTooltipType: AreaChart.propTypes.tooltipType,
  utilizationFooterLabel: UtilizationDialog.propTypes.utilizationFooterLabel,
}

export default UtilizationTrendCard
