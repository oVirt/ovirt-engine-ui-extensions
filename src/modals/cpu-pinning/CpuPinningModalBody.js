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
import CpuPinningPolicy from './CpuPinningPolicy'
import CpuTopology from './CpuTopology'
import { parse } from './cpuPinningParser'

const CpuPinningModalBody = ({ vm, hosts }) => {
  const [selectedHost, setSelectedHost] = useState()

  useEffect(() => {
    if (hosts && hosts[0]) {
      setSelectedHost(hosts[0])
    }
  }, [hosts])

  const handleHostChange = (hostId) => {
    setSelectedHost(hosts.find((host) => host.id === hostId))
  }

  const cpuPinningString = (vm) => {
    // e.g 0#0_1#1-4,^2
    const pinnings = []
    vm.cpuPinnings.forEach((pinning) =>
      pinnings.push(`${pinning.vcpu}#${pinning.cpuSet}`)
    )
    return pinnings.join('_')
  }

  const cpuPinningMapping = () => {
    const mapping = new Map()
    vm.cpuPinnings.forEach((cpuPinning) => {
      const [vcpu, pcpus] = parse(cpuPinning)
      mapping.set(vcpu, [...pcpus])
    })
    return mapping
  }

  const isPinnedCpuValid = (id) => {
    return !selectedHost || (selectedHost.cpus > id)
  }

  const cpuIdToPinnedCpuIdsMap = cpuPinningMapping()
  const allPinnedCpusValid = Array.from(cpuIdToPinnedCpuIdsMap.values()).flat().every(cpu => isPinnedCpuValid(cpu))

  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>
          {msg.cpuPinningModalVmPinningPolicyField()}
        </DescriptionListTerm>
        <DescriptionListDescription>
          {CpuPinningPolicy[vm.cpuPinningPolicy]}
        </DescriptionListDescription>
      </DescriptionListGroup>

      <DescriptionListGroup>
        <DescriptionListTerm>
          {msg.cpuPinningModalVmPinningField()}
        </DescriptionListTerm>
        <DescriptionListDescription>
          {cpuPinningString(vm) || msg.cpuPinningModalVmPinningFieldPlaceholder()}
        </DescriptionListDescription>
      </DescriptionListGroup>
      {
        CpuPinningPolicy.isManual(vm.cpuPinningPolicy) && (
          <DescriptionListGroup>
            <DescriptionListTerm>
              {msg.cpuPinningModalHostField()}
            </DescriptionListTerm>
            <DescriptionListDescription>
              <FormSelect
                id='cpu-pinning-host-field'
                value={selectedHost?.id}
                onChange={handleHostChange}
              >
                {hosts.map((host, index) => (
                  <FormSelectOption
                    key={index}
                    value={host.id}
                    label={host.name}
                  />
                ))}
              </FormSelect>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )
      }
      {
        CpuPinningPolicy.isDynamic(vm.cpuPinningPolicy) && (
          <DescriptionListGroup>
            <DescriptionListTerm>
              {msg.cpuPinningModalRunsOnHostField()}
            </DescriptionListTerm>
            <DescriptionListDescription>
              {
                selectedHost || msg.cpuPinningModalRunsOnHostFieldPlaceholder()
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
            !vm.cpuTopology.sockets && msg.cpuPinningModalEmptyState()
          }
          {
            vm.cpuTopology.sockets && (
              <div className='cpu-pinning-body'>
                <CpuTopology
                  sockets={vm.cpuTopology.sockets}
                  cores={vm.cpuTopology.cores}
                  threads={vm.cpuTopology.threads}
                  cpuIdToPinnedCpuIdsMap={cpuIdToPinnedCpuIdsMap}
                  socketLabelProvider={(id) => `${msg.cpuTopologySocket()} ${id}`}
                  coreLabelProvider={(id) => `${msg.cpuTopologyCore()} ${id}`}
                  cpuLabelProvider={(id) => `${msg.cpuPinningModalCpuId()} ${id}`}
                  pinnedCpuLabelProvider={(id) => `${msg.cpuPinningModalPinnedCpu()} ${id}`}
                  isPinnedCpuValid={isPinnedCpuValid}
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
  vm: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    cpuTopology: PropTypes.shape({
      sockets: PropTypes.number,
      cores: PropTypes.number,
      threads: PropTypes.number,
    }),
    cpuPinningPolicy: PropTypes.string,
    cpuPinnings: PropTypes.arrayOf(
      PropTypes.shape({
        vcpu: PropTypes.string,
        cpuSet: PropTypes.string,
      })
    ),
  }),
  hosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      cpus: PropTypes.number,
    })
  ),
}

export default CpuPinningModalBody
