var util   = require('./util.js');
var PubSub = require('pubsub-js');
var GitHubAPI = require('github-api');

var GitHub =  {

	topics: function() {
		return {
			Token: 'GitHub_Token'
		};
	},

	_CLIENT_ID: window.LIVECODING_PROD ? 'ebb6390f3c54ed8002f1' : '7f06406d4740f8839007',

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

	getUser: function(token) {

		return new Promise(function(resolve, reject) {

			var github = new GitHubAPI({
				token: token,
				auth: 'oauth'
			});

			var user = github.getUser();

			user.show(null, function(error, user) {
				if (error) {
					reject(error);
				} else {
					resolve(user);
				}
			});
		});

	},

	readGist: function(token, id) {

		return new Promise(function(resolve, reject) {

			if (token) {

				var github = new GitHubAPI({
					token: token,
					auth: 'oauth'
				});

				var gist = github.getGist(id);

				gist.read(function(error, gist) {
					if (error) {
						reject(error);
					} else {
						var data = GitHub.convertGistToLivecodingData(gist);
						resolve(data);
					}
				});

			} else {

				util.getJSON('https://api.github.com/gists/d28b2bddba2e121d2160')
					.then(function(response) {
						var data = GitHub.convertGistToLivecodingData(response);
						resolve(data);
					}).catch(function(error) {
						reject(error);
					});
			}

		});

	},

	saveGist: function(token, data) {

		return new Promise(function(resolve, reject) {

			var github = new GitHubAPI({
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

module.exports = GitHub;

window.handleToken = function(code) {

	var gatekeeperApp = window.LIVECODING_PROD ? 'damp-journey-4764' : 'powerful-chamber-3695';

	var url = 'http://' + gatekeeperApp + '.herokuapp.com/authenticate/' + code;

	util.getJSON(url)
		.then(function(response) {
			PubSub.publish(GitHub.topics().Token, response);
		}).catch(function(error) {
			console.log('Error', error);
		});
};