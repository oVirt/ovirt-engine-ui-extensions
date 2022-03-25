import {
  Alert,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { msg } from '_/intl-messages'
import * as CpuPinningPolicy from './CpuPinningPolicy'
import CpuTopology from './CpuTopology'
import PinnedEntity from './PinnedEntity'

const CpuPinningModalBody = ({
  mainEntity,
  pinnedEntities,
  socketLabelProvider,
  coreLabelProvider,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  pinnedEntityIcon,
  cpuTopologyDescription,
  variant,
}) => {
  const [selectedPinnedEntity, setSelectedPinnedEntity] = useState()

  useEffect(() => {
    if (pinnedEntities && pinnedEntities[0]) {
      setSelectedPinnedEntity(pinnedEntities[0])
    }
  }, [pinnedEntities])

  const handlePinnedEntityChange = (id) => {
    setSelectedPinnedEntity(pinnedEntities.find((pinned) => pinned.id === id))
  }

  const isPinnedCpuValid = (id) => {
    return !selectedPinnedEntity || (selectedPinnedEntity.cpuCount > id)
  }

  const validateAllCpus = () => {
    if (CpuPinningPolicy.isManual(mainEntity.cpuPinningPolicy)) {
      for (const socket of mainEntity.cpuPinningTopology.sockets.values()) {
        for (const core of socket.cores.values()) {
          for (const cpu of core.cpus.values()) {
            if (!isPinnedCpuValid(cpu.cpuId)) {
              return false
            }
          }
        }
      }
    }
    return true
  }

  const cpuPinningPolicyLabel = (policy) => {
    if (CpuPinningPolicy.isNone(policy)) {
      return msg.cpuPinningModalVmPinningPolicyFieldNone()
    }
    if (CpuPinningPolicy.isManual(policy)) {
      return msg.cpuPinningModalVmPinningPolicyFieldManual()
    }
    if (CpuPinningPolicy.isResizeAndPinNuma(policy)) {
      return msg.cpuPinningModalVmPinningPolicyFieldResizeAndPin()
    }
    if (CpuPinningPolicy.isDedicated(policy)) {
      return msg.cpuPinningModalVmPinningPolicyFieldDedicated()
    }
    return ''
  }

  const allPinnedCpusValid = validateAllCpus()

  return (
    <DescriptionList>
      {
        mainEntity.cpuPinningPolicy && (
          <DescriptionListGroup>
            <DescriptionListTerm>
              {msg.cpuPinningModalVmPinningPolicyField()}
            </DescriptionListTerm>
            <DescriptionListDescription>
              {cpuPinningPolicyLabel(mainEntity.cpuPinningPolicy)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )
      }
      {
        mainEntity.cpuPinningString !== undefined && (
          <DescriptionListGroup>
            <DescriptionListTerm>
              {msg.cpuPinningModalVmPinningField()}
            </DescriptionListTerm>
            <DescriptionListDescription>
              {mainEntity.cpuPinningString || msg.cpuPinningModalVmPinningFieldPlaceholder()}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )
      }
      {
        CpuPinningPolicy.isManual(mainEntity.cpuPinningPolicy) && (
          <DescriptionListGroup>
            <DescriptionListTerm>
              {msg.cpuPinningModalHostField()}
            </DescriptionListTerm>
            <DescriptionListDescription>
              <FormSelect
                id='cpu-pinned-entity-field'
                value={selectedPinnedEntity?.id}
                onChange={handlePinnedEntityChange}
              >
                {pinnedEntities.map((pinned, index) => (
                  <FormSelectOption
                    key={index}
                    value={pinned.id}
                    label={pinned.name}
                  />
                ))}
              </FormSelect>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )
      }
      {
        CpuPinningPolicy.isDynamic(mainEntity.cpuPinningPolicy) && (
          <DescriptionListGroup>
            <DescriptionListTerm>
              {msg.cpuPinningModalRunsOnHostField()}
            </DescriptionListTerm>
            <DescriptionListDescription>
              {
                selectedPinnedEntity?.name || msg.cpuPinningModalRunsOnHostFieldPlaceholder()
              }
            </DescriptionListDescription>
          </DescriptionListGroup>
        )
      }
      <DescriptionListGroup>
        <DescriptionListTerm>
          {msg.cpuTopology()}
        </DescriptionListTerm>
        <DescriptionListDescription>
          {!allPinnedCpusValid && (
            <Alert variant='danger' isInline title={msg.cpuPinningModalAlertInvalidPinningTitle()}>
              {msg.cpuPinningModalAlertInvalidPinningText()}
            </Alert>
          )
          }
          {
            !mainEntity.cpuPinningTopology.numberOfSockets() && msg.cpuPinningModalEmptyState()
          }
          {
            mainEntity.cpuPinningTopology.numberOfSockets() && (
              <div className='cpu-pinning-body'>
                <div className='cpu-pinning-body-description'>{cpuTopologyDescription}</div>
                <CpuTopology
                  variant={variant}
                  topology={mainEntity.cpuPinningTopology}
                  socketLabelProvider={socketLabelProvider}
                  coreLabelProvider={coreLabelProvider}
                  cpuLabelProvider={cpuLabelProvider}
                  pinnedCpuLabelProvider={pinnedCpuLabelProvider}
                  isPinnedCpuValid={isPinnedCpuValid}
                  pinnedEntityIcon={pinnedEntityIcon}
                />
              </div>
            )
          }
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  )
}

CpuPinningModalBody.propTypes = {
  mainEntity: PropTypes.instanceOf(PinnedEntity),
  pinnedEntities: PropTypes.arrayOf(
    PropTypes.instanceOf(PinnedEntity)
  ),
  socketLabelProvider: PropTypes.func,
  coreLabelProvider: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  cpuTopologyDescription: PropTypes.string,
  pinnedEntityIcon: PropTypes.element,
  variant: PropTypes.string,
}

export default CpuPinningModalBody
