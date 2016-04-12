import React, { // eslint-disable-line no-unused-vars
  Component,
  PropTypes,
  StyleSheet,
  View
} from 'react-native';

import NavIcon from './nav_icon';

class Nav extends Component {
  render() {
    const active = this.getActiveItem();
    return (
      <View style={styles.container}>
        <NavIcon name="home"   label="Home"      onPress={this.props.onPress.bind(this, 'home')}      isActive={active == 'home'}     />
        <NavIcon name="search" label="Directory" onPress={this.props.onPress.bind(this, 'directory')} isActive={active == 'directory'}/>
        <NavIcon name="users"  label="Groups"    onPress={this.props.onPress.bind(this, 'groups')}    isActive={active == 'groups'}   />
        <NavIcon name="user"   label="Me"        onPress={this.props.onPress.bind(this, 'me')}        isActive={active == 'me'}       />
      </View>
    );
  }

  getActiveItem() {
    if (!this.props.url) return;
    const path = this.props.url.replace(/^https?:\/\/[^\/]+/, '').split('#')[0];
    if (path.match(/^\/?$/)) {
      return 'home';
    } else if (path.match(/^\/search/)) {
      return 'directory';
    } else if (path.match(/^\/groups/)) {
      return 'groups';
    } else if (this.isProfilePath(path)) {
      return 'me';
    }
  }

  isProfilePath(path) {
    if (!this.props.profilePath) return false;
    console.log(path, this.props.profilePath);
    return path.match(RegExp('^' + this.props.profilePath));
  }
}

Nav.propTypes = {
  onPress:     PropTypes.func.isRequired,
  url:         PropTypes.string,
  profilePath: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  icon: {
  }
});

export default Nav;
