import CpuTopologyCore from './CpuTopologyCore'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Title,
} from '@patternfly/react-core'
import './cpu-topology.css'
import { Socket } from './PinnedEntityTopology'

const CpuTopologySocket = ({
  socket,
  socketLabelProvider,
  coreLabelProvider,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  isPinnedCpuValid,
  pinnedEntityIcon,
  variant,
}) => {
  return (
    <div className='cpu-socket'>
      <Title headingLevel="h6" size="md">
        { socketLabelProvider(socket.socketId) }
      </Title>
      <div className='cpu-socket-body'>
        {
          socket.toArray().map((core) => {
            return (
              <CpuTopologyCore
                variant={variant}
                key={`core_${core.coreId}`}
                core={core}
                coreLabelProvider={coreLabelProvider}
                cpuLabelProvider={cpuLabelProvider}
                pinnedCpuLabelProvider={pinnedCpuLabelProvider}
                isPinnedCpuValid={isPinnedCpuValid}
                pinnedEntityIcon={pinnedEntityIcon}
              />
            )
          })
        }
      </div>
    </div>
  )
}

CpuTopologySocket.propTypes = {
  socket: PropTypes.instanceOf(Socket),
  socketLabelProvider: PropTypes.func,
  coreLabelProvider: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  isPinnedCpuValid: PropTypes.func,
  pinnedEntityIcon: PropTypes.element,
  variant: PropTypes.string,
}

export default CpuTopologySocket
