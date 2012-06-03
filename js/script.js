/* Author:
	Gabriel Florit
*/

var aigua = (function () {
	return {

		// isSliderVisible: function() {
		// 	return $('#handle').is(':visible');
		// },

		slider: function(cm) {

			// if (!aigua.isSliderVisible) {

			// 	console.log('fire slider')
			// 	aigua.isSliderVisible = true;
			// }
			// var token = cm.getTokenAt(cm.getCursor());
			// var tokenString = token.string;
			// $('#number').show();
			// $('#number').text(tokenString);
			// console.log('positioning handle');
			// $('#handle').css('left', cm.cursorCoords().x);
			// $('#handle').css('top', cm.cursorCoords().y);
			// $('#handle').show();
		},

		samples: ['data/chord.txt']
	}
}());

$(function() {

	d3.text(aigua.samples[0], function(data) {
		aigua.codeMirror = CodeMirror($('#code').get(0), {
			onKeyEvent: function(cm, e) {

				// did we keydown the alt key?
				if (e.altKey && e.type == 'keydown') {

					// is the handle hidden?
					if (!$('#handle').is(':visible')) {

						// show the handle
						$('#handle').show();
						console.log('showing handle');
					}
				}

				// did we keyup?
				if (e.type == 'keyup') {
					$('#handle').hide();
				}
			},
			lineNumbers: true,
			matchBrackets: true,
			mode:  'javascript',
			theme: 'lesser-dark',
			value: data
		});
	});

	$('#handle').draggable({
		axis: 'x'
	});

});

	// $('#number').on('mousedown', function(e) {
	// 	$('#number').draggable({
	// 		axis: 'x',
	// 		drag: function(ui, event) {
	// 		}
	// 	});



	// 	// var handle = $('#handle');
	// 	// handle.css('left', $(this).position().left);
	// 	// handle.css('top', $(this).position().top + $(this).height()/2 - handle.height()/2);
	// 	// handle.css('width', $(this).width());
	// });

	// var bar = $('#bar');
	// var borderWidth = 1;
	// var increaseStep = 5;
	// handle.draggable({
	// 	axis: 'x',
	// 	drag: function(ui, event) {

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
			// if (bar.position().left - ball.position().left >= -borderWidth) {
			// 	bar.animate({
			// 		left: '-=' + increaseStep,
			// 		width: '+=' + increaseStep
			// 	}, 0);
			// }

			// // if we're at right edge of bar, increase bar width
			// if (ball.position().left + ball.width() >= bar.position().left + bar.width()) {
			// 	bar.animate({
			// 		width: '+=' + increaseStep
			// 	}, 0);
			// }
	// 	},
	// 	stop: function(ui, event) {
	// 		// if we're past left edge of bar, bring back inside
	// 		// if (bar.position().left - ball.position().left > -borderWidth) {
	// 		// 	ball.css('left', bar.position().left + borderWidth);
	// 		// }

	// 		// // if we're past right edge of bar, bring back inside
	// 		// if (ball.position().left + ball.width() > bar.position().left + bar.width()) {
	// 		// 	ball.css('left', bar.position().left + bar.width() - ball.width() + borderWidth);
	// 		// }
	// 	}
	// });




