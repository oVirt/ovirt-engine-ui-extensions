import React from 'react'
import { shape, instanceOf, func } from 'prop-types'
import { searchPrefixes, searchFields, heatMapThresholds, heatMapLegendLabels, storageUnitTable, webadminPlaces } from '../constants'
import { msg } from '../intl-messages'
import { formatNumber1D } from '../utils/intl'
import { convertValue } from '../utils/unit-conversion'
import { applySearch } from '../utils/webadmin-search'
import RefreshDataControl from './RefreshDataControl'
import LastUpdatedLabel from './LastUpdatedLabel'
import AggregateStatusCard from './AggregateStatusCard'
import UtilizationTrendCard from './UtilizationTrendCard'
import HeatMap from './patternfly/HeatMap'
import HeatMapLegend from './patternfly/HeatMapLegend'
import HeightMatching from './helper/HeightMatching'
import classNames from 'classnames'

function GlobalDashboard ({ data: { inventory, globalUtilization, heatMapData }, lastUpdated, onRefreshData = () => {} }) {
  const storageUtilizationFooterLabel = (used, total, unit) => {
    const { unit: newUnit, value: newUsed } = convertValue(storageUnitTable, unit, used)
    return (
      <div style={{ display: 'inline-block' }}>
        <strong>{formatNumber1D(newUsed)} {newUnit}</strong> Used
      </div>
    )
  }
  const showGlusterCard = inventory.volume.totalCount > 0
  const statusCardClass = classNames('col-xs-4', 'col-sm-4', {
    'col-md-1': showGlusterCard,
    'col-md-2': !showGlusterCard
  })

  return (
    <div className='container-fluid container-tiles-pf containers-dashboard'>

      {/* refresh buttons and last updated information label */}
      <div className='row row-tile-pf'>
        <div className='col-xs-12 global-dashboard-update-column'>
          <RefreshDataControl onRefresh={onRefreshData} />

          <div style={{ marginLeft: 10 }}>
            <LastUpdatedLabel date={lastUpdated} />
          </div>
        </div>
      </div>

      {/* inventory cards - match height of all of the card's titles and body */}
      <HeightMatching
        className={classNames('row', 'row-tile-pf', {'seven-cols': showGlusterCard})}
        selector={[
          '.card-pf-aggregate-status .card-pf-title',
          '.card-pf-aggregate-status .card-pf-body' ]}>

        <div className={statusCardClass}>
          <AggregateStatusCard
            data={inventory.dc}
            title={msg.statusCardDataCenterTitle()}
            mainIconClass='fa fa-building-o'
            onTotalCountClick={() => {
              applySearch(webadminPlaces.dc, searchPrefixes.dc)
            }}
            onStatusCountClick={(statusItem) => {
              applySearch(webadminPlaces.dc, searchPrefixes.dc, [{
                name: searchFields.status,
                values: statusItem.statusValues
              }])
            }} />
        </div>

        <div className={statusCardClass}>
          <AggregateStatusCard
            data={inventory.cluster}
            title={msg.statusCardClusterTitle()}
            mainIconClass='pficon pficon-cluster'
            noStatusText={msg.notAvailableShort()}
            noStatusIconClass=''
            onTotalCountClick={() => {
              applySearch(webadminPlaces.cluster, searchPrefixes.cluster)
            }} />
        </div>

        <div className={statusCardClass}>
          <AggregateStatusCard
            data={inventory.host}
            title={msg.statusCardHostTitle()}
            mainIconClass='pficon pficon-screen'
            onTotalCountClick={() => {
              applySearch(webadminPlaces.host, searchPrefixes.host)
            }}
            onStatusCountClick={(statusItem) => {
              applySearch(webadminPlaces.host, searchPrefixes.host, [{
                name: searchFields.status,
                values: statusItem.statusValues
              }])
            }} />
        </div>

        <div className={statusCardClass}>
          <AggregateStatusCard
            data={inventory.storage}
            title={msg.statusCardStorageTitle()}
            mainIconClass='pficon pficon-storage-domain'
            onTotalCountClick={() => {
              applySearch(webadminPlaces.storage, searchPrefixes.storage)
            }}
            onStatusCountClick={(statusItem) => {
              applySearch(webadminPlaces.storage, searchPrefixes.storage, [{
                name: searchFields.status,
                values: statusItem.statusValues
              }])
            }} />
        </div>

        {showGlusterCard &&
          <div className={statusCardClass}>
            <AggregateStatusCard
              data={inventory.volume}
              title={msg.statusCardGlusterVolumeTitle()}
              mainIconClass='pficon pficon-volume'
              onTotalCountClick={() => {
                applySearch(webadminPlaces.volume, searchPrefixes.volume)
              }}
              onStatusCountClick={(statusItem) => {
                applySearch(webadminPlaces.volume, searchPrefixes.volume, [{
                  name: searchFields.status,
                  values: statusItem.statusValues
                }])
              }} />
          </div>
        }

        <div className={statusCardClass}>
          <AggregateStatusCard
            data={inventory.vm}
            title={msg.statusCardVmTitle()}
            mainIconClass='pficon pficon-virtual-machine'
            onTotalCountClick={() => {
              applySearch(webadminPlaces.vm, searchPrefixes.vm)
            }}
            onStatusCountClick={(statusItem) => {
              applySearch(webadminPlaces.vm, searchPrefixes.vm, [{
                name: searchFields.status,
                values: statusItem.statusValues
              }])
            }} />
        </div>

        <div className={statusCardClass}>
          <AggregateStatusCard
            data={inventory.event}
            title={msg.statusCardEventTitle()}
            mainIconClass='fa fa-bell'
            onTotalCountClick={() => {
              applySearch(webadminPlaces.event, searchPrefixes.event)
            }}
            onStatusCountClick={(statusItem) => {
              applySearch(webadminPlaces.event, searchPrefixes.event, [{
                name: searchFields.severity,
                values: statusItem.statusValues
              }, {
                name: searchFields.time,
                values: statusItem.searchSince ? [statusItem.searchSince] : [],
                operator: '>'
              }])
            }} />
        </div>

      </HeightMatching>

      {/* utilization cards */}
      <div className='row row-tile-pf'>
        <div className='col-md-12'>
          <div className='card-pf'>
            <div className='card-pf-heading'>
              <h2 className='card-pf-title'>{msg.globalUtilizationHeading()}</h2>
            </div>
            <div className='card-pf-body'>
              <HeightMatching className='row' selector='.utilization-chart-pf .overcommit-text'>

                <div className='col-xs-12 col-sm-4 col-md-4'>
                  <UtilizationTrendCard
                    data={globalUtilization.cpu}
                    title={msg.cpuTitle()}
                    unit=''
                    utilizationDialogTitle={msg.utilizationCardCpuDialogTitle()}
                    showValueAsPercentage
                    donutCenterLabel='percent'
                    sparklineTooltipType='percentPerDate'
                    utilizationFooterLabel='percent' />
                </div>

                <div className='col-xs-12 col-sm-4 col-md-4'>
                  <UtilizationTrendCard
                    data={globalUtilization.memory}
                    title={msg.memoryTitle()}
                    unit='GiB'
                    utilizationDialogTitle={msg.utilizationCardMemoryDialogTitle()}
                    donutCenterLabel='used'
                    sparklineTooltipType='valuePerDate'
                    utilizationFooterLabel={storageUtilizationFooterLabel} />
                </div>

                <div className='col-xs-12 col-sm-4 col-md-4'>
                  <UtilizationTrendCard
                    data={globalUtilization.storage}
                    title={msg.storageTitle()}
                    unit='TiB'
                    utilizationDialogTitle={msg.utilizationCardStorageDialogTitle()}
                    donutCenterLabel='used'
                    sparklineTooltipType='valuePerDate'
                    utilizationFooterLabel={storageUtilizationFooterLabel} />
                </div>

              </HeightMatching>
            </div>
          </div>
        </div>
      </div>

      {/* heat maps */}
      <div className='row row-tile-pf row-tile-pf-last'>
        <div className='col-md-8'>
          <div className='heatmap-card'>
            <div className='card-pf'>
              <div className='card-pf-heading'>
                <h2 className='card-pf-title'>{msg.clusterUtilizationHeading()}</h2>
              </div>
              <div className='card-pf-body'>
                <div className='row'>
                  <div className='col-xs-12 col-sm-12 col-md-12 card-heatmap-body'>

                    <div className='col-xs-12 col-sm-6 col-md-6 container-heatmap-tile'>
                      <h3 className='heatmap-chart-title'>{msg.cpuTitle()}</h3>
                      <HeatMap
                        data={heatMapData.cpu}
                        thresholds={heatMapThresholds}
                        onBlockClick={(dataItem) => {
                          applySearch(webadminPlaces.host, searchPrefixes.host, [{
                            name: searchFields.cluster,
                            values: [dataItem.name]
                          }])
                        }} />
                    </div>

                    <div className='col-xs-12 col-sm-6 col-md-6 container-heatmap-tile'>
                      <h3 className='heatmap-chart-title'>{msg.memoryTitle()}</h3>
                      <HeatMap
                        data={heatMapData.memory}
                        thresholds={heatMapThresholds}
                        onBlockClick={(dataItem) => {
                          applySearch(webadminPlaces.host, searchPrefixes.host, [{
                            name: searchFields.cluster,
                            values: [dataItem.name]
                          }])
                        }} />
                    </div>

                    <div className='col-xs-12 col-sm-12 col-md-12'>
                      <HeatMapLegend labels={heatMapLegendLabels} />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='heatmap-card'>
            <div className='card-pf'>
              <div className='card-pf-heading'>
                <h2 className='card-pf-title'>{msg.storageUtilizationHeading()}</h2>
              </div>
              <div className='card-pf-body'>
                <div className='row'>
                  <div className='col-xs-12 col-sm-12 col-md-12 card-heatmap-body'>

                    <div className='col-xs-12 col-sm-12 col-md-12 container-heatmap-tile'>
                      <h3 className='heatmap-chart-title'>{msg.storageTitle()}</h3>
                      <HeatMap
                        data={heatMapData.storage}
                        thresholds={heatMapThresholds}
                        onBlockClick={(dataItem) => {
                          applySearch(webadminPlaces.storage, searchPrefixes.storage, [{
                            name: searchFields.name,
                            values: [dataItem.name]
                          }])
                        }} />
                    </div>

                    <div className='col-xs-12 col-sm-12 col-md-12'>
                      <HeatMapLegend labels={heatMapLegendLabels} />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

const dataShape = {
  inventory: shape({
    dc: shape(AggregateStatusCard.dataShape),
    cluster: shape(AggregateStatusCard.dataShape),
    host: shape(AggregateStatusCard.dataShape),
    storage: shape(AggregateStatusCard.dataShape),
    volume: shape(AggregateStatusCard.dataShape),
    vm: shape(AggregateStatusCard.dataShape),
    event: shape(AggregateStatusCard.dataShape)
  }),
  globalUtilization: shape({
    cpu: shape(UtilizationTrendCard.dataShape),
    memory: shape(UtilizationTrendCard.dataShape),
    storage: shape(UtilizationTrendCard.dataShape)
  }),
  heatMapData: shape({
    cpu: HeatMap.propTypes.data,
    memory: HeatMap.propTypes.data,
    storage: HeatMap.propTypes.data
  })
}

GlobalDashboard.propTypes = {
  data: shape(dataShape).isRequired,
  lastUpdated: instanceOf(Date).isRequired,
  onRefreshData: func
}

export default GlobalDashboard
