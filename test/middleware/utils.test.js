import { isUndefined, keysToKeyPath, getField } from '../../src/middleware/utils'

test('test isUndefined method', () => {
  expect(isUndefined()).toBe(true);
  expect(isUndefined(undefined)).toBe(true);
  expect(isUndefined(null)).toBe(false);
})

test('test keysToKeyPath method', () => {
  expect(keysToKeyPath('')).toEqual(['']);
  expect(keysToKeyPath('state')).toEqual(['state']);
  expect(keysToKeyPath('state.state')).toEqual(['state', 'state']);
  expect(keysToKeyPath('state["state"]')).toEqual(['state', 'state']);
  expect(keysToKeyPath("state['state']")).toEqual(['state', 'state']);
  expect(keysToKeyPath('state.state["a-b"]')).toEqual(['state', 'state', 'a-b']);
  expect(keysToKeyPath('["state"].state["a-b"]')).toEqual(['state', 'state', 'a-b']);
})

test('test getField method', () => {
  expect(getField({'': 1}, '')).toEqual(1);
  expect(getField({'state': { 'state': { 'a-b': 12 }}}, 'state.state["a-b"]')).toEqual(12);
  expect(getField({'state': { 'state': { 'a-b': 12 }}}, "state.state['a-b']")).toEqual(12);
})
