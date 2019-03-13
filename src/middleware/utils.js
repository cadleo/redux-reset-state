export function updateNewStateWithShallowCopy(state, keyPath, endValue) {
  keyPath.reduce((object, key, index) => {
    object[key] = (index === keyPath.length - 1) ? endValue : { ...object[key] };
    object = object[key];
    return object
  }, state);
  return state;
}

export function isString(v) {
  return typeof v === 'string';
}

export function isUndefined(v) {
  return typeof v === 'undefined';
}

export function isArray(v) {
  return Array.isArray(v);
}

export function getField(data, keyPath) {
  let value;
  try {
    value = data;
    for (let i = 0; i < keyPath.length; i++) {
      value = value[keyPath[i]];
    }
  } catch (e) {
    const message = `, here is your key-path: ${JSON.stringify(keyPath)}, please make sure that your application state has the fields you want to reset`;
    const err = new Error(e.message + message)
    throw err
  }
  if (process.env.NODE_ENV !== 'production') {
    isUndefined(value) && console.warn(`The fields of your application state matched key-path ${JSON.stringify(keyPath)} is undefined, please make sure that the spelling is correct`);
  }
  return value
}
