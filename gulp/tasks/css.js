var gulp         = require('gulp');
var sass         = require('gulp-ruby-sass');
var util         = require('gulp-util');
var csso         = require('gulp-csso');
var browserSync  = require('browser-sync');
var filter       = require('gulp-filter');
var handleErrors = require('../util/handleErrors');

gulp.task('css', function() {
	return gulp.src('src/css/*.scss')
		.pipe(sass({compass: true}))
		.on('error', handleErrors)
		.pipe(util.env.prod ? filter('**/*.css') : util.noop())
		.pipe(util.env.prod ? csso(true) : util.noop())
		.pipe(gulp.dest(util.env.prod ? 'dist' : '.tmp'));
});