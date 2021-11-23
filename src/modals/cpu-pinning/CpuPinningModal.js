import { Button } from '@patternfly/react-core'
import { Spinner } from 'patternfly-react'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import PluginApiModal from '_/components/modals/PluginApiModal'
import { msg } from '_/intl-messages'
import CpuPinningModalBody from './CpuPinningModalBody'

const CpuPinningModal = ({
  vm,
  hosts,
  isLoading = false,
  onClose = () => {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const handleCloseModal = () => {
    setIsModalOpen(false)
    onClose()
  }

  return (
    <PluginApiModal
      variant='small'
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
        <CpuPinningModalBody vm={vm} hosts={hosts} />
      </Spinner>
    </PluginApiModal>
  )
}

CpuPinningModal.propTypes = {
  vm: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    cpuTopology: PropTypes.shape({
      sockets: PropTypes.number,
      cores: PropTypes.number,
      threads: PropTypes.number,
    }),
    cpuPinningPolicy: PropTypes.string,
    cpuPinnings: PropTypes.arrayOf(
      PropTypes.shape({
        vcpu: PropTypes.string,
        cpuSet: PropTypes.string,
      })
    ),
  }),
  hosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      cpus: PropTypes.number,
    })
  ),
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
}

export default CpuPinningModal
