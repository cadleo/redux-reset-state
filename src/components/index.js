import React, { Component } from 'react'
import { resetReduxState } from '../middleware/reduxResetMiddleware'

export default stateKeys => WrappedComponent => class ReduxResetHOC extends Component {
  static displayName = `Reset(${stateKeys})(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  
  componentWillUnmount() {
    resetReduxState(stateKeys)
  }

  render() {
    return <WrappedComponent {...this.props} />;
  }
}
