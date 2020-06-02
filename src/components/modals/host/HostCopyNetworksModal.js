import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import { Spinner } from 'patternfly-react'
import { Modal, Button } from '@patternfly/react-core'

import HostCopyNetworksModalBody, { CHOOSE_MSG, selectItemShape } from './HostCopyNetworksModalBody'

const HostCopyNetworksModal = ({
  isLoading = false,
  hostNames = [],
  targetHostItems = [],
  onCopyNetworksToHost = () => {},
  onRefreshHosts = () => {},
  onClose = () => {},
  appendTo
}) => {
  const [isOpen, setOpen] = useState(true)
  const [hostId, setHostId] = useState(CHOOSE_MSG.value)
  if (!appendTo) {
    return null
  }

  if (!isOpen) {
    onClose()
    return null
  }

  const close = () => setOpen(false)

  const onCopyNetworksToHostButtonClick = () => {
    const hostOrNothing =
      hostId === CHOOSE_MSG.value
        ? undefined
        : hostId

    onCopyNetworksToHost(hostOrNothing)
    close()
  }

  const modalActionButtons = [
    <Button
      key='host-copy-networks-cancel-button'
      ouiaId='host-copy-networks-cancel-button'
      variant='link'
      onClick={close}
    >
      {msg.cancelButton()}
    </Button>,
    <Button
      key='host-copy-networks-copy-button'
      ouiaId='host-copy-networks-copy-button'
      variant='primary'
      onClick={onCopyNetworksToHostButtonClick}
      isDisabled={targetHostItems.length === 0 || hostId === CHOOSE_MSG.value}
    >
      {msg.hostCopyNetworksButton()}
    </Button>
  ]

  return (
    <Modal
      isLarge
      title={msg.hostCopyNetworksDialogTitle()}
      isOpen={isOpen}
      onClose={close}
      appendTo={appendTo}
      actions={modalActionButtons}
    >
      <Spinner loading={isLoading}>
        <HostCopyNetworksModalBody
          hostNames={hostNames}
          targetHostItems={targetHostItems}
          selectedHostId={hostId}
          onHostSelectionChange={setHostId}
        />
      </Spinner>
    </Modal>
  )
}

HostCopyNetworksModal.propTypes = {
  // data input
  isLoading: PropTypes.bool,
  hostNames: PropTypes.arrayOf(PropTypes.string),
  targetHostItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),

  // operation callbacks
  onCopyNetworksToHost: PropTypes.func,
  onRefreshHosts: PropTypes.func,

  // modal props
  appendTo: PropTypes.object,
  onClose: PropTypes.func
}

export default HostCopyNetworksModal
