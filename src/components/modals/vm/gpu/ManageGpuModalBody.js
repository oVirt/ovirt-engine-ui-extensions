import React from 'react'
import PropTypes from 'prop-types'
import {
  Title,
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
  TextContent,
  TextInput,
  TextVariants,
  Text,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core'
import { SearchIcon } from '@patternfly/react-icons'
import { msg } from '_/intl-messages'
import GpuTable from './GpuTable'
import './vgpu.css'

const ManageGpuModalBody = ({
  gpus, selectedGpus, onGpuSelectionChange
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
    <React.Fragment>
      <TextContent>
        <Text
          component={TextVariants.small}
        >
          {msg.vmManageGpuBodyDescription()}
        </Text>
      </TextContent>
      <Toolbar>
        <ToolbarGroup className='vgpu-search-box'>
          <ToolbarItem className='vgpu-search-box'>
            <TextInput
              value={searchText}
              placeholder={msg.vmManageGpuSearchButtonPlaceholder()}
              type='search'
              onChange={onSearchBoxInput}
              aria-label='text input'
              className='vgpu-body-element vgpu-search-box'
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      <GpuTable
        gpus={filteredGpus}
        selectedGpus={selectedGpus}
        onGpuSelectionChange={onGpuSelectionChange}
        className='vgpu-body-element'
      />
    </React.Fragment>
  )
}

ManageGpuModalBody.propTypes = {
  gpus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
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
      selected: PropTypes.bool
    })),
  selectedGpus: PropTypes.any,
  onGpuSelectionChange: PropTypes.func
}

export default ManageGpuModalBody
