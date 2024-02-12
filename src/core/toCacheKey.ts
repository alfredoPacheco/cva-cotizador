const hasObjectPrototype = o => {
  return Object.prototype.toString.call(o) === '[object Object]';
};

// Copied from: https://github.com/jonschlinkert/is-plain-object
export const isPlainObject = o => {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === 'undefined') {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  // eslint-disable-next-line no-prototype-builtins
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

// Copied from react-query: https://github.com/TanStack/query/blob/a9706a0bef43c58fea7e0ee17d941c0d0bec5f28/src/core/utils.ts#L268
const toCacheKey = (...args) => {
  const cacheKey = JSON.stringify(args, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {})
      : val
  );
  return cacheKey;
};

export default toCacheKey;
