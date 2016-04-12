import React, { // eslint-disable-line no-unused-vars
  Component,
  Image,
  PropTypes,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

class Setup extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../images/logo.png')}
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
          value={this.props.baseUrl}
          placeholder="members.mychurch.com"
          keyboardType="url"
          onChange={this.props.onChangeURL}
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus/>
        <TouchableHighlight
          onPress={this.props.onGoPress}>
          <View>
            <Text style={styles.urlButton}>Go!</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

Setup.propTypes = {
  onGoPress: PropTypes.func.isRequired,
  onChangeURL: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
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
  }
});

export default Setup;
