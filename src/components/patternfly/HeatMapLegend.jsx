import React from 'react'
import { string, arrayOf } from 'prop-types'
import HeatMap from './HeatMap'

// PatternFly reference:
//  http://www.patternfly.org/pattern-library/data-visualization/heat-map/

// TODO(vs) this should be an integral part of HeatMap component (needs refactor)

function HeatMapLegend ({ colors, labels }) {
  const reversedColors = colors.slice().reverse()
  const reversedLabels = labels.slice().reverse()

  return (
    <div className='heatmap-legend heatmap-legend-container'>
      <ul className='heatmap-legend-container' style={{ paddingLeft: 0 }}>
        {reversedColors.map((color, index) => (
          <li key={color} className='heatmap-pf-legend-items'>
            <span className='color-box' style={{ backgroundColor: color }} />
            <span className='legend-text'>{reversedLabels[index]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

HeatMapLegend.propTypes = {
  colors: arrayOf(string),
  labels: arrayOf(string)
}

HeatMapLegend.defaultProps = {
  colors: HeatMap.defaultProps.thresholds.colors,
  labels: ['< 70%', '70-80%', '80-90%', '> 90%']
}

export default HeatMapLegend
