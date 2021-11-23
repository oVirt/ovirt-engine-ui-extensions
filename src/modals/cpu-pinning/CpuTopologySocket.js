import times from 'lodash/times'
import CpuTopologyCore from './CpuTopologyCore'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Title,
} from '@patternfly/react-core'
import './cpu-topology.css'

const CpuTopologySocket = ({
  socketId,
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
    <div className='cpu-socket'>
      <Title headingLevel="h6" size="md">
        { socketLabelProvider(socketId) }
      </Title>
      {
        times(cores, (i) => {
          const coreId = socketId * cores + i
          const startCpuIndex = socketId * cores * threads + i * threads
          return (
            <CpuTopologyCore
              key={`core_${coreId}`}
              coreId={coreId}
              threads={threads}
              startCpuIndex={startCpuIndex}
              cpuIdToPinnedCpuIdsMap={cpuIdToPinnedCpuIdsMap}
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

CpuTopologySocket.propTypes = {
  socketId: PropTypes.number,
  cores: PropTypes.number,
  threads: PropTypes.number,
  cpuIdToPinnedCpuIdsMap: PropTypes.instanceOf(Map).isRequired,
  socketLabelProvider: PropTypes.func,
  coreLabelProvider: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  isPinnedCpuValid: PropTypes.func,
}

export default CpuTopologySocket
