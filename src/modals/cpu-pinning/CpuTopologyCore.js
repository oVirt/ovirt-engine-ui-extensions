import PropTypes from 'prop-types'
import React from 'react'
import CpuTopologyThread from './CpuTopologyThread'
import {
  Title,
} from '@patternfly/react-core'
import './cpu-topology.css'
import { Core } from './PinnedEntityTopology'

const CpuTopologyCore = ({
  core,
  coreLabelProvider,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  isPinnedCpuValid,
  pinnedEntityIcon,
  variant,
}) => {
  return (
    <div className={`cpu-core cpu-core-variant-${variant}`}>
      <Title headingLevel="h6" size="md">
        { coreLabelProvider(core.coreId) }
      </Title>
      <div className={`cpu-core-body cpu-core-body-variant-${variant}`}>
        {core.toArray().map((thread) => {
          return (
            <CpuTopologyThread
              variant={variant}
              key={`cpuId_${thread.cpuId}`}
              thread={thread}
              cpuLabelProvider={cpuLabelProvider}
              pinnedCpuLabelProvider={pinnedCpuLabelProvider}
              isPinnedCpuValid={isPinnedCpuValid}
              pinnedEntityIcon={pinnedEntityIcon}
            />
          )
        })}
      </div>
    </div>
  )
}

CpuTopologyCore.propTypes = {
  core: PropTypes.instanceOf(Core),
  coreLabelProvider: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  isPinnedCpuValid: PropTypes.func,
  pinnedEntityIcon: PropTypes.element,
  variant: PropTypes.string,
}

export default CpuTopologyCore
