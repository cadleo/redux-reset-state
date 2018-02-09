import { path, isUndefined, clone } from 'lodash/fp'

export function shallowCopyObjectOnThePathAndAssignTheLast(pathArr, obj, targetValue) {
  if (!pathArr.length || isUndefined(path(pathArr)(obj))) {
    return obj
  }
  pathArr.reduce((object, key, index) => {
    object[key] = (index === pathArr.length - 1 && !isUndefined(targetValue)) ? targetValue : clone(object[key]);
    object = object[key];
    return object
  }, obj);
  return obj;
}
