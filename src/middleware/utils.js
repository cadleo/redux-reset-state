export function updateNewStateWithShallowCopy(state, keyStr, endValue) {
  const keyPath = keysToKeyPath(keyStr);
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

/**
 * Convert keys to key-path, for exzample: `'key[0].state.state["state-state"]'` ==> `["key", "0", "state", "state", "state-state"]`
 * The keys containing nested strings `'.'` and `'[]'` cannot be parsed correctly now, for example, `'key[0].state["state[a].state"]'`
 * @param {string} keys 
 * @returns {Array}
 */
export function keysToKeyPath(keys) {
  return keys === '' ? [''] : keys.split('.').reduce((arr, key) => {
    var list = key.split('[').map(s => s.replace(/\]/g, '').replace(/\'|\"/g, '')).filter(i => i);
    return arr.concat(list)
  }, []);
}

export function getField(data, keyStr) {
  const keyPath = keysToKeyPath(keyStr);
  let value;
  try {
    value = data;
    for (let i = 0; i < keyPath.length; i++) {
      value = value[keyPath[i]];
    }
  } catch (e) {
    const message = `, here is your stateKeys: ${keyStr}, it has been converted to: ${JSON.stringify(keyPath)}, if you are sure that your application state has the fields you want to reset, ` + 
    `maybe the stateKeys containing nested strings '.' or '[]', for example, 'state["state[a].state"]', it cannot be parsed correctly`;
    const err = new Error(e.message + message)
    throw err
  }
  if (process.env.NODE_ENV !== 'production') {
    isUndefined(value) && console.warn(`The fields of your application state matched stateKeys ['${keyStr}'] is undefined, please make sure that the spelling is correct`);
  }
  return value
}
