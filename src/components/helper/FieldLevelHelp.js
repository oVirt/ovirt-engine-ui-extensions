import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, TooltipPosition } from '@patternfly/react-core'
import { InfoCircleIcon } from '@patternfly/react-icons'
import { getWebAdminDocumentBody } from '_/utils/webadmin-dom'
import './styles.css'

const FieldLevelHelp = ({
  content,
}) => {
  return (
    <div className='field-level-help'>
      <Tooltip
        appendTo={getWebAdminDocumentBody}
        position={TooltipPosition.right}
        content={content}
      >
        <InfoCircleIcon />
      </Tooltip>
    </div>
  )
}

FieldLevelHelp.propTypes = {
  content: PropTypes.node.isRequired,
}

export default FieldLevelHelp
