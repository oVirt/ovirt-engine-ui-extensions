import {
  Bullseye,
  Chip,
  ChipGroup,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Switch,
  TextInput,
  Title,
} from '@patternfly/react-core'
import { SearchIcon } from '@patternfly/react-icons'
import PropTypes from 'prop-types'
import React from 'react'
import { msg } from '_/intl-messages'
import CompatibilityVersion from '_/utils/CompatibilityVersion'
import GpuTable from './GpuTable'
import './vgpu.css'

const ManageGpuModalBody = ({
  gpus,
  displayOn,
  driverParams,
  compatibilityVersion,
  selectedMDevTypes,
  onDisplayOnChange,
  onDriverParamsChange,
  onGpuSelectionChange,
}) => {
  const [searchText, setSearchText] = React.useState('')

  const onSearchBoxInput = (value) => {
    setSearchText(value)
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

  const driverParamsEnabled = compatibilityVersion >= CompatibilityVersion.VERSION_4_7
  const gpusAvailable = gpus.length > 0

  return (
    <div>
      <span className='vgpu-modal-description'>
        {msg.vmManageGpuBodyDescription()}
      </span>
      <DescriptionList isHorizontal className='vgpu-description-list'>
        <DescriptionListGroup>
          <DescriptionListTerm className='vgpu-description-list-term'>
            {msg.vmManageGpuBodyDisplaySwitchLabel()}
          </DescriptionListTerm>
          <DescriptionListDescription className='vgpu-description-list-description'>
            <Switch
              id='vgpu-display-on-switch'
              label={msg.vmManageGpuBodyDisplaySwitchOn()}
              labelOff={msg.vmManageGpuBodyDisplaySwitchOff()}
              isChecked={displayOn}
              onChange={value => onDisplayOnChange(value)}
              isDisabled={!gpusAvailable}
            />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm className='vgpu-description-list-term'>
            {msg.vmManageGpuBodyDriverParams()}
          </DescriptionListTerm>
          <DescriptionListDescription className='vgpu-description-list-description'>
            <TextInput
              value={driverParams || ''}
              type='text'
              isDisabled={!driverParamsEnabled || !gpusAvailable}
              onChange={onDriverParamsChange}
              aria-label='text input'
            />
            {!driverParamsEnabled && (
              <div>
                {msg.vmManageGpuBodyDriverParamsHelperText()}
              </div>
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm className='vgpu-description-list-term'>
            {msg.vmManageGpuBodySubTitleSelectionsCards()}
          </DescriptionListTerm>
          <DescriptionListDescription className='vgpu-description-list-description'>
            {!selectedMDevType && (
              <span className='vgpu-modal-body-label'>
                {msg.vmManageGpuBodySubTitleSelectionsCardsEmpty()}
              </span>
            )}
            {selectedMDevType && (
              <ChipGroup>
                {selectedMDevTypeInstances.map(selectedMDevTypeInstance => (
                  <Chip key={selectedMDevTypeInstance} onClick={() => onGpuSelectionChange(selectedMDevType, selectedMDevTypes[selectedMDevType] - 1)}>
                    {selectedMDevType}
                  </Chip>
                ))}
              </ChipGroup>
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
        </DescriptionList>

      {
        !gpusAvailable && (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.large}>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel='h5' size='lg'>{msg.vmManageGpuEmptyStateTitle()}</Title>
              <EmptyStateBody>{msg.vmManageGpuEmptyStateBody()}</EmptyStateBody>
            </EmptyState>
          </Bullseye>
        )
      }
      {
        gpusAvailable && (
          <div>
            <TextInput
              value={searchText}
              placeholder={msg.vmManageGpuSearchButtonPlaceholder()}
              type='search'
              onChange={value => onSearchBoxInput(value)}
              aria-label='text input'
              className='vgpu-search-box'
            />
            <div className='.vgpu-table-wrapper'>
              <GpuTable
                gpus={filteredGpus}
                selectedMDevTypes={selectedMDevTypes}
                onGpuSelectionChange={onGpuSelectionChange}
                className='vgpu-body-element'
              />
            </div>
          </div>
        )
      }
    </div>
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
  driverParams: PropTypes.string,
  compatibilityVersion: PropTypes.instanceOf(CompatibilityVersion),
  selectedMDevTypes: PropTypes.any,
  onDisplayOnChange: PropTypes.func,
  onDriverParamsChange: PropTypes.func,
  onGpuSelectionChange: PropTypes.func,
}

export default ManageGpuModalBody
