import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'
import { formatNumber0D } from '_/utils/intl'
import { inventoryStatus as inventoryStatusDataShape } from './dataShapes'

import { Card, CardTitle, CardBody, Tooltip } from '@patternfly/react-core'
import {
  EnterpriseIcon, ClusterIcon, ScreenIcon, StorageDomainIcon, VolumeIcon,
  VirtualMachineIcon, BellIcon, QuestionCircleIcon, ErrorCircleOIcon, WarningTriangleIcon,
  FlagIcon, OkIcon, ArrowAltCircleUpIcon, ArrowAltCircleDownIcon,
} from '@patternfly/react-icons'

/* eslint-disable key-spacing */
const HEADER_ICON = {
  'building'       : <EnterpriseIcon height='1.1em' width='1.1em'className='aggregate-status-count' />,
  'cluster'        : <ClusterIcon height='1.1em' width='1.1em' className='aggregate-status-count' />,
  'screen'         : <ScreenIcon height='1.1em' width='1.1em' className='aggregate-status-count' />,
  'storage-domain' : <StorageDomainIcon height='1.1em' width='1.1em' className='aggregate-status-count' />,
  'volume'         : <VolumeIcon height='1.1em' width='1.1em' className='aggregate-status-count' />,
  'virtual-machine': <VirtualMachineIcon height='1.1em' width='1.1em' className='aggregate-status-count' />,
  'bell'           : <BellIcon height='1.1em' width='1.1em' className='aggregate-status-count' />,
}

const STATUS_TYPE = {
  up: {
    toText: msg.dashboardStatusTypeUp,
    iconClass: <ArrowAltCircleUpIcon style={{ height: '15px' }} />,
  },
  down: {
    toText: msg.dashboardStatusTypeDown,
    iconClass: <ArrowAltCircleDownIcon style={{ height: '15px' }} />,
  },
  error: {
    toText: msg.dashboardStatusTypeError,
    iconClass: <ErrorCircleOIcon style={{ color: 'var(--pf-global--danger-color--100)', height: '15px' }} />,
  },
  warning: {
    toText: msg.dashboardStatusTypeWarning,
    iconClass: <WarningTriangleIcon style={{ color: 'var(--pf-global--warning-color--100)', height: '15px' }} />,
  },
  alert: {
    toText: msg.dashboardStatusTypeAlert,
    iconClass: <FlagIcon style={{ height: '15px' }} />,
  },
}

const AggregateStatusCard = ({
  data: { totalCount, statuses },
  title,
  mainIconClass,
  noStatusText = '',
  noStatusIconClass = 'ok',
  onTotalCountClick = () => {},
  onStatusCountClick = () => {},
}) => {
  const statusTypeToText =
    (statusType) => STATUS_TYPE[statusType] ? STATUS_TYPE[statusType].toText() : msg.dashboardStatusTypeUnknown()

  const statusTypeToIconClass =
    (statusType) => STATUS_TYPE[statusType] ? STATUS_TYPE[statusType].iconClass : <QuestionCircleIcon />

  const getStatusItemTooltip =
    (statusItem) => `${statusTypeToText(statusItem.type)}: ${formatNumber0D(statusItem.count)}`

  return (
    <Card className='aggregate-status-card' isHoverable>
      <CardTitle>
        <a href='#' onClick={event => { event.preventDefault(); onTotalCountClick() }}>
          {HEADER_ICON[mainIconClass]}
          {' '}
          <span className='aggregate-status-count'>{formatNumber0D(totalCount)}</span>
          {' '}
          <span className='aggregate-status-title'>{title}</span>
        </a>
      </CardTitle>
      <CardBody>
        <p className='aggregate-status-notifications'>
          {statuses.map(statusItem => (
            <span className='aggregate-status-notification' key={statusItem.type}>
              <Tooltip content={getStatusItemTooltip(statusItem)} distance={5}>
                <a href='#' onClick={event => {
                  event.preventDefault()
                  onStatusCountClick(statusItem)
                }}
                >
                  {statusTypeToIconClass(statusItem.type)}
                  {formatNumber0D(statusItem.count)}
                </a>
              </Tooltip>
            </span>
          ))}

          {statuses.length === 0 && (
            <span className='aggregate-status-notification'>
              {noStatusIconClass && <OkIcon />}
              {noStatusText}
            </span>
          )}
        </p>
      </CardBody>
    </Card>
  )
}

AggregateStatusCard.propTypes = {
  data: inventoryStatusDataShape.isRequired,
  title: PropTypes.string.isRequired,
  mainIconClass: PropTypes.string.isRequired,
  noStatusText: PropTypes.string,
  noStatusIconClass: PropTypes.string,
  onTotalCountClick: PropTypes.func, // () => void
  onStatusCountClick: PropTypes.func, // (statusItem:object) => void
}

export default AggregateStatusCard
