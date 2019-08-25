// 常量
export const key = '__ironReducerKey';
const initAction = { type: '@ironReducer/INIT' };

/**
 *  解析reducerMap
 */

function mapValues(obj, fn) {
  return Object.keys(obj).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: fn(obj[key], key),
    }),
    {},
  );
}

/**
 * @desc reducer复用
 * @param reducers 需要复用的reducer
 * @param reducerKey reducer的key值
 */
export function ironReducer(reducers, reducerKey) {
  let isCustomMountPoint;
  if (typeof reducers === 'function') {
    if (!reducerKey) {
      throw new Error('请指定reducer的key值!');
    } else {
      isCustomMountPoint = true;
    }
  }

  const initialState = isCustomMountPoint
    ? reducers(undefined, initAction)
    : mapValues(reducers, reducer => reducer(undefined, initAction));

  return (state = initialState, action) => {
    if (action && action.meta && action.meta[key]) {
      const actionReducerKey = action.meta[key];
      if (isCustomMountPoint && reducerKey === actionReducerKey) {
        return reducers(state, action);
      }

      // 取某一个key下的reucer
      const reducer = reducers[actionReducerKey];

      if (reducer) {
        return {
          ...state,
          [actionReducerKey]: reducer(state[actionReducerKey], action),
        };
      }
    }

    return state;
  };
}
