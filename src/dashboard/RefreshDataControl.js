import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import { Tooltip } from '@patternfly/react-core'

const RefreshDataControl = ({ onRefresh }) => {
  return (
    <Tooltip content={msg.dashboardRefreshButtonTooltip()} position='bottom' distance={5}>
      <div className='btn-group'>
        <button type='button' className='btn btn-default' onClick={event => {
          event.preventDefault()
          onRefresh()
        }}>
          <i className='fa fa-refresh' />
        </button>
        {/* refresh configuration drop down menu would go here */}
      </div>
    </Tooltip>
  )
}

RefreshDataControl.propTypes = {
  onRefresh: PropTypes.func.isRequired
}

export default RefreshDataControl
