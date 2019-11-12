import React from 'react'
import PropTypes from 'prop-types'
import { noop, Button, Spinner } from 'patternfly-react'
import { msg } from '_/intl-messages'

import VmMigrateModalBody, { AUTO_SELECT_ITEM } from './VmMigrateModalBody'
import StatefulModalPattern from '../StatefulModalPattern'
import { selectItemShape } from '../../forms/SelectFormGroup'

class VmMigrateModal extends StatefulModalPattern {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      hostId: AUTO_SELECT_ITEM.value,
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
    this.props.onRefreshHosts(migrateVmsInAffinity)
  }

  onMigrateButtonClick () {
    const hostId =
      this.state.hostId === AUTO_SELECT_ITEM.value
        ? undefined
        : this.state.hostId

    this.props.onMigrateToHost(hostId, this.state.migrateVmsInAffinity)
    this.close()
  }

  render () {
    const {
      isLoading,
      vmNames,
      targetHostItems
    } = this.props

    const modalBody = (
      <Spinner loading={isLoading}>
        <VmMigrateModalBody
          vmNames={vmNames}
          migrateVmsInAffinity={this.state.migrateVmsInAffinity}
          targetHostItems={targetHostItems}

          onHostSelectionChange={this.onHostSelectionChange}
          onMigrateVmsInAffinityChange={this.onMigrateVmsInAffinityChange}
        />
      </Spinner>
    )

    const modalButtons = (
      <React.Fragment>
        <Button onClick={this.close}>
          {msg.cancelButton()}
        </Button>
        <Button
          bsStyle='primary'
          onClick={this.onMigrateButtonClick}
          disabled={targetHostItems.length === 0}
        >
          {msg.migrateVmButton()}
        </Button>
      </React.Fragment>
    )

    return React.cloneElement(
      super.render(),
      {
        title: msg.migrateVmDialogTitle(),
        children: modalBody,
        footer: modalButtons
      }
    )
  }
}

VmMigrateModal.propTypes = {
  // data input
  isLoading: PropTypes.bool,
  vmNames: PropTypes.arrayOf(PropTypes.string),
  targetHostItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),

  // operation callbacks
  onMigrateToHost: PropTypes.func,
  onRefreshHosts: PropTypes.func,

  // modal props
  show: PropTypes.bool,
  onExited: StatefulModalPattern.propTypes.onExited,
  container: StatefulModalPattern.propTypes.container,
  dialogClassName: StatefulModalPattern.propTypes.dialogClassName
}

VmMigrateModal.defaultProps = {
  // data input
  isLoading: false,
  vmNames: [],
  targetHostItems: [],

  // operation callbacks
  migrateToHost: noop,
  refreshHosts: noop,

  // modal props
  show: false,
  onExited: StatefulModalPattern.defaultProps.onExited,
  container: StatefulModalPattern.defaultProps.container,
  dialogClassName: 'modal-lg'
}

export default VmMigrateModal
