import React, { useContext, useState } from 'react'
import ReactDOM from 'react-dom'
import { getWebAdminWindow } from './webadmin-dom'

/*
 * This context provides access to the closest `renderContainer` available as a
 * `PluginApiModal` render target.  If the context is empty/undefined, a `renderContainer`
 * will need to be built as needed.
 */
export const WebAdminModalContext = React.createContext()
WebAdminModalContext.displayName = 'WebAdminModalContext'

/**
 * Create a shadow root base `div`, populate it with the necessary CSS, add an app
 * render container, and append the whole thing on the target window.
 */
export function buildAndAppendShadowroot ({
  renderContainerId,
  sourceWindow = window,
  targetWindow = getWebAdminWindow(),
  containerId = `root-container-${renderContainerId}`,
} = {}) {
  const renderContainer = targetWindow.document.createElement('div')
  renderContainer.setAttribute('class', 'ui-extensions-plugin-root')
  renderContainer.setAttribute('id', renderContainerId)

  const shadowRoot = targetWindow.document.createElement('div')
  shadowRoot.style.position = 'absolute'
  shadowRoot.style.top = 0
  shadowRoot.style.left = 0
  shadowRoot.style.width = 0
  shadowRoot.style.height = 0
  shadowRoot.setAttribute('id', containerId)
  shadowRoot.attachShadow({ mode: 'open' })

  sourceWindow
    .document
    .querySelectorAll('head style, head link[type="text/css"], head link[rel="stylesheet"]')
    .forEach(style => {
      const cloned = style.cloneNode(true)
      cloned.setAttribute('data-for-container-id', containerId)
      cloned.setAttribute('data-for-render-container-id', renderContainerId)
      shadowRoot.shadowRoot.append(cloned)
    })

  shadowRoot.shadowRoot.append(renderContainer)

  targetWindow.document.body.append(shadowRoot)

  const removeShadowRoot = () => {
    shadowRoot.remove()
  }

  return { shadowRoot, removeShadowRoot, renderContainer }
}

/**
 * React hook to provide access to a modal `renderContainer` properly configured
 * to render in the webadmin window itself.
 */
export function useWebAdminContext (id) {
  const modalContext = useContext(WebAdminModalContext)
  const [shadowRoot, setShadowRoot] = useState(null)

  if (modalContext) {
    return {
      renderContainer: modalContext.renderContainer,
      buildContainer () {},
      removeContainer () {},
    }
  }

  function buildContainer () {
    if (!shadowRoot) {
      setShadowRoot(buildAndAppendShadowroot({ renderContainerId: id }))
    }
  }

  function removeContainer () {
    if (shadowRoot) {
      shadowRoot.removeShadowRoot()
      setShadowRoot(null)
    }
  }

  return {
    renderContainer: shadowRoot?.renderContainer,
    buildContainer,
    removeContainer,
  }
}

/**
 * Create an application container `div` in the wedadmin window and render the given
 * `render()` function as a React app in the container.  A `WebAdminModalContext.Provider`
 * initialized with the built `renderContainer` allows `PluginApiModal` to render
 * in the correct place.
 *
 * @param {function} render Function to render your React App root
 * @param {string} id element id for the container div
 */
export const renderComponent = (render, id) => {
  const { removeShadowRoot, renderContainer } = buildAndAppendShadowroot({ renderContainerId: id })

  /*
    Immediately schedule an unmount of the rendered component.  This gives any Portal
    that may have been opened a chance to close first.  Since `PluginApiModal` will
    Portal itself to `container`, it needs to unmount the Portal before the component is
    unmounted.  This avoid an error message from react.
   */
  const unmountComponent = () => setTimeout(() => { removeShadowRoot() }, 0)

  ReactDOM.render(
    <WebAdminModalContext.Provider value={{ renderContainer }}>
      {render({ unmountComponent })}
    </WebAdminModalContext.Provider>,
    renderContainer
  )
}
