import ReactDOM from 'react-dom'
import { getWebAdminDocumentBody } from './webadmin-dom'

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
export const showModal = (modalCreator) => {
  const modalRoot = document.createElement('div')
  document.body.appendChild(modalRoot)

  const destroyModal = () => {
    ReactDOM.unmountComponentAtNode(modalRoot)
    document.body.removeChild(modalRoot)
  }

  ReactDOM.render(
    modalCreator({
      container: getWebAdminDocumentBody(),
      destroyModal
    }),
    modalRoot
  )
}
