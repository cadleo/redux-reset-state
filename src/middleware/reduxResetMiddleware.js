import { cloneDeep, isArray, isObject, isUndefined } from 'lodash/fp'

let cacheInitialState = {};
let resetActionType = '';
const defaultResetActionType = '@@redux-reset-state/RESET';

function createResetReduxStateFunction({ dispatch, getState }) {
  cacheInitialState = cloneDeep(getState());
  if(process.env.NODE_ENV !== 'production') {
    console.log('The redux initialState has deeply cloned and cached', cacheInitialState);
  }
  return (payload) => {
    dispatch({
      type: resetActionType,
      payload: payload
    })
  }
}
function throwPayloadError() {
  throw new Error('Expected the arg to be a array or an object which has a array-type property named `stateKeys`')
}

export function composeRootReducer(rootReducer) {
  return (state, action) => {
    const { type, payload } = action;
    if(type === resetActionType) {
      const stateKeys = isArray(payload) 
                        ? payload 
                        : (isObject(payload) && isArray(payload.stateKeys)) 
                          ? payload.stateKeys 
                          : throwPayloadError();
      stateKeys.forEach(key => {
        !isUndefined(cacheInitialState[key]) && (state[key] = cloneDeep(cacheInitialState[key]));
      })
      return { ...state };
    }
    return rootReducer(state, action);
  }
}

let realResetReduxState = () => {};
export const resetReduxState = (...arg) => realResetReduxState(...arg);
function createResetMiddleware(actionType = defaultResetActionType) {
  resetActionType = actionType;
  return ({ dispatch, getState }) => next => {
    realResetReduxState = createResetReduxStateFunction({ dispatch, getState });
    return action => next(action);
  }
}
const resetMiddleware = createResetMiddleware();
resetMiddleware.withResetActionType = createResetMiddleware;

export { resetMiddleware as default }
