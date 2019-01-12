# redux-reset-state
A redux plugin to reset the redux state you specify.

```bash
$ npm install -S redux-reset-state
```

## Usage

```js
import { createStore, applyMiddleware } from 'redux'
import rootReducer from 'your/path/reducers'
import { composeRootReducer, resetMiddleware, resetReduxState } from 'redux-reset-state'

// Some code is omitted here

const store = createStore(composeRootReducer(rootReducer), initialState, applyMiddleware(
  resetMiddleware
))

// If the shape of your application state is like this: { state: { key: { "state-key": 'value' } } }, 
// you can call the following line of code to reset the state: 
resetReduxState(['state.key["state-key"]', 'state["key"]'])

```
## Hoc in React application

Now the `resetStateWhenUnmount` has been remove from the package, you can copy the code bellow to your application, the hoc will use the `stateKeys` to reset the corresponding states of your application, and in React 16.3, you can use `React.forwardRef` to reconstruct it

```js
import React, { Component } from 'react'
import { resetReduxState } from '../middleware/reduxResetMiddleware'

export default function (stateKeys) {

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

    return RedsetStateWhenUnmount;
  }
}
```
## Apis 

#### composeRootReducer
It is used to wrap the `rootReducer` of your application  
#### resetMiddleware
When the redux store is created, the `resetMiddleware` will be called, then `resetMiddleware` will deeply clone and cache the initial state of your application
#### resetReduxState
See the usage above  

## Other

em...., my English is poor
