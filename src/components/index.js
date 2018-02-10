import React, { Component } from 'react'
import { resetReduxState } from '../middleware/reduxResetMiddleware'
import hoistNonReactStatics from 'hoist-non-react-statics';

export default stateKeys => {

  return function wrapWithRedsetStateWhenUnmount(WrappedComponent) {
    class RedsetStateWhenUnmount extends Component {
      static displayName = `Reset(${stateKeys})(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
      
      componentWillUnmount() {
        resetReduxState(stateKeys)
      }
      
      render() {
        return <WrappedComponent resetReduxState={resetReduxState} {...this.props} />;
      }
    }

    return hoistNonReactStatics(RedsetStateWhenUnmount, WrappedComponent);
  }
}
  