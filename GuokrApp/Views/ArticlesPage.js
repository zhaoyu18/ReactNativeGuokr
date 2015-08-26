'use strict';

var React = require('react-native');
var RCTRefreshControl = require('react-refresh-control');
var TimerMixin = require('react-timer-mixin');
var ArticleDetailPage = require('./ArticleDetailPage');

var {
	StyleSheet,
	Text,
	View,
	ActivityIndicatorIOS,
	Image,
	ListView,
	TouchableHighlight,
} = React;

var LISTVIEW = 'ListView';

var styles = StyleSheet.create({
  	container: {
  		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
  	},
  	listView: {
  		marginTop: 64,
	    backgroundColor: '#F5FCFF',
  	},
  	rowContainer: {
		flexDirection: 'row',
		padding: 10,
	},
	thumb: {
		width: 80,
		height: 80,
		marginRight: 10
	},
	textContainer: {
		flex: 1
	},
	title: {
		fontSize: 17,
		color: '#656565'
	},
	separator: {
		height: 1,
		backgroundColor: '#dddddd'
	},
	footerContainer: {
		flex: 1,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
});

function _getArticlesRequestUrl(offset) {
	var data = {
		retrieve_type: 'by_subject',
		limit: '20',
	};
	data['offset'] = offset;

	var queryString = Object.keys(data)
		.map(key => key + '=' + encodeURIComponent(data[key]))
		.join('&');

	console.log(queryString);
	return 'http://apis.guokr.com/minisite/article.json?' + queryString;
};

var articlesCache;

var ArticlesPage = React.createClass ({
	mixins: [TimerMixin],
	getInitialState: function() {
		return {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			}),
			loaded: false,
			refreshControl: false,
		};
	},

	componentDidMount: function() {
		this.refreshData();
	},

	render: function() {
		if (!this.state.loaded) {
			return this.renderLoadingView();
		} else {
			var articlesView = (
				<ListView
					ref={LISTVIEW}
					style={styles.listView}
					automaticallyAdjustContentInsets={false}
					dataSource={this.state.dataSource}
					renderRow={this.renderArticle}
					renderFooter={this.renderFooter}
					onEndReached={this.onEndReached}
					showsVerticalScrollIndicator={false} />);

			return articlesView;
		}
	},

	componentDidUpdate: function() {
		console.log('componentDidUpdate');
		// after render listview config pull to refresh
		if (typeof(this.refs[LISTVIEW]) == "undefined") {
			console.log('underfined');
		} else {
			console.log('defined');
			this.setTimeout(
				() => {
					if ((typeof(this.refs[LISTVIEW]) != "undefined") && !this.state.refreshControl) {
						RCTRefreshControl.configure({
							node: this.refs[LISTVIEW]}, 
							() => {
								this.refreshData();
						});
						this.state.refreshControl = true;
					}
				}, 
				500);
		}
	},

	renderLoadingView: function() {
		return (
			<View style={styles.container}>
				<ActivityIndicatorIOS
					hidden='true'
					size='large'/> 
			</View>
		);
	},

	refreshData: function() {
		fetch(_getArticlesRequestUrl(0))
			.then((response) => response.json())
			.then((responseData) => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(responseData.result),
					loaded: true,
				});
				this.endRefreshing();
				articlesCache = responseData.result;
				// console.log(articlesCache);
			})
			.catch(error => {
				this.endRefreshing();
			})
			.done();
  	},

  	endRefreshing: function() {
		this.setTimeout(
			() => {
				RCTRefreshControl.endRefreshing(this.refs[LISTVIEW]);
			}, 
			500);
  	},

  	_loadMoreData: function(offset) {
  		fetch(_getArticlesRequestUrl(offset))
  			.then((response) => response.json())
  			.then((responseData) => {
  				var tempData = articlesCache.slice();
  				for (var i in responseData.result) {
  					tempData.push(responseData.result[i]);
  				}
  				articlesCache = tempData;

  				this.setState({
  					dataSource: this.state.dataSource.cloneWithRows(articlesCache),
  				})

  			})
  			.done();
  	},

  	renderArticle: function(article) {
  		return (
			<TouchableHighlight onPress={() => this._rowPressed(article)}
				underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<Image style={styles.thumb} source={{ uri: article.small_image }} />
						<View  style={styles.textContainer}>
							<Text style={styles.title} 
								numberOfLines={2}>{article.title}</Text>
						</View>
					</View>
				<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
  		);
  	},

  	_rowPressed: function(article) {
  		this.props.navigator.push({
  			title: article.subject.name,
  			component: ArticleDetailPage,
  			passProps: {articleSnapShot: article},
  		});
	},

	renderFooter: function() {
		// console.log('renderFooter');
		return (
			<View style={styles.footerContainer}>
				<ActivityIndicatorIOS/>
			</View>);
	},

	onEndReached: function() {
		console.log('onEndReached');
		this._loadMoreData(articlesCache.length);
	},
});

module.exports = ArticlesPage;