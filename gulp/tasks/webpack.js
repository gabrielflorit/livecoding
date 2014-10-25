var gulp           = require('gulp');
var webpack        = require('gulp-webpack');
var webpackPlugins = require('gulp-webpack/node_modules/webpack');
var rename         = require('gulp-rename');
var browserSync    = require('browser-sync');
var _              = require('lodash');
var util           = require('gulp-util');

var config = {
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style-loader!css-loader' }
		]
	}
};

gulp.task('webpack', function() {

	if (util.env.prod) {
		_.extend(config, {
			plugins: [
				new webpackPlugins.optimize.UglifyJsPlugin()
		    ]
		});
	} else {
		_.extend(config, {
			watch: true,
			devtool: 'eval-source-map'
		});
	}

	return gulp.src('src/js/entry.js')
		.pipe(webpack(config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist'))
		.pipe(util.env.prod ? browserSync.reload({stream:true}) : util.noop());
});