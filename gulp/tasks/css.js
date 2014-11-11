var gulp        = require('gulp');
var sass        = require('gulp-ruby-sass');
var util        = require('gulp-util');
var csso        = require('gulp-csso');
var browserSync = require('browser-sync');

gulp.task('css', function() {

	return gulp.src('src/css/*.scss')
		.pipe(sass({compass: true}))
		.pipe(util.env.prod ? csso(true) : util.noop())
		.pipe(gulp.dest(util.env.prod ? 'dist' : '.tmp'));
});