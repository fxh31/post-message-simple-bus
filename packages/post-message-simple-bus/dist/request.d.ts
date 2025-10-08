export type EventCallback = (data: any, event?: MessageEvent) => void;
export type ResponseFunction = (data: any, success?: boolean) => void;
export interface RequestOptions {
    timeout?: number;
    targetOrigin?: string;
}
export declare class CrossFrameEventBus {
    private targetWindow;
    private targetOrigin;
    private debug;
    private listeners;
    private pendingRequests;
    private targetOriginArray;
    constructor(targetWindow: Window, targetOrigin: string | string[], debug?: boolean);
    private initListener;
    private handleMessage;
    /**
     * 注册监听事件
     * @param eventType 事件类型
     * @param callback 回调函数
     * @returns 关闭监听事件函数
     */
    on(eventType: string, callback: EventCallback): () => void;
    /**
     * 触发事件
     * @param eventType 事件类型
     * @param data 传递数据
     */
    emit(eventType: string, data?: any): void;
    /**
     * 发起请求，并将其封装为 promise
     * @param eventType 请求事件类型
     * @param data 传递参数
     * @param timeout 超时时间
     * @returns Promise
     */
    request<T = any>(eventType: string, data?: any, options?: RequestOptions): Promise<T>;
    /**
     * 监听发送的请求并通过 response 响应结果
     * @param eventType 监听事件类型
     * @param handler 执行函数
     */
    onRequest(eventType: string, handler: (data: any, response: ResponseFunction) => void): void;
    off(eventType: string, callback: EventCallback): void;
    destroy(): void;
}
