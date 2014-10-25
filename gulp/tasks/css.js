var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var util = require('gulp-util');
var csso = require('gulp-csso');

gulp.task('css', function() {

	return gulp.src('src/css/*.scss')
		.pipe(sass({compass: true}))
		.pipe(util.env.prod ? csso(true) : util.noop())
		.pipe(gulp.dest('src/css'));
});