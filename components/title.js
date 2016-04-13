import React, { // eslint-disable-line no-unused-vars
  Component,
  PropTypes,
  StyleSheet,
  View
} from 'react-native';

import { colors } from '../constants';
import NavIcon from './nav_icon';
import Search from './search';

class Title extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.spacer}>
          {this.renderBack()}
        </View>
        <Search onSearch={this.props.onSearch}/>
        <View style={styles.spacer}/>
      </View>
    );
  }

  renderBack() {
    if (!this.props.showBack) return;
    return <NavIcon name="chevron-left" size={18} onPress={this.props.onBack} activeColor="#FFF" isActive={true}/>;
  }
}

Title.propTypes = {
  showBack: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.main,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  spacer: {
    width: 20,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default Title;
