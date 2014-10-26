var gulp        = require('gulp');
var runSequence = require('run-sequence');
var util        = require('gulp-util');

gulp.task('build', function(done) {

	if (util.env.prod) {
		runSequence(
			'html',
			'css',
			'webpack'
		);
	} else {
		runSequence(
			'clean',
			'watch',
			'browser-sync',
			'html',
			'css',
			'webpack'
		);
	}
});