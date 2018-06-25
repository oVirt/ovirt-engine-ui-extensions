import ReactDOM from 'react-dom'
import { getWebAdminDocumentBody } from './webadmin-dom'

/**
 * Render patternfly-react `Modal` based component into WebAdmin document body.
 *
 * Example:
 *
 * ```
 * showModal(({ container, destroyModal }) => {
 *   return (
 *     <MyModal show={true} container={container} onExited={destroyModal}>
 *       ... modal bits go here ...
 *     </MyModal>
 *   )
 * })
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
