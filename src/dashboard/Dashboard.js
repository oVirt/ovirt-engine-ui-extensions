import React from 'react'
import PropTypes from 'prop-types'
import { dashboardDataShape } from './dataShapes'

import { Stack, StackItem, Flex, FlexItem } from '@patternfly/react-core'
import RefreshDataControl from './RefreshDataControl'
import LastUpdatedLabel from './LastUpdatedLabel'
import InventoryStatusCards from './InventoryStatusCards'
import GlobalUtilizationCards from './GlobalUtilizationCards'
import HeatMapCards from './HeatMapCards'

const Dashboard = ({ data, lastUpdated, onRefreshData }) => {
  if (!data) {
    // no data available, don't render anything
    return null
  }

  const { inventory, globalUtilization, heatMapData } = data
  const showGluster = inventory.volume.totalCount > 0

  return (
    <Stack id='global-dashboard' hasGutter>
      <StackItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <RefreshDataControl onRefresh={onRefreshData} />
          </FlexItem>
          <FlexItem>
            <LastUpdatedLabel date={lastUpdated} />
          </FlexItem>
        </Flex>
      </StackItem>

      <StackItem>
        <InventoryStatusCards inventory={inventory} showGluster={showGluster} />
      </StackItem>

      <StackItem>
        <GlobalUtilizationCards globalUtilization={globalUtilization} />
      </StackItem>

      <StackItem>
        <HeatMapCards heatMapData={heatMapData} showGluster={showGluster} />
      </StackItem>
    </Stack>
  )
}

Dashboard.propTypes = {
  data: PropTypes.shape(dashboardDataShape),
  lastUpdated: PropTypes.instanceOf(Date),
  onRefreshData: PropTypes.func
}

Dashboard.defaultProps = {
  data: null,
  lastUpdated: new Date(0),
  onRefreshData () {}
}

export default Dashboard
