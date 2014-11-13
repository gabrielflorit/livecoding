var gulp      = require('gulp');
var GitHubApi = require('github');
var _         = require('lodash');
var fs        = require('fs');
var template  = require('gulp-template');

gulp.task('fetchEnhancements', function(done) {

	var github = new GitHubApi({
		version: '3.0.0'
	});

	github.issues.repoIssues({
		user: 'gabrielflorit',
		repo: 'livecoding',
		state: 'all',
		labels: 'enhancement'
	}, function(err, res) {

		var enhancements = _.chain(res)
			.map(function(v) {
				return _.pick(v, ['title', 'number', 'closed_at', 'state']);
			})
			.value();

		fs.writeFileSync('src/js/enhancements.json', JSON.stringify(enhancements, null, 4));

		done();
	});
});