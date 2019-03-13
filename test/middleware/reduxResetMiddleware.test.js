import { resetReduxState, composeRootReducer, resetMiddleware } from '../../src/middleware/reduxResetMiddleware'
import { createStore, applyMiddleware } from 'redux'

const reducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'update-a':
      newState.state = { ...newState.state };
      newState.state.state = { ...newState.state.state };
      newState.state.state.a = action.payload;
      break;
    case 'update-b':
      newState.state = { ...newState.state };
      newState.state.state = { ...newState.state.state };
      newState.state.state.b = action.payload;
      break;
    case 'update-ab':
      newState.state = { ...newState.state };
      newState.state.state = { ...newState.state.state };
      newState.state.state['a-b'] = action.payload;
      break;
  
    default:
  }
  return newState === state ? state : newState;
}

const initA = 'a', initB = 'a', initAB = 'ab';
const store = createStore(composeRootReducer(reducer), { state: { state: { 'a-b': initAB, a: initA, b: initB } } }, applyMiddleware(resetMiddleware))

test('test redux-reset-state package', () => {
  store.dispatch({
    type: 'update-a',
    payload: 'aa'
  })
  expect(store.getState().state.state.a).toBe('aa');
  
  store.dispatch({
    type: 'update-b',
    payload: 'bb'
  })
  expect(store.getState().state.state.b).toBe('bb');

  store.dispatch({
    type: 'update-ab',
    payload: 'aabb'
  })
  expect(store.getState().state.state['a-b']).toBe('aabb');
  expect(store.getState()).toEqual({ state: { state: { 'a-b': 'aabb', a: 'aa', b: 'bb' } } });

  let prevState = store.getState();
  resetReduxState([['state', 'state', 'a']])
  expect(store.getState().state.state.a).toBe(initA);
  expect(store.getState().state.state.b).toBe('bb');
  expect(store.getState().state.state['a-b']).toBe('aabb');
  expect(store.getState().state === prevState.state).toBe(false);
  expect(store.getState().state.state === prevState.state.state).toBe(false);
  prevState = store.getState();

  resetReduxState([['state', 'state', 'a-b']])
  expect(store.getState().state.state.a).toBe(initA);
  expect(store.getState().state.state.b).toBe('bb');
  expect(store.getState().state.state['a-b']).toBe(initAB);
  expect(store.getState().state === prevState.state).toBe(false);
  expect(store.getState().state.state === prevState.state.state).toBe(false);
  prevState = store.getState();

  resetReduxState([['state', 'state', 'b']])
  expect(store.getState().state.state.a).toBe(initA);
  expect(store.getState().state.state.b).toBe(initB);
  expect(store.getState().state.state['a-b']).toBe(initAB);
  expect(store.getState().state === prevState.state).toBe(false);
  expect(store.getState().state.state === prevState.state.state).toBe(false);
  prevState = store.getState();

  resetReduxState([['']])
  expect(store.getState() === prevState).toBe(false);
  expect(store.getState().state === prevState.state).toBe(true);
  prevState = store.getState();
  
  try {
    resetReduxState([['state', 'state', 'b', 'b', 'b']])
  } catch (e) {
    expect(e.message).toContain(`here is your key-path`);
    console.warn(e.message)
  }
})
