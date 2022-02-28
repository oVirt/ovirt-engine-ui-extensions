import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import {
  Card,
  CardTitle,
  CardBody,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core'
import { ContainerNodeIcon } from '@patternfly/react-icons'

const UpgradeReview = ({
  heading,
  hostCount,
}) => {
  return (
    <Stack className='clusterUpgradeWizard-UpgradeReview'>
      <StackItem>
        <Title headingLevel='h2'>{heading}</Title>
      </StackItem>
      <StackItem isFilled className='clusterUpgradeWizard-UpgradeReview-Cards'>
        <Card>
          <CardTitle>
            <ContainerNodeIcon className='card-title-icon' />
            <div className='card-title-label'>
              { msg.clusterUpgradeHostsLabel({ count: hostCount }) }
            </div>
          </CardTitle>
          <CardBody>
            { msg.clusterUpgradeHostsDescription() }
          </CardBody>
        </Card>
      </StackItem>
    </Stack>
  )
}

UpgradeReview.propTypes = {
  heading: PropTypes.string.isRequired,
  hostCount: PropTypes.number.isRequired,
}

export default UpgradeReview
