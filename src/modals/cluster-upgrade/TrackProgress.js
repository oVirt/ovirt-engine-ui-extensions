import React from 'react'
import PropTypes from 'prop-types'
import IntlMessageFormat from 'intl-messageformat'
import { msg } from '_/intl-messages'
import { currentLocale } from '_/utils/intl'
import { ProgressStatus } from './data'

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
  [ProgressStatus.PENDING]: (clusterName) => msg.clusterUpgradeOperationPending({ clusterName }),
  [ProgressStatus.STARTED]: (clusterName) => msg.clusterUpgradeOperationStarted({ clusterName }),
  [ProgressStatus.COMPLETE]: (clusterName) => msg.clusterUpgradeOperationComplete({ clusterName }),
  [ProgressStatus.FAILED]: (clusterName) => msg.clusterUpgradeOperationFailed({ clusterName }),
}

const STATUS_TO_PROGRESS_VARIANT = {
  [ProgressStatus.PENDING]: null,
  [ProgressStatus.STARTED]: null,
  [ProgressStatus.COMPLETE]: 'success',
  [ProgressStatus.FAILED]: 'warning',
}

const TrackProgress = ({
  cluster,
  upgradeStatus = ProgressStatus.PENDING,
  upgradePercent = 0,
  upgradeLog = [],
  onJumpToEvents,
  onClose,
}) => {
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
              {STATUS_TO_TITLE[upgradeStatus](cluster.name)}
            </Title>
            <EmptyStateBody>
              <Progress
                value={upgradePercent}
                measureLocation='outside'
                variant={STATUS_TO_PROGRESS_VARIANT[upgradeStatus]}
              />
            </EmptyStateBody>
            { upgradeLog.length > 0 && (
              <EmptyStateBody>
                <SimpleLogView logItems={upgradeLog} />
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
  upgradeStatus: PropTypes.oneOf(Object.values(ProgressStatus)),
  upgradePercent: PropTypes.number,
  upgradeLog: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    time: PropTypes.number,
    description: PropTypes.string,
  })),

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
  logItems: TrackProgress.propTypes.upgradeLog,
}
