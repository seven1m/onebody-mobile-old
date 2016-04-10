import { NativeModules, NativeAppEventEmitter } from 'react-native';
const { WebViewProxyManager } = NativeModules;

let subscription;

export default {
  setup() {
    subscription = NativeAppEventEmitter.addListener(
      'WebRequest',
      ({id, status, headers, data}) => {
        if (headers['Content-Type'].match(/^text\/html/)) {
          data = data
                 .replace(/<header[^]*<\/header>/m, '')
                 .replace(/<footer[^]*<\/footer>/m, '')
                 .replace(/<div class='main-footer no-margin-left'>\n\s*<ul class='footer-links[^]*<\/ul>[^]*?<\/div>/m, '');
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
