import ReactDOM from 'react-dom'
import { node } from 'prop-types'
import { getWebAdminDocumentBody } from '../../utils/webadmin-dom'

/**
 * Renders component's children into WebAdmin document body.
 */
function WebAdminBodyPortal ({
  children
}) {
  return ReactDOM.createPortal(children, getWebAdminDocumentBody())
}

WebAdminBodyPortal.propTypes = {
  children: node
}

export default WebAdminBodyPortal
