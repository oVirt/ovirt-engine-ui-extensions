import React from 'react'
import PropTypes from 'prop-types'
import * as C from '_/constants'
import { msg } from '_/intl-messages'
import { applySearch } from '_/utils/webadmin-search'
import { dashboardDataShape } from './dataShapes'

import { Flex, FlexItem } from '@patternfly/react-core'
import HeightMatching from '_/components/helper/HeightMatching'
import AggregateStatusCard from './AggregateStatusCard'

const FlexItem1 = ({ children, ...rest }) => (
  <FlexItem
    flex={{ default: 'flex_1' }}
    {...rest}
  >
    {children}
  </FlexItem>
)
FlexItem1.propTypes = {
  children: PropTypes.node.isRequired,
}

const InventoryStatusCards = ({ inventory }) => {
  const showGlusterCard = inventory.volume.totalCount > 0

  return (
    <HeightMatching
      selector={[
        '.aggregate-status-card .pf-c-card__title',
        '.aggregate-status-card .pf-c-card__body',
      ]}
    >
      <Flex
        alignItems={{ default: 'alignItemsStretch' }}
        flexWrap={{ default: 'nowrap' }}
        grow={{ default: 'grow' }}
        spaceItems={{ default: 'spaceItemsSm' }}
      >

        <FlexItem1>
          <AggregateStatusCard
            data={inventory.dc}
            title={msg.dashboardStatusCardDataCenterTitle()}
            mainIconClass='building'
            onTotalCountClick={() => {
              applySearch(C.webadminPlaces.dc, C.searchPrefixes.dc)
            }}
            onStatusCountClick={statusItem => {
              applySearch(C.webadminPlaces.dc, C.searchPrefixes.dc, [{
                name: C.searchFields.status,
                values: statusItem.statusValues,
              }])
            }}
          />
        </FlexItem1>

        <FlexItem1>
          <AggregateStatusCard
            data={inventory.cluster}
            title={msg.dashboardStatusCardClusterTitle()}
            mainIconClass='cluster'
            noStatusText={''}
            noStatusIconClass=''
            onTotalCountClick={() => {
              applySearch(C.webadminPlaces.cluster, C.searchPrefixes.cluster)
            }}
          />
        </FlexItem1>

        <FlexItem1>
          <AggregateStatusCard
            data={inventory.host}
            title={msg.dashboardStatusCardHostTitle()}
            mainIconClass='screen'
            onTotalCountClick={() => {
              applySearch(C.webadminPlaces.host, C.searchPrefixes.host)
            }}
            onStatusCountClick={statusItem => {
              applySearch(C.webadminPlaces.host, C.searchPrefixes.host, [{
                name: C.searchFields.status,
                values: statusItem.statusValues,
              }])
            }}
          />
        </FlexItem1>

        <FlexItem1>
          <AggregateStatusCard
            data={inventory.storage}
            title={msg.dashboardStatusCardStorageTitle()}
            mainIconClass='storage-domain'
            onTotalCountClick={() => {
              applySearch(C.webadminPlaces.storage, C.searchPrefixes.storage)
            }}
            onStatusCountClick={statusItem => {
              applySearch(C.webadminPlaces.storage, C.searchPrefixes.storage, [{
                name: C.searchFields.status,
                values: statusItem.statusValues,
              }])
            }}
          />
        </FlexItem1>

        {showGlusterCard && (
          <FlexItem1>
            <AggregateStatusCard
              data={inventory.volume}
              title={msg.dashboardStatusCardGlusterVolumeTitle()}
              mainIconClass='volume'
              onTotalCountClick={() => {
                applySearch(C.webadminPlaces.volume, C.searchPrefixes.volume)
              }}
              onStatusCountClick={statusItem => {
                applySearch(C.webadminPlaces.volume, C.searchPrefixes.volume, [{
                  name: C.searchFields.status,
                  values: statusItem.statusValues,
                }])
              }}
            />
          </FlexItem1>
        )}

        <FlexItem1>
          <AggregateStatusCard
            data={inventory.vm}
            title={msg.dashboardStatusCardVmTitle()}
            mainIconClass='virtual-machine'
            onTotalCountClick={() => {
              applySearch(C.webadminPlaces.vm, C.searchPrefixes.vm)
            }}
            onStatusCountClick={statusItem => {
              applySearch(C.webadminPlaces.vm, C.searchPrefixes.vm, [{
                name: C.searchFields.status,
                values: statusItem.statusValues,
              }])
            }}
          />
        </FlexItem1>

        <FlexItem1>
          <AggregateStatusCard
            data={inventory.event}
            title={msg.dashboardStatusCardEventTitle()}
            mainIconClass='bell'
            onTotalCountClick={() => {
              applySearch(C.webadminPlaces.event, C.searchPrefixes.event)
            }}
            onStatusCountClick={statusItem => {
              applySearch(C.webadminPlaces.event, C.searchPrefixes.event, [{
                name: C.searchFields.severity,
                values: statusItem.statusValues,
              }, {
                name: C.searchFields.time,
                values: statusItem.searchSince ? [statusItem.searchSince] : [],
                operator: '>',
              }])
            }}
          />
        </FlexItem1>

      </Flex>
    </HeightMatching>
  )
}

InventoryStatusCards.propTypes = {
  inventory: dashboardDataShape.inventory,
}

export default InventoryStatusCards
