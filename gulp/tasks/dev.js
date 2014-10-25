var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('dev', function(done) {
	runSequence(
		'watch',
		'browser-sync',
		'css',
		'webpack:dev'
	);
});