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
  const modalContext = useContext(WebAdminModalContext)

  useEffect(() => {
    if (isOpen) {
      const clonedStyles = []

      if (window !== modalContext.targetWindow) {
        window.document.querySelectorAll('head style, head link[type="text/css"], head link[rel="stylesheet"]').forEach(style => {
          const cloned = style.cloneNode(true)
          cloned.setAttribute('data-style-for', id)
          clonedStyles.push(cloned)

          if (/ui-extensions\/css\/vendor\.[^/]*?css$/.test(cloned.href)) {
            modalContext.prependCss(cloned)
          } else {
            modalContext.appendCss(cloned)
          }
        })
      }

      return () => {
        clonedStyles.forEach(style => {
          modalContext.removeCss(style)
        })
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
