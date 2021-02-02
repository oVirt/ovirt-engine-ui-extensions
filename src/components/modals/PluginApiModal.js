import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import uniqueId from 'lodash/uniqueId'
import { getWebAdminWindow, getWebAdminDocumentBody } from '_/utils/webadmin-dom'

import { Modal } from '@patternfly/react-core'

const PluginApiModal = ({
  children,
  title,
  className,
  modalId = `pluginApiModal-${uniqueId()}`,
  isOpen,
  onClose = () => {},
  ...restForModal
}) => {
  useEffect(() => {
    if (isOpen) {
      const targetWindow = getWebAdminWindow()
      const clonedStyles = []

      if (window !== targetWindow) {
        window.document.querySelectorAll('head style, head link[type="text/css"], head link[rel="stylesheet"]').forEach(style => {
          const cloned = style.cloneNode(true)
          cloned.setAttribute('data-style-for', modalId)
          clonedStyles.push(cloned)

          if (/ui-extensions\/css\/vendor\.[^/]*?css$/.test(cloned.href)) {
            targetWindow.document.head.insertBefore(cloned, targetWindow.document.head.firstChild)
          } else {
            targetWindow.document.head.appendChild(cloned)
          }
        })
      }

      return () => {
        clonedStyles.forEach(style => {
          targetWindow.document.head.removeChild(style)
        })
      }
    }
  }, [ isOpen ])

  return (
    <Modal
      id={modalId}
      title={title}
      className={className}
      isOpen={isOpen}
      onClose={onClose}
      appendTo={getWebAdminDocumentBody()}
      disableFocusTrap
      {...restForModal}
    >
      {children}
    </Modal>
  )
}

PluginApiModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  modalId: PropTypes.string,

  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func
}

export default PluginApiModal
