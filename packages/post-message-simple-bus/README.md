English | [中文](./README-zh-cn.md)

# Usage Guide

## Installation

```bash
npm install post-message-simple-bus
```

## Basic Usage

### Register and Listen for Events

Listen for specified events.

```js
import { PostMessageBus } from "post-message-simple-bus";

const postBus = new PostMessageBus(); // Initialize
// Listen for the 'loaded' event
postBus.on("loaded", (source, data, event) => {
  // Inside the event listener, you can get the source of the message
  // You can directly use 'source' to send messages back without configuring options
  source.emit("token", {
    name: "token from container",
  });
});
```

> **Principle**: Uses `window.addEventListener` to listen for message events.

### Send Messages (Trigger Events)）

Send messages to a specified port, Must configure targetWindow and targetOrigin.

```js
import { PostMessageBus } from "post-message-simple-bus";

const postBus = new PostMessageBus({
  targetOrigin: "http://localhost:5100", // Specify the target origin
  targetWindow: window.parent, // Specify the target window
}); // Initialize the event bus

// Emit the 'loaded' event
postBus.emit("loaded", {
  name: "loaded from child",
});
```

### Modify Configuration

In some cases, the target configuration may not be known during initialization. Use config to manually update the settings before sending messages.

```js
function sendMessage() {
  const iframe = document.getElementById("iframeId-" + currentIndex.value);

  postBus.config({
    targetWindow: iframe?.contentWindow,
    targetOrigin: "*",
  }); // Update configuration
}
```

## Notes

- Only one instance of `PostMessageBus` should be initialized per window.
- Ensure events are registered before they are triggered.
- Be mindful of asynchronous execution between main and child projects, as both follow the event loop order.

## API

### on

Listen for (register) events of a specified type.

```ts
interface EventCallback {
  source: sourceType,
  data: any,
  event?: MessageEvent
}
on(eventType: string, callback: EventCallback): void
```

- `eventType`: The event type.
- `callback`: The callback function to register. Receives three parameters:
  > This callback function executes when emit() triggers the corresponding eventType.
  - `source`: The source event object of the sender.
  - `data`: The event data.
  - `event`: The event object.

### emit

Trigger an event of a specified type.

```ts
emit(eventType: string, data?: any): void
```

- `eventType`: The event type.
- `data`: The data to transmit.

### config

Modify configuration.

```ts
export interface PostMessageBusOptions {
  targetOrigin: string;
  targetWindow: Window;
}
config(options: PostMessageBusOptions): void
```

- `options`: Configuration object.
  - `targetOrigin`: The target origin for sending messages.
  - `targetWindow`: The target window for sending messages.

### destroy

Destroy the event bus. Removes all PostMessageBus (message) listeners under the current window.
