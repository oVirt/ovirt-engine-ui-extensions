import React from 'react'
import { msg } from '_/intl-messages'
import { Bullseye, Spinner } from '@patternfly/react-core'

/**
 * Loading component to match the style of ovirt-engine/webadmin (GwtHostPage.jsp).
 *
 * Renders vertically and horizontally centered.
 */
const LoadingPlaceHolder = () => (
  <Bullseye className='loading-place-holder'>
    <Spinner size='lg' isSVG className='loading-place-holder-spinner' />
    <div className='loading-place-holder-label'>{msg.dashboardDataLoading()}</div>
  </Bullseye>
)

export default LoadingPlaceHolder
