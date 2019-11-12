import React from 'react'
import PropTypes from 'prop-types'
import { excludeKeys, noop, Button, Spinner } from 'patternfly-react'
import VmMigrateModalBody from './VmMigrateModalBody'
import StatefulModalPattern from '../StatefulModalPattern'

class VmMigrateModal extends StatefulModalPattern {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      migrateVmsInAffinity: false
    }

    this.onHostSelectionChange = this.onHostSelectionChange.bind(this)
    this.onMigrateVmsInAffinityChange = this.onMigrateVmsInAffinityChange.bind(this)
    this.onMigrateButtonClick = this.onMigrateButtonClick.bind(this)
  }

  onHostSelectionChange (newHostId) {
    this.setState({ hostId: newHostId })
  }

  onMigrateVmsInAffinityChange (migrateVmsInAffinity) {
    this.setState({ migrateVmsInAffinity: migrateVmsInAffinity })
    this.props.refreshHosts(migrateVmsInAffinity)
  }

  onMigrateButtonClick () {
    const { hostAutoSelectItem, hostSelectItems, migrateToHost } = this.props

    const hostId = this.state.hostId ||
      (hostAutoSelectItem && hostAutoSelectItem.value) ||
      (hostSelectItems.length > 0 && hostSelectItems[0].value)

    migrateToHost(hostId, this.state.migrateVmsInAffinity)
    this.close()
  }

  render () {
    const {
      vmInfoLabel,
      vmListLabel,
      vmListShowAllLabel,
      vmListShowLessLabel,
      vmNames,
      hostSelectLabel,
      hostSelectFieldHelp,
      hostSelectItems,
      hostAutoSelectItem,
      affinityText,
      isLoading,
      migrateButtonLabel,
      cancelButtonLabel
    } = this.props

    const modalBody = (
      <Spinner loading={isLoading}>
        <VmMigrateModalBody
          vmInfoLabel={vmInfoLabel}
          vmListLabel={vmListLabel}
          vmListShowAllLabel={vmListShowAllLabel}
          vmListShowLessLabel={vmListShowLessLabel}
          vmNames={vmNames}
          hostSelectLabel={hostSelectLabel}
          hostSelectFieldHelp={hostSelectFieldHelp}
          hostSelectItems={hostSelectItems}
          hostAutoSelectItem={hostAutoSelectItem}
          affinityText={affinityText}
          migrateVmsInAffinity={this.state.migrateVmsInAffinity}
          onHostSelectionChange={this.onHostSelectionChange}
          onMigrateVmsInAffinityChange={this.onMigrateVmsInAffinityChange}
        />
      </Spinner>
    )

    const modalButtons = (
      <React.Fragment>
        <Button onClick={this.close}>
          {cancelButtonLabel}
        </Button>
        <Button
          bsStyle='primary'
          onClick={this.onMigrateButtonClick}
          disabled={hostSelectItems.length === 0}
        >
          {migrateButtonLabel}
        </Button>
      </React.Fragment>
    )

    return React.cloneElement(super.render(), {
      children: modalBody,
      footer: modalButtons
    })
  }
}

VmMigrateModal.propTypes = {
  ...excludeKeys(StatefulModalPattern.propTypes, ['children', 'footer']),
  ...excludeKeys(VmMigrateModalBody.propTypes, ['onHostSelectionChange']),
  migrateToHost: PropTypes.func,
  isLoading: PropTypes.bool,
  migrateButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string
}

VmMigrateModal.defaultProps = {
  ...excludeKeys(StatefulModalPattern.defaultProps, ['children', 'footer']),
  ...excludeKeys(VmMigrateModalBody.defaultProps, ['onHostSelectionChange']),
  dialogClassName: 'modal-lg',
  title: 'Migrate VM(s)',
  migrateToHost: noop,
  isLoading: false,
  migrateButtonLabel: 'Migrate',
  cancelButtonLabel: 'Cancel'
}

export default VmMigrateModal
