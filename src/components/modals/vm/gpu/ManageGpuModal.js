import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import PluginApiModal from '_/components/modals/PluginApiModal'
import { Spinner } from 'patternfly-react'
import { Button } from '@patternfly/react-core'
import ManageGpuModalBody from './ManageGpuModalBody'

function gpuArrayToSelectedMap (gpus) {
  const selectedGpus = {}
  let selectedGpuAlreadyFound = false
  for (const gpu of gpus) {
    if (!(gpu.cardName in selectedGpus)) {
      if (selectedGpuAlreadyFound) {
        selectedGpus[gpu.cardName] = 0
      } else {
        selectedGpuAlreadyFound = !!gpu.requestedInstances
        selectedGpus[gpu.cardName] = Math.min(gpu.requestedInstances, gpu.maxInstances)
      }
    }
  }
  return selectedGpus
}

const ManageGpuModal = ({
  isLoading = false,
  vmName,
  gpus = [],
  displayOn = true,
  onSelectButtonClick = () => {},
  onClose = () => {}
}) => {
  const [ isOpen, setOpen ] = useState(true)
  const [ displayOn_, setDisplayOn_ ] = useState(undefined)
  const [ selectedGpus, setSelectedGpus ] = useState(gpuArrayToSelectedMap(gpus))

  useEffect(() => {
    setSelectedGpus(gpuArrayToSelectedMap(gpus))
  }, [ gpus ])

  const close = () => {
    setOpen(false)
    onClose()
  }

  const onDisplayOnChange = (isSelected) => {
    setDisplayOn_(isSelected)
  }

  const onGpuSelectionChange = (cardName, requestedInstances) => {
    const tmpSelectedGpus = {}
    for (const selectedGpu in selectedGpus) {
      tmpSelectedGpus[selectedGpu] = 0
    }
    tmpSelectedGpus[cardName] = requestedInstances
    setSelectedGpus(tmpSelectedGpus)
  }

  const onSelect = () => {
    gpus.forEach(gpu => {
      if (gpu.cardName in selectedGpus) {
        gpu.requestedInstances = selectedGpus[gpu.cardName]
      }
    })

    const allSelectedGpus = gpus.filter(gpu => gpu.requestedInstances > 0)
    const d = displayOn_ === undefined ? displayOn : displayOn_

    onSelectButtonClick(d, allSelectedGpus)
    close()
  }

  return (
    <PluginApiModal
      className='vgpu-modal'
      variant='large'
      title={msg.vmManageGpuDialogTitle()}
      isOpen={isOpen}
      onClose={close}
      actions={[
        <Button
          key='manage-gpu-select-button'
          variant='primary'
          onClick={onSelect}
          isDisabled={gpus.length === 0}
        >
          {msg.saveButton()}
        </Button>,
        <Button
          key='manage-gpu-cancel-button'
          variant='link'
          onClick={close}
        >
          {msg.cancelButton()}
        </Button>
      ]}
    >
      <Spinner loading={isLoading}>
        <ManageGpuModalBody
          gpus={gpus}
          displayOn={displayOn_ === undefined ? displayOn : displayOn_}
          selectedGpus={selectedGpus}
          onDisplayOnChange={onDisplayOnChange}
          onGpuSelectionChange={onGpuSelectionChange}
        />
      </Spinner>
    </PluginApiModal>
  )
}

ManageGpuModal.propTypes = {
  isLoading: PropTypes.bool,
  vmName: PropTypes.string,
  gpus: PropTypes.arrayOf(
    PropTypes.shape({
      cardName: PropTypes.string,
      host: PropTypes.string,
      availableInstances: PropTypes.number,
      requestedInstances: PropTypes.number,
      maxInstances: PropTypes.number,
      maxResolution: PropTypes.string,
      numberOfHeads: PropTypes.number,
      frameBuffer: PropTypes.string,
      frameRateLimiter: PropTypes.number,
      product: PropTypes.string,
      vendor: PropTypes.string,
      address: PropTypes.string
    })),
  displayOn: PropTypes.bool,

  onSelectButtonClick: PropTypes.func,
  onClose: PropTypes.func
}

export default ManageGpuModal
