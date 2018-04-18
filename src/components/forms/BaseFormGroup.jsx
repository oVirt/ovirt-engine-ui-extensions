import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup as BsFormGroup } from 'react-bootstrap'
import { Form, FieldLevelHelp, Grid } from 'patternfly-react'

const BaseFormGroup = ({
  id,
  label,
  help,
  fieldHelp,
  validationState,
  children
}) => (
  <Form.FormGroup controlId={id} validationState={validationState}>
    <Grid.Col componentClass={Form.ControlLabel} sm={3}>
      {label}
      {fieldHelp && <FieldLevelHelp content={fieldHelp} />}
    </Grid.Col>
    <Grid.Col sm={9}>
      {children}
      {help && <Form.HelpBlock>{help}</Form.HelpBlock>}
    </Grid.Col>
  </Form.FormGroup>
)

BaseFormGroup.propTypes = {
  id: BsFormGroup.propTypes.controlId,
  label: PropTypes.string.isRequired,
  help: PropTypes.string,
  fieldHelp: FieldLevelHelp.propTypes.content,
  validationState: BsFormGroup.propTypes.validationState,
  children: PropTypes.node.isRequired
}

export default BaseFormGroup
