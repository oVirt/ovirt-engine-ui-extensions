import React from 'react'
import { msg } from '_/intl-messages'
import { dashboardDataShape } from './dataShapes'
import * as C from '_/constants'
import { formatNumber1D } from '_/utils/intl'
import { convertValue } from '_/utils/unit-conversion'

import { Card, CardTitle, CardBody, Grid, GridItem } from '@patternfly/react-core'
import HeightMatching from '_/components/helper/HeightMatching'
import UtilizationTrendCard from './UtilizationTrendCard'

const storageUtilizationFooterLabel = (used, total, unit) => {
  const { unit: newUnit, value: newUsed } = convertValue(C.storageUnitTable, unit, used)
  return (
    <div style={{ display: 'inline-block' }}>
      <strong>{formatNumber1D(newUsed)} {newUnit}</strong> Used
    </div>
  )
}

const GlobalUtilizationCards = ({ globalUtilization }) => (
  <Card className='global-utilization-cards'>
    <CardTitle>
      {msg.dashboardGlobalUtilizationHeading()}
    </CardTitle>
    <CardBody>
      <HeightMatching selector='.utilization-trend-card .overcommit-text'>
        <Grid hasGutter sm={12} md={4}>
          <GridItem>
            <UtilizationTrendCard
              data={globalUtilization.cpu}
              title={msg.cpuTitle()}
              unit=''
              utilizationDialogTitle={msg.dashboardUtilizationCardCpuDialogTitle()}
              showValueAsPercentage
              donutCenterLabel='percent'
              historyTooltipType='percentPerDate'
              utilizationFooterLabel='percent'
            />
          </GridItem>
          <GridItem>
            <UtilizationTrendCard
              data={globalUtilization.memory}
              title={msg.memoryTitle()}
              unit='GiB'
              utilizationDialogTitle={msg.dashboardUtilizationCardMemoryDialogTitle()}
              donutCenterLabel='used'
              historyTooltipType='valuePerDate'
              utilizationFooterLabel={storageUtilizationFooterLabel}
            />
          </GridItem>
          <GridItem>
            <UtilizationTrendCard
              data={globalUtilization.storage}
              title={msg.storageTitle()}
              unit='TiB'
              utilizationDialogTitle={msg.dashboardUtilizationCardStorageDialogTitle()}
              donutCenterLabel='used'
              historyTooltipType='valuePerDate'
              utilizationFooterLabel={storageUtilizationFooterLabel}
            />
          </GridItem>
        </Grid>
      </HeightMatching>
    </CardBody>
  </Card>
)

GlobalUtilizationCards.propTypes = {
  globalUtilization: dashboardDataShape.globalUtilization
}

export default GlobalUtilizationCards
