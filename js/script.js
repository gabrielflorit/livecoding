/* Author:
	Gabriel Florit
*/

var aigua = (function () {
	return {
		
		renderCode: function() {
			// clear out the display contents
			$('svg').empty();

			// get the code
			var code = aigua.codeMirror.getValue();

			// run it
			eval(code);
		},

		resetBar: function(markerCenter) {
			aigua.bar.width(aigua.startingBarWidth);
			aigua.bar.css('left', markerCenter - aigua.startingBarWidth/2 - aigua.borderWidth);
			aigua.filler.removeClass('filler-edge-left');
			aigua.filler.removeClass('filler-edge-right');
		},

		bar: null,
		borderWidth: 2,
		filler: null,
		handle: null,
		lineHeight: 19,
		marker: null,
		originalNumber: null,
		samples: ['data/chord.txt'],
		startingBarWidth: 200

	}
}());

$(function() {

	// set various dom elements
	aigua.handle = $('#handle');
	aigua.bar = $('#bar');
	aigua.marker = $('#marker');
	aigua.filler = $('#filler');

	// set the handle's default width
	aigua.handle.width(aigua.startingBarWidth);

	// set the bar's border width
	aigua.bar.css('border-width', aigua.borderWidth);

	// create codemirror instance
	aigua.codeMirror = CodeMirror($('#code').get(0), {

		onChange: function(cm, e) {
			aigua.renderCode();
		},

		onKeyEvent: function(cm, e) {

			var cursor;
			var token;
			var startCoords;
			var endCoords;
			var center;

			// did we keydown the ctrl key?
			if (e.ctrlKey && e.type == 'keydown') {

				// is the handle hidden?
				if (!aigua.handle.is(':visible')) {

					// grab the current token
					cursor = cm.getCursor();
					token = cm.getTokenAt(cursor);

					// are we on a number?
					if (token.className == 'number') {

						// save the original number
						if (aigua.originalNumber == null) {
							aigua.originalNumber = Number(token.string);
						}

						// select token
						cm.setSelection({line: cursor.line, ch: token.start}, {line: cursor.line, ch: token.end});

						// find coords at token start
						startCoords = cm.cursorCoords(true);
						endCoords = cm.cursorCoords(false);

						// center marker on token
						center = startCoords.x + (endCoords.x - startCoords.x)/2;
						aigua.marker.css('left', center);

						// center handle on token
						aigua.handle.css('left', center - aigua.handle.width()/2);

						// show the handle
						aigua.handle.show();

						// center bar above token
						aigua.bar.css('left', center - aigua.bar.width()/2 - aigua.borderWidth);
						aigua.bar.css('top', startCoords.y - aigua.lineHeight);

						// show the bar
						aigua.bar.show();
					}
				}
			}

			// did we keyup?
			if (e.type == 'keyup') {

				// hide the handle
				aigua.handle.hide();

				// reset filler width
				aigua.filler.width(0);

				// reset bar width
				aigua.bar.width(aigua.startingBarWidth);

				// hide the bar
				aigua.bar.hide();

				// clear out the original number
				aigua.originalNumber = null;
			}
		},

		lineNumbers: true,
		matchBrackets: true,
		mode:  'javascript',
		theme: 'lesser-dark'
	});

	// load sample code
	d3.text(aigua.samples[0], function(data) {
		aigua.codeMirror.setValue(data);
	});

	// force svg contents to occupy the entire svg container
	// by rerendering code on window resize
	$(window).on('resize', function() {
		aigua.renderCode();
	});

	// initialize slider
	aigua.handle.draggable({
		axis: 'x',
		drag: function(ui, event) {

			var position = event.position.left + aigua.handle.width()/2;
			var markerCenter = aigua.marker.offset().left;
			var offset = position - markerCenter;
			var newNumber;

			// if the original number is larger than 1/-1, increment by 1
			if (Math.abs(aigua.originalNumber) >= 1) {
				newNumber = offset*100 + aigua.originalNumber;
			}
			// otherwise increment by the original number rounded up to the nearest decimal
			else {
				newNumber = offset/10 + aigua.originalNumber; // TODO - this isn't working properly
			}

			// replace the selection with the new number
			aigua.codeMirror.replaceSelection(String(newNumber));

			// is the dragging cursor to the right of the marker?
			if (offset > 0) {

				// if the left bar got stuck, reset the bar width and position
				if (markerCenter - aigua.bar.offset().left - aigua.borderWidth > aigua.startingBarWidth/2) {
					aigua.resetBar(markerCenter);
				}

				// set the filler width and position
				aigua.filler.width(offset);
				aigua.filler.css('left', aigua.startingBarWidth/2);

				// are we dragging past the initial bar width?
				if (offset > aigua.startingBarWidth/2 - (aigua.borderWidth)) {

					// round the filler edges
					aigua.filler.addClass('filler-edge-right');

					 // add 1 pixel to filler width to prevent square edges
					 // from hitting the round borders prematurely
					aigua.filler.width(offset + 1);

					// set bar right edge to dragging position
					aigua.bar.width(position - aigua.bar.offset().left);
				}

				// reset the width, since fast drags won't trigger a drag call every pixel.
				else {
					aigua.resetBar(markerCenter);
				}

			// is the dragging cursor to the left of the marker?
			} else if (offset < 0) {

				// set the filler width
				aigua.filler.width(-offset);

				// adjust the filler position
				aigua.filler.css('left', aigua.startingBarWidth/2 - -offset + aigua.borderWidth/2);

				// are we dragging past the initial bar width?
				if (-offset > aigua.startingBarWidth/2) {

					// adjust the filler position
					aigua.filler.css('left', aigua.borderWidth/2);

					// round the filler edges
					aigua.filler.addClass('filler-edge-left');

					// set bar left edge to dragging position
					aigua.bar.width(-offset + aigua.startingBarWidth/2);
					aigua.bar.css('left', position - aigua.borderWidth);
				}

				// reset the width, since fast drags won't trigger a drag call every pixel.
				else {
					aigua.resetBar(markerCenter);
				}

			// are we at the middle?
			} else {
				aigua.filler.width(0);
			}
		}
	});

});

