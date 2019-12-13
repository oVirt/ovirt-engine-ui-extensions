import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant
} from '@patternfly/react-table'
import { msg } from '_/intl-messages'
import { handleNonAvailableValue } from './handleNonAvailableValue'

const cellWidth = (width) => () => ({
  width: width
})

const columns = [
  msg.vmManageGpuTableHostName(),
  { title: msg.vmManageGpuTableVendor(), transforms: [cellWidth(160)] },
  { title: msg.vmManageGpuTableProduct(), transforms: [cellWidth(180)] },
  { title: msg.vmManageGpuTableAddress(), transforms: [cellWidth(180)] },
  { title: msg.vmManageGpuTableAvailableInstances(), transforms: [cellWidth(120)] }
]

const createRows = (gpus) => {
  return gpus.map((gpu) => {
    return {
      cells: [
        gpu.host,
        handleNonAvailableValue(gpu.vendor),
        handleNonAvailableValue(gpu.product),
        handleNonAvailableValue(gpu.address),
        handleNonAvailableValue(gpu.availableInstances)
      ]
    }
  })
}

const GpuTableRowDetail = ({gpus}) => {
  return (
    <Table
      aria-label='Simple Table'
      variant={TableVariant.compact}
      cells={columns}
      rows={createRows(gpus)}
      className={'vgpu-detail-table'}
    >
      <TableHeader />
      <TableBody />
    </Table>
  )
}

GpuTableRowDetail.propTypes = {
  gpus: PropTypes.arrayOf(
    PropTypes.shape({
      cardName: PropTypes.string,
      host: PropTypes.string,
      availableInstances: PropTypes.number,
      maxInstances: PropTypes.number,
      maxResolution: PropTypes.string,
      numberOfHeads: PropTypes.number,
      frameBuffer: PropTypes.string,
      frameRateLimiter: PropTypes.number,
      product: PropTypes.string,
      vendor: PropTypes.string,
      address: PropTypes.string,
      selected: PropTypes.bool
    }))
}

export default GpuTableRowDetail
