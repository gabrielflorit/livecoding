var CodeMirror = require('codemirror');
require('../../node_modules/codemirror/lib/codemirror.css');
var GitHub = require('github-api');

var myCodeMirror = CodeMirror(document.body);

var CLIENT_ID = '7f06406d4740f8839007';

window.login = function(code) {
	$.getJSON('http://powerful-chamber-3695.herokuapp.com/authenticate/'+code, function(data) {

		console.log(JSON.stringify(data, null, 4));

		var github = new GitHub({
			token: data.token,
			auth: 'oauth'
		});

		var options = {
			files: {
				"file1.txt": {
					"content": "livecoding"
				}
			}
		};

		github.getGist().create(options, function(a, b, c) {

			// it works!

		});
	});
};

$('button').click(function() {

	open('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID + '&scope=gist', 'popup', 'width=1015,height=500');
});