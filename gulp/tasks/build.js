var gulp        = require('gulp');
var runSequence = require('run-sequence');
var util        = require('gulp-util');

gulp.task('build', function(done) {

	if (util.env.prod) {
		runSequence(
			'css',
			'webpack'
		);
	} else {
		runSequence(
			'watch',
			'browser-sync',
			'css',
			'webpack'
		);
	}
});