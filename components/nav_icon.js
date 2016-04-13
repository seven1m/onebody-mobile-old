import React, { // eslint-disable-line no-unused-vars
  Component,
  PropTypes,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { colors } from '../constants';
const Icon = require('react-native-vector-icons/FontAwesome');

class NavIcon extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon
          name={this.props.name}
          size={this.props.size}
          color={this.props.isActive ? this.props.activeColor : this.props.inactiveColor}
          onPress={this.props.onPress}/>
        {this.renderLabel()}
      </View>
    );
  }

  renderLabel() {
    if (!this.props.label) return;
    return (
      <Text
        style={[styles.label, {color: this.props.isActive ? this.props.activeColor : this.props.inactiveColor}]}
        onPress={this.props.onPress}>
        {this.props.label}
      </Text>
    );
  }
}

NavIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  label: PropTypes.string,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  onPress: PropTypes.func.isRequired
};

NavIcon.defaultProps = {
  activeColor: colors.main,
  size: 25,
  inactiveColor: '#999'
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  label: {
    fontSize: 10
  }
});

export default NavIcon;
