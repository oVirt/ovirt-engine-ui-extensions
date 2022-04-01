import React from 'react'
import ReactDOM from 'react-dom'
import { getWebAdminWindow, getWebAdminDocumentBody } from './webadmin-dom'

function createModalContextValue (
  targetWindow = getWebAdminWindow(),
  targetContainer = getWebAdminDocumentBody(),
  cssContainer
) {
  cssContainer = cssContainer || targetWindow.document.head

  return {
    targetWindow,
    targetContainer,

    applyCss: (beforeCssNodes, afterCssNodes) => {
      for (const cssNode of beforeCssNodes) {
        cssContainer.insertBefore(cssNode, cssContainer.firstChild)
      }
      for (const cssNode of afterCssNodes) {
        cssContainer.appendChild(cssNode)
      }
    },

    removeCss: (cssNodes) => {
      for (const cssNode of cssNodes) {
        cssContainer.removeChild(cssNode)
      }
    },
  }
}

export const WebAdminModalContext = React.createContext(createModalContextValue())
WebAdminModalContext.displayName = 'WebAdminModalContext'

export const renderComponent = (render, id) => {
  const targetWindow = getWebAdminWindow()

  let container = targetWindow.document.querySelector(`div#${id}`)
  if (!container) {
    container = targetWindow.document.createElement('div')
    container.setAttribute('id', id)
    container.setAttribute('class', 'ui-extensions-container')
    targetWindow.document.body.appendChild(container)
  }

  /*
    Unmount the rendered component but give any Portal that may have been opened
    a chance to close before doing so.  Since `PluginApiModal` will Portal itself
    to `container`, it needs to unmount the Portal before the component is
    unmounted.  This avoid an error message from react.
   */
  const unmountComponent = () =>
    setTimeout(() => {
      const container = targetWindow.document.querySelector(`div#${id}`)
      ReactDOM.unmountComponentAtNode(container)
      targetWindow.document.body.removeChild(container)
    }, 0)

  ReactDOM.render(
    <WebAdminModalContext.Provider
      value={createModalContextValue(targetWindow, container)}
    >
      {render({ unmountComponent })}
    </WebAdminModalContext.Provider>,
    container
  )
}
