import React from 'react'
import PropTypes from 'prop-types'
import { noop, Form, Alert } from 'patternfly-react'
import SelectFormGroup, { selectItemShape } from '../../forms/SelectFormGroup'

// TODO(vs) consider moving this to patternfly-react helpers along
// with any existing occurrences, like in UtilizationBar component.
const randomId = () => Date.now().toString()

// TODO(vs) extract as utility function
const nonEmptyString = obj => typeof obj === 'string' && obj

export function errorMessageToArray (errorMessage) {
  if (nonEmptyString(errorMessage)) {
    return [errorMessage]
  } else if (Array.isArray(errorMessage)) {
    return errorMessage.filter(nonEmptyString)
  }
  return []
}

const VmMigrateModalBody = ({
  hostSelectLabel,
  hostSelectItems,
  hostAutoSelectItem,
  onHostSelectionChange,
  errorMessage
}) => {
  const items = hostAutoSelectItem
    ? [hostAutoSelectItem].concat(hostSelectItems)
    : hostSelectItems

  const allErrors = errorMessageToArray(errorMessage)
  const hasError = allErrors.length > 0

  return (
    <Form horizontal>
      <SelectFormGroup
        id={randomId()}
        label={hostSelectLabel}
        items={items}
        defaultValue={hostAutoSelectItem && hostAutoSelectItem.value}
        usePlaceholder={false}
        onChange={event => { onHostSelectionChange(event.target.value) }}
        disabled={hasError}
        validationState={hasError ? 'error' : 'success'}
      />
      {hasError && allErrors.map(error => (
        <Alert key={error} type='error'>{error}</Alert>
      ))}
    </Form>
  )
}

export const hostAutoSelectItemValue = '_AutoSelect_'

VmMigrateModalBody.propTypes = {
  hostSelectLabel: PropTypes.string,
  hostSelectItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  hostAutoSelectItem: PropTypes.shape(selectItemShape),
  onHostSelectionChange: PropTypes.func,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
}

VmMigrateModalBody.defaultProps = {
  hostSelectLabel: 'Select Destination Host',
  hostSelectItems: [],
  hostAutoSelectItem: {
    value: hostAutoSelectItemValue,
    text: 'Select Host Automatically'
  },
  onHostSelectionChange: noop,
  errorMessage: null
}

export default VmMigrateModalBody
