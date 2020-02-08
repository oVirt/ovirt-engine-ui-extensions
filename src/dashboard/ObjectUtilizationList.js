import React from 'react'
import PropTypes from 'prop-types'
import { objectUtilization as objectUtilizationShape } from './dataShapes'
import { utilizationListGridNameThreshold } from '_/constants'

import { Grid, GridItem } from '@patternfly/react-core'
import { TrendDownIcon, TrendUpIcon } from '@patternfly/react-icons'
import UtilizationBarChart from '_/components/patternfly/UtilizationBarChart'

const ObjectUtilizationList = ({
  title,
  data = [],
  unit,
  emptyListText,
  thresholds,
  utilizationFooterLabel,
  onObjectNameClick = () => {}
}) => {
  const someItemHasNamePastThreshold = data.some(item => {
    return item.name.length > utilizationListGridNameThreshold
  })

  const nameColSpan = someItemHasNamePastThreshold ? 3 : 2
  const barColSpan = someItemHasNamePastThreshold ? 8 : 9

  return (
    <div className='object-utilization-list'>
      <div className='title'>
        {title}
      </div>

      {data.length === 0 &&
        <div className='empty-list'>
          {emptyListText}
        </div>
      }

      {data.length > 0 && (
        <div className='list-container'>
          {data.map(item => (
            <Grid key={item.name}>
              <GridItem span={nameColSpan} className='item-name'>
                <a href='#' onClick={e => { e.preventDefault(); onObjectNameClick(item) }}>
                  {item.name}
                </a>
              </GridItem>

              <GridItem span={barColSpan} className='item-utilization-bar'>
                <UtilizationBarChart
                  used={item.used}
                  total={item.total}
                  unit={unit}
                  thresholds={thresholds}
                  layout='inline'
                  footerLabel={utilizationFooterLabel}
                />
              </GridItem>

              <GridItem span={1} className='item-trend'>
                {item.trend === 'up' && <TrendUpIcon />}
                {item.trend === 'down' && <TrendDownIcon />}
              </GridItem>
            </Grid>
          ))}
        </div>
      )}
    </div>
  )
}

ObjectUtilizationList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(objectUtilizationShape),
  unit: PropTypes.string.isRequired,
  emptyListText: PropTypes.string.isRequired,
  thresholds: UtilizationBarChart.propTypes.thresholds,
  utilizationFooterLabel: UtilizationBarChart.propTypes.footerLabel,
  onObjectNameClick: PropTypes.func // (dataItem:object) => void
}

export default ObjectUtilizationList
