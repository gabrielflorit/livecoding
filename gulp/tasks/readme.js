var gulp     = require('gulp');
var template = require('gulp-template');
var data     = require('gulp-data');
var rename   = require('gulp-rename');

gulp.task('readme', function() {
	return gulp.src('src/_README.md')
		.pipe(data(function() {
			return {
				enhancements: require('../../src/js/enhancements.json')
			};
		}))
		.pipe(template())
		.pipe(rename('README.md'))
		.pipe(gulp.dest('./'));
});