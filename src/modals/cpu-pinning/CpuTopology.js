import PropTypes from 'prop-types'
import React from 'react'
import { Topology } from './PinnedEntityTopology'
import CpuTopologySocket from './CpuTopologySocket'

const CpuTopology = ({
  topology,
  socketLabelProvider,
  coreLabelProvider,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  isPinnedCpuValid,
  pinnedEntityIcon,
  variant,
}) => {
  return (
    <div>
      {
        topology.toArray().map((socket) => {
          return (
            <CpuTopologySocket
              variant={variant}
              key={`socket_${socket.socketId}`}
              socket={socket}
              socketLabelProvider={socketLabelProvider}
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
  )
}

CpuTopology.propTypes = {
  topology: PropTypes.instanceOf(Topology),
  socketLabelProvider: PropTypes.func,
  coreLabelProvider: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  isPinnedCpuValid: PropTypes.func,
  pinnedEntityIcon: PropTypes.element,
  variant: PropTypes.string,
}

export default CpuTopology
