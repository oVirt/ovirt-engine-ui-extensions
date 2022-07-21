import React from 'react'
import PropTypes from 'prop-types'
import { DEFAULT_THRESHOLD_COLORS } from './HeatMap'

// PatternFly reference:
//   https://www.patternfly.org/v3/pattern-library/data-visualization/heat-map/

const HeatMapLegend = ({ colors, labels }) => {
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
  colors: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(PropTypes.string),
}

HeatMapLegend.defaultProps = {
  colors: DEFAULT_THRESHOLD_COLORS,
  labels: ['< 70%', '70-80%', '80-90%', '> 90%'],
}

export default HeatMapLegend
