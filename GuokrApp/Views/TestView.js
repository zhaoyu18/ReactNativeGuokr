'use strict';

var React = require('react-native');

var {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	ActivityIndicatorIOS,
	Image,
	Component
} = React;

var styles = StyleSheet.create({
	description: {
		marginBottom: 20,
		fontSize: 18,
		textAlign: 'center',
		color: '#656565'
	},
		container: {
		padding: 30,
		marginTop: 65,
		alignItems: 'center'
	}
});

class TestView extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.description}>
					欢迎来到果壳
				</Text>
				<Text style={styles.description}>
					让科技有意思
				</Text>
			</View>
		);
	}
}

module.exports = TestView;