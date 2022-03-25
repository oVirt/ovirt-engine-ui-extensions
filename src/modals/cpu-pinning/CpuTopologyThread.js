import {
  Label,
  LabelGroup,
  Title,
} from '@patternfly/react-core'
import PropTypes from 'prop-types'
import React from 'react'
import { msg } from '_/intl-messages'
import './cpu-topology.css'
import { Thread } from './PinnedEntityTopology'

const CpuTopologyThread = ({
  thread,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  isPinnedCpuValid,
  pinnedEntityIcon,
  variant,
}) => {
  const exclusivelyPinnedClassName = thread.exclusivelyPinned ? 'cpu-thread-exclusively-pinned' : ''
  const labelVariant = thread.exclusivelyPinned ? 'filled' : 'outline'

  return (
    <div className={`cpu-thread cpu-thread-variant-${variant} ${exclusivelyPinnedClassName}`}>
      <Title headingLevel="h6" size="md" className='cpu-thread-header'>
        { cpuLabelProvider(thread.cpuId) }
      </Title>
      {
        thread.exclusivelyPinned && (
          <div className='cpu-thread-header-hint'> {`(${msg.cpuPinningModalExclusivePinning()})`} </div>
        )
      }
      <div className='cpu-thread-body'>
        <LabelGroup isVertical>
          {thread.pinnedEntities.map((pinnedEntity) => (
            <Label
              key={pinnedEntity}
              variant={labelVariant}
              color={isPinnedCpuValid(pinnedEntity) ? 'blue' : 'red'}
              icon={pinnedEntityIcon}
            >
              <div className='cpu-thread-body-label' >
                { pinnedCpuLabelProvider(pinnedEntity) }
              </div>
            </Label>
          ))}
        </LabelGroup>
      </div>
    </div>
  )
}

CpuTopologyThread.propTypes = {
  thread: PropTypes.instanceOf(Thread),
  isPinnedCpuValid: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  pinnedEntityIcon: PropTypes.element,
  variant: PropTypes.string,
}

export default CpuTopologyThread
