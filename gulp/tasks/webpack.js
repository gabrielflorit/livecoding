var gulp            = require('gulp');
var webpack         = require('gulp-webpack');
var webpackPlugins  = require('gulp-webpack/node_modules/webpack');
var rename          = require('gulp-rename');
var browserSync     = require('browser-sync');
var _               = require('lodash');

var config = {
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style-loader!css-loader' }
		]
	}
};

gulp.task('webpack:dev', function() {

	// extend default webpack options
	// with dev specific info
	_.extend(config, {
		watch: true
	});

	return gulp.src('src/js/entry.js')
		.pipe(webpack(config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('webpack:prod', function() {

	// extend default webpack options
	// with prod specific info
	_.extend(config, {
		plugins: [
			new webpackPlugins.optimize.UglifyJsPlugin()
	    ]
	});

	return gulp.src('src/js/entry.js')
		.pipe(webpack(config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist'));
});
