import React, { // eslint-disable-line no-unused-vars
  AppRegistry,
  AsyncStorage,
  Component,
  StyleSheet,
  View,
  WebView
} from 'react-native';

import WebViewProxy from './ios/web_view_proxy';
import Nav from './components/nav';
import Setup from './components/setup';

class OneBodyMobile extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      go: false,
      loaded: false,
      html: '',
      actualUrl: null,
      profilePath: null
    };
  }

  componentDidMount() {
    WebViewProxy.setup();
    WebViewProxy.onProfilePathUpdate = this.handleUpdateProfilePath.bind(this);
    AsyncStorage.multiGet(['url', 'go'], (err, result) => {
      const [[,baseUrl], [,go]] = result;
      const goBool = (go == 'true');
      this.setState({baseUrl, url: baseUrl, go: goBool, loaded: true});
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
            onNavigationStateChange={this.handleUpdateActualUrl.bind(this)}/>
          <Nav
            onPress={this.handleNavPress.bind(this)}
            url={this.state.actualUrl}
            profilePath={this.state.profilePath}/>
        </View>
      );
    } else {
      return (
        <Setup
          baseUrl={this.state.baseUrl}
          onGoPress={this.handleGoPress.bind(this)}
          onChangeURL={(e) => this.setState({baseUrl: e.nativeEvent.text})}/>
      );
    }
  }

  handleGoPress() {
    let { baseUrl } = this.state;
    if (!baseUrl.match(/^https?:\/\//)) baseUrl = 'http://' + baseUrl;
    this.setState({baseUrl, url: baseUrl, go: true});
    AsyncStorage.multiSet([['url', baseUrl], ['go', 'true']]);
  }

  handleNavPress(id) {
    const path = {
      home:      '/',
      directory: '/search',
      groups:    '/groups',
      me:        this.state.profilePath || '/people'
    }[id];
    this.setState({
      url: this.state.baseUrl + path + '#' + Math.random() // force webview to update with random number
    });
  }

  handleUpdateActualUrl({url}) {
    this.setState({actualUrl: url});
  }

  handleUpdateProfilePath(path) {
    this.setState({profilePath: path});
  }
}

const styles = StyleSheet.create({
  containerStretch: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },
  webView: {
    marginTop: 20
  }
});

AppRegistry.registerComponent('OneBodyMobile', () => OneBodyMobile);
