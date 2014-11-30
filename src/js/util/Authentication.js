var util   = require('./util.js');
var PubSub = require('pubsub-js');
var GitHub = require('github-api');

var Authentication =  {

	topics: function() {
		return {
			Token: 'Authentication_Token'
		};
	},

	_CLIENT_ID: '7f06406d4740f8839007',

	login: function() {
		open('https://github.com/login/oauth/authorize?client_id=' + this._CLIENT_ID + '&scope=gist', 'popup', 'width=1015,height=500');
	},

	convertGistToLivecodingData: function(gist) {

		var files = gist.files;
		var html = files['water.html'] ? files['water.html'].content : '';
		var javascript = files['water.js'] ? files['water.js'].content : '';
		var css = files['water.css'] ? files['water.css'].content : '';

		var options = JSON.parse(files['options.json'].content);

		return {
			html: html,
			javascript: javascript,
			css: css,
			mode: options.mode
		};

	},

	read: function(token, id) {

		return new Promise(function(resolve, reject) {

			if (token) {

				var github = new GitHub({
					token: token,
					auth: 'oauth'
				});

				var gist = github.getGist(id);

				gist.read(function(error, gist) {
					if (error) {
						reject(error);
					} else {
						var data = Authentication.convertGistToLivecodingData(gist);
						resolve(data);
					}
				});

			} else {

				util.getJSON('https://api.github.com/gists/d28b2bddba2e121d2160')
					.then(function(response) {
						var data = Authentication.convertGistToLivecodingData(response);
						resolve(data);
					}).catch(function(error) {
						reject(error);
					});
			}

		});

	},

	save: function(token, data) {

		return new Promise(function(resolve, reject) {

			var github = new GitHub({
				token: token,
				auth: 'oauth'
			});

			var options = {
				mode: data.mode
			};

			var files = {
				files: {
					'options.json': {
						content: JSON.stringify(options, null, 4)
					}
				},
				public: true
			};

			// Use `water` terminology to support old livecoding.io gists.
			// Also, only add files if content exists.
			if (data.html) { files.files['water.html'] = { content:data.html }; }
			if (data.javascript) { files.files['water.js'] = { content:data.javascript }; }
			if (data.css) { files.files['water.css'] = { content:data.css }; }

			github.getGist().create(files, function(error, gist) {
				if (error) {
					reject(error);
				} else {
					resolve(gist);
				}
			});

		});
	}

};

module.exports = Authentication;

window.handleToken = function(code) {

	var url = 'http://powerful-chamber-3695.herokuapp.com/authenticate/' + code;

	util.getJSON(url)
		.then(function(response) {
			PubSub.publish(Authentication.topics().Token, response);
		}).catch(function(error) {
			console.log('Error', error);
		});
};