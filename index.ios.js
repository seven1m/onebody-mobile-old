import React, {
  AppRegistry,
  AsyncStorage,
  Component,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  WebView
} from 'react-native';

import WebViewProxy from './ios/web_view_proxy';

class OneBodyMobile extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      go: false,
      loaded: false,
      html: '',
      baseUrl: ''
    };
  }

  componentDidMount() {
    WebViewProxy.setup();
    AsyncStorage.multiGet(['url', 'go'], (err, result) => {
      const [[,url], [,go]] = result;
      const goBool = (go == 'true');
      this.setState({url, go: goBool, loaded: true});
    });
  }

  componentWillUnmount() {
    WebViewProxy.teardown();
  }

  render() {
    if (!this.state.loaded) {
      return <View/>;
    } else if (this.state.go) {
      return (
        <View style={styles.containerStretch}>
          <WebView
            startInLoadingState={true}
            style={styles.webView}
            source={{url: this.state.go ? this.state.url : null}}
            onLoadHtml={this.handleLoadHtml.bind(this)}/>
          <Text>nice</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('./images/logo.png')}
            resizeMode="contain"/>
          <Text style={styles.heading}>
            OneBody
          </Text>
          <Text style={styles.instructions}>
            Enter your church community URL below:
          </Text>
          <TextInput
            ref="urlInput"
            style={styles.urlInput}
            value={this.state.url}
            placeholder="members.mychurch.com"
            keyboardType="url"
            onChange={(e) => this.setState({url: e.nativeEvent.text})}
            autoCorrect={false}
            autoCapitalize="none"
            autoFocus/>
          <TouchableHighlight
            onPress={this.handleGoClick.bind(this)}>
            <View>
              <Text style={styles.urlButton}>Go!</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
  }

  handleGoClick() {
    let url = this.state.url;
    if (!url.match(/\Ahttp:\/\//))
      url = 'http://' + url;
    this.setState({url, go: true});
    AsyncStorage.multiSet([['url', url], ['go', 'true']]);
  }

  handleLoadHtml(html) {
    return html.replace(/<header[^]*<\/header>/m, '');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  containerStretch: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },
  logo: {
    marginTop: 100,
    width: 100,
    height: 100
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    marginBottom: 20
  },
  instructions: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5
  },
  discreetInstructions: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 5
  },
  urlInput: {
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 35,
    marginLeft: 25,
    marginRight: 25,
    padding: 10
  },
  urlButton: {
    textAlign: 'center',
    borderWidth: 1,
    backgroundColor: '#5b80a6',
    marginTop: 10,
    color: '#fff',
    height: 35,
    padding: 10
  },
  webView: {
    marginTop: 20
  }
});

const webviewJS = "";

AppRegistry.registerComponent('OneBodyMobile', () => OneBodyMobile);
