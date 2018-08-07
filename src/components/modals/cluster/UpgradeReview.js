import React from 'react'
import PropTypes from 'prop-types'
import Format from 'intl-messageformat'
import { propNamesToType } from '../../../utils/react'

import {
  Card,
  Icon
} from 'patternfly-react'

const UpgradeReview = ({
  hostCount,
  nonMigratableVmCount,
  migrateVmCount,

  hostsLabel,
  hostsDescription,
  nonMigratableLabel,
  nonMigratableDescription,
  migrateLabel,
  migrateDescription
}) => {
  const hostLabelFormat = new Format(hostsLabel)
  const nonMigratableLabelFormat = new Format(nonMigratableLabel)
  const migrateLabelFormat = new Format(migrateLabel)

  return (
    <div className='clusterUpgradeWizard-UpgradeReview'>

      <Card>
        <Card.Title>
          <Icon type='pf' name='container-node' className='circle-icon' />
          <div className='info-label'>
            { hostLabelFormat.format({ count: hostCount }) }
          </div>
        </Card.Title>
        <Card.Body>
          { hostsDescription }
        </Card.Body>
      </Card>

      { nonMigratableVmCount !== undefined &&
      <Card>
        <Card.Title>
          <Icon type='pf' name='virtual-machine' className='circle-icon' />
          <div className='info-label'>
            { nonMigratableLabelFormat.format({ count: nonMigratableVmCount }) }
          </div>
        </Card.Title>
        <Card.Body>
          { nonMigratableDescription }
        </Card.Body>
      </Card>
      }

      { migrateVmCount !== undefined &&
      <Card>
        <Card.Title>
          <Icon type='pf' name='virtual-machine' className='circle-icon' />
          <div className='info-label'>
            { migrateLabelFormat.format({ count: migrateVmCount }) }
          </div>
        </Card.Title>
        <Card.Body>
          { migrateDescription }
        </Card.Body>
      </Card>
      }

    </div>
  )
}

UpgradeReview.i18nProps = {
  hostsLabel: '{count,number} {count, plural, one {Host} other {Hosts}}',
  hostsDescription: 'Will be upgraded one at a time during Cluster upgrade',
  nonMigratableLabel: '{count,number} Pinned VMs',
  nonMigratableDescription: 'Will be stopped before Cluster upgrade',
  migrateLabel: '{count,number} VMs',
  migrateDescription: 'Will be migrated to a new Host before Cluster upgrade'
}

UpgradeReview.propTypes = {
  hostCount: PropTypes.number.isRequired,
  nonMigratableVmCount: PropTypes.number,
  migrateVmCount: PropTypes.number,

  ...propNamesToType(UpgradeReview.i18nProps, PropTypes.string)
}

UpgradeReview.defaultProps = {
  ...UpgradeReview.i18nProps
}

export default UpgradeReview
