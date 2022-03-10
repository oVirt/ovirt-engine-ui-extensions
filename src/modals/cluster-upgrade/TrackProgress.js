import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import IntlMessageFormat from 'intl-messageformat'
import { msg } from '_/intl-messages'
import { currentLocale } from '_/utils/intl'
import { trackUpgradeProgress, cancelTracker } from './data'

import {
  Alert,
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Progress,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core'
import { CogsIcon } from '@patternfly/react-icons'

const STATUS_TO_TITLE = {
  'pending': (clusterName) => msg.clusterUpgradeOperationPending({ clusterName }),
  'started': (clusterName) => msg.clusterUpgradeOperationStarted({ clusterName }),
  'complete': (clusterName) => msg.clusterUpgradeOperationComplete({ clusterName }),
  'failed': (clusterName) => msg.clusterUpgradeOperationFailed({ clusterName }),
}

const STATUS_TO_PROGRESS_VARIANT = {
  'pending': null,
  'started': null,
  'complete': 'success',
  'failed': 'warning',
}

const TrackProgress = ({
  cluster,
  correlationId,
  onJumpToEvents,
  onClose,
}) => {
  const [status, setStatus] = useState('pending')
  const [percent, setPercent] = useState(0)
  const [log, setLog] = useState([])

  // track status once a correlation id is set (or changed)
  useEffect(() => {
    if (!correlationId) {
      return
    }

    setStatus('started')
    trackUpgradeProgress(correlationId, ({ isRunning, percent, log }) => {
      setStatus(isRunning ? 'started' : 'complete')
      setPercent(percent)
      setLog(currentLog => [...currentLog, ...log])
    })
    return () => {
      cancelTracker(correlationId)
    }
  }, [correlationId])

  return (
    <Stack>
      <StackItem>
        <Alert variant='info' isInline title={msg.clusterUpgradeTrackProgressInfo()} />
      </StackItem>
      <StackItem isFilled>
        <Bullseye>
          <EmptyState className='clusterUpgradeTrackProgress-Layout' variant='large'>
            <EmptyStateIcon icon={CogsIcon} />
            <Title headingLevel='h4' size='lg'>
              {STATUS_TO_TITLE[status](cluster.name)}
            </Title>
            <EmptyStateBody>
              <Progress
                value={percent}
                measureLocation='outside'
                variant={STATUS_TO_PROGRESS_VARIANT[status]}
              />
            </EmptyStateBody>
            { log.length > 0 && (
              <EmptyStateBody>
                <SimpleLogView logItems={log} />
              </EmptyStateBody>
            )}
            <EmptyStateSecondaryActions>
              <Button variant='secondary' onClick={onJumpToEvents}>
                {msg.clusterUpgradeGoToEventLog()}
              </Button>
              <Button variant='primary' onClick={onClose}>
                {msg.closeButton()}
              </Button>
            </EmptyStateSecondaryActions>
          </EmptyState>
        </Bullseye>
      </StackItem>
    </Stack>
  )
}

TrackProgress.propTypes = {
  cluster: PropTypes.object.isRequired,
  correlationId: PropTypes.string,

  onClose: PropTypes.func.isRequired,
  onJumpToEvents: PropTypes.func.isRequired,
}

export default TrackProgress

/*
  TODO: Use LogViewer here once a compt version is found with - log-viewer 1st
        release was 2021-05-13 closer to react-core 4.87.
*/
const SimpleLogView = ({ logItems }) => {
  const logFormat = new IntlMessageFormat('{time,date,short} {time,time,medium}: {description}', currentLocale())

  return (
    <Stack className='simpleLogView'>
      {logItems.sort((a, b) => b.id - a.id).map(({ id, time, description }) => (
        <StackItem key={id}>{logFormat.format({ id, time, description })}</StackItem>
      ))}
    </Stack>
  )
}
SimpleLogView.propTypes = {
  logItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    time: PropTypes.number,
    description: PropTypes.string,
  })),
}
