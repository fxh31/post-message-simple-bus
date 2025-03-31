# 使用指南

## 安装

```bash
npm install post-message-simple-bus
```

## 基本使用

### 初始化事件总线

**主项目：**

> 主项目地址：`http://localhost:5200/`。

```js
import { CrossFrameEventBus } from 'post-message-simple-bus';

const iframe = document.querySelector(`#iframeContainer`);
const iframeWindow = iframe.contentWindow;

const mainBus = new CrossFrameEventBus(
  iframeWindow, // 指定接收端端口（window）
  'http://localhost:5201/', // 子项目域名（*：通配符 string | string[]）
  true, // 开启调试模式
)
```

**子项目：**

```js
import { CrossFrameEventBus } from 'post-message-simple-bus';

const childBus = new CrossFrameEventBus(
  window.parent, // 指定接收端端口（window）
  'http://localhost:5201/', // 接收方域名（string | string[]）
  true, // 开启调试模式
)
```

### 发送消息

向监听了该事件的子项目发送消息。

```js
mainBus.emit('test_event', { name: 'test' })
```

### 接收消息

监听对应事件的返回值。

```js
childBus.on('test_event', (res) => {
  console.log('res', res); // test
})
```

### Promise

如果有异步函数请求，可以以 promise 的形式获取返回值。

```js
// 向指定地址发起请求，可带参数
async function getRequest() {
  const res = await mainBus.request('test_request', { name: 'hannah' }, {
    timeout: 5000,
    targetOrigin: 'http://localhost:5201/',
  })
}
```
> **注意**：如果不指定 targetOrigin 则默认以初始化的 url（url 数组第一项）为准。

```js
function fetchMock(name) {
  const res = {
    code: 200,
    data: {
      name,
      age: 18,
      address: '重庆',
    },
  }
  return Promise.resolve(res)
}

// 响应请求
childBus.onRequest('test_request', async (data, response) => {
  const res = await fetchMock(data.name)
  if (200 <= res.code < 300) {
    response(res, true)
  }
})
```

## API

### on()

监听（注册）指定类型事件。

```js
on(eventType: string, callback: EventCallback): function
```

- eventType: 事件类型。
- callback: 注册回调函数。
  > 该回调函数会在 `emit()` 触发对应 eventType 时执行。

> 返回值：关闭事件监听函数。

### emit()

触发指定类型事件。

```js
emit(eventType: string, data?: any): void
```

- eventType: 事件类型。
- data: 事件参数。

### request()

对指定类型事件发起请求，如果超过指定时间未收到响应，则响应超时异常。

```js
request(eventType: string, data?: any, timeout?: number): Promise<any>
```

- eventType: 事件类型。
- data: 请求参数。
- timeout: 请求超时时间（ms），默认 5000。

> 返回值：带结果的 Promise 响应。
 
### onRequest()

响应指定类型事件请求，

```js
type ResponseFunction = (data: any, success?: boolean) => void;

onRequest(eventType: string, handler: (data: any, response: ResponseFunction) => void) : void
```

- eventType：事件类型。
- response： 响应函数。
  - data：响应数据。该数据会作为 `request()` 函数的 Promise 的 resolve 参数。
  - success：响应结果。
  > **注意**：如果**没有执行响应函数**或者**指定事件类型没有进行注册**（requset），则会响应超时异常。
