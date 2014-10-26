var gulp = require('gulp');

gulp.task('watch', function() {
	gulp.watch('src/css/*.scss', ['css']);
	gulp.watch('src/html/*.html', ['html']);
});