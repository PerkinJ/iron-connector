import * as React from "react";
import {
  useDispatch,
  useSelector,
  useStore,
  shallowEqual,
  connect as originConnect
} from "react-redux";
import { bindActionCreators as originalBindActionCreator } from "redux";
import { key } from "./ironReducer";

/**
 * @desc 区分不同key值对应的action，放入meta中进行区分
 * @param action 传入的action
 * @param reducerKey reducer的key值
 */
function wrapAction(action, reducerKey) {
  return {
    ...action,
    meta: {
      ...action.meta,
      [key]: reducerKey
    }
  };
}

/**
 * @desc 对dispatch进行高阶处理
 * @param dispatch 默认的dispatch
 * @param reducerKey reducer的key值
 */
function wrapDispatch(dispatch, reducerKey) {
  const wrappedDispatch = action => {
    let wrappedAction;
    if (typeof action === "function") {
      wrappedAction = (globalDispatch, getState, extraArgument) =>
        action(
          wrappedDispatch,
          getState,
          globalDispatch,
          reducerKey,
          extraArgument
        );
    } else if (typeof action === "object") {
      wrappedAction = wrapAction(action, reducerKey);
    }
    return dispatch(wrappedAction);
  };

  return wrappedDispatch;
}

/**
 * @desc 对bindActionCreator进行封装
 * @param actionCreators
 * @param dispatch
 * @param reducerKey
 */
export function bindActionCreators(actionCreators, dispatch, reducerKey) {
  const wrappedDispatch = wrapDispatch(dispatch, reducerKey);

  return originalBindActionCreator(actionCreators, wrappedDispatch);
}

/**
 * @desc 构造高阶组件形式，简化connect的写法
 */
export function WrappedConnector({
  as,
  reducer,
  actions = null,
  ...restProps
}) {
  const dispatch = useDispatch();
  const newActionCreator = { ...actions };
  const newActions = bindActionCreators(newActionCreator, dispatch, as);
  const reduxProps = useSelector(state => state[as], shallowEqual);
  // 获取store
  const store = useStore();
  // 注册动态redux实例
  (store as any).registerDynamicModule({ as, reducer });

  return (
    <div>
      {React.cloneElement(restProps.children as React.ReactElement<any>, {
        ...reduxProps,
        ...restProps,
        ...newActions
      })}
    </div>
  );
}
export const Connector = React.memo(WrappedConnector);

/**
 * @desc 高阶函数，对react-redux connect进行封装
 * @param 接收reducer参数
 */

export const connect = (mapStateToProps, mapDispatchToProps) => {
  const mapStateToPropsHoc = (state, { as }) => {
    return mapStateToProps(state, { as });
  };
  const mapDispatchToPropsHoc = (dispatch, { as }) => {
    return bindActionCreators(mapDispatchToProps, dispatch, as);
  };
  //

  return originConnect(mapStateToPropsHoc, mapDispatchToPropsHoc);
};
