import React from 'react'
import ReactDOM from 'react-dom'
import uniqueId from 'lodash/uniqueId'

import { getWebAdminWindow } from './webadmin-dom'

export const WebAdminModalContext = React.createContext()
WebAdminModalContext.displayName = 'WebAdminModalContext'

/**
 * Render patternfly-react `Modal` based component into WebAdmin document body.
 *
 * @example
 * ```
 * showModal(({ container, destroyModal }) => (
 *   <MyModal show container={container} onExited={destroyModal} />
 * ))
 * ```
 */
export const showModal = (modalCreator, modalId = uniqueId()) => {
  const targetWindow = getWebAdminWindow()

  const modalContainer = targetWindow.document.createElement('div')
  modalContainer.setAttribute('id', `showModal-${modalId}`)

  targetWindow.document.body.appendChild(modalContainer)

  const clonedStyles = []
  if (window !== targetWindow) {
    window.document.querySelectorAll('head style, head link[type="text/css"], head link[rel="stylesheet"]').forEach(style => {
      const cloned = style.cloneNode(true)
      cloned.setAttribute('data-style-for', `showModal-${modalId}`)
      clonedStyles.push(cloned)

      if (/ui-extensions\/css\/vendor\.[^/]*?css$/.test(cloned.href)) {
        targetWindow.document.head.insertBefore(cloned, targetWindow.document.head.firstChild)
      } else {
        targetWindow.document.head.appendChild(cloned)
      }
    })
  }

  const destroyModal = () => {
    ReactDOM.unmountComponentAtNode(modalContainer)
    targetWindow.document.body.removeChild(modalContainer)
    clonedStyles.forEach(style => {
      targetWindow.document.head.removeChild(style)
    })
  }

  ReactDOM.render(
    <WebAdminModalContext.Provider
      value={{
        window: targetWindow,
        modalContainer,
        destroyModal,
      }}
    >
      {modalCreator({ container: modalContainer, destroyModal })}
    </WebAdminModalContext.Provider>,
    modalContainer
  )
}

export const renderComponent = (render, id = `component-${uniqueId()}`) => {
  let container = document.querySelector(`div#${id}`)
  if (!container) {
    container = document.createElement('div')
    container.setAttribute('id', id)
    document.body.appendChild(container)
  }

  const unmountComponent = () => {
    ReactDOM.unmountComponentAtNode(container)
    document.body.removeChild(container)
  }

  ReactDOM.render(render({ unmountComponent }), container)
}
