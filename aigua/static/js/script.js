/* Author:
	Gabriel Florit
*/

var aigua = (function () {

	return {

		loadExample: function(name) {

			aigua.reset();

			aigua.switchMode('css', true);

			d3.text(aigua.baseUrl + name + '.css', function(css) {

				aigua.codeMirror.setValue(css);

				d3.text(aigua.baseUrl + name + '.js', function(js) {

					aigua.switchMode('javascript');
					aigua.codeMirror.setValue(js);
					aigua.codeMirror.setValue(js); // don't know why i have to do this twice

				});
			});
		},

		// modify a number by a certain distance
		// e.g. modifyNumber(5.89, 10) = 5.89 + 10 * 0.1
		// e.g. modifyNumber(58.9, 20) = 58.9 + 20 * 1
		modifyNumber: function(number, distance) {

			var parts;
			var exponent;
			var factor;
			var result;

			// say we have a number: 5.89
			// we first calculate its exponent: 0
			parts = number.toExponential().split('e');
			exponent = Number(parts[1]);

			// next we subtract 1 from the exponent: -1
			exponent = exponent - 1;

			// then we calculate our desired factor: 10^-1 = 0.1
			factor = Math.pow(10, exponent);

			// next we modify the number by the distance
			result = number + distance * factor;

			// finally we make sure not to add rounding errors
			return Number(result.toPrecision(parts[0].replace('.', '').length));
		},

		// run the code and update the display
		renderCode: function() {

			// get the current code
			var code = aigua.codeMirror.getValue();

			try {

				switch (aigua.modes[aigua.currentModeIndex].name) {

					case 'javascript':

						// clear out the display contents
						$('svg').empty();

						// run the code
						eval(code);

					break;

					case 'css':
						$('#aiguaStyle').get(0).textContent = code;
					break;

				}

			}
			catch (error) {}
			finally {};
		},

		reset: function() {
			aigua.switchMode('javascript', true);
			aigua.codeMirror.setValue('');
			aigua.switchMode('css', true);
			aigua.codeMirror.setValue('');
			aigua.switchMode('javascript');

			$('svg').remove();
			$('#display').append('<svg></svg>');
		},

		respondToKey: function(cm) {

			if (aigua.modes[aigua.currentModeIndex].name == 'javascript') {

				var cursor;
				var token;
				var startCoords;
				var endCoords;
				var center;

				// is the slider hidden?
				if (!aigua.slider.is(':visible')) {

					// grab the current token
					cursor = cm.getCursor();
					token = cm.getTokenAt(cursor);

					// are we on a number?
					if (token.className == 'number') {

						// show the slider
						aigua.slider.show();

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

						// center bar above token
						aigua.bar.css('left', center - aigua.bar.width()/2 - aigua.borderWidth);
						aigua.bar.css('top', startCoords.y - aigua.lineHeight);

						// center triangle on token
						aigua.triangle.css('left', center - aigua.triangleWidth);
						aigua.triangle.css('top', aigua.bar.offset().top + aigua.bar.height() + aigua.borderWidth * 2);
					}
				}
			}
		},

		// reset bar position and width:
		// center bar over the token
		// set bar width to default starting width
		resetBar: function(markerCenter) {
			aigua.bar.width(aigua.startingBarWidth);
			aigua.bar.css('left', markerCenter - aigua.startingBarWidth/2 - aigua.borderWidth);
			aigua.filler.removeClass('filler-edge-left');
			aigua.filler.removeClass('filler-edge-right');
		},

		switchMode: function(mode, noTab) {

			aigua.pause = true;

			if (!noTab) {
				$('#modes h2').attr('class', 'passive');
				$("#modes h2:contains('" + mode + "')").attr('class', 'active');
			}

			aigua.modes[aigua.currentModeIndex].code = aigua.codeMirror.getValue();

			aigua.currentModeIndex = _.indexOf(_.pluck(aigua.modes, 'name'), mode);

			aigua.codeMirror.setValue(aigua.modes[aigua.currentModeIndex].code || '');

			aigua.codeMirror.setOption("mode", aigua.modes[aigua.currentModeIndex].name);
			CodeMirror.autoLoadMode(editor, aigua.modes[aigua.currentModeIndex].name);

			aigua.pause = false;
		},

		bar: null,
		baseUrl: 'static/data/',
		borderWidth: 2,
		currentModeIndex: 1,
		filler: null,
		handle: null,
		lineHeight: 19,
		marker: null,
		modes: [
			{
				name: 'css',
				code: null
			}, {
				name: 'javascript',
				code: null
			}
		],
		originalNumber: null,
		pause: false,
		samples: [this.baseUrl + 'chord.txt'],
		slider: null,
		startingBarWidth: 300,
		triangle: null,
		triangleHeight: 7,
		triangleWidth: 12

	}
}());

$(function() {

	// ----------- initialization section

	// setup the key correctly (linux/windows)
	var theKey = (navigator && navigator.platform && navigator.platform.toLowerCase().indexOf('linux') != -1) 
		? 'Ctrl' 
		: 'Ctrl-Ctrl';
	var extraKeys = {};
	{extraKeys[theKey] = aigua.respondToKey};

	// set various dom elements
	aigua.slider = $('#slider');
	aigua.handle = $('#handle');
	aigua.bar = $('#bar');
	aigua.marker = $('#marker');
	aigua.filler = $('#filler');
	aigua.triangle = $('#triangle');

	// set the handle's default width
	aigua.handle.width(aigua.startingBarWidth);

	// set the bar's border width and default width
	aigua.bar.css('border-width', aigua.borderWidth);
	aigua.bar.width(aigua.startingBarWidth);

	// set the triangle
	aigua.triangle.css('border-width', aigua.triangleHeight + 'px ' + aigua.triangleWidth + 'px 0px ' + aigua.triangleWidth + 'px');

	// create codemirror instance
	aigua.codeMirror = CodeMirror($('#code').get(0), {

		onChange: function(cm, e) {
			if (!aigua.pause) {
				aigua.renderCode();
			}
		},

		extraKeys: extraKeys,
		lineNumbers: true,
		matchBrackets: true,
		mode:  'javascript',
		modeURL: '/mode/%N.js',
		theme: 'lesser-dark'
	});

	// load the first example
	aigua.loadExample($("#menu .item h2:contains('examples') + ul li:first").attr('rel'));

	// initialize slider
	aigua.handle.draggable({

		axis: 'x',
		
		drag: function(ui, event) {

			var position = event.position.left + aigua.handle.width()/2;
			var markerCenter = aigua.marker.offset().left;
			var offset = position - markerCenter;
			var newNumber;

			// calculate the new number based on the original number
			// plus the dragging offset
			newNumber = aigua.modifyNumber(aigua.originalNumber, offset);

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

	// populate mode switcher
	_.each(aigua.modes, function(mode, index) {

		var div = $("<div class='item'></div>");
		var h2 = $("<h2></h2>");
		div.append(h2);

		h2.attr('class', index == aigua.currentModeIndex ? 'active' : 'passive');
		h2.text(mode.name);

		$('#modes').append(div);
	});


	// ----------- event handlers section

	// did we keyup the handle key?
	$(window).keyup(function(e) {

		if (e.which == 17) {

			// hide the slider
			aigua.slider.hide();

			// reset filler width
			aigua.filler.width(0);

			// reset bar width
			aigua.bar.width(aigua.startingBarWidth);

			// clear out the original number
			aigua.originalNumber = null;
		}
	});

	// force svg contents to occupy the entire svg container
	// by rerendering code on window resize
	$(window).on('resize', function() {
		aigua.renderCode();
	});

	// handle modes switcher
	$('#modes .item h2').on('click', function(e) {
		aigua.switchMode($(this).text());
	});

	// handle menu mouseover/mouseout events
	$('#menu .item h2').on('mouseover', function(e) {
		var item = $(this).parents('.item');

		$('ul', item).show(); // show this dropdown
		$(this).addClass('hover'); // add hover class to this h2
	});

	// handle menu mouseover/mouseout events
	$('#menu .item').on('mouseout', function(e) {

		if ($(e.toElement).parents('.item').get(0) == $(this).get(0)) {

		} else {

			var menu = $(this).parents('#menu');

			$('ul', menu).hide(); // hide all the dropdowns
			$('h2', menu).removeClass('hover'); // remove hover class from all the h2's
		}
	});

	// handle menu mouseover/mouseout events
	$('#menu .item li').on('mouseover', function(e) {
		$(this).addClass('hover');
	});

	// handle menu mouseover/mouseout events
	$('#menu .item li').on('mouseout', function(e) {
		$(this).removeClass('hover');
	});

	// handle menu item choices
	$('#menu .item ul li').on('click', function(e) {
		e.preventDefault();

		var choice = $(this);
		var itemName = $('h2', choice.parents('.item')).text();

		switch(itemName) {
			case 'file':
				switch (choice.text()) {
					case 'new':
						var result = confirm('Are you sure? You will lose any unsaved changes.');
						if (result) {
							aigua.reset();
						}
						break;
				}
			break;
			case 'examples':
				var result = confirm('Are you sure? You will lose any unsaved changes.');
				if (result) {
					aigua.loadExample(choice.attr('rel'));
				}
			break;
		}
	});

});

