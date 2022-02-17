import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

const MonitoringPortalLink = ({ url }) => {
  return url && (
    <a className='monitoring-portal-link' target='_top' href={url}>{msg.dashboardLinkMonitoringPortal()}</a>
  )
}

MonitoringPortalLink.propTypes = {
  url: PropTypes.string,
}

export default MonitoringPortalLink
