var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	
	browserSync({
		server: {
			baseDir: './'
		},
		files: [
			'index.html'
		]
	});
});