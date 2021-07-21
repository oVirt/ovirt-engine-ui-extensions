import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import PluginApiModal from '_/components/modals/PluginApiModal'
import { Spinner } from 'patternfly-react'
import { Button } from '@patternfly/react-core'
import VmExportModalBody from './VmExportModalBody'

function selectFirstId (storageDomains) {
  return !storageDomains || storageDomains.length === 0
    ? ''
    : storageDomains[0].id
}

const VmExportModal = ({
  isLoading = false,
  vm,
  storageDomains = [],
  onExportVm = () => {},
  onClose = () => {},
}) => {
  const [isOpen, setOpen] = useState(true)
  const [exportVmName, setExportVmName] = useState(vm.name + '-export')
  const [error, setError] = useState('')
  const [shouldCollapseSnapshots, setShouldCollapseSnapshots] = useState(false)
  const [selectedStorageDomain, setSelectedStorageDomain] = useState(selectFirstId(storageDomains))

  // auto-select the first storage domain if the storageDomains change
  useEffect(() => {
    setSelectedStorageDomain(selectFirstId(storageDomains))
  }, [storageDomains])

  if (!isOpen) {
    return null
  }

  const close = () => {
    setOpen(false)
    onClose()
  }

  const doExportVm = async () => {
    try {
      const result = await onExportVm(vm.id, exportVmName, selectedStorageDomain, shouldCollapseSnapshots)
      console.log('export result:', result)
      close()
    } catch (e) {
      console.error('export problem:', e)
      setError(e.message)
    }
  }

  const modalActions = [
    <Button
      key='vm-export-modal-export-button'
      variant='primary'
      onClick={doExportVm}
      isDisabled={!storageDomains || storageDomains.length === 0 || exportVmName.length === 0}
    >
      {msg.exportVmButton()}
    </Button>,
    <Button
      key='vm-export-modal-cancel-button'
      variant='link'
      onClick={close}
    >
      {msg.cancelButton()}
    </Button>,
  ]

  return (
    <PluginApiModal
      variant='large'
      title={msg.exportVmTitle()}
      isOpen={isOpen}
      onClose={close}
      actions={modalActions}
    >
      <Spinner loading={isLoading}>
        <VmExportModalBody
          sourceVmName={vm.name}
          exportVmName={exportVmName}
          error={error}
          shouldCollapseSnapshots={shouldCollapseSnapshots}
          selectedStorageDomain={selectedStorageDomain}
          storageDomains={storageDomains}
          onExportVmNameChange={setExportVmName}
          onShouldCollapseSnapshotsChange={setShouldCollapseSnapshots}
          onSelectedStorageDomainChange={setSelectedStorageDomain}
        />
      </Spinner>
    </PluginApiModal>
  )
}

VmExportModal.propTypes = {
  // data input
  isLoading: PropTypes.bool,
  vm: PropTypes.object,
  storageDomains: PropTypes.array,

  // callbacks
  onExportVm: PropTypes.func,

  // modal props
  onClose: PropTypes.func,
}

export default VmExportModal
