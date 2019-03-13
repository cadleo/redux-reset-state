import { isUndefined, getField } from '../../src/middleware/utils'

test('test isUndefined method', () => {
  expect(isUndefined()).toBe(true);
  expect(isUndefined(undefined)).toBe(true);
  expect(isUndefined(null)).toBe(false);
})

test('test getField method', () => {
  expect(getField({ '': 1 }, [''])).toEqual(1);
  expect(getField({ 'state': { 'state': { 'a-b': 12 } } }, ['state', 'state'])).toEqual({ 'a-b': 12 });
  expect(getField({ 'state': { 'state': { 'a-b': 12 } } }, ['state', 'state', 'a-b'])).toEqual(12);
})
