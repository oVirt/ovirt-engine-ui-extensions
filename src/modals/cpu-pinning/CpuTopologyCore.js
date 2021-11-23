import times from 'lodash/times'
import PropTypes from 'prop-types'
import React from 'react'
import CpuTopologyThread from './CpuTopologyThread'
import {
  Title,
} from '@patternfly/react-core'
import './cpu-topology.css'

const CpuTopologyCore = ({
  coreId,
  startCpuIndex,
  threads,
  cpuIdToPinnedCpuIdsMap,
  coreLabelProvider,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  isPinnedCpuValid,
}) => {
  return (
    <div className='cpu-core'>
      <Title headingLevel="h6" size="md">
        { coreLabelProvider(coreId) }
      </Title>
      <div className='cpu-core-body'>
        {times(threads, (i) => {
          const cpuId = startCpuIndex + i
          const pinnedCpuIds = cpuIdToPinnedCpuIdsMap.get(cpuId) || []
          return (
            <CpuTopologyThread
              key={`cpuId_${cpuId}`}
              cpuId={cpuId}
              pinnedCpuIds={pinnedCpuIds}
              cpuLabelProvider={cpuLabelProvider}
              pinnedCpuLabelProvider={pinnedCpuLabelProvider}
              isPinnedCpuValid={isPinnedCpuValid}
            />
          )
        })}
      </div>
    </div>
  )
}

CpuTopologyCore.propTypes = {
  coreId: PropTypes.number,
  startCpuIndex: PropTypes.number,
  threads: PropTypes.number,
  cpuIdToPinnedCpuIdsMap: PropTypes.instanceOf(Map).isRequired,
  coreLabelProvider: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  isPinnedCpuValid: PropTypes.func,
}

export default CpuTopologyCore
