import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import { Alert, Button } from '@patternfly/react-core'
import PluginApiModal from '_/components/modals/PluginApiModal'
import LoadingSpinner from '_/components/helper/LoadingSpinner'
import CompatibilityVersion from '_/utils/CompatibilityVersion'
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
        mdevTypesToRequestedInstances[gpu.mDevType] = Math.min(gpu.requestedInstances, gpu.aggregatedMaxInstances || Number.POSITIVE_INFINITY)
      }
    }
  }
  return mdevTypesToRequestedInstances
}

const ManageGpuModal = ({
  isLoading = false,
  gpus = [],
  displayOn: initialDisplayOn = true,
  driverParams: initialDriverParams,
  compatibilityVersion,
  nonExistingSelectedMdevs,
  noDisplayConsistent,
  driverParamsConsistent,
  onSelectButtonClick = () => {},
  onClose = () => {},
}) => {
  const [isOpen, setOpen] = useState(true)
  const [displayOn, setDisplayOn] = useState(undefined)
  const [driverParams, setDriverParams] = useState(undefined)
  const [selectedMDevTypes, setSelectedMDevTypes] = useState(gpuArrayToSelectedMap(gpus))

  useEffect(() => {
    setSelectedMDevTypes(gpuArrayToSelectedMap(gpus))
  }, [gpus])

  const close = () => {
    setOpen(false)
    onClose()
  }

  const onDisplayOnChange = (isSelected) => {
    setDisplayOn(isSelected)
  }

  const onDriverParamsChange = (params) => {
    setDriverParams(params)
  }

  const onGpuSelectionChange = (mDevType, requestedInstances) => {
    const tmpSelectedMDevTypes = {}
    for (const selectedMDevType in selectedMDevTypes) {
      tmpSelectedMDevTypes[selectedMDevType] = 0
    }
    tmpSelectedMDevTypes[mDevType] = requestedInstances
    setSelectedMDevTypes(tmpSelectedMDevTypes)
  }

  const getDriverParams = () => {
    if (compatibilityVersion >= CompatibilityVersion.VERSION_4_7) {
      return driverParams === undefined ? initialDriverParams : driverParams
    }
    return undefined
  }

  const onSelect = () => {
    gpus.forEach(gpu => {
      if (gpu.mDevType in selectedMDevTypes) {
        gpu.requestedInstances = selectedMDevTypes[gpu.mDevType]
      }
    })

    const allSelectedGpus = gpus.filter(gpu => gpu.requestedInstances > 0)
    const d = displayOn === undefined ? initialDisplayOn : displayOn
    onSelectButtonClick(d, getDriverParams(), allSelectedGpus)
    close()
  }

  return (
    <PluginApiModal
      id='vm-manage-gpu-modal'
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
          isDisabled={gpus.length === 0 && !nonExistingSelectedMdevs?.length}
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
      <LoadingSpinner isLoading={isLoading}>
        <>
          {
            nonExistingSelectedMdevs && nonExistingSelectedMdevs.length > 0 && (
              <Alert variant='warning' isInline title={msg.vmManageGpuDialogMissingMDevWarningTitle()}>
                {msg.vmManageGpuDialogMissingMDevWarning({ mdevs: nonExistingSelectedMdevs.join(',') })}
              </Alert>
            )
          }
          {
            !noDisplayConsistent && (
              <Alert variant='warning' isInline title={msg.vmManageGpuDialogInconsistentNodisplayWarningTitle()}>
                {msg.vmManageGpuDialogInconsistentNodisplayWarning()}
              </Alert>
            )
          }
          {
            !driverParamsConsistent && (
              <Alert variant='warning' isInline title={msg.vmManageGpuDialogInconsistentDriverParamsWarningTitle()}>
                {msg.vmManageGpuDialogInconsistentDriverParamsWarning()}
              </Alert>
            )
          }
          <ManageGpuModalBody
            gpus={gpus}
            displayOn={displayOn === undefined ? initialDisplayOn : displayOn}
            driverParams={getDriverParams()}
            compatibilityVersion={compatibilityVersion}
            selectedMDevTypes={selectedMDevTypes}
            onDisplayOnChange={onDisplayOnChange}
            onDriverParamsChange={onDriverParamsChange}
            onGpuSelectionChange={onGpuSelectionChange}
          />
        </>
      </LoadingSpinner>
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
  nonExistingSelectedMdevs: PropTypes.array,
  noDisplayConsistent: PropTypes.bool,
  driverParamsConsistent: PropTypes.bool,

  onSelectButtonClick: PropTypes.func,
  onClose: PropTypes.func,
}

export default ManageGpuModal
