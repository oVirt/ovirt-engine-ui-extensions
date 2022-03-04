import React from 'react'
import { msg } from '_/intl-messages'
import { Bullseye } from '@patternfly/react-core'

/**
 * Loading had an error component to match the style of ovirt-engine/webadmin (GwtHostPage.jsp).
 *
 * Renders vertically and horizontally centered.
 */
const LoadingErrorPlaceHolder = () => (
  <Bullseye className='loading-place-holder'>
    <div className='loading-place-holder-label'>{msg.dashboardDataErrorDetail()}</div>
  </Bullseye>
)

export default LoadingErrorPlaceHolder
