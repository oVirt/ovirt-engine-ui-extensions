import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup as BsFormGroup } from 'react-bootstrap'
import { Form, Grid } from 'patternfly-react'
import FieldLevelHelp from '../patternfly-react-overrides/FieldLevelHelp'

const BaseFormGroup = ({
  id,
  label,
  help,
  fieldHelp,
  fieldHelpPlacement,
  validationState,
  children
}) => {
  // react-bootstrap Overlay content's offset calculation gets messed up when
  // rendered out-of-iframe. To fix this, we use the component's DOM element
  // as an explicit "offsetParent" for the Overlay.
  const componentRef = React.createRef()

  return (
    <Form.FormGroup
      controlId={id}
      validationState={validationState}
      ref={componentRef}
    >
      <Grid.Col sm={3} componentClass={Form.ControlLabel}>
        <strong>{label}</strong>
        {fieldHelp &&
          <FieldLevelHelp
            content={fieldHelp}
            placement={fieldHelpPlacement || 'top'}
            container={() => componentRef.current}
          />
        }
      </Grid.Col>
      <Grid.Col sm={9}>
        {children}
        {help && <Form.HelpBlock>{help}</Form.HelpBlock>}
      </Grid.Col>
    </Form.FormGroup>
  )
}

BaseFormGroup.propTypes = {
  id: BsFormGroup.propTypes.controlId,
  label: PropTypes.string.isRequired,
  help: PropTypes.string,
  fieldHelp: FieldLevelHelp.propTypes.content,
  fieldHelpPlacement: PropTypes.string,
  validationState: BsFormGroup.propTypes.validationState,
  children: PropTypes.node.isRequired
}

export default BaseFormGroup
