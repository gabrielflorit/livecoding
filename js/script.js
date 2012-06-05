/* Author:
	Gabriel Florit
*/

var aigua = (function () {
	return {
		borderWidth: Number($('#bar').css('border-width').replace('px', '')),
		lineHeight: 19,
		samples: ['data/chord.txt'],
		startingBarWidth: 200
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

						// grab the current token
						var cursor = cm.getCursor();
						var token = cm.getTokenAt(cursor);

						// select token
						cm.setSelection({line: cursor.line, ch: token.start}, {line: cursor.line, ch: token.end});

						// find coords at token start
						var startCoords = cm.cursorCoords(true);
						var endCoords = cm.cursorCoords(false);

						// make handle as wide as the selection
						var width = endCoords.x - startCoords.x;
						$('#handle').width(width);

						// position marker at center of handle
						var center = startCoords.x + width/2;
						$('#marker').css('left', center);

						// position handle at token
						$('#handle').css('left', startCoords.x);						

						// show the handle
						$('#handle').show();

						// position the bar centered above the token
						$('#bar').css('left', center - $('#bar').width()/2 - aigua.borderWidth);
						$('#bar').css('top', startCoords.y - aigua.lineHeight);

						// show the bar
						$('#bar').show();
					}
				}

				// did we keyup?
				if (e.type == 'keyup') {

					// hide the handle
					$('#handle').hide();

					// reset filler width
					$('#filler').width(0);

					// reset bar width
					$('#bar').width(aigua.startingBarWidth);

					// hide the bar
					$('#bar').hide();

					// grab the current token and deselect it
					var cursor = cm.getCursor();
					var token = cm.getTokenAt(cursor);
					cm.setSelection({line: cursor.line, ch: token.end}, {line: cursor.line, ch: token.end});
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
		axis: 'x',
		drag: function(ui, event) {

			var handleCenter = $('#handle').offset().left + $('#handle').width()/2;
			var markerCenter = $('#marker').offset().left;
			var handleOffset = handleCenter - markerCenter;

			// is the dragging cursor to the right of the marker?
			if (handleOffset > 0) {

				// set the filler width and position
				$('#filler').width(handleOffset);
				$('#filler').css('left', aigua.startingBarWidth/2);

				// are we dragging past the initial bar width?
				if (handleOffset > aigua.startingBarWidth/2 - (aigua.borderWidth)) {

					// round the filler edges
					$('#filler').addClass('filler-edge-right');

					 // add 1 pixel to filler width to prevent square edges
					 // from hitting the round borders prematurely
					$('#filler').width(handleOffset + 1);

					// set bar right edge to dragging position
					$('#bar').width(handleCenter - $('#bar').offset().left);
				}

				else {

					// square the filler edges
					$('#filler').removeClass('filler-edge-left');
					$('#filler').removeClass('filler-edge-right');

					// reset the width, since fast drags won't trigger a drag call every pixel. 
					$('#bar').width(aigua.startingBarWidth);
				}

			// is the dragging cursor to the left of the marker?
			} else if (handleOffset < 0) {

				// set the filler width
				$('#filler').width(-handleOffset);

				// adjust the filler position
				$('#filler').css('left', aigua.startingBarWidth/2 - -handleOffset + aigua.borderWidth/2);

				// are we dragging past the initial bar width?
				if (-handleOffset> aigua.startingBarWidth/2) {

					// adjust the filler position
					$('#filler').css('left', aigua.borderWidth/2);

					// round the filler edges
					$('#filler').addClass('filler-edge-left');

					// set bar left edge to dragging position
					$('#bar').width(-handleOffset + aigua.startingBarWidth/2);
					$('#bar').css('left', handleCenter - aigua.borderWidth);
				}

				else {

					// square the filler edges
					$('#filler').removeClass('filler-edge-left');
					$('#filler').removeClass('filler-edge-right');

					// reset the width, since fast drags won't trigger a drag call every pixel. 
					$('#bar').width(aigua.startingBarWidth);
					$('#bar').css('left', markerCenter - aigua.startingBarWidth/2 - aigua.borderWidth);
				}

			// are we at the middle?
			} else {
				$('#filler').width(0);
			}
		},
		stop: function(ui, event) {
		}
	});

});

