import React from 'react'
import PropTypes from 'prop-types'
import {
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants
} from '@patternfly/react-core'
import { msg } from '_/intl-messages'
import { handleNonAvailableValue } from './handleNonAvailableValue'

const DataList = ({ children }) => {
  return (
    <TextContent>
      <TextList component={TextListVariants.dl}>
        { children }
      </TextList>
    </TextContent>
  )
}

DataList.propTypes = {
  children: PropTypes.node
}

const DataListItem = ({ label, value }) => {
  return (
    <React.Fragment>
      <TextListItem component={TextListItemVariants.dt}>{ label }</TextListItem>
      <TextListItem component={TextListItemVariants.dd}>{ handleNonAvailableValue(value) }</TextListItem>
    </React.Fragment>
  )
}

DataListItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node
}

const GpuTableRowDetail = ({gpu}) => {
  return (
    <DataList>
      <DataListItem label={msg.vmManageGpuTableVendor()} value={gpu.vendor} />
      <DataListItem label={msg.vmManageGpuTableProduct()} value={gpu.product} />
      <DataListItem label={msg.vmManageGpuTableNumberOfHeads()} value={gpu.numberOfHeads} />
      <DataListItem label={msg.vmManageGpuTableFrameRateLimiter()} value={gpu.frameRateLimiter} />
      <DataListItem label={msg.vmManageGpuTableFrameBuffer()} value={gpu.frameBuffer} />
    </DataList>
  )
}

GpuTableRowDetail.propTypes = {
  gpu: PropTypes.shape({
    id: PropTypes.string,
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
    selected: PropTypes.bool
  })
}

export default GpuTableRowDetail
