import React from 'react'
import ReactDOM from 'react-dom'
import { getWebAdminWindow, getWebAdminDocumentBody } from './webadmin-dom'

function createModalContextValue (
  targetWindow = getWebAdminWindow(),
  targetContainer = getWebAdminDocumentBody(),
  cssContainer
) {
  cssContainer = cssContainer || targetWindow.document.head

  const cloneSourceStyles = (forId) => {
    if (window === targetWindow) {
      return { before: [], after: [] }
    }

    const cssTop = []
    const cssBottom = []

    window.document.querySelectorAll('head style, head link[type="text/css"], head link[rel="stylesheet"]').forEach(style => {
      const cloned = style.cloneNode(true)
      cloned.setAttribute('data-style-for', forId)

      if (/ui-extensions\/css\/vendor\.[^/]*?css$/.test(cloned.href)) {
        cssTop.push(cloned)
      } else {
        cssBottom.push(cloned)
      }
    })

    return { before: cssTop, after: cssBottom }
  }

  return {
    targetWindow,
    targetContainer,

    applyCss: (forId) => {
      const { before, after } = cloneSourceStyles(forId)

      for (const cssNode of before) {
        cssContainer.insertBefore(cssNode, cssContainer.firstChild)
      }
      for (const cssNode of after) {
        cssContainer.appendChild(cssNode)
      }
    },

    removeCss: (forId) => {
      for (const cssNode of cssContainer.querySelectorAll(`[data-style-for="${forId}"]`)) {
        if (cssNode.parentNode) {
          cssNode.parentNode.removeChild(cssNode)
        }
      }
    },
  }
}

/*
 * The default context value supports Dashboard (places integration) based modals.
 */
export const WebAdminModalContext = React.createContext(createModalContextValue())
WebAdminModalContext.displayName = 'WebAdminModalContext'

/**
 * Create an application container `div` in the wedadmin window and render the
 * given `render()` as a React app in the container.  A `WebAdminModalContext.Provider`
 * configured with the correct `targetWindow` and `targetContianer` as determine and
 * created by the function.
 *
 * @param {function} render Function to render your React App root
 * @param {string} id element id for the container div
 */
export const renderComponent = (render, id) => {
  const targetWindow = getWebAdminWindow()

  let container = targetWindow.document.querySelector(`div#${id}`)
  if (!container) {
    container = targetWindow.document.createElement('div')
    container.setAttribute('id', id)
    container.setAttribute('class', 'ui-extensions-plugin-approot') // marker class
    targetWindow.document.body.appendChild(container)
  }

  /*
    Immediately schedule an unmount of the rendered component.  This gives any Portal
    that may have been opened a chance to close first.  Since `PluginApiModal` will
    Portal itself to `container`, it needs to unmount the Portal before the component is
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
