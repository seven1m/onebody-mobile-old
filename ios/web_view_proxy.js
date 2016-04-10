import { NativeModules, NativeAppEventEmitter } from 'react-native';
const { WebViewProxyManager } = NativeModules;

let subscription;

export default {
  setup() {
    subscription = NativeAppEventEmitter.addListener(
      'WebRequest',
      ({id, status, headers, data}) => {
        if (headers['Content-Type'].match(/^text\/html/)) {
          data = data.replace(/<header[^]*<\/header>/m, '');
        }
        WebViewProxyManager.sendResponse(id, status, headers, data);
      }
    );
    WebViewProxyManager.removeAllHandlers(); // in case we get reloaded
    WebViewProxyManager.handleRequestsMatching('http://crccfamily.com*');
  },

  teardown() {
    subscription.remove();
  }
};
