import React from 'react'
import ReactDOM from 'react-dom'
import { getWebAdminWindow } from './webadmin-dom'

export const WebAdminModalContext = React.createContext()
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
      value={{
        targetWindow,
        targetContainer: container,
        prependCss: (cssNode) => {
          targetWindow.document.head.insertBefore(cssNode, targetWindow.document.head.firstChild)
        },
        appendCss: (cssNode) => {
          targetWindow.document.head.appendChild(cssNode)
        },
        removeCss: (cssNode) => {
          targetWindow.document.head.removeChild(cssNode)
        },
      }}
    >
      {render({ unmountComponent })}
    </WebAdminModalContext.Provider>,
    container
  )
}
