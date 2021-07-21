import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import { formatDateTime } from '_/utils/intl'

import { ClockIcon } from '@patternfly/react-icons'

const LastUpdatedLabel = ({ date }) => {
  return (
    <span>
      <ClockIcon /> <b>{msg.dashboardLastUpdated()}</b> {formatDateTime(date)}
    </span>
  )
}

LastUpdatedLabel.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
}

export default LastUpdatedLabel
