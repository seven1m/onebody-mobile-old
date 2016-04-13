import React, { // eslint-disable-line no-unused-vars
  Animated,
  Component,
  PropTypes,
  StyleSheet,
  View
} from 'react-native';

import { colors } from '../constants';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
      empty: new Animated.Value(1),
      opacity: new Animated.Value(1)
    };
  }

  componentDidUpdate({progress: prevProgress}) {
    const {progress} = this.props;
    if (progress === 1.0) {
      this.animateFinish();
    } else if (progress !== prevProgress) {
      this.animateProgress(progress);
    }
    if (!this.props.active) setTimeout(this.reset.bind(this), 1001);
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.on, {flex: this.state.progress, opacity: this.state.opacity}]}/>
        <Animated.View style={{flex: this.state.empty}}/>
      </View>
    );
  }

  animateProgress(progress) {
    this.state.opacity.setValue(1);
    const empty = this.state.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });
    Animated.timing(this.state.progress, {toValue: progress, duration: 5000}).start();
    Animated.timing(this.state.empty,    {toValue: empty,    duration: 0   }).start();
  }

  animateFinish() {
    Animated.timing(this.state.progress, {toValue: 1, duration: 500 }).start();
    Animated.timing(this.state.empty,    {toValue: 0, duration: 500 }).start();
    Animated.timing(this.state.opacity,  {toValue: 0, duration: 1000}).start();
  }

  reset() {
    if (this.props.active) return;
    this.state.progress.setValue(0);
    this.state.empty.setValue(1);
    this.state.opacity.setValue(1);
  }
}

Loading.propTypes = {
  progress: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  container: {
    height: 2,
    flexDirection: 'row'
  },

  on: {
    backgroundColor: colors.loading
  }
});

export default Loading;
