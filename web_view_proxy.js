/*global fetch*/

import WebViewBridge from 'react-native-webview-bridge';

import React, {
  Component
} from 'react-native';

class WebViewProxy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: ''
    };
    if (props.source.url) this.fetch(props.source.url);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source.url && nextProps.source.url != this.props.source.url) {
      this.fetch(nextProps.source.url);
    }
  }

  render() {
    return (
      <WebViewBridge {...this.getWebViewProps()}
        onBridgeMessage={this.handleMessage.bind(this)}
        injectedJavaScript={injectedJS} />
    );
  }

  getWebViewProps() {
    return Object.assign(
      {},
      this.props,
      {
        source: {
          html: this.state.html,
          baseUrl: this.getBaseUrl()
        }
      }
    );
  }

  getBaseUrl() {
    const { url } = this.props.source;
    if (!url) return '';
    return url.match(/^https?:\/\/[^/]+/)[0];
  }

  handleMessage(rawMessage) {
    const message = JSON.parse(rawMessage);
    if (message.action == 'navigate') {
      let { url } = message;
      if (!url.match(/^https?:\/\//)) url = this.getBaseUrl() + url;
      this.fetch(url);
    }
  }

  fetch(url) {
    fetch(url).then((response) => {
      response.text().then((html) => {
        this.setState({
          html: this.props.onLoadHtml(html)
        });
      });
    });
  }
}

const injectedJS = "$(document).on('click', 'a', function(e) { e.preventDefault(); WebViewBridge.send(JSON.stringify({action: 'navigate', url: e.target.getAttribute('href')})); });";

export default WebViewProxy;
