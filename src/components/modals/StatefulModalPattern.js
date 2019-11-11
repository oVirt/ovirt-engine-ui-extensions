import React from 'react'
import ModalPattern from './ModalPattern'
import { excludeKeys, filterKeys } from 'patternfly-react'

class StatefulModalPattern extends React.Component {
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.show !== prevState.lastPropShow) {
      return {
        show: nextProps.show,
        lastPropShow: nextProps.show
      }
    }

    return null
  }

  constructor (props) {
    super(props)
    this.state = {
      show: props.show,
      lastPropShow: props.show
    }

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.modalPropNames = Object.keys(StatefulModalPattern.propTypes)
  }

  open () {
    this.setState({ show: true })
  }

  close () {
    this.setState({ show: false })
  }

  render () {
    const propsForModalPattern = filterKeys(this.props, key => this.modalPropNames.includes(key))

    return (
      <ModalPattern
        {...propsForModalPattern}
        show={this.state.show}
        onClose={this.close}
      />
    )
  }
}

StatefulModalPattern.propTypes = {
  ...excludeKeys(ModalPattern.propTypes, ['onClose'])
}

StatefulModalPattern.defaultProps = {
  ...excludeKeys(ModalPattern.defaultProps, ['onClose', 'show']),
  show: false
}

export default StatefulModalPattern
