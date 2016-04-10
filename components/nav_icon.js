import React, { // eslint-disable-line no-unused-vars
  Component,
  PropTypes,
  StyleSheet,
  Text,
  View
} from 'react-native';

let Icon = require('react-native-vector-icons/FontAwesome');

const activeColor   = '#39F';
const inactiveColor = '#999';

class NavIcon extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon
          name={this.props.name}
          size={25}
          color={this.props.isActive ? activeColor : inactiveColor}
          onPress={this.props.onPress}/>
        <Text
          style={[styles.label, this.props.isActive && styles.activeLabel]}
          onPress={this.props.onPress}>
          {this.props.label}
        </Text>
      </View>
    );
  }
}

NavIcon.propTypes = {
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  label: {
    fontSize: 10,
    color: inactiveColor
  },
  activeLabel: {
    color: activeColor
  }
});

export default NavIcon;
