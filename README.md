# iron-connector

Lightweight multi-instance redux library based on react-redux.The main purpose of `iron-connector` is to better reuse state logic.

# Solution

We provide two different ways to construct Redux multi-instance applications, including `ironReducer` and `Connector`.
The `Connector`'s method requires:

- `React` >= 16.8
- `react-redux` >= 7.0

## ironReducer

`ironReducer`'s purpose is to strengthen the `reducer`, and construct multi-instance redux applications.
you can try [ironReducer -  Demo](https://codesandbox.io/s/ipxgb)

The key code：

```typescript
const reducer = {
  addTodo: ironReducer(originReducer, "addTodo"),
  addPush: ironReducer(originReducer, "addPush")
};

function TodoApp() {
  return (
    <div>
      <AddTodo as="addTodo" />
      <AddPush as="addPush" />
    </div>
  );
}
```

## Connector

`Connector`'s purpose is to add `Redux` instances dynamically.
you can try [Connector - Demo](https://codesandbox.io/s/l91hn)

The key code：

```typescript
// 根目录store.tsx
import { createStore } from "redux";
import { ironStore, Connecor } from "iron-connector";

// 对redux的createStore增强
const store = ironStore(createStore)(rootReducer);

// 使用Connecor对组件进行封装，绑定动态redux状态
export default () => {
  return (
    <Connector as="addPush" reducer={reducer} actions={actions}>
      <AddPush />
    </Connector>
  );
};

```

# license

MIT