import React from 'react'
import PropTypes from 'prop-types'
import { noop, Form, Grid } from 'patternfly-react'
import { randomId } from '../../../utils/random'
import SelectFormGroup, { selectItemShape } from '../../forms/SelectFormGroup'
import VmListFormGroup, { VmList } from '../../forms/VmListFormGroup'

const VmMigrateModalBody = ({
  vmInfoLabel,
  vmListLabel,
  vmListShowAllLabel,
  vmListShowLessLabel,
  vmNames,
  hostSelectLabel,
  hostSelectFieldHelp,
  hostSelectItems,
  hostAutoSelectItem,
  onHostSelectionChange
}) => {
  const items = hostAutoSelectItem
    ? [hostAutoSelectItem].concat(hostSelectItems)
    : hostSelectItems

  return (
    <Grid fluid>
      <Grid.Row>
        <Grid.Col sm={12}>
          <div className={'form-group'}>
            {vmInfoLabel || `Migrate ${vmNames.length} Virtual Machines to the selected Host.`}
          </div>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col sm={12}>
          <Form horizontal>
            <SelectFormGroup
              id={randomId()}
              label={hostSelectLabel}
              fieldHelp={hostSelectFieldHelp}
              fieldHelpPlacement={'right'}
              items={items}
              defaultValue={hostAutoSelectItem && hostAutoSelectItem.value}
              usePlaceholder={false}
              onChange={event => { onHostSelectionChange(event.target.value) }}
            />
            <VmListFormGroup
              id={randomId()}
              label={vmListLabel}
              vmNames={vmNames}
              showAllThreshold={10}
              showAllLabel={vmListShowAllLabel}
              showLessLabel={vmListShowLessLabel}
            />
          </Form>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  )
}

export const hostAutoSelectItemValue = '_AutoSelect_'

VmMigrateModalBody.propTypes = {
  vmInfoLabel: PropTypes.string,
  vmListLabel: PropTypes.string,
  vmListShowAllLabel: PropTypes.string,
  vmListShowLessLabel: PropTypes.string,
  vmNames: PropTypes.arrayOf(PropTypes.string),
  hostSelectLabel: PropTypes.string,
  hostSelectFieldHelp: PropTypes.string,
  hostSelectItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  hostAutoSelectItem: PropTypes.shape(selectItemShape),
  onHostSelectionChange: PropTypes.func
}

VmMigrateModalBody.defaultProps = {
  vmInfoLabel: null,
  vmListLabel: 'Virtual Machines',
  vmListShowAllLabel: VmList.defaultProps.showAllLabel,
  vmListShowLessLabel: VmList.defaultProps.showLessLabel,
  vmNames: [],
  hostSelectLabel: 'Destination Host',
  hostSelectFieldHelp: 'Select \'Automatically Choose Host\' to allow the application to select the best suited Host for these Virtual Machines to migrate to.',
  hostSelectItems: [],
  hostAutoSelectItem: {
    value: hostAutoSelectItemValue,
    text: 'Automatically Choose Host'
  },
  onHostSelectionChange: noop
}

export default VmMigrateModalBody
