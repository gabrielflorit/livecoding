/* Author:
	Gabriel Florit
*/

var aigua = (function () {
	return {
		samples: ['data/chord.txt']
	}
})();

$(function() {

	d3.text(aigua.samples[0], function(data) {
		aigua.codeMirror = CodeMirror(document.getElementById('code'), {
			lineNumbers: true,
			matchBrackets: true,
			mode:  'javascript',
			theme: 'lesser-dark',
			value: data
		});
	});

	var ball = $('#ball');
	var slider = $('#slider');
	ball.draggable({
		axis: 'x',
		drag: function(ui, event) {
			if (ball.position().top > slider.height() - ball.height()) {
				slider.height(slider.height() + 10);
			}
			if (ball.position().left > slider.width() - ball.width()) {
				slider.width(slider.width() + 10);
			}
		}
	});

});
































