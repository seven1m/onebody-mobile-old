import React, { // eslint-disable-line no-unused-vars
  AppRegistry,
  AsyncStorage,
  Component,
  StyleSheet,
  View,
  WebView
} from 'react-native';

import WebViewProxy from './ios/web_view_proxy';
import Loading from './components/loading';
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
      profilePath: null,
      loadingProgress: 0,
      loadingActive: false
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
        <View style={styles.container}>
          <WebView
            startInLoadingState={true}
            style={styles.webView}
            source={{url: this.state.go ? this.state.url : null}}
            onNavigationStateChange={this.handleUpdateActualURL.bind(this)}
            onLoadStart={this.handleStartLoad.bind(this)}
            onLoadEnd={this.handleFinishLoad.bind(this)}/>
          <Nav
            onPress={this.handleNavPress.bind(this)}
            url={this.state.actualUrl}
            profilePath={this.state.profilePath}/>
          <View style={styles.progressContainer}>
            <Loading
              progress={this.state.loadingProgress}
              active={this.state.loadingActive}/>
          </View>
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

  handleUpdateActualURL({url}) {
    this.setState({actualUrl: url});
  }

  handleStartLoad() {
    this.setState({loadingProgress: 0.75, loadingActive: true});
  }

  handleFinishLoad() {
    this.setState({loadingProgress: 1, loadingActive: false});
  }

  handleUpdateProfilePath(path) {
    this.setState({profilePath: path});
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },

  webView: {
  },

  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2,
    right: 0
  }
});

AppRegistry.registerComponent('OneBodyMobile', () => OneBodyMobile);
