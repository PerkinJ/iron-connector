import { combineReducers } from 'redux';
import { ironReducer } from './ironReducer';

/**
 * @desc 对createStore进行封装
 * @param 接收一个createStore函数
 * @returns 返回增强版的store,接收动态的reducer
 */

export default createStore => (reducerMap, ...restProps) => {
  const store = createStore(combineReducers(reducerMap), ...restProps);
  const injectAsyncReducers = (store, as, reducer) => {
    // 增加动态的多实例reducer
    store.asyncReducers[as] = ironReducer(reducer, as);
    // 动态插入reducer
    store.replaceReducer(
      combineReducers({
        ...reducerMap,
        ...store.asyncReducers,
      }),
    );
  };
  // 把所用新增的reducer放入到asyncReducers对象中
  (store as any).asyncReducers = {};
  // 添加动态实例注册方法
  (store as any).registerDynamicModule = ({ as, reducer }) => {
    injectAsyncReducers(store, as, reducer);
  };
  // 注销动态实例
  (store as any).unRegisterDynamicModule = (as) => {
    const noopReducer = (state = {}) => state;
    injectAsyncReducers(store, as, noopReducer);
  };
  return store;
};
