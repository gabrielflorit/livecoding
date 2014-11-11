var gulp = require('gulp');
var del  = require('del');

gulp.task('clean', function (cb) {
  del([
  	'dist',
  	'.sass-cache',
  	'.tmp',
    './*.html',
  ], cb);
});