var gulp      = require('gulp');
var GitHubApi = require('github');
var _         = require('lodash');
var fs        = require('fs');
var template  = require('gulp-template');

gulp.task('updates', function(done) {

	var enhancements = JSON.parse(fs.readFileSync('src/js/enhancements.json', 'utf8'));

	var updates = _.filter(enhancements, {'state': 'closed'});

	fs.writeFileSync('src/js/updates.json', JSON.stringify(updates, null, 4));

	done();
});