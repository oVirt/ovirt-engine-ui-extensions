import {
  Label,
  LabelGroup,
  Title,
} from '@patternfly/react-core'
import { CpuIcon } from '@patternfly/react-icons'
import PropTypes from 'prop-types'
import React from 'react'
import './cpu-topology.css'

const CpuTopologyThread = ({
  cpuId,
  pinnedCpuIds,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  isPinnedCpuValid,
}) => {
  return (
    <div className='cpu-thread'>
      <Title headingLevel="h6" size="md">
        { cpuLabelProvider(cpuId) }
      </Title>
      <div className='cpu-thread-body'>
        <LabelGroup isVertical>
          {pinnedCpuIds.map((pinnedCpuId) => (
            <Label
              key={pinnedCpuId}
              variant='outline'
              color={isPinnedCpuValid(pinnedCpuId) ? 'blue' : 'red'}
              icon={<CpuIcon />}
            >
              { pinnedCpuLabelProvider(pinnedCpuId) }
            </Label>
          ))}
        </LabelGroup>
      </div>
    </div>
  )
}

CpuTopologyThread.propTypes = {
  cpuId: PropTypes.number,
  pinnedCpuIds: PropTypes.array,
  isPinnedCpuValid: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
}

export default CpuTopologyThread
