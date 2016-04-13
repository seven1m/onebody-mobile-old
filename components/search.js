import React, { // eslint-disable-line no-unused-vars
  Component,
  PropTypes,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

const Icon = require('react-native-vector-icons/FontAwesome');

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon
          name="search"
          onPress={() => this.refs.input.focus()}
          size={18}
          color="#777"
          backgroundColor="rgba(0,0,0,0)"
          style={styles.icon}/>
        <TextInput
          ref="input"
          value={this.state.value}
          style={styles.input}
          placeholder="search"
          autoCorrect={false}
          autoCapitalize="none"
          onChange={this.handleInputChange.bind(this)}
          onSubmitEditing={this.handleSubmit.bind(this)}/>
        <View style={styles.spacer}/>
      </View>
    );
  }

  renderBack() {
    if (!this.props.showBack) return;
    return <NavIcon name="chevron-left" onPress={this.props.onBack} activeColor="#FFF" isActive={true}/>;
  }

  handleInputChange(e) {
    this.setState({value: e.nativeEvent.text});
  }

  handleSubmit() {
    this.props.onSearch(this.state.value);
  }
}

Search.propTypes = {
  onSearch: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  icon: {
    marginLeft: 6
  },

  input: {
    height: 25,
    width: 150,
    textAlign: 'center'
  },

  spacer: {
    width: 18,
    marginRight: 6
  }
});

export default Search;
