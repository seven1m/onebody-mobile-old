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

class OneBodyMobile extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      go: false,
      loaded: false
    };
  }

  componentDidMount() {
    AsyncStorage.multiGet(['url', 'go'], (err, result) => {
      const [[,url], [,go]] = result;
      this.setState({url, go: go == 'true', loaded: true});
    });
  }

  render() {
    if (!this.state.loaded) {
      return <View/>;
    } else if (this.state.go) {
      return (
        <WebView style={styles.webView} source={{url: this.state.url}}/>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 100
  },
  logo: {
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

AppRegistry.registerComponent('OneBodyMobile', () => OneBodyMobile);
