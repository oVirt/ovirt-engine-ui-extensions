import React from 'react'
import PropTypes from 'prop-types'
import { Bullseye, Spinner } from '@patternfly/react-core'

const LoadingSpinner = ({ isLoading = true, children }) => (
  isLoading
    ? (
      <Bullseye>
        <Spinner isSVG size='lg' aria-label='Loading contents' />
      </Bullseye>
    )
    : (
      children
    )
)

LoadingSpinner.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default LoadingSpinner
