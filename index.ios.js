import React, { // eslint-disable-line no-unused-vars
  AppRegistry,
  AsyncStorage,
  Component,
  StatusBar,
  StyleSheet,
  View,
  WebView
} from 'react-native';

import { colors } from './constants';
import WebViewProxy from './ios/web_view_proxy';
import Loading from './components/loading';
import Title from './components/title';
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
      loadingActive: false,
      canGoBack: false
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
          <StatusBar barStyle="light-content"/>
          <View style={styles.statusBarBackground}/>
          <Title
            onBack={this.handleBack.bind(this)}
            showBack={this.state.canGoBack}
            onSearch={this.handleSearch.bind(this)}/>
          <WebView
            ref="webView"
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

  handleUpdateActualURL({url, canGoBack}) {
    this.setState({actualUrl: url, canGoBack});
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

  handleBack() {
    this.refs.webView.goBack();
  }

  handleSearch(value) {
    const url = `${this.state.baseUrl}/search?name=${value}`;
    this.setState({url});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },

  webView: {
  },

  progressContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    height: 2,
    right: 0
  },

  statusBarBackground: {
    backgroundColor: colors.main,
    height: 20
  }
});

AppRegistry.registerComponent('OneBodyMobile', () => OneBodyMobile);
