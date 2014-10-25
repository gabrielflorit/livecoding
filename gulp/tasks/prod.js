var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prod', function(done) {
	runSequence(
		'webpack:prod'
	);
});