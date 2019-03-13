import cloneDeep from 'lodash/cloneDeep'
import { isArray, isString, getField, updateNewStateWithShallowCopy } from './utils'

export const resetReduxActionType = '@@redux-reset-state/RESET';

let cacheInitialState = {};
function createResetReduxStateFunction({ dispatch, getState }) {
  cacheInitialState = cloneDeep(getState());
  if(process.env.NODE_ENV !== 'production') {
    console.log('The redux initialState has been deeply cloned and cached:', cacheInitialState);
  }
  return payload => {
    dispatch({
      type: resetReduxActionType,
      payload
    })
  }
}

export function composeRootReducer(rootReducer) {
  return (state, action) => {
    const { type, payload: stateKeys } = action;
    if (type === resetReduxActionType) {
      if (!isArray(stateKeys)) {
        throw new Error('Expected the payload of action to be an array');
      }

      if (!stateKeys.length) {
        return state;
      }

      const typeArr = [];
      let isValid = stateKeys.every(k => {
        const isArrayType = isArray(k);
        !isArrayType && typeArr.push(typeof k);
        return isArrayType;
      });
      if (!isValid) {
        throw new Error(`Expected the member of payload to be an array but got '${typeArr.join(' and ')}'`);
      }
      
      isValid = stateKeys.every(arr => arr.every(k => {
        // string or number is valid
        const isValidType = isString(k) || (parseInt(k) === k);
        !isValidType && typeArr.push(typeof k);
        return isValidType;
      }));
      if (!isValid) {
        throw new Error(`Expected the member of key-path-array to be a string or number but got '${typeArr.join(' and ')}'`);
      }

      const newState = { ...state };
      stateKeys.forEach(keyPath => {
        // cloneDeep for some impure reducers
        const initState = cloneDeep(getField(cacheInitialState, keyPath));
        updateNewStateWithShallowCopy(newState, keyPath, initState);
      })
      return newState;
    }
    return rootReducer(state, action);
  }
}

let realResetReduxState = () => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(`Please apply the 'resetMiddleware' with 'applyMiddleware' first`);
  }
};
export const resetReduxState = (...arg) => realResetReduxState(...arg);
export const resetMiddleware = ({ dispatch, getState }) => next => {
  // The code bellow will be executed only once after `dispatch({ type: ActionTypes.INIT })`
  realResetReduxState = createResetReduxStateFunction({ dispatch, getState });
  return action => next(action);
}
