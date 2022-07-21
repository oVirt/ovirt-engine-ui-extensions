import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import config from '_/plugin-config'

import { Button } from '@patternfly/react-core'

const MonitoringPortalLink = ({ url }) => {
  if (!url && !config.useFakeData) {
    return null
  }

  const onClick = () => {
    if (url) {
      window.open(url, '_top')
    }
    if (config.useFakeData) {
      console.info('clicked MonitoringPortalLink')
    }
  }

  return (
    <Button variant='link' className='monitoring-portal-link' onClick={onClick}>
      {msg.dashboardLinkMonitoringPortal()}
    </Button>
  )
}

MonitoringPortalLink.propTypes = {
  url: PropTypes.string,
}

export default MonitoringPortalLink
