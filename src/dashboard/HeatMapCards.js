import React from 'react'
import PropTypes from 'prop-types'
import * as C from '_/constants'
import { msg } from '_/intl-messages'
import { applySearch } from '_/utils/webadmin-search'
import { dashboardDataShape, heatMapDataArray as heatMapDataShape } from './dataShapes'

import { Card, CardTitle, CardBody, Grid, GridItem, Stack, StackItem } from '@patternfly/react-core'
import HeightMatching from '_/components/helper/HeightMatching'
import HeatMap from '_/components/patternfly/HeatMap'
import HeatMapLegend from '_/components/patternfly/HeatMapLegend'

const HeatMapCards = ({ heatMapData, showGluster = false }) => (
  <HeightMatching selector='.heatmap-cards .heatmap-chart'>
    <Grid className='heatmap-cards' hasGutter sm={12} md={4}>
      <GridItem sm={12} md={showGluster ? 4 : 8}>
        <ClusterUtilizationCards cpu={heatMapData.cpu} memory={heatMapData.memory} />
      </GridItem>
      <GridItem>
        <StorageUtilizationCard storage={heatMapData.storage} />
      </GridItem>
      {showGluster && (
        <GridItem>
          <GlusterUtilizationCard vdoSavings={heatMapData.vdoSavings} />
        </GridItem>
      )}
    </Grid>
  </HeightMatching>
)

HeatMapCards.propTypes = {
  heatMapData: dashboardDataShape.heatMapData,
  showGluster: PropTypes.bool,
}

const ClusterUtilizationCards = ({ cpu, memory }) => (
  <Card>
    <CardTitle>
      {msg.dashboardClusterUtilizationHeading()}
    </CardTitle>
    <CardBody>
      <Stack>
        <StackItem className='heatmap-chart' isFilled>
          <Grid hasGutter span={6}>
            <GridItem>
              <div className='heatmap-chart-title'>{msg.cpuTitle()}</div>
              <HeatMap
                id='cluser-utilization-heatmap-cpu'
                data={cpu}
                thresholds={C.heatMapThresholds}
                onBlockClick={dataItem => {
                  applySearch(C.webadminPlaces.host, C.searchPrefixes.host, [{
                    name: C.searchFields.cluster,
                    values: [dataItem.name],
                  }])
                }}
              />
            </GridItem>
            <GridItem>
              <div className='heatmap-chart-title'>{msg.memoryTitle()}</div>
              <HeatMap
                id='cluser-utilization-heatmap-memory'
                data={memory}
                thresholds={C.heatMapThresholds}
                onBlockClick={dataItem => {
                  applySearch(C.webadminPlaces.host, C.searchPrefixes.host, [{
                    name: C.searchFields.cluster,
                    values: [dataItem.name],
                  }])
                }}
              />
            </GridItem>
          </Grid>
        </StackItem>
        <StackItem>
          <HeatMapLegend labels={C.heatMapLegendLabels} />
        </StackItem>
      </Stack>
    </CardBody>
  </Card>
)

ClusterUtilizationCards.propTypes = {
  cpu: heatMapDataShape,
  memory: heatMapDataShape,
}

const StorageUtilizationCard = ({ storage }) => (
  <Card>
    <CardTitle>
      {msg.dashboardStorageUtilizationHeading()}
    </CardTitle>
    <CardBody>
      <Stack>
        <StackItem className='heatmap-chart' isFilled>
          <div className='heatmap-chart-title'>{msg.storageTitle()}</div>
          <HeatMap
            id='cluser-utilization-heatmap-storage'
            data={storage}
            thresholds={C.heatMapThresholds}
            onBlockClick={dataItem => {
              applySearch(C.webadminPlaces.storage, C.searchPrefixes.storage, [{
                name: C.searchFields.name,
                values: [dataItem.name],
              }])
            }}
          />
        </StackItem>
        <StackItem>
          <HeatMapLegend labels={C.heatMapLegendLabels} />
        </StackItem>
      </Stack>
    </CardBody>
  </Card>
)

StorageUtilizationCard.propTypes = {
  storage: heatMapDataShape,
}

const GlusterUtilizationCard = ({ vdoSavings }) => (
  <Card>
    <CardTitle>
      {msg.dashboardVdoSavingsHeading()}
    </CardTitle>
    <CardBody>
      <Stack>
        <StackItem className='heatmap-chart' isFilled>
          <div className='heatmap-chart-title'>{msg.vdoSavingsTitle()}</div>
          <HeatMap
            id='cluser-utilization-heatmap-vdoSavings'
            data={vdoSavings}
            thresholds={C.heatMapVDOThresholds}
            onBlockClick={dataItem => {
              applySearch(C.webadminPlaces.vdoSavings, C.searchPrefixes.vdoSavings, [{
                name: C.searchFields.name,
                values: [dataItem.name],
              }])
            }}
          />
        </StackItem>
        <StackItem>
          <HeatMapLegend labels={C.heatMapLegendLabels} />
        </StackItem>
      </Stack>
    </CardBody>
  </Card>
)

GlusterUtilizationCard.propTypes = {
  vdoSavings: heatMapDataShape,
}

export default HeatMapCards
