var gulp       = require('gulp');
var preprocess = require('gulp-preprocess');
var util       = require('gulp-util');

gulp.task('html', function() {
	var NODE_ENV = util.env.prod ? 'prod' : 'dev';

	gulp.src('src/html/*.html')
		.pipe(preprocess({context: { NODE_ENV: NODE_ENV}}))
		.pipe(gulp.dest(util.env.prod ? './' : '.tmp'));
});