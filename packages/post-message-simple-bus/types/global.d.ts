export {};

declare global {
  interface Window {
    _postMessageBus?: boolean;
  }
}
