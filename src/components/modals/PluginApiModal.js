import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { WebAdminModalContext } from '_/utils/react-modals'

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
  // Note: The `WebAdminModalContext` is only created once per action button click
  //       and once when the Dashboard place is loaded.  Once created it will be stable
  //       for the entire modal (or dashboard) app instance.  See `renderComponent()`
  //       and `src/utils/react-modals.js` in general for more details.
  const modalContext = useContext(WebAdminModalContext)

  useEffect(() => {
    if (isOpen) {
      modalContext.applyCss(id)

      return () => {
        modalContext.removeCss(id)
      }
    }
  }, [isOpen, id, modalContext])

  return (
    <Modal
      id={id}
      title={title}
      className={className}
      isOpen={isOpen}
      onClose={onClose}
      appendTo={modalContext.targetContainer}
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
