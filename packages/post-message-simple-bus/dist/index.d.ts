export type EmitOptions = (eventType: string, data: any) => void;
export interface sourceType {
    window: Window;
    origin: string;
    emit: EmitOptions;
}
export type EventCallback = (source: sourceType, data: any, event: MessageEvent) => void;
export interface PostMessageBusOptions {
    targetOrigin: string;
    targetWindow: Window;
}
export declare class PostMessageBus {
    private listeners;
    private options;
    constructor(options?: PostMessageBusOptions);
    private initListener;
    private handleMessage;
    /**
     * 注册监听事件
     * @param eventType 事件类型
     * @param callback 回调函数
     * @returns 关闭监听事件函数
     */
    on(eventType: string, callback: EventCallback): void;
    /**
     * 触发事件
     * @param eventType 事件类型
     * @param data 传递数据
     */
    emit(eventType: string, data: any): void;
    /**
     * 更改配置
     * @param options
     */
    config(options: PostMessageBusOptions): void;
    /**
     * 摧毁当前 window 下所有的 PostMessageBus（message）监听器
     */
    destroy(): void;
}
