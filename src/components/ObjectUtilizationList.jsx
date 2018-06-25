import React from 'react'
import { string, number, shape, oneOf, arrayOf, func } from 'prop-types'
import classNames from 'classnames'
import UtilizationBarChart from './patternfly/UtilizationBarChart'
import { utilizationListGridNameThreshold } from '../constants'

// TODO(vs) utilize
//  https://github.com/patternfly/patternfly-react/tree/master/packages/core/src/components/ListView

function ObjectUtilizationList ({ data, unit, emptyListText, thresholds, utilizationFooterLabel, onObjectNameClick }) {
  if (data.length === 0) {
    return (
      <div className='no-overutilized'>{emptyListText}</div>
    )
  }

  const someItemHasNamePastThreshold = data.some((item) => {
    return item.name.length > utilizationListGridNameThreshold
  })

  const nameThresholdClass = someItemHasNamePastThreshold ? 'col-md-3' : 'col-md-2'
  const barThresholdClass = someItemHasNamePastThreshold ? 'col-md-8' : 'col-md-9'

  return (
    <div className='overutilized-container'>
      <div className='overutilized-section'>
        {data.map((item) => (
          <div key={item.name} className='row'>
            <div className={`text-right overutilized-item-name-container ${nameThresholdClass}`}>
              <a className='overutilized-item-name' href='#' onClick={(event) => {
                event.preventDefault()
                onObjectNameClick(item)
              }}>{item.name}</a>
            </div>
            <div className={`overutilized-item-bar ${barThresholdClass}`}>
              <UtilizationBarChart
                used={item.used}
                total={item.total}
                unit={unit}
                thresholds={thresholds}
                layout='inline'
                footerLabel={utilizationFooterLabel} />
            </div>
            <div className='col-md-1 overutilized-item-trend'>
              {item.trend !== 'same' &&
                <span className={classNames('pficon', {
                  'pficon-trend-up': item.trend === 'up',
                  'pficon-trend-down': item.trend === 'down'
                })} />
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const dataItemShape = ObjectUtilizationList.dataItemShape = {
  name: string,
  used: number,
  total: number,
  trend: oneOf(['up', 'down', 'same'])
}

ObjectUtilizationList.propTypes = {
  data: arrayOf(shape(dataItemShape)).isRequired,
  unit: string.isRequired,
  emptyListText: string.isRequired,
  thresholds: UtilizationBarChart.propTypes.thresholds,
  utilizationFooterLabel: UtilizationBarChart.propTypes.footerLabel,
  onObjectNameClick: func // (dataItem:object) => void
}

ObjectUtilizationList.defaultProps = {
  thresholds: UtilizationBarChart.defaultProps.thresholds,
  utilizationFooterLabel: UtilizationBarChart.defaultProps.footerLabel,
  onObjectNameClick () {}
}

export default ObjectUtilizationList
