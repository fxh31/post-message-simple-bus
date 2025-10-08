export type EmitOptions = (eventType: string, data: any) => void;
export interface sourceType {
  window: Window;
  origin: string;
  emit: EmitOptions;
}
export type EventCallback = (
  source: sourceType,
  data: any,
  event: MessageEvent
) => void;
export interface PostMessageBusOptions {
  targetOrigin: string;
  targetWindow: Window;
}

export class PostMessageBus {
  private listeners = new Map<string, Set<EventCallback>>();
  private options: PostMessageBusOptions | any;

  constructor(options?: PostMessageBusOptions) {
    this.handleMessage = this.handleMessage.bind(this); // tips：将 this 绑定在 CrossFrameEventBus 的实例对象上，或使用箭头函数。否则 this 会在 window 上，导致获取对象中的属性异常
    this.options = Object.assign({}, this.options, options);
    this.initListener();
  }

  private initListener() {
    // 单例模式，一个 window 只能拥有一个 PostMessageBus
    if (window._postMessageBus) {
      console.warn("[post-message-simple-bus] PostMessageBus already init");
      return;
    }
    window._postMessageBus = true;
    window?.addEventListener("message", this.handleMessage);
  }
  private handleMessage(event: MessageEvent) {
    // 封装源信息对象，可直接在内部对消息源发信息
    const source: sourceType = {
      window: event.source as Window,
      origin: event.origin,

      emit: (eventType: string, data: any) => {
        event.source?.postMessage(
          { type: eventType, data },
          event.origin as WindowPostMessageOptions
        );
      },
    };
    const { type, data } = event.data;

    // 确保符合的监听对象出现，隔离无关消息
    if (type && this.listeners?.has(type)) {
      this.listeners.get(type)?.forEach((cb) => cb(source, data, event));
    }
  }

  /**
   * 注册监听事件
   * @param eventType 事件类型
   * @param callback 回调函数
   * @returns 关闭监听事件函数
   */
  on(eventType: string, callback: EventCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(callback);
  }

  /**
   * 触发事件
   * @param eventType 事件类型
   * @param data 传递数据
   */
  emit(eventType: string, data: any) {
    const { targetWindow, targetOrigin } = this.options;
    if (!targetWindow || !targetOrigin) {
      console.warn(
        "[PostMessageBus] targetWindow or targetOrigin is not defined"
      );
      return;
    }
    targetWindow.postMessage({ type: eventType, data }, targetOrigin);
  }

  /**
   * 更改配置
   * @param options
   */
  config(options: PostMessageBusOptions) {
    this.options = Object.assign({}, this.options, options);
  }

  /**
   * 摧毁当前 window 下所有的 PostMessageBus（message）监听器
   */
  destroy() {
    window.removeEventListener("message", (err) => {
      console.log("remove listener", err);
    });
    this.listeners.clear();
  }
}
