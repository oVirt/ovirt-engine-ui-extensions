import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWebAdminContext } from '_/utils/react-modals'

import { Modal } from '@patternfly/react-core'

const PluginApiModal = ({
  children,
  title,
  className,
  id,
  isOpen,
  onClose = () => {},
  ...restForModal
}) => {
  const { renderContainer, buildContainer, removeContainer } = useWebAdminContext(id)

  useEffect(() => {
    if (isOpen) {
      buildContainer()
    } else {
      removeContainer()
    }
  }, [isOpen, buildContainer, removeContainer])

  if (!isOpen || !renderContainer) {
    return null
  }

  return (
    <Modal
      id={id}
      title={title}
      className={className}
      isOpen={isOpen}
      onClose={onClose}
      appendTo={renderContainer}
      disableFocusTrap
      {...restForModal}
    >
      {children}
    </Modal>
  )
}

PluginApiModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,

  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
}

export default PluginApiModal
