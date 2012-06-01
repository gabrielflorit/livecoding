/* Author:
	Gabriel Florit
*/

var aigua = (function () {
	return {
		samples: ['data/chord.txt']
	}
}());

$(function() {

	// d3.text(aigua.samples[0], function(data) {
	// 	aigua.codeMirror = CodeMirror(document.getElementById('code'), {
	// 		lineNumbers: true,
	// 		matchBrackets: true,
	// 		mode:  'javascript',
	// 		theme: 'lesser-dark',
	// 		value: data
	// 	});
	// });

	var ball = $('#ball');
	var bar = $('#bar');
	var borderWidth = 1;
	var increaseStep = 5;
	ball.draggable({
		axis: 'x',
		drag: function(ui, event) {

			// prevent dragging past left edge of bar
			// if (bar.position().left - ball.position().left > -borderWidth) {
			// 	$(this).data('draggable').offset.click.left +=
			// 		(event.position.left - bar.position().left) - borderWidth;
			// }

			// // prevent dragging past right edge of bar
			// if (ball.position().left + ball.width() > bar.position().left + bar.width()) {
			// 	$(this).data('draggable').offset.click.left +=
			// 		(event.position.left + ball.width()) - (bar.position().left + bar.width()) - borderWidth;
			// }

			// if we're at left edge of bar, increase bar width
			if (bar.position().left - ball.position().left >= -borderWidth) {
				bar.animate({
					left: '-=' + increaseStep,
					width: '+=' + increaseStep
				}, 0);
			}

			// if we're at right edge of bar, increase bar width
			if (ball.position().left + ball.width() >= bar.position().left + bar.width()) {
				bar.animate({
					width: '+=' + increaseStep
				}, 0);
			}
		},
		stop: function(ui, event) {
			// if we're past left edge of bar, bring back inside
			if (bar.position().left - ball.position().left > -borderWidth) {
				ball.css('left', bar.position().left + borderWidth);
			}

			// if we're past right edge of bar, bring back inside
			if (ball.position().left + ball.width() > bar.position().left + bar.width()) {
				ball.css('left', bar.position().left + bar.width() - ball.width() + borderWidth);
			}
		}
	});

});



