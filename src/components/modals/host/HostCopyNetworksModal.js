import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import PluginApiModal from '_/components/modals/PluginApiModal'
import { Spinner } from 'patternfly-react'
import { Button } from '@patternfly/react-core'
import HostCopyNetworksModalBody, { CHOOSE_MSG, selectItemShape } from './HostCopyNetworksModalBody'

const HostCopyNetworksModal = ({
  isLoading = false,
  hostNames = [],
  targetHostItems = [],
  onCopyNetworksToHost = () => {},
  onRefreshHosts = () => {},
  onClose = () => {}
}) => {
  const [isOpen, setOpen] = useState(true)
  const [hostId, setHostId] = useState(CHOOSE_MSG.value)

  if (!isOpen) {
    return null
  }

  const close = () => {
    setOpen(false)
    onClose()
  }

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
    <PluginApiModal
      isLarge
      title={msg.hostCopyNetworksDialogTitle()}
      isOpen={isOpen}
      onClose={close}
      actions={modalActionButtons}
    >
      <Spinner loading={isLoading}>
        <HostCopyNetworksModalBody
          hostNames={hostNames}
          targetHostItems={targetHostItems}
          selectedHostId={hostId}
          onHostSelectionChange={value => setHostId(value)}
        />
      </Spinner>
    </PluginApiModal>
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
  onClose: PropTypes.func
}

export default HostCopyNetworksModal
