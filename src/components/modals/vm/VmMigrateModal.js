import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import PluginApiModal from '_/components/modals/PluginApiModal'
import { Spinner } from 'patternfly-react'
import { Button } from '@patternfly/react-core'
import VmMigrateModalBody, { AUTO_SELECT_ITEM, selectItemShape } from './VmMigrateModalBody'
import withTargetHosts from './VmMigrateDataProvider'

import './vm-migrate.css'

const VmMigrateModal = ({
  isLoading = false,
  vmNames = [],
  targetHostItems = [],
  suggestAffinity = false,
  onMigrateToHost = () => {},
  onRefreshHosts = () => {},
  onClose = () => {}
}) => {
  const [isOpen, setOpen] = useState(true)
  const [hostId, setHostId] = useState(AUTO_SELECT_ITEM.value)
  const [migrateVmsInAffinity, setMigrateVmsInAffinity] = useState(false)

  if (!isOpen) {
    return null
  }

  const close = () => {
    setOpen(false)
    onClose()
  }

  const onMigrateVmsInAffinityChange = (migrateVmsInAffinity) => {
    setMigrateVmsInAffinity(migrateVmsInAffinity)
    onRefreshHosts(migrateVmsInAffinity)
  }

  const onMigrateButtonClick = () => {
    const hostOrNothing =
      hostId === AUTO_SELECT_ITEM.value
        ? undefined
        : hostId

    onMigrateToHost(hostOrNothing, migrateVmsInAffinity)
    close()
  }

  const modalActionButtons = [
    <Button
      key='vm-migrate-cancel-button'
      ouiaId='vm-migrate-cancel-button'
      variant='link'
      onClick={close}
    >
      {msg.cancelButton()}
    </Button>,
    <Button
      key='vm-migrate-migrate-button'
      ouiaId='vm-migrate-migrate-button'
      variant='primary'
      onClick={onMigrateButtonClick}
      isDisabled={targetHostItems.length === 0}
    >
      {msg.migrateVmButton()}
    </Button>
  ]

  return (
    <PluginApiModal
      isLarge
      title={msg.migrateVmDialogTitle()}
      isOpen={isOpen}
      onClose={close}
      actions={modalActionButtons}
    >
      <Spinner loading={isLoading}>
        <VmMigrateModalBody
          vmNames={vmNames}
          migrateVmsInAffinity={migrateVmsInAffinity}
          targetHostItems={targetHostItems}
          selectedHostId={hostId}
          suggestAffinity={suggestAffinity}

          onHostSelectionChange={value => setHostId(value)}
          onMigrateVmsInAffinityChange={onMigrateVmsInAffinityChange}
        />
      </Spinner>
    </PluginApiModal>
  )
}

VmMigrateModal.propTypes = {
  // data input
  isLoading: PropTypes.bool,
  vmNames: PropTypes.arrayOf(PropTypes.string),
  targetHostItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  suggestAffinity: PropTypes.bool,

  // operation callbacks
  onMigrateToHost: PropTypes.func,
  onRefreshHosts: PropTypes.func,

  // modal props
  onClose: PropTypes.func
}

export default withTargetHosts(VmMigrateModal)
