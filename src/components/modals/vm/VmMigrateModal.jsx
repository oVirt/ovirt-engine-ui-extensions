import React from 'react'
import PropTypes from 'prop-types'
import { bindMethods, excludeKeys, filterKeys, Button, Spinner } from 'patternfly-react'
import VmMigrateModalBody, { errorMessageToArray } from './VmMigrateModalBody'
import StatefulModalPattern from '../StatefulModalPattern'

class VmMigrateModal extends StatefulModalPattern {
  constructor (props) {
    super(props)
    bindMethods(this, ['migrateAndClose', 'onHostSelectionChange'])
  }

  async migrateAndClose () {
    const { hostAutoSelectItem, migrateToHost } = this.props
    const hostId = this._hostId || (hostAutoSelectItem && hostAutoSelectItem.value)

    if (hostId) {
      this.setState({ migrateInProgress: true })
      const result = await migrateToHost(hostId)
      this.setState({ migrateInProgress: false })

      if (!Array.isArray(result)) {
        throw new Error('VmMigrateModal: migrateToHost function result is not an array')
      }

      if (result.length === 0) {
        // all VMs were migrated successfully, close the modal
        this.close()
      } else {
        // one or more VMs failed to migrate, keep the modal open
        this.setState({ migrateErrors: result })
      }
    }
  }

  onHostSelectionChange (newHostId) {
    this._hostId = newHostId
  }

  getModalPatternProps () {
    // TODO(vs) check if the latest patternfly-react version has 'includeKeys'
    // to complement the existing 'excludeKeys' helper, post a PR otherwise
    return filterKeys(this.props, key => Object.keys(StatefulModalPattern.propTypes).includes(key))
  }

  render () {
    const {
      hostSelectLabel,
      hostSelectItems,
      hostAutoSelectItem,
      errorMessage,
      isLoading,
      okButtonLabel,
      cancelButtonLabel
    } = this.props
    const { migrateInProgress, migrateErrors = [] } = this.state
    const allErrors = errorMessageToArray(errorMessage).concat(migrateErrors)
    const hasError = allErrors.length > 0

    const modalBody = (
      <Spinner loading={isLoading || migrateInProgress}>
        <VmMigrateModalBody
          hostSelectLabel={hostSelectLabel}
          hostSelectItems={hostSelectItems}
          hostAutoSelectItem={hostAutoSelectItem}
          onHostSelectionChange={this.onHostSelectionChange}
          errorMessage={allErrors}
        />
      </Spinner>
    )

    const modalButtons = (
      <React.Fragment>
        <Button bsStyle='primary' onClick={this.migrateAndClose} disabled={hasError}>
          {okButtonLabel}
        </Button>
        <Button onClick={this.close}>
          {cancelButtonLabel}
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
  okButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string
}

VmMigrateModal.defaultProps = {
  ...excludeKeys(StatefulModalPattern.defaultProps, ['children', 'footer']),
  ...excludeKeys(VmMigrateModalBody.defaultProps, ['onHostSelectionChange']),
  dialogClassName: 'modal-lg',
  title: 'Migrate VM(s)',
  migrateToHost: () => Promise.resolve([]),
  isLoading: false,
  okButtonLabel: 'OK',
  cancelButtonLabel: 'Cancel'
}

export default VmMigrateModal
