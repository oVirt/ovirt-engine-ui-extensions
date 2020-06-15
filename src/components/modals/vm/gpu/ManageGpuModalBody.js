import { Bullseye,
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
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core'
import { SearchIcon } from '@patternfly/react-icons'
import PropTypes from 'prop-types'
import React from 'react'
import { msg } from '_/intl-messages'
import GpuTable from './GpuTable'
import './vgpu.css'

const ManageGpuModalBody = ({
  gpus, displayOn, selectedGpus, onDisplayOnChange, onGpuSelectionChange
}) => {
  const [searchText, setSearchText] = React.useState('')

  const onSearchBoxInput = (value) => {
    setSearchText(value)
  }

  const selectedCards = new Set(
    gpus
      .filter((gpu) => selectedGpus.get(gpu.cardName) === undefined ? gpu.selected : selectedGpus.get(gpu.cardName))
      .map((gpu) => gpu.cardName)
  )

  if (gpus.length === 0) {
    return (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={SearchIcon} />
          <Title size='lg'>{msg.vmManageGpuEmptyStateTitle()}</Title>
          <EmptyStateBody>{msg.vmManageGpuEmptyStateBody()}</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    )
  }

  const filteredGpus =
    gpus.filter(gpu => searchText === '' ||
    gpu.cardName.toLowerCase().includes(searchText.toLowerCase()) ||
    gpu.host.toLowerCase().includes(searchText.toLowerCase()))
  return (
    <Stack gutter='sm'>
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
          onChange={onDisplayOnChange}
        />
      </StackItem>
      <StackItem>
        <span className='vgpu-modal-body-label'>
          {msg.vmManageGpuBodySubTitleSelectionsCards()}
        </span>
        { selectedCards.size === 0 &&
          <span className='vgpu-modal-body-label'>
            {msg.vmManageGpuBodySubTitleSelectionsCardsEmpty()}
          </span>
        }
        { selectedCards.size > 0 &&
          <ChipGroup>
            {Array.from(selectedCards).sort().map(selectedCard => (
              <Chip key={selectedCard} onClick={() => onGpuSelectionChange(selectedCard, false)}>
                {selectedCard}
              </Chip>
            ))}
          </ChipGroup>
        }
      </StackItem>
      <StackItem>
        <Toolbar>
          <ToolbarGroup className='vgpu-search-box'>
            <ToolbarItem className='vgpu-search-box'>
              <TextInput
                value={searchText}
                placeholder={msg.vmManageGpuSearchButtonPlaceholder()}
                type='search'
                onChange={onSearchBoxInput}
                aria-label='text input'
                className='vgpu-search-box'
              />
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      </StackItem>
      <StackItem className='vgpu-table-wrapper'>
        <GpuTable
          gpus={filteredGpus}
          selectedGpus={selectedGpus}
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
      cardName: PropTypes.string,
      host: PropTypes.string,
      availableInstances: PropTypes.number,
      maxInstances: PropTypes.number,
      maxResolution: PropTypes.string,
      numberOfHeads: PropTypes.number,
      frameBuffer: PropTypes.string,
      frameRateLimiter: PropTypes.number,
      product: PropTypes.string,
      vendor: PropTypes.string,
      address: PropTypes.string,
      selected: PropTypes.bool
    })),
  displayOn: PropTypes.bool,
  selectedGpus: PropTypes.any,
  onDisplayOnChange: PropTypes.func,
  onGpuSelectionChange: PropTypes.func
}

export default ManageGpuModalBody
