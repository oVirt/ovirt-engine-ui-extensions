import times from 'lodash/times'
import PropTypes from 'prop-types'
import React from 'react'
import CpuTopologySocket from './CpuTopologySocket'

const CpuTopology = ({
  sockets,
  cores,
  threads,
  cpuIdToPinnedCpuIdsMap,
  socketLabelProvider,
  coreLabelProvider,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  isPinnedCpuValid,
}) => {
  return (
    <div>
      {
        times(sockets, (i) => {
          return (
            <CpuTopologySocket
              key={`socket_${i}`}
              socketId={i}
              cores={cores}
              threads={threads}
              cpuIdToPinnedCpuIdsMap={cpuIdToPinnedCpuIdsMap}
              socketLabelProvider={socketLabelProvider}
              coreLabelProvider={coreLabelProvider}
              cpuLabelProvider={cpuLabelProvider}
              pinnedCpuLabelProvider={pinnedCpuLabelProvider}
              isPinnedCpuValid={isPinnedCpuValid}
            />
          )
        })
     }
    </div>
  )
}

CpuTopology.propTypes = {
  sockets: PropTypes.number,
  cores: PropTypes.number,
  threads: PropTypes.number,
  cpuIdToPinnedCpuIdsMap: PropTypes.instanceOf(Map).isRequired,
  socketLabelProvider: PropTypes.func,
  coreLabelProvider: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  isPinnedCpuValid: PropTypes.func,
}

export default CpuTopology
