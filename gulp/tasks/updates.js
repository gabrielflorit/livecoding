var gulp      = require('gulp');
var GitHubApi = require('github');
var _         = require('lodash');
var fs        = require('fs');
var template  = require('gulp-template');

gulp.task('updates', function(done) {

	var enhancements = JSON.parse(fs.readFileSync('.tmp/enhancements.json', 'utf8'));

	var updates = _.filter(enhancements, {'state': 'closed'});

	fs.writeFileSync('.tmp/updates.json', JSON.stringify(updates, null, 4));

	done();
});