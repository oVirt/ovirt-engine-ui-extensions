import React from 'react'
import PropTypes from 'prop-types'
import { ArrowCircleDownIcon, ArrowCircleUpIcon, UnknownIcon } from '@patternfly/react-icons'

/* eslint-disable key-spacing, no-multi-spaces */
const statusMap = {
  // 'connecting'               : { type: '', name: '', tooltip: '' },
  'down'                     : { icon: ArrowCircleDownIcon, className: 'host-status-icon-red', tooltip: 'Down' },
  // 'error'                    : { type: '', name: '', tooltip: '' },
  // 'initializing'             : { type: '', name: '', tooltip: '' },
  // 'install_failed'           : { type: '', name: '', tooltip: '' },
  // 'installing'               : { type: '', name: '', tooltip: '' },
  // 'installing_os'            : { type: '', name: '', tooltip: '' },
  // 'kdumping'                 : { type: '', name: '', tooltip: '' },
  // 'maintenance'              : { type: '', name: '', tooltip: '' },
  // 'non_operational'          : { type: '', name: '', tooltip: '' },
  // 'non_responsive'           : { type: '', name: '', tooltip: '' },
  // 'pending_approval'         : { type: '', name: '', tooltip: '' },
  // 'preparing_for_maintenance': { type: '', name: '', tooltip: '' },
  // 'reboot'                   : { type: '', name: '', tooltip: '' },
  // 'unassigned'               : { type: '', name: '', tooltip: '' },
  'up'                       : { icon: ArrowCircleUpIcon, className: 'host-status-icon-green', tooltip: 'Up' },
  'DEFAULT'                  : { icon: UnknownIcon },
}

/**
 * Render a Host's status as an Icon
 */
const HostStatusIcon = ({ status }) => {
  const entry = statusMap[status] || statusMap.DEFAULT
  const tooltip = entry.tooltip || status
  const EntryIcon = entry.icon

  return (
    <EntryIcon
      title={tooltip}
      className={`host-status-icon ${entry.className || ''}`}
    />
  )
}

HostStatusIcon.propTypes = {
  status: PropTypes.string,
}

export default HostStatusIcon
