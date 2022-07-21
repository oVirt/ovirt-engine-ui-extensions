import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import { Button, Tooltip } from '@patternfly/react-core'
import { SyncIcon } from '@patternfly/react-icons'

const RefreshDataControl = ({ onRefresh }) => {
  return (
    <Tooltip content={msg.dashboardRefreshButtonTooltip()} position='right-start' distance={5}>
      <Button
        className='refreshButton'
        variant='plain'
        onClick={onRefresh}
      >
        <SyncIcon size='sm' />
      </Button>
    </Tooltip>
  )
}

RefreshDataControl.propTypes = {
  onRefresh: PropTypes.func.isRequired,
}

export default RefreshDataControl
