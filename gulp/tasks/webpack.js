var gulp            = require('gulp');
var webpack         = require('gulp-webpack');
var webpackPlugins  = require('gulp-webpack/node_modules/webpack');
var rename          = require('gulp-rename');
var browserSync     = require('browser-sync');
var config          = require('../config/webpack.js');
var _               = require('lodash');

gulp.task('webpack:dev', function() {

	// extend default webpack options
	// with dev specific info
	var opts = _.extend({}, config, {
		watch: true
	});

	return gulp.src('src/js/entry.js')
		.pipe(webpack(opts))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('webpack:prod', function() {

	// extend default webpack options
	// with prod specific info
	var opts = _.extend({}, config, {
		plugins: [
			new webpackPlugins.optimize.UglifyJsPlugin()
	    ]
	});

	return gulp.src('src/js/entry.js')
		.pipe(webpack(opts))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist'));
});
