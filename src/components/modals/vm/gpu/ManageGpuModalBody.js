import {
  Bullseye,
  Chip,
  ChipGroup,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Stack,
  StackItem,
  Switch,
  TextInput,
  Title,
} from '@patternfly/react-core'
import { SearchIcon } from '@patternfly/react-icons'
import PropTypes from 'prop-types'
import React from 'react'
import { msg } from '_/intl-messages'
import GpuTable from './GpuTable'
import './vgpu.css'

const ManageGpuModalBody = ({
  gpus, displayOn, selectedMDevTypes, onDisplayOnChange, onGpuSelectionChange,
}) => {
  const [searchText, setSearchText] = React.useState('')

  const onSearchBoxInput = (value) => {
    setSearchText(value)
  }

  if (gpus.length === 0) {
    return (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel='h5' size='lg'>{msg.vmManageGpuEmptyStateTitle()}</Title>
          <EmptyStateBody>{msg.vmManageGpuEmptyStateBody()}</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    )
  }

  const selectedMDevType = Object.keys(selectedMDevTypes).find(mDevType => selectedMDevTypes[mDevType] > 0)

  const selectedMDevTypeInstances = []
  if (selectedMDevType) {
    for (let i = 0; i < selectedMDevTypes[selectedMDevType]; i++) {
      selectedMDevTypeInstances.push(`${selectedMDevType}_${i}`)
    }
  }

  const filteredGpus =
    gpus.filter(gpu => searchText === '' ||
    gpu.mDevType.toLowerCase().includes(searchText.toLowerCase()) ||
    gpu.host.toLowerCase().includes(searchText.toLowerCase()))

  return (
    <Stack hasGutter>
      <StackItem>
        <span className='vgpu-modal-description'>
          {msg.vmManageGpuBodyDescription()}
        </span>
      </StackItem>
      <StackItem>
        <span className='vgpu-modal-body-label'>
          {msg.vmManageGpuBodyDisplaySwitchLabel()}
        </span>
        <Switch
          id='vgpu-display-on-switch'
          label={msg.vmManageGpuBodyDisplaySwitchOn()}
          labelOff={msg.vmManageGpuBodyDisplaySwitchOff()}
          isChecked={displayOn}
          onChange={value => onDisplayOnChange(value)}
        />
      </StackItem>
      <StackItem>
        <span className='vgpu-modal-body-label'>
          {msg.vmManageGpuBodySubTitleSelectionsCards()}
        </span>
        { !selectedMDevType && (
          <span className='vgpu-modal-body-label'>
            {msg.vmManageGpuBodySubTitleSelectionsCardsEmpty()}
          </span>
        )}
        { selectedMDevType && (
          <ChipGroup>
            {selectedMDevTypeInstances.map(selectedMDevTypeInstance => (
              <Chip key={selectedMDevTypeInstance} onClick={() => onGpuSelectionChange(selectedMDevType, selectedMDevTypes[selectedMDevType] - 1)}>
                {selectedMDevType}
              </Chip>
            ))}
          </ChipGroup>
        )}
      </StackItem>
      <StackItem>
        <TextInput
          value={searchText}
          placeholder={msg.vmManageGpuSearchButtonPlaceholder()}
          type='search'
          onChange={value => onSearchBoxInput(value)}
          aria-label='text input'
          className='vgpu-search-box'
        />
      </StackItem>
      <StackItem className='vgpu-table-wrapper'>
        <GpuTable
          gpus={filteredGpus}
          selectedMDevTypes={selectedMDevTypes}
          onGpuSelectionChange={onGpuSelectionChange}
          className='vgpu-body-element'
        />
      </StackItem>
    </Stack>
  )
}

ManageGpuModalBody.propTypes = {
  gpus: PropTypes.arrayOf(
    PropTypes.shape({
      mDevType: PropTypes.string,
      name: PropTypes.string,
      host: PropTypes.string,
      availableInstances: PropTypes.number,
      requestedInstances: PropTypes.number,
      maxInstances: PropTypes.number,
      aggregatedMaxInstances: PropTypes.number,
      maxResolution: PropTypes.string,
      numberOfHeads: PropTypes.number,
      frameBuffer: PropTypes.string,
      frameRateLimiter: PropTypes.number,
      product: PropTypes.string,
      vendor: PropTypes.string,
      address: PropTypes.string,
    })),
  displayOn: PropTypes.bool,
  selectedMDevTypes: PropTypes.any,
  onDisplayOnChange: PropTypes.func,
  onGpuSelectionChange: PropTypes.func,
}

export default ManageGpuModalBody
