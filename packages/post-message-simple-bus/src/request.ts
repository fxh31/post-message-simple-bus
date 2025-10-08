export type EventCallback = (data: any, event?: MessageEvent) => void;
export type ResponseFunction = (data: any, success?: boolean) => void;

export interface RequestOptions {
  timeout?: number;
  targetOrigin?: string;
}

export class CrossFrameEventBus {
  private listeners = new Map<string, Set<EventCallback>>();
  private pendingRequests = new Map<
    string,
    { resolve: Function; reject: Function }
  >();
  private targetOriginArray: string[];

  constructor(
    private targetWindow: Window,
    private targetOrigin: string | string[],
    private debug: boolean = false
  ) {
    this.targetOriginArray = Array.isArray(targetOrigin)
      ? targetOrigin
      : ([targetOrigin] as string[]);
    this.initListener();
  }

  private initListener() {
    window.addEventListener("message", this.handleMessage);
  }

  private handleMessage = (event: MessageEvent) => {
    // 安全校验（示例）
    // if (event.origin !== this.targetOrigin) return;
    const { type, data, isRequest, eventId } = event.data || {};
    if (!type) return;

    if (this.debug) {
      console.log("[CrossFrame] Received:", event.data);
    }

    // 处理订阅事件
    if (this.listeners.has(type)) {
      this.listeners.get(type)?.forEach((cb) => cb(data, event));
    }
    // 处理请求响应
    if (eventId && this.pendingRequests.has(eventId)) {
      const { resolve, reject } = this.pendingRequests.get(eventId)!;
      event.data.success ? resolve(data) : reject(data);
      this.pendingRequests.delete(eventId);
    }
  };
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

    return () => this.off(eventType, callback);
  }
  /**
   * 触发事件
   * @param eventType 事件类型
   * @param data 传递数据
   */
  emit(eventType: string, data?: any) {
    this.targetOriginArray.forEach((origin) => {
      this.targetWindow.postMessage({ type: eventType, data }, origin);
    });
  }

  /**
   * 发起请求，并将其封装为 promise
   * @param eventType 请求事件类型
   * @param data 传递参数
   * @param timeout 超时时间
   * @returns Promise
   */
  request<T = any>(
    eventType: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    const eventId = Math.random().toString(36).slice(2);
    const { timeout = 5000, targetOrigin = this.targetOriginArray[0] } =
      options;

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(eventId, { resolve, reject });
      this.targetWindow.postMessage(
        { type: eventType, data, eventId, isRequest: true },
        targetOrigin
      );

      setTimeout(() => {
        if (this.pendingRequests.has(eventId)) {
          reject(new Error("Request timeout"));
          this.pendingRequests.delete(eventId);
        }
      }, timeout);
    });
  }

  /**
   * 监听发送的请求并通过 response 响应结果
   * @param eventType 监听事件类型
   * @param handler 执行函数
   */
  onRequest(
    eventType: string,
    handler: (data: any, response: ResponseFunction) => void
  ) {
    this.on(eventType, (data: any, originalEvent: MessageEvent) => {
      // 生成 response 函数
      const response: ResponseFunction = (responseData, success = true) => {
        (originalEvent.source as Window).postMessage(
          {
            type: `${eventType}_RESPONSE`, // 可选：自动生成响应类型
            data: responseData,
            eventId: originalEvent.data.eventId, // 自动关联 eventId
            success: success,
          },
          originalEvent.origin
        );
      };

      // 执行用户处理逻辑，并传入 response
      handler(data, response);
    });
  }

  off(eventType: string, callback: EventCallback) {
    this.listeners.get(eventType)?.delete(callback);
  }

  destroy() {
    window.removeEventListener("message", this.handleMessage);
    this.listeners.clear();
  }
}
