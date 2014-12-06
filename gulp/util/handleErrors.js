var notify = require('gulp-notify');

module.exports = function() {
	var args = Array.prototype.slice.call(arguments);
	var error = args[0].message;

	notify.onError({
		title: 'Sass compile error',
		message: 'See terminal for details.'
	}).apply(this, args);

	console.log(error);
	this.emit('end');
};