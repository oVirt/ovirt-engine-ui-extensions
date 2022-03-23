import { Button } from '@patternfly/react-core'
import { Spinner } from 'patternfly-react'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import PluginApiModal from '_/components/modals/PluginApiModal'
import { msg } from '_/intl-messages'
import CpuPinningModalBody from './CpuPinningModalBody'
import PinnedEntity from './PinnedEntity'

const CpuPinningModal = ({
  mainEntity,
  pinnedEntities,
  socketLabelProvider,
  coreLabelProvider,
  cpuLabelProvider,
  pinnedCpuLabelProvider,
  pinnedEntityIcon,
  cpuTopologyDescription,
  isLoading = false,
  variant = 'small',
  onClose = () => {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const handleCloseModal = () => {
    setIsModalOpen(false)
    onClose()
  }
  return (
    <PluginApiModal
      variant={variant}
      title={msg.cpuPinningModalTitle()}
      id='CpuPinningModal'
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      actions={[
        <Button
          key='cpu-pinning-ok-button'
          variant='link'
          onClick={handleCloseModal}
        >
          {msg.okButton()}
        </Button>,
      ]}
    >
      <Spinner loading={isLoading}>
        <CpuPinningModalBody
          variant={variant}
          mainEntity={mainEntity}
          pinnedEntities={pinnedEntities}
          socketLabelProvider={socketLabelProvider}
          coreLabelProvider={coreLabelProvider}
          cpuLabelProvider={cpuLabelProvider}
          pinnedCpuLabelProvider={pinnedCpuLabelProvider}
          pinnedEntityIcon={pinnedEntityIcon}
          cpuTopologyDescription={cpuTopologyDescription}
        />
      </Spinner>
    </PluginApiModal>
  )
}

CpuPinningModal.propTypes = {
  mainEntity: PropTypes.instanceOf(PinnedEntity),
  pinnedEntities: PropTypes.arrayOf(
    PropTypes.instanceOf(PinnedEntity)
  ),
  socketLabelProvider: PropTypes.func,
  coreLabelProvider: PropTypes.func,
  cpuLabelProvider: PropTypes.func,
  pinnedCpuLabelProvider: PropTypes.func,
  cpuTopologyDescription: PropTypes.string,
  pinnedEntityIcon: PropTypes.element,
  isLoading: PropTypes.bool,
  variant: PropTypes.string,
  onClose: PropTypes.func,
}

export default CpuPinningModal
