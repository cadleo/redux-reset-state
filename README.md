# redux-reset-state
A redux plugin to reset the redux state you specify.

```bash
$ npm install -S redux-reset-state
```

## Usage

#### First
```js
import { createStore, applyMiddleware } from 'redux'
import rootReducer from 'your/path/reducers'
import { composeRootReducer, resetMiddleware } from 'redux-reset-state'

// You can configure the delimiter of the stateKeys and the actionType if you need it
resetMiddleware.setConfig({
    resetActionType: 'yourResetActionType', // '@@redux-reset-state/RESET' is the default value
    keyDelimiter: 'yourDelimiter' // '.' is the default value
})

const store = createStore(composeRootReducer(rootReducer), initialState, applyMiddleware(
  resetMiddleware
))

```

#### Second

```js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import resetStateWhenUnmount, { resetReduxState } from 'redux-reset-state'

@connect(
  state => ({
    exampleState: state.exampleStateKey,
    exampleState2: state.exampleStateKey2.subState1
  })
)
// For multiple and nested state
@resetStateWhenUnmount(['exampleStateKey', 'exampleStateKey2.subState1'])
export default class Page extends Component {
  onClick = () => {
    this.props.resetReduxState === resetReduxState // true
    // You can also use it like this    
    this.props.resetReduxState(['exampleStateKey', 'exampleStateKey2.subState1'])
    
    // this is also supported, please make sure that the `exampleState` and `initSubState1`
    // is correct initState-shape whitch matched the stateKeys
    this.props.resetReduxState({
        'exampleStateKey': exampleState,
        'exampleStateKey2.subState1': initSubState1
    })
  }
  
  render(){
    return (
      <div onClick={this.onClick}>
        app
      </div>
    )
  }
}
```
## Apis 

#### composeRootReducer
It is used to wrap the `rootReducer` of the application  
#### resetMiddleware
It is used to deep clone and cache the initial-state of the application, when the redux store is created, the `resetMiddleware` will be called, then `resetMiddleware` will deep clone and cache all initial-state of the application
#### resetReduxState
See the usage above  
#### resetStateWhenUnmount
In the `React` applications, when the `WrappedComponent` will unmount, it will call `resetReduxState`, see the usage above

## Other

em...., my English is poor
