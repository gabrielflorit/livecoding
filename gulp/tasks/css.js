var gulp        = require('gulp');
var sass        = require('gulp-ruby-sass');

gulp.task('css', function() {

	return gulp.src('src/css/**/*.scss')
		.pipe(sass({compass: true}))
		.pipe(gulp.dest('src/css'));
});