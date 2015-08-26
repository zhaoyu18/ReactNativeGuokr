'use strict';

var React = require('react-native');
var ParallaxView = require('react-native-parallax-view');
var HtmlRender = require('react-native-html-render');

var {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	ActivityIndicatorIOS,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
} = React;

var screen = Dimensions.get('window');

var styles = StyleSheet.create({
	description: {
		marginBottom: 20,
		fontSize: 14,
	},
	container: {
		flex: 1,
		alignItems: 'center',
	},
	htmlContainer: {
		flex: 1,
		padding: 16,
	},
	invisibleView: {
	    flex: 1,
	    position: "absolute",
	    top: 0,
	    left: 0,
	    bottom: 0,
	    right:0
  	},
	headerContent: {
		flex: 1,
		paddingBottom: 20,
		paddingTop: 40,
		paddingLeft: 20,
		paddingRight: 20,
		alignItems: "center",
		width: screen.width,
		backgroundColor: "#fff"
	},
	playerAvatar: {
		borderRadius: 40,
		width: 80,
		height: 80,
		position: "absolute",
		bottom: 60,
		left: screen.width / 2 - 40,
		borderWidth: 2,
		borderColor: "#fff"
  	},
	shotTitle: {
		fontSize: 18,
		fontWeight: "400",
		color: "#00796B",
		lineHeight: 18,
		textAlign: 'center',
	},
	userContent: {
    	fontSize: 12,
  	},
  	user: {
    	fontWeight: "900",
    	lineHeight: 18
  	},
});

function _getArticleRequestUrl(articleId) {
	var articleUrl = 'http://apis.guokr.com/minisite/article/{articleId}.json';
	var url = articleUrl.replace(/{(\w+)}/g, articleId);
	console.log(url);
	return url;
};

var ArticleDetailPage = React.createClass ({
	getInitialState: function() {
		return {
			loaded: false,
			article: null,
		};
	},

	componentDidMount: function() {
		this._fetchData();
	},

	render: function() {
		var articleSnapShot = this.props.articleSnapShot;
		var author = articleSnapShot.author;

		var articleContentView = !this.state.loaded ? 
			( <View style={styles.container}>
				<ActivityIndicatorIOS
					hidden='true'
					size='large' />
			</View>) :
			(<View style={styles.htmlContainer}>
				<HtmlRender
					value={this.state.article.content}
					renderNode={this._renderNode}
					onLinkPress={this._onLinkPress}/> 
			</View>);

		return (
			<ParallaxView
				backgroundSource={{uri: articleSnapShot.small_image}}
				windowHeight={screen.height / 4}
				header={(
	          		<TouchableOpacity onPress={this._headerClicked}>
	            		<View style={styles.invisibleView}></View>
	          		</TouchableOpacity>
        		)}>
				<View>
					<TouchableHighlight 
						style={styles.invisibleTouch}
						onPress={this._selectAuthor(author)}
						underlayColor={"#333"}
						activeOpacity={0.95}>
						<View style={styles.headerContent}>
							<Image source={{uri: articleSnapShot.author.avatar.large}}
								style={styles.playerAvatar} />
							<Text style={styles.shotTitle}>{articleSnapShot.title}</Text>
							<Text style={styles.userContent}>by <Text style={styles.user}>{articleSnapShot.author.nickname}</Text></Text>
						</View>
					</TouchableHighlight>
					{articleContentView}
				</View>
			</ParallaxView>
		);
	},

	_fetchData: function() {
		fetch(_getArticleRequestUrl(this.props.articleSnapShot.id))
			.then((response) => response.json())
			.then((responseData) => {
				var content = responseData.result.content;
				var filtedContent =  content.replace(/<\/?span.*?>/g, '');
				// filtedContent = filtedContent.replace(/\sclass=".*?"/g, '');
				// console.log('BEFORE: ' + content);
				// console.log('AFTER: ' + filtedContent);
				responseData.result.content = filtedContent;
				this.setState({
					loaded: true,
					article: responseData.result,
				});
			})
			.done();
	},

	_headerClicked: function() {

	},

	_selectAuthor: function(author: Object) {

	},

	_renderNode: function(node, index, parent, type) {
        var name = node.name;
        // console.log('NAME: ' + name + '    ' + node.text );
        if (node.type == 'block' && type == 'block') {
            if (name == 'img') {
                var uri = node.attribs.src;
                var ratio = 2;

                var widthMatch = /\/w\/(\d+)/g.exec(uri);
                var heightMatch = /\/h\/(\d+)/g.exec(uri);

                if (widthMatch != null && heightMatch != null) {
                	console.log('width = ' + widthMatch[1]);
                	console.log('height = ' + heightMatch[1]);
                	ratio = widthMatch[1] / heightMatch[1];
            	}

                return (
                    <View
                        key={index}
                        style={styles.imgWrapper}>
                        <Image source={{uri:uri}}
                            	style={  		
                            		{width: screen.width - 40,
  									height: (screen.width - 40) / ratio,
  									resizeMode: Image.resizeMode.contain,}}>
                        </Image>
                    </View>
                )
            }
        }
    },

    _onLinkPress: function(url) {
        // if (/^\/user\/\w*/.test(url)) {
        //     let authorName = url.replace(/^\/user\//, '')
        //     routes.toUser(this, {
        //         userName: authorName
        //     })
        // }

        // if (/^https?:\/\/.*/.test(url)) {
        //     window.link(url)
        // }
    }
});

module.exports = ArticleDetailPage;