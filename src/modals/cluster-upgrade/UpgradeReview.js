import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '_/intl-messages'

import {
  Card,
  CardTitle, // NOTE: Can't use Card.Title due to https://github.com/patternfly/patternfly-react/issues/2931
  CardBody,
  Icon,
} from 'patternfly-react'

const UpgradeReview = ({
  hostCount,
  nonMigratableVmCount,
  migrateVmCount,
}) => {
  return (
    <div className='clusterUpgradeWizard-UpgradeReview'>

      <Card>
        <CardTitle>
          <Icon type='pf' name='container-node' className='circle-icon' />
          <div className='info-label'>
            { msg.clusterUpgradeHostsLabel({ count: hostCount }) }
          </div>
        </CardTitle>
        <CardBody>
          { msg.clusterUpgradeHostsDescription() }
        </CardBody>
      </Card>

      { nonMigratableVmCount !== undefined && (
        <Card>
          <CardTitle>
            <Icon type='pf' name='virtual-machine' className='circle-icon' />
            <div className='info-label'>
              { msg.clusterUpgradeNonMigratableLabel({ count: nonMigratableVmCount }) }
            </div>
          </CardTitle>
          <CardBody>
            { msg.clusterUpgradeNonMigratableDescription() }
          </CardBody>
        </Card>
      )}

      { migrateVmCount !== undefined && (
        <Card>
          <CardTitle>
            <Icon type='pf' name='virtual-machine' className='circle-icon' />
            <div className='info-label'>
              { msg.clusterUpgradeMigrateLabel({ count: migrateVmCount }) }
            </div>
          </CardTitle>
          <CardBody>
            { msg.clusterUpgradeMigrateDescription() }
          </CardBody>
        </Card>
      )}

    </div>
  )
}

UpgradeReview.propTypes = {
  hostCount: PropTypes.number.isRequired,
  nonMigratableVmCount: PropTypes.number,
  migrateVmCount: PropTypes.number,
}

export default UpgradeReview
