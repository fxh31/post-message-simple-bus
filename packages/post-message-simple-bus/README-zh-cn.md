中文 | [English](./README.md)

# 使用指南

## 安装

```bash
npm install post-message-simple-bus
```

## 基本使用

### 注册并监听事件

监听指定事件。

```js
import { PostMessageBus } from "post-message-simple-bus";

const postBus = new PostMessageBus(); // 初始化
// 监听 loaded 事件
postBus.on("loaded", (source, data, event) => {
  // 监听事件内可获取发送消息的源
  // 在监听事件内可直接借助 source 向其发送消息，不需要配置 options
  source.emit("token", {
    name: "token from container",
  });
});
```

> **原理**：利用 `window.addEventListener` 监听 message 事件。

### 发送消息（触发事件）

向指定端口发送消息，必须配置 targetWindow 和 targetOrigin。

```js
import { PostMessageBus } from "post-message-simple-bus";

const postBus = new PostMessageBus({
  targetOrigin: "http://localhost:5100", // 指定发送地址
  targetWindow: window.parent, // 指定发送端端口（window）
}); // 初始化事件总线

// 发送 loaded 事件
postBus.emit("loaded", {
  name: "loaded from child",
});
```

### 修改配置

在某些情况下，初始化时并不能确定发送地址，可通过 change 手动修改配置，再发送消息。

```js
function sendMessage() {
  const iframe = document.getElementById("iframeId-" + currentIndex.value);

  postBus.config({
    targetWindow: iframe?.contentWindow,
    targetOrigin: "*",
  }); // 修改配置
}
```

## 注意事项

- 每一个 window 底下都只能初始化一个 PostMessageBus。
- 注意注册的时机，触发事件前必须先注册。
- 注意主项目和子项目之间代码的异步执行，均遵循事件循环顺序。

## API

### on

监听（注册）指定类型事件。

```ts
interface EventCallback {
  source: sourceType,
  data: any,
  event?: MessageEvent
}
on(eventType: string, callback: EventCallback): void
```

- eventType: 事件类型。
- callback: 注册回调函数。接收三个参数：
  > 该回调函数会在 `emit()` 触发对应 eventType 时执行。
  - source: 发送源事件对象。
  - data: 事件参数。
  - event: 事件对象。

### emit

触发指定类型事件。

```ts
emit(eventType: string, data?: any): void
```

- eventType: 事件类型。
- data: 传递数据

### config

修改配置。

```ts
export interface PostMessageBusOptions {
  targetOrigin: string;
  targetWindow: Window;
}
config(options: PostMessageBusOptions): void
```

- options: 配置对象。
  - targetOrigin: 发送地址。
  - targetWindow: 发送端端口（window）

### destroy

销毁事件总线。摧毁当前 window 下所有的 PostMessageBus（message）监听器。
