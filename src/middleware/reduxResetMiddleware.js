import { cloneDeep, isArray, isPlainObject, isUndefined, path, isString } from 'lodash/fp'
import { shallowCopyObjectOnThePathAndAssignTheLast } from './utils'

let cacheInitialState = {};
const config = {
  keyDelimiter: '.',
  resetActionType: '@@redux-reset-state/RESET'
}

function createResetReduxStateFunction({ dispatch, getState }) {
  cacheInitialState = cloneDeep(getState());
  if(process.env.NODE_ENV !== 'production') {
    console.log('The redux initialState has been deeply cloned and cached:', cacheInitialState);
  }
  return (payload) => {
    dispatch({
      type: config.resetActionType,
      payload: payload
    })
  }
}

export function composeRootReducer(rootReducer) {
  return (state, action) => {
    const { type, payload } = action;
    if (type === config.resetActionType) {
      if (process.env.NODE_ENV !== 'production') {
        if (!isArray(payload) && !isPlainObject(payload)) {
          throw new Error('Expected the payload of action to be an array or a plain-object');
        }
        const typeArr = [];
        const isValidated = payload.every(k => {
          const isStringType = isString(k);
          !isStringType && typeArr.push(Object.prototype.toString.call(k));
          return isStringType;
        })
        if (isArray(payload) && !isValidated) {
          throw new Error(`Expected the member of payload to be a string but got '${typeArr.join(' or ')}'`);
        }
      }
      const newState = { ...state };
      const stateKeys = (isArray(payload) ? payload : Object.keys(payload));
      const stateKeysMap = stateKeys.reduce((obj, key) => {
        const pathArr = key.split(config.keyDelimiter).filter(k => k !== '');
        obj[key] = {
          pathArr,
          initState: isArray(payload) ? cloneDeep(path(pathArr)(cacheInitialState)) : payload[key]
        };
        return obj;
      }, {});
      stateKeys.forEach(key => {
        const { pathArr, initState } = stateKeysMap[key];
        if (!isUndefined(initState)) {
          shallowCopyObjectOnThePathAndAssignTheLast(pathArr, newState, cloneDeep(initState));
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`The initState matched '${key}' is undefined, please make sure that the spelling is correct`);
          }
        }
      })
      return newState;
    }
    return rootReducer(state, action);
  }
}

let realResetReduxState = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Please install the 'resetMiddleware' with 'applyMiddleware' first`);
  }
};
export const resetReduxState = (...arg) => realResetReduxState(...arg);
export const resetMiddleware = ({ dispatch, getState }) => next => {
  realResetReduxState = createResetReduxStateFunction({ dispatch, getState });
  return action => next(action);
}

resetMiddleware.setConfig = obj => {
  if (process.env.NODE_ENV !== 'production') {
    if (isPlainObject(obj)) {
      console.warn(`The arg of 'setConfig' must be a plain-object`);
      return 
    }
  }
  Object.assign(config, obj);
}

export { resetMiddleware as default }
