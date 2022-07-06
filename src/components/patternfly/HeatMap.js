import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import d3 from 'd3'
import { useElementSize } from 'usehooks-ts'
import { Tooltip } from '@patternfly/react-core'

// PatternFly reference:
//  https://www.patternfly.org/v3/pattern-library/data-visualization/heat-map/

function determineBlockSize ({ containerWidth, containerHeight, numberOfBlocks, maxBlockSize }) {
  const x = containerWidth
  const y = containerHeight
  const n = numberOfBlocks
  const px = Math.ceil(Math.sqrt(n * x / y))
  const py = Math.ceil(Math.sqrt(n * y / x))

  let sx
  if (Math.floor(px * y / x) * px < n) {
    sx = y / Math.ceil(px * y / x)
  } else {
    sx = x / px
  }

  let sy
  if (Math.floor(py * x / y) * py < n) {
    sy = x / Math.ceil(x * py / y)
  } else {
    sy = y / py
  }

  sx = Math.min(sx, maxBlockSize)
  sy = Math.min(sy, maxBlockSize)

  return Math.max(sx, sy)
}

export const DEFAULT_THRESHOLD_COLORS = ['#D4F0FA', '#F9D67A', '#EC7A08', '#CE0000']

const HeatMap = ({
  id,
  data,
  thresholds = {
    domain: [0.7, 0.8, 0.9],
    colors: DEFAULT_THRESHOLD_COLORS,
  },
  maxBlockSize = 50,
  blockPadding = 1,
  containerStyle = {
    height: 100,
  },
  onBlockClick = () => {},
}) => {
  const [containerRef, { width: containerWidth, height: containerHeight }] = useElementSize()

  const [{ blockSize, numberOfRows }, setRenderParams] = useState({})
  const [allBlocksActive, setAllBlocksActive] = useState(true)
  const [mouseOverBlock, setMouseOverBlock] = useState(-1)

  useEffect(() => {
    if (!containerWidth || !containerHeight) {
      return
    }

    const blockSize = determineBlockSize({
      containerWidth,
      containerHeight,
      numberOfBlocks: data.length,
      maxBlockSize,
    })

    const numberOfRows = (blockSize === 0) ? 0 : Math.floor(containerHeight / blockSize)

    setRenderParams({ blockSize, numberOfRows })
  }, [containerWidth, containerHeight, data, maxBlockSize])

  const color = d3.scale.threshold().domain(thresholds.domain).range(thresholds.colors)

  return (
    <div id={id} className='heatmap-container' style={containerStyle} ref={containerRef}>
      <svg
        className='heatmap-svg'
        onMouseLeave={() => { setAllBlocksActive(true) }}
      >
        {blockSize && data.map((d, index) => (
          <Tooltip
            key={index}
            id={`${id}-tooltip-${index}`}
            content={d.name}
          >
            <rect
              key={index}
              x={(Math.floor(index / numberOfRows) * blockSize) + blockPadding}
              y={(index % numberOfRows * blockSize) + blockPadding}
              width={blockSize - (2 * blockPadding)}
              height={blockSize - (2 * blockPadding)}
              style={{
                fill: color(d.value),
                fillOpacity: allBlocksActive || mouseOverBlock === index ? 1 : 0.4,
              }}
              onClick={() => { onBlockClick(d) }}
              onMouseOver={() => {
                setAllBlocksActive(false)
                setMouseOverBlock(index)
              }}
              onMouseOut={() => {
                setMouseOverBlock(-1)
              }}
            />
          </Tooltip>
        ))}
      </svg>
    </div>
  )
}

HeatMap.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number, // from range <0, 1>
    name: PropTypes.string,
  })).isRequired,
  thresholds: PropTypes.shape({
    domain: PropTypes.arrayOf(PropTypes.number), // threshold scale domain
    colors: PropTypes.arrayOf(PropTypes.string), // threshold scale color range
  }),
  maxBlockSize: PropTypes.number,
  blockPadding: PropTypes.number,
  containerStyle: PropTypes.object,
  onBlockClick: PropTypes.func, // (dataItem:object) => void
}

export default HeatMap
