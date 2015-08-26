'use strict';

var React = require('react-native');
var TestView = require('./GuokrApp/Views/ArticlesPage');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
  Component,
} = React;

class ReactNativeGuokr extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        tintColor='#FFFFFF'
        titleTextColor='#FFFFFF'
        barTintColor='#009688'
        initialRoute={{
          title: '果壳',
          component: TestView,
        }}/>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('ReactNativeGuokr', function() { return ReactNativeGuokr});