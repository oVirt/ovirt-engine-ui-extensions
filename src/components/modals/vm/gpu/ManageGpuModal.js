import React from 'react'
import PropTypes from 'prop-types'
import { excludeKeys, Spinner } from 'patternfly-react'
import { msg } from '_/intl-messages'
import ManageGpuModalBody from './ManageGpuModalBody'
import StatefulModalPattern from '../../StatefulModalPattern'
import { Button } from '@patternfly/react-core'

class ManageGpuModal extends StatefulModalPattern {
  constructor (props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.onGpuSelectionChange = this.onGpuSelectionChange.bind(this)
    this.state = {
      ...this.state,
      selectedGpus: new Map()
    }
  }

  onGpuSelectionChange (gpu, isSelected) {
    this.setState(state => ({
      selectedGpus: state.selectedGpus.set(gpu.id, isSelected)
    }))
  }

  onSelect () {
    const selectedGpus = this.props.gpus.filter(gpu => {
      const rowSelected = this.state.selectedGpus.get(gpu.id)
      return rowSelected === undefined ? gpu.selected : rowSelected
    })
    this.props.onSelectButtonClick(selectedGpus)
    this.close()
  }

  render () {
    const {
      isLoading,
      gpus
    } = this.props

    const modalBody = (
      <Spinner loading={isLoading}>
        <ManageGpuModalBody
          gpus={gpus}
          selectedGpus={this.state.selectedGpus}
          onGpuSelectionChange={this.onGpuSelectionChange}
        />
      </Spinner>
    )

    const modalButtons = (
      <React.Fragment>
        <Button variant='link' onClick={this.close}>
          {msg.cancelButton()}
        </Button>
        <Button
          variant='primary'
          onClick={this.onSelect}
          isDisabled={gpus.length === 0}
        >
          {msg.saveButton()}
        </Button>
      </React.Fragment>
    )

    return React.cloneElement(super.render(), {
      children: modalBody,
      footer: modalButtons
    })
  }
}

ManageGpuModal.propTypes = {
  ...excludeKeys(StatefulModalPattern.propTypes, ['children', 'footer']),
  isLoading: PropTypes.bool,
  gpus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      cardName: PropTypes.string,
      host: PropTypes.string,
      availableInstances: PropTypes.number,
      maxInstances: PropTypes.number,
      maxResolution: PropTypes.string,
      numberOfHeads: PropTypes.number,
      frameBuffer: PropTypes.string,
      frameRateLimiter: PropTypes.number,
      product: PropTypes.string,
      vendor: PropTypes.string,
      selected: PropTypes.bool
    })),
  onSelectButtonClick: PropTypes.func
}

ManageGpuModal.defaultProps = {
  ...excludeKeys(StatefulModalPattern.defaultProps, ['children', 'footer']),
  dialogClassName: 'modal-lg',
  isLoading: false,
  gpus: []
}

export default ManageGpuModal
