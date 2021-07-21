import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import PluginApiModal from '_/components/modals/PluginApiModal'
import { Spinner } from 'patternfly-react'
import { Button } from '@patternfly/react-core'
import ManageGpuModalBody from './ManageGpuModalBody'

function gpuArrayToSelectedMap (gpus) {
  const mdevTypesToRequestedInstances = {}
  let selectedMDevTypeAlreadyFound = false
  for (const gpu of gpus) {
    if (!(gpu.mDevType in mdevTypesToRequestedInstances)) {
      if (selectedMDevTypeAlreadyFound) {
        mdevTypesToRequestedInstances[gpu.mDevType] = 0
      } else {
        selectedMDevTypeAlreadyFound = !!gpu.requestedInstances
        mdevTypesToRequestedInstances[gpu.mDevType] = Math.min(gpu.requestedInstances, gpu.maxInstances)
      }
    }
  }
  return mdevTypesToRequestedInstances
}

const ManageGpuModal = ({
  isLoading = false,
  gpus = [],
  displayOn = true,
  onSelectButtonClick = () => {},
  onClose = () => {},
}) => {
  const [isOpen, setOpen] = useState(true)
  const [displayOn_, setDisplayOn_] = useState(undefined)
  const [selectedMDevTypes, setSelectedMDevTypes] = useState(gpuArrayToSelectedMap(gpus))

  useEffect(() => {
    setSelectedMDevTypes(gpuArrayToSelectedMap(gpus))
  }, [gpus])

  const close = () => {
    setOpen(false)
    onClose()
  }

  const onDisplayOnChange = (isSelected) => {
    setDisplayOn_(isSelected)
  }

  const onGpuSelectionChange = (mDevType, requestedInstances) => {
    const tmpSelectedMDevTypes = {}
    for (const selectedMDevType in selectedMDevTypes) {
      tmpSelectedMDevTypes[selectedMDevType] = 0
    }
    tmpSelectedMDevTypes[mDevType] = requestedInstances
    setSelectedMDevTypes(tmpSelectedMDevTypes)
  }

  const onSelect = () => {
    gpus.forEach(gpu => {
      if (gpu.mDevType in selectedMDevTypes) {
        gpu.requestedInstances = selectedMDevTypes[gpu.mDevType]
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
        </Button>,
      ]}
    >
      <Spinner loading={isLoading}>
        <ManageGpuModalBody
          gpus={gpus}
          displayOn={displayOn_ === undefined ? displayOn : displayOn_}
          selectedMDevTypes={selectedMDevTypes}
          onDisplayOnChange={onDisplayOnChange}
          onGpuSelectionChange={onGpuSelectionChange}
        />
      </Spinner>
    </PluginApiModal>
  )
}

ManageGpuModal.propTypes = {
  isLoading: PropTypes.bool,
  gpus: PropTypes.arrayOf(
    PropTypes.shape({
      mDevType: PropTypes.string,
      name: PropTypes.string,
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
      address: PropTypes.string,
    })),
  displayOn: PropTypes.bool,

  onSelectButtonClick: PropTypes.func,
  onClose: PropTypes.func,
}

export default ManageGpuModal
