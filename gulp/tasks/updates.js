var gulp      = require('gulp');
var GitHubApi = require('github');
var _         = require('lodash');
var fs        = require('fs');

gulp.task('updates', function(done) {

	var github = new GitHubApi({
		version: '3.0.0'
	});

	github.issues.repoIssues({
		user: 'gabrielflorit',
		repo: 'livecoding',
		state: 'closed',
		labels: 'enhancement'
	}, function(err, res) {

		var updates = _.map(res, function(v) {
			return _.pick(v, ['title', 'number', 'closed_at']);
		});

		fs.writeFileSync('src/js/updates.json', JSON.stringify(updates, null, 4));

		done();
	});
});