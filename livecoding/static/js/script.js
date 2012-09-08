/* Author:
	Gabriel Florit
*/

var aigua = (function () {

	var token = null;

	return {

		askBeforeNew: function() {
			var result = aigua.isDirty() ? confirm(aigua.areYouSureText) : true;

			if (result) {
				aigua.resetScreen();
				aigua.resetUrl();
				aigua.resetMenu();
			}
		},

		comment: function(cm) {

			var cursor = cm.getCursor();
			var line = cm.getLine(cursor.line);
			var keyword;
			var mode = aigua.modes[aigua.currentModeIndex].name;

			if (mode == 'html') {
				keyword = {start: "<!--", end: '-->'};
			} else if (mode == 'css') {
				keyword = {start: "/*", end: '*/'};
			} else if (mode == 'javascript') {
				keyword = {start: "//", end: ''};
			} else {
				keyword = {start: '', end: ''};
			}

			// does this line start and end with the keywords? if so, remove it.
			if (line.substring(0, keyword.start.length) == keyword.start
				&& line.substring(line.length - keyword.end.length, line.length) == keyword.end) {
				cm.setLine(cursor.line, line.substring(keyword.start.length, line.length - keyword.end.length));
			}
			// otherwise add the keywords to beginning and end of line
			else {
				cm.setLine(cursor.line, keyword.start + line + keyword.end);
			}
		},

		createPostDataObject: function() {

			var result = {};
			var currentMode = aigua.modes[aigua.currentModeIndex].name;

			_.each(aigua.modes, function(value, index, list) {

				var name = value.name;

				if (currentMode == name) {
					result[name] = aigua.codeMirror.getValue();
				} else {
					result[name] = _.find(aigua.modes, function(value) {
						return value.name == name;
					}).code;
				}

			});

			var selectedLibraries = $('li[class*="selected"]', $('#menu .item h2:contains("libraries")').next());

			var options = {

				// add libraries (e.g. d3, highcharts)
				libraries: _.map(selectedLibraries, function(value) {
					return $(value).text();
				}),

				// add current mode (e.g. html)
				mode: aigua.modes[aigua.currentModeIndex].name,

				// add current mode (e.g. sketchpad mode)
				layout: aigua.screenLayouts[aigua.currentScreenLayoutIndex],

				// add current resolution (e.g. 320x480)
				resolution: $('li[class*="disabled"]', $('#menu .item h2:contains("resolution")').next()).text()

			};

			// don't include resolution if it's set to nothing
			if (options.resolution == 'reset') {
				delete options.resolution;
			}

			result.options = JSON.stringify(options, null, 4); // pretty print

			return result;
		},

		getOAuthToken: function() {
			return token;
		},

		getUrlGistId: function() {

			var a = document.createElement('a');
			a.href = location.href;

			var gistId = a.pathname.split('/')[1];

			return (gistId.length > 0 && gistId != '!') ? gistId : null;
		},

		hidePopup: function() {

			if ($('#popup .about').is(':visible')) {
				localStorage.livecoding_about = $('#popup .about').attr('rel');
			}

			$('#popup .containerItem').fadeOut();
			$('#popup').fadeOut();
		},

		isDirty: function() {
			return $('.dirty').css('visibility') == 'visible';
		},

		isHexString: function(value) {
			return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
		},

		loadGist: function(gistId) {

			aigua.isLoading = true;

			aigua.resetScreen();
			aigua.resetMenu();
			aigua.setToClean();

			$.ajax({
				url: 'https://api.github.com/gists/' + gistId + '?callback=?',
				dataType: 'json',
				success: function (data) {

					aigua.currentGistUserId = data.data.user ? data.data.user.id : null;

					var html = data.data.files['water.html'];
					var javascript = data.data.files['water.js'];
					var css = data.data.files['water.css'];
					var json = data.data.files['water.json'];

					var options;
					if (data.data.files['options.json']) {
						options = JSON.parse(data.data.files['options.json'].content);
					} else {
						options = {
							libraries: []
						};
					}

					if (!options.mode) {
						options.mode = aigua.modes[0].name;
					}

					if (!options.layout) {
						options.layout = aigua.screenLayouts[2];
					}

					if (!options.resolution) {
						options.resolution = $('li:first', $('#menu .item h2:contains("resolution")').next());
					} else {
						options.resolution = $('li:contains("' + options.resolution + '")', $('#menu .item h2:contains("resolution")').next());
					}

					// switch to the default layout
					aigua.switchLayout(options.layout);

					// switch to the default resolution
					aigua.switchResolution(options.resolution);

					// iterate over every library in the options object
					_.each(options.libraries, function(value) {

						var library = value;

						// add library to dom
						frames[0].livecoding.addJs(_.find(aigua.libraries, function(value) {
							return value.name == library;
						}));

						// find the library menu item and select it
						$(_.find($('li', $('#menu .item h2:contains("libraries")').next()), function(value) {

							return $(value).text() == library;

						})).addClass('selected');

					});

					aigua.switchMode('json', true);
					if (json) {
						aigua.codeMirror.setValue(json.content);
					}

					aigua.switchMode('css', true);
					if (css) {
						aigua.codeMirror.setValue(css.content);
					}

					aigua.switchMode('html', true);
					if (html) {
						aigua.codeMirror.setValue(html.content);
					}

					aigua.switchMode('javascript');
					if (javascript) {
						aigua.codeMirror.setValue(javascript.content);
						aigua.codeMirror.setValue(javascript.content); // don't know why i have to do this twice
					}

					// switch to the default mode
					aigua.switchMode(options.mode);

					aigua.setUrl(gistId);

					aigua.isLoading = false;
				}
			});

		},

		logIn: function(oauthToken) {
			token = oauthToken;
			localStorage['aigua.token'] = token;

			aigua.resetMenu();

			$.get('https://api.github.com/user?access_token=' + token, function(user) {
				aigua.user = user;
				var userh2 = $('#controls .item h2.user');
				userh2.css('background-image', 'url(' + aigua.user.avatar_url + ')');
				userh2.css('cursor', 'pointer');
				userh2.click(function(e) {
					window.open(aigua.user.html_url);

					aigua.resetMenu();
				});
				$('li:contains("login")').text('logout');
				$('li').filter(function() { return $(this).text() == 'save'; } ).removeClass('disabled');
			});
		},

		logOut: function() {
			token = null;
			aigua.user = null;
			localStorage.removeItem('aigua.token');

			aigua.resetMenu();

			var userh2 = $('#controls .item h2.user');
			userh2.removeAttr('style');
			userh2.unbind('click');
			$('li:contains("logout")').text('login');
			$('li').filter(function() { return $(this).text() == 'save'; } ).addClass('disabled');
		},

		// modify a number by a certain distance
		// e.g. modifyNumber(5.89, 10) = 5.89 + 10 * 0.1
		// e.g. modifyNumber(58.9, 20) = 58.9 + 20 * 1
		modifyNumber: function(number, distance) {

			var parts;
			var exponent;
			var factor;
			var result;
			var decimalPlaces;

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
			// how many decimal places does the factor (0.1) have?
			decimalPlaces = (factor.toString().split('.')[1] || "").length;

			// round to that many decimal places (2)
			return d3.round(result, decimalPlaces);
		},

		// run the code and update the display
		renderCode: function() {

			// get the current code
			var code = aigua.codeMirror.getValue();

			switch (aigua.modes[aigua.currentModeIndex].name) {

				case 'html':

					// replace html
					$('body #livecoding-main', $('iframe').contents()).html(code);

					// run the javascript code
					frames[0].livecoding.renderCode(_.find(aigua.modes, function(value) {
						return value.name == 'javascript';
					}).code || '');
	
				break;

				case 'javascript':

					// replace html
					$('body #livecoding-main', $('iframe').contents()).html(_.find(aigua.modes, function(value) {
						return value.name == 'html';
					}).code || '');

					// run the javascript code
					frames[0].livecoding.renderCode(code);

				break;

				case 'css':

					// set css
					$('#style', $('iframe').contents()).get(0).textContent = code;

					// replace html
					$('body #livecoding-main', $('iframe').contents()).html(_.find(aigua.modes, function(value) {
						return value.name == 'html';
					}).code || '');

					// run the javascript code
					frames[0].livecoding.renderCode(_.find(aigua.modes, function(value) {
						return value.name == 'javascript';
					}).code || '');
				break;

				case 'json':

					if (code.length > 0) {
	
						try {
		
							// update the global json object
							frames[0].livecoding.json = JSON.parse(code);

							// replace html
							$('body #livecoding-main', $('iframe').contents()).html(_.find(aigua.modes, function(value) {
								return value.name == 'html';
							}).code || '');

							// run the javascript code
							frames[0].livecoding.renderCode(_.find(aigua.modes, function(value) {
								return value.name == 'javascript';
							}).code || '');
		
						}
						catch (error) {
							console.log(error);
						}
						finally {}
	
					}

				break;

			}
		},

		// TODO: improve by creating a list of snippet objects, each
		// object containing the snippet as key, and two properties,
		// the replacement, and the mode to run under
		replaceSnippet: function(cm) {
			var cursor = cm.getCursor();
			var line = cursor.line;
			var ch = cursor.ch;

			// if we're on ch = 3 or later, inspect the token starting 3 characters ago
			if (ch >= 3) {
				var token = cm.getTokenAt({line: line, ch: ch - 2});

				// is there a snippet for this keyword?
				var snippet = _.find(aigua.snippets, function(value) {
					return value.keyword == token.string;
				});

				// if we found a snippet, replace it only if we're on the right mode
				if (snippet && aigua.modes[aigua.currentModeIndex].name == snippet.mode) {
					cm.replaceRange(snippet.snippet, {line: line, ch: ch - 3}, {line: line, ch: ch});
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

		resetMenu: function() {

			var menu = $('#menu');
			$('ul', menu).hide(); // hide all the dropdowns
			$('h2', menu).removeClass('hover'); // remove hover class from all the h2's
		},

		resetScreen: function() {

			// clear out all the modes (html, css, etc)
			_.each(aigua.modes, function(value, index, list) {
				aigua.switchMode(value.name, true);
				aigua.codeMirror.setValue('');
			});

			// uncheck all items from the libraries dropdown
			$('li', $('#menu .item h2:contains("libraries")').next()).removeClass('selected');

			// remove all js libraries from DOM
			_.each(aigua.libraries, function(value) {
				frames[0].livecoding.removeJs(_.find(aigua.libraries, function(val) {
					return val.name == value.name;
				}));
			});

			aigua.switchMode('html');
		},

		resetUrl: function() {
			history.pushState(null, null, '!');
			$('#gist').attr('href', '');
			$('#gist').html('');
		},

		respondToKey: function(cm) {

			var cursor;
			var token;
			var hex = '';

			// is the slider and mini colors hidden?
			if (!aigua.slider.is(':visible') && !$(aigua.miniColorsSelector).is(':visible')) {

				// grab the current token
				cursor = cm.getCursor();
				token = cm.getTokenAt(cursor);

				// handle numbers
				if (token.className == 'number' || token.className == 'cm-number') {
					aigua.showSlider(cm, cursor, token);
				}

				// handle colors
				if (token.string.length > 1) {

					switch (aigua.modes[aigua.currentModeIndex].name) {

						case 'javascript':
							hex = token.string.substring(1, token.string.length - 1);
							aigua.currentSelectionStart = {line: cursor.line, ch: token.start + 1};
							aigua.currentSelectionEnd   = {line: cursor.line, ch: token.end - 1};
						break;

						case 'css':
							hex = token.string;;
							aigua.currentSelectionStart = {line: cursor.line, ch: token.start};
							aigua.currentSelectionEnd   = {line: cursor.line, ch: token.end};
						break;
					}

					// is this a hex?
					if (!aigua.isHexString(hex)) {
						return;
					}

					aigua.showColorSelector(cm, hex);
				}
			}
		},

		// TODO: clean up all the code duplication
		saveAsUser: function() {

			aigua.setToClean();

			$('#gist').hide();
			$('.save-confirmation').show();
			$('.save-confirmation').text('saving...');

			// possible scenarios:
			// 1) this is a new gist (url has no gist id)
			//			create new gist (POST /gists)
			// 2) this is an existing gist, but not owned by user
			//			fork gist (POST /gists/:id/fork)
			// 3) this is an existing gist, owned by user
			//			save gist (POST /gists/:id)

			var saveUrl = '';
			var postData = aigua.createPostDataObject();
			postData['token'] = aigua.getOAuthToken();

			// 1) this is a new gist
			//			create new gist (POST /gists)
			if (!aigua.getUrlGistId()) {
				saveUrl = '/create-new';
			} else {

				postData['id'] = aigua.getUrlGistId();

				// 2) this is an existing gist, but not owned by user
				//			fork gist (POST /gists/:id/fork)
				if (!aigua.currentGistUserId || aigua.currentGistUserId != aigua.user.id) {
					saveUrl = '/fork';
				}

				// 3) this is an existing gist, owned by user
				//			save gist (POST /gists/:id)
				else {
					saveUrl = '/save';
				}
			}

			$.post(saveUrl, postData, function(data) {
				aigua.setUrl(data);
				aigua.currentGistUserId = aigua.user.id;
				aigua.showSaveConfirmation();
			});

		},

		saveAnonymously: function() {

			aigua.setToClean();

			$('#gist').hide();
			$('.save-confirmation').show();
			$('.save-confirmation').text('saving...');

			var postData = aigua.createPostDataObject();

			$.post('/save-anonymously', postData, function(data) {

				aigua.setUrl(data);
				aigua.currentGistUserId = null;
				aigua.showSaveConfirmation();
			});
		},

		saveAsUserOrAnonymously: function() {

			if (localStorage['aigua.token']) {
				aigua.saveAsUser();
			} else {
				aigua.saveAnonymously();
			}

		},

		setToClean: function() {
			$('.dirty').css('visibility', 'hidden');
		},

		setToDirty: function() {
			$('.dirty').css('visibility', 'visible');
		},

		setUrl: function(gistId) {
			history.pushState(null, null, gistId);

			var gistBaseUrl = 'https://gist.github.com/';
			gistUrl = gistBaseUrl + gistId;

			$('#gist').attr('href', gistUrl);
			$('#gist').html(gistUrl);
		},

		showColorSelector: function(cm, hex) {

			var startCoords;
			var endCoords;
			var center;

			if (aigua.pulseColors) {

				// stop pulsing colors
				window.clearInterval(aigua.pulseColorsInterval);
				window.clearInterval(aigua.pulseMessageInterval);
				$('#message').hide();
				aigua.pulseColors = false;
			}

			// select token
			cm.setSelection(aigua.currentSelectionStart, aigua.currentSelectionEnd);

			// show the color picker
			aigua.miniColorsTrigger.click();

			// initialize color picker with current color
			$('#hidden-miniColors').miniColors('value', hex.substring(1));

			// find coords at token start
			startCoords = cm.cursorCoords(true);
			endCoords = cm.cursorCoords(false);
			center = startCoords.x + (endCoords.x - startCoords.x)/2;

			// position color picker centered below token
			$(aigua.miniColorsSelector).css('left', center - $(aigua.miniColorsSelector).width()/2);
			$(aigua.miniColorsSelector).css('top', endCoords.y + aigua.lineHeight);
		},

		showSaveConfirmation: function() {
			$('.save-confirmation').text('saved at ' + new Date().toLocaleTimeString());
			$('.save-confirmation').fadeOut(1500, function() {
				$('#gist').fadeIn(250);
			});
		},

		showSlider: function(cm, cursor, token) {

			var startCoords;
			var endCoords;
			var center;
			var value;
			var suffix = '';

			if (aigua.pulseNumbers) {

				// stop pulsing numbers
				window.clearInterval(aigua.pulseNumbersInterval);
				window.clearInterval(aigua.pulseMessageInterval);
				$('#message').hide();
				aigua.pulseNumbers = false;
			}

			// show the slider
			aigua.slider.show();

			// if this isn't a number, e.g. 10px or 1.0em or 100%, strip the suffix
			_.each(['px', 'em', '%'], function(value) {
				if (token.string.indexOf(value) != -1) {
					suffix = value;
				}
			});

			// save the original number
			if (aigua.originalNumber == null) {
				aigua.originalNumber = {
					value: Number(token.string.replace(suffix, '')),
					suffix: suffix
				};
			}

			// select token
			aigua.currentSelectionStart = {line: cursor.line, ch: token.start};
			aigua.currentSelectionEnd   = {line: cursor.line, ch: token.end};
			cm.setSelection(aigua.currentSelectionStart, aigua.currentSelectionEnd);

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

			aigua.ball.offset({top: aigua.filler.offset().top});
		},

		switchLayout: function(choice) {

			var layoutItems = $('.screenLayout');
			layoutItems.siblings('.screenLayout').removeClass('disabled');
			$('.screenLayout:contains("' + choice + '")').addClass('disabled');

			aigua.currentScreenLayoutIndex = _.indexOf(aigua.screenLayouts, choice);
			aigua.updateScreenLayout();
			aigua.resetMenu();
		},

		switchMode: function(mode, noTab) {

			// pause aigua: disable code evals from happening on codemirror changes
			aigua.pause = true;

			// if noTab is true, don't highlight/dehighlight the mode tabs
			if (!noTab) {

				$('#modes h2').not(":contains('" + mode + "')").addClass('passive');
				$('#modes h2').not(":contains('" + mode + "')").removeClass('active');
				$("#modes h2:contains('" + mode + "')").addClass('active');
				$("#modes h2:contains('" + mode + "')").removeClass('passive');
			}

			// save current code to this mode's 'code' property
			aigua.modes[aigua.currentModeIndex].code = aigua.codeMirror.getValue();

			// set current mode index to new mode
			aigua.currentModeIndex = _.indexOf(_.pluck(aigua.modes, 'name'), mode);

			// populate the code mirror tab with the new mode's code
			aigua.codeMirror.setValue(aigua.modes[aigua.currentModeIndex].code || '');

			// change codemirror's language syntax to the new mode
			var codeMirrorOptionMode, codeMirrorLoadMode;

			if (aigua.modes[aigua.currentModeIndex].name == 'json') {
				codeMirrorOptionMode = 'application/json';
				codeMirrorLoadMode = 'javascript';
			} else if (aigua.modes[aigua.currentModeIndex].name == 'html') {
				codeMirrorOptionMode = 'text/html';
				codeMirrorLoadMode = 'htmlmixed';
			} else {
				codeMirrorOptionMode = aigua.modes[aigua.currentModeIndex].name;
				codeMirrorLoadMode = aigua.modes[aigua.currentModeIndex].name;
			}

			// remove all code folding markers
			$('.CodeMirror-gutter-text pre').removeClass('codeFolded');

			aigua.codeMirror.setOption("mode", codeMirrorOptionMode);
			CodeMirror.autoLoadMode(aigua.codeMirror, codeMirrorLoadMode);

			aigua.pause = false;
		},

		switchToNextLayout: function() {

			// if we're on the last one, go to the first one
			// else go to the next one
			if (aigua.currentScreenLayoutIndex == aigua.screenLayouts.length - 1) {
				aigua.switchLayout(aigua.screenLayouts[0]);
			} else {
				aigua.switchLayout(aigua.screenLayouts[aigua.currentScreenLayoutIndex + 1]);
			}
		},

		switchToPreviousLayout: function() {

			// if we're on the first one, go to the last one
			// else go to the previous one
			if (aigua.currentScreenLayoutIndex == 0) {
				aigua.switchLayout(aigua.screenLayouts[aigua.screenLayouts.length - 1]);
			} else {
				aigua.switchLayout(aigua.screenLayouts[aigua.currentScreenLayoutIndex - 1]);
			}
		},

		switchToNextMode: function() {

			// if we're on the last one, go to the first one
			// else go to the next one
			if (aigua.currentModeIndex == aigua.modes.length - 1) {
				aigua.switchMode(aigua.modes[0].name);
			} else {
				aigua.switchMode(aigua.modes[aigua.currentModeIndex + 1].name);
			}
		},

		switchToPreviousMode: function() {

			// if we're on the first one, go to the last one
			// else go to the previous one
			if (aigua.currentModeIndex == 0) {
				aigua.switchMode(aigua.modes[aigua.modes.length - 1].name);
			} else {
				aigua.switchMode(aigua.modes[aigua.currentModeIndex - 1].name);
			}
		},

		switchResolution: function(resolution) {

			resolution.siblings().removeClass('disabled');
			resolution.addClass('disabled');

			// reset
			if (resolution.text() == 'reset') {

				$('iframe').css('width', '');
				$('iframe').css('height', '');
				$('iframe').css('border', '');

			}
			// set width and height
			else {

				width = resolution.attr('rel').split('x')[0];
				height = resolution.attr('rel').split('x')[1];

				$('iframe').css('width', width);
				$('iframe').css('height', height);
				$('iframe').css('border', 'solid gray 1px');
			}

			aigua.renderCode();
			aigua.resetMenu();
		},

		updateScreenLayout: function() {

			if (aigua.screenLayouts[aigua.currentScreenLayoutIndex] == 'sketchpad mode') {
				$('body').find('*').removeClass('full horizontal');
			} else {
				$('body').find('*').addClass('full');

				if (aigua.screenLayouts[aigua.currentScreenLayoutIndex] == 'fullscreen mode (horizontal)') {
					$('body').find('*').addClass('horizontal');
				}
				else {
					$('body').find('*').removeClass('horizontal');
				}
			}

			// render the javascript code
			// but we can't simply call aigua.renderCode(), because
			// if we're on css mode, it doesn't actually render code
			// so we either (1) force it by passing an extra param to aigua.renderCode()
			// or (2) we do it right here
			// or (3) we create a global variable, like aigua.pause,
			// and turn it on, run renderCode(), then turn it off

			// we'll choose (2) - do it right here

			// if we're on javascript mode, call rendercode
			switch(aigua.modes[aigua.currentModeIndex].name) {

				case 'html':
					aigua.renderCode();
					// switch modes to css, without tabbing
					aigua.switchMode('css', true);
					// switch back to javascript
					aigua.switchMode('html', true);
				break;

				case 'javascript':
					aigua.renderCode();
					// switch modes to css, without tabbing
					aigua.switchMode('css', true);
					// switch back to javascript
					aigua.switchMode('javascript', true);
				break;

				case 'css':
					// switch modes to javascript, without tabbing
					aigua.switchMode('javascript', true);
					// render code
					aigua.renderCode();
					// switch back to css
					aigua.switchMode('css', true);
				break;

				case 'json':
					aigua.renderCode();
					// switch modes to javascript, without tabbing
					aigua.switchMode('javascript', true);
					// switch back to json
					aigua.switchMode('json', true);
				break;
			}
		},

		areYouSureText: 'Are you sure? You will lose any unsaved changes.',
		ball: null,
		bar: null,
		borderWidth: 2,
		currentGistUserId: null,
		miniColorsSelector: '.miniColors-selector',
		miniColorsTrigger: null,
		currentModeIndex: 0,
		currentScreenLayoutIndex: 2,
		currentSelection: null,
		filler: null,
		handle: null,
		iframeLoaded: null,
		isLoading: null,
		key: null,
		libraries: [
			{
				name: 'crossfilter',
				obj: 'crossfilter'
			},
			{
				name: 'd3',
				obj: 'd3'
			},
			{
				name: 'Highcharts',
				obj: 'Highcharts'
			},
			{
				name: 'Underscore',
				obj: '_'
			}
		],
		lineHeight: 19,
		marker: null,
		modes: [
			{
				name: 'html',
				code: null
			}, {
				name: 'javascript',
				code: null
			}, {
				name: 'css',
				code: null
			}, {
				name: 'json',
				code: null
			}
		],
		originalNumber: null,
		pause: false,
		pulseColors: true,
		pulseColorsInterval: null,
		pulseMessageInterval: null,
		pulseNumbers: true,
		pulseNumbersInterval: null,
		screenLayouts: ['fullscreen mode (horizontal)', 'fullscreen mode (vertical)', 'sketchpad mode'],
		slider: null,
		snippets: [
			{
				keyword: 'bor',
				snippet: 'border: solid #FF0000 1px;',
				mode: 'css'
			},
			{
				keyword: 'bac',
				snippet: 'background: #FF0000;',
				mode: 'css'
			},
			{
				keyword: 'mar',
				snippet: 'margin: 0em 0em 0em 0em;',
				mode: 'css'
			},
			{
				keyword: 'pad',
				snippet: 'padding: 0em 0em 0em 0em;',
				mode: 'css'
			}
		],
		startingBarWidth: 300,
		triangle: null,
		triangleHeight: 5,
		triangleWidth: 12,
		user: null

	}
}());

$(function() {

	// do a slow fade in
	$('#main').fadeIn(1000);

	aigua.iframeLoaded = function() {

		// ----------- initialization section ---------------------- 

		// do we support this browser?
		if (!(BrowserDetect.browser == 'Chrome' || BrowserDetect.browser == 'Firefox'
			|| BrowserDetect.browser == 'Safari')) {

			// we don't - show the 'sorry, upgrade your browser' dialog
			$('#browsermessage').fadeIn(1000);

		// we do support this browser! 
		} else {

			if (!localStorage.livecoding_about
				|| localStorage.livecoding_about != $('#popup .about').attr('rel')) {

				$('#popup').fadeIn();
				$('#popup .about').fadeIn();
			}

			var extraKeys = {};
			var gistId;
			aigua.key = {};

			var shortcuts = [];

			// setup the key correctly (mac/linux/windows)
			// aigua.key.Name: CodeMirror will listen for this key - it's the key that triggers slider/color picker
			// aigua.key.DisplayName: we display this string to the user - it's to inform them of what key to use
			if (BrowserDetect.OS == 'Mac') {
				aigua.key.Name = 'Alt-Alt'; 
				aigua.key.DisplayName = 'Alt'; 
				aigua.key.Code = 18;

				// TODO: consolidate code duplication here
				{extraKeys['Alt-S']  = aigua.saveAsUserOrAnonymously};
				{extraKeys['Cmd-/']  = aigua.switchToNextMode};
				{extraKeys['Cmd-.']  = aigua.switchToPreviousMode};
				{extraKeys["Cmd-'"]  = aigua.switchToPreviousLayout};
				{extraKeys['Cmd-;']  = aigua.switchToNextLayout};
				{extraKeys['Tab']    = aigua.replaceSnippet};
				{extraKeys['Cmd-\\'] = aigua.comment};

				shortcuts = [
					{
						section: 'general', shortcuts: [
							{ shortcut: 'Alt + S', name: 'save document' },
							{ shortcut: '⌘ + /', name: 'next mode' },
							{ shortcut: '⌘ + .', name: 'previous mode' },
							{ shortcut: "⌘ + '", name: 'next layout' },
							{ shortcut: '⌘ + ;', name: 'previous layout' },
							{ shortcut: "⌘ + \\", name: 'comment/uncomment' }
						]
					}
				];
			}
			
			if (BrowserDetect.OS == 'Linux') {
				aigua.key.Name = 'Ctrl';
				aigua.key.DisplayName = 'Ctrl';
				aigua.key.Code = 17;

				{extraKeys['Ctrl-S'] = aigua.saveAsUserOrAnonymously};
			}
			
			if (BrowserDetect.OS == 'Windows') {
				aigua.key.Name = 'Ctrl-Ctrl';
				aigua.key.DisplayName = 'Ctrl';
				aigua.key.Code = 17;

				// TODO: consolidate code duplication here
				{extraKeys['Ctrl-S']  = aigua.saveAsUserOrAnonymously};
				{extraKeys['Ctrl-/']  = aigua.switchToNextMode};
				{extraKeys['Ctrl-.']  = aigua.switchToPreviousMode};
				{extraKeys["Ctrl-'"]  = aigua.switchToPreviousLayout};
				{extraKeys['Ctrl-;']  = aigua.switchToNextLayout};
				{extraKeys['Tab']     = aigua.replaceSnippet};
				{extraKeys['Ctrl-\\'] = aigua.comment};

				shortcuts = [
					{
						section: 'general', shortcuts: [
							{ shortcut: 'Ctrl + S', name: 'save document' },
							{ shortcut: 'Ctrl + /', name: 'next mode' },
							{ shortcut: 'Ctrl + .', name: 'previous mode' },
							{ shortcut: "Ctrl + '", name: 'next layout' },
							{ shortcut: 'Ctrl + ;', name: 'previous layout' },
							{ shortcut: "Ctrl + \\", name: 'comment/uncomment' }
						]
					}
				];
			}

			// group snippets by mode
			var snippets = _.chain(aigua.snippets)
				.groupBy(function(value) {
					return value.mode;
				})
				.map(function(value) {
					var shortcuts = _.map(value, function(value) {
						return { shortcut: value.keyword + ' + Tab', name: value.snippet };
					});

					return { section: 'snippets (' + value[0].mode + ')', shortcuts: shortcuts };
				})
				.each(function(value) {
					shortcuts.push(value);
				});

			// add keyboard shortcuts to popup
			_.each(shortcuts, function(value) {

				var h3 = $('<h3></h3>');
				h3.text(value.section);
				$('#popup .keyboard').append(h3);

				var ul = $('<ul class="keys"></ul>');

				_.each(value.shortcuts, function(value) {
					var li = $('<li></li>');
					var span = $('<span></span>');
					span.text(value.shortcut);
					li.append(span);
					li.append(value.name);
					ul.append(li);
				});

				$('#popup .keyboard').append(ul);
			});

			// display the key DisplayName to the user - 'Alt', or 'Ctrl', etc
			$('#message .key').text(aigua.key.DisplayName);
			
			// this object will be used by codemirror to respond to THE key
			{extraKeys[aigua.key.Name] = aigua.respondToKey};

			// initialize mini colors
			$('#hidden-miniColors').miniColors({

				// when we change a color, replace the old hex string
				// in codemirror with this new color
				change: function(hex, rgb) {
					aigua.codeMirror.replaceSelection(hex.toUpperCase());
				}

			});

			// set various dom elements
			aigua.ball = $('#ball');
			aigua.bar = $('#bar');
			aigua.filler = $('#filler');
			aigua.handle = $('#handle');
			aigua.marker = $('#marker');
			aigua.slider = $('#slider');
			aigua.triangle = $('#triangle');
			aigua.miniColorsTrigger = $('.miniColors-trigger');

			// set the handle's default width
			aigua.handle.width(aigua.startingBarWidth);

			// set the bar's border width and default width
			aigua.bar.css('border-width', aigua.borderWidth);
			aigua.bar.width(aigua.startingBarWidth);

			// set the triangle
			aigua.triangle.css('border-width', aigua.triangleHeight + 'px ' + aigua.triangleWidth + 'px 0px ' + aigua.triangleWidth + 'px');

			// create codemirror instance
			aigua.codeMirror = CodeMirror($('#code').get(0), {

				// listen for a change in the codemirror's contents
				onChange: function(cm, e) {

					// if aigua.pause is true, don't do anything when the code changes
					if (!aigua.pause) {

						// if we've modified the code, set the 'dirty' flag (the green dot)
						// but don't do that when we're loading the code
						if (!aigua.isLoading) {
							aigua.setToDirty();
						}

						// call render code every time we change the code's contents
						// this will re-render the code contents and display the results
						// on the display panel
						aigua.renderCode();
					}
				},

				// enable code folding
				onGutterClick: CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder),

				// this object holds a reference to THE key we defined above
				extraKeys: extraKeys,

				// show line numbers
				lineNumbers: true,

				// match closing brackets
				matchBrackets: true,

				// set default mode to javascript
				mode:  'javascript',

				// tell codemirror where to find javascript mode assets
				modeURL: '/mode/%N.js',

				// allow code modifications
				readOnly: false,

				// set the theme (a decent twilight-lookalike)
				theme: 'lesser-dark'
			});

			// if token is in localstorage, log in
			if (localStorage['aigua.token']) {
				aigua.logIn(localStorage['aigua.token']);
			} else {
			// we still call log out to make sure all UI-related elements are set correctly
				aigua.logOut();
			}

			// try to grab the gist id from the url
			// e.g. the '3072416' bit in http://livecoding.io/3072416
			gistId = aigua.getUrlGistId();

			// is there an id in the url?
			if (gistId) {

				// yes - load its contents
				aigua.loadGist(gistId);
			} else {

				// no gist - load the first example
				aigua.loadGist($("#menu .item h2:contains('examples') + ul li:first").attr('rel'));
			}

			// show the 'click a number' message
			$('#message').show();

			// pulse the message
			aigua.pulseMessageInterval = setInterval(function() {
				$('#message').animate({opacity: 0.5}).animate({opacity: 1});
			}, 1000);

			// pulse colors (e.g. '#CF2626' or '#FFF')
			aigua.pulseColors = true;
			aigua.pulseColorsInterval = setInterval(function() {
				switch (aigua.modes[aigua.currentModeIndex].name) {

					// if we're on the javascript tab, colors will be
					// in a <span class='cm-string'></span>
					case 'javascript':
						$('.cm-string').filter(function(index) {

							// check the string (using a regular expression)
							// to make sure it's a valid color hex
							// but first, remove the first and last characters,
							// which will be either single or double quotes
							var token = $(this).text();
							return token.length > 1 && aigua.isHexString(token.substring(1, token.length - 1));

						}).animate({opacity: 0.5}).animate({opacity: 1});
					break;

					// if we're on the css tab, colors will be
					// in a <span class='cm-atom'></span> element
					case 'css':
						$('.cm-atom').filter(function(index) {

							// check the string (using a regular expression)
							// to make sure it's a valid color hex
							// no need to remove the first and last characters
							var token = $(this).text();
							return token.length > 1 && aigua.isHexString(token);

						}).animate({opacity: 0.5}).animate({opacity: 1});
					break;
				}

			}, 1000);
			
			// pulse numbers
			aigua.pulseNumbers = true;
			aigua.pulseNumbersInterval = setInterval(function() {
				// this is pretty convenient - codemirror will wrap numbers
				// in a <span class='cm-number'></span> element
				$('.cm-number').animate({opacity: 0.5}).animate({opacity: 1});

			}, 1000);

			// initialize slider
			aigua.handle.draggable({

				// only allow dragging along the x-axis
				axis: 'x',
				
				drag: function(ui, event) {

					var position = event.position.left + aigua.handle.width()/2;
					var markerCenter = aigua.marker.offset().left;
					var offset = position - markerCenter;
					var newNumber;

					// calculate the new number based on the original number
					// plus the dragging offset
					newNumber = aigua.modifyNumber(aigua.originalNumber.value, offset);

					// replace the selection with the new number
					aigua.codeMirror.replaceSelection(String(newNumber) + aigua.originalNumber.suffix);

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
						if (offset > aigua.startingBarWidth/2 - 6) {

							// set bar right edge to dragging position
							aigua.bar.width(position - aigua.bar.offset().left + 5);
						}

						// reset the width, since fast drags won't trigger a drag call every pixel.
						else {
							aigua.resetBar(markerCenter);

							// show the ball
							aigua.ball.show();
						}

					// is the dragging cursor to the left of the marker?
					} else if (offset < 0) {

						// set the filler width
						aigua.filler.width(-offset);

						// adjust the filler position
						aigua.filler.css('left', aigua.startingBarWidth/2 - -offset + aigua.borderWidth/2);

						// are we dragging past the initial bar width?
						if (-offset > aigua.startingBarWidth/2 - 6) {

							// adjust the filler position
							aigua.filler.css('left', aigua.borderWidth/2 + 7);

							// set bar left edge to dragging position
							aigua.bar.width(-offset + aigua.startingBarWidth/2 + 7);
							aigua.bar.css('left', position - aigua.borderWidth - 7);
						}

						// reset the width, since fast drags won't trigger a drag call every pixel.
						else {
							aigua.resetBar(markerCenter);

							// show the ball
							aigua.ball.show();
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

				h2.addClass(index == aigua.currentModeIndex ? 'active' : 'passive');
				h2.text(mode.name);

				$('#modes').append(div);
			});

			// populate screen layout switcher
			_.each(aigua.screenLayouts, function(layout, index, list) {

				var li = $('<li />');
				li.text(layout);
				li.addClass('screenLayout');
				li.addClass(index == aigua.currentScreenLayoutIndex ? 'disabled' : '');

				$('#menu .item h2:contains("view")').next().prepend(li);
			});

			// populate libraries dropdown
			_.each(aigua.libraries, function(value) {

				var li = $('<li />');
				li.text(value.name);

				$('#menu .item h2:contains("libraries")').next().append(li);
			});


			// ----------- event handlers section ----------------------

			// if we mouseup, and the slider is showing, AND nothing is selected,
			// select the previously selected token
			$(window).mouseup(function(e) {

				if (aigua.slider.is(':visible') && aigua.codeMirror.getSelection() == '') {
					aigua.codeMirror.setSelection(aigua.currentSelectionStart, aigua.currentSelectionEnd);
				}
			});

			// if 'esc', hide popup
			$(window).keydown(function(e) {

				if (e.which == 27) {
					aigua.hidePopup();
				}

			});

			// did we keyup the handle key?
			$(window).keyup(function(e) {

				if (e.which == aigua.key.Code) {

					// if slider is visible
					if (aigua.slider.is(':visible')) {
		
						// hide the slider
						aigua.slider.hide();

						// reset filler width
						aigua.filler.width(0);

						// reset bar width
						aigua.bar.width(aigua.startingBarWidth);

						// clear out the original number
						aigua.originalNumber = null;
					}

					// if mini colors is visible
					if ($(aigua.miniColorsSelector).is(':visible')) {

						// trigger an event which will hide mini colors
						$(document).trigger('mousedown');
					}
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
				$(this).children().addClass('hover'); // add hover class to this h2
			});

			// handle menu mouseover/mouseout events
			$('#menu .item').on('mouseout', function(e) {

				if ($(e.relatedTarget).parents('.item').get(0) != $(this).get(0)) {
					aigua.resetMenu();
				}
			});

			// handle menu mouseover/mouseout events
			$('#menu .item li').on('mouseover', function(e) {
				var li = $(this);

				if (li.attr('class') && li.attr('class').indexOf('disabled') != -1) {

				} else {
					li.addClass('hover');
				}
			});

			// handle menu mouseover/mouseout events
			$('#menu .item li').on('mouseout', function(e) {
				$(this).removeClass('hover');
			});

			// handle clicking on title
			$('#header').on('click', function(e) {

				e.preventDefault();

				// ask user 'are you sure' before wiping the codemirror contents
				aigua.askBeforeNew();
			});

			$(window).on('beforeunload', function() {

				if (aigua.isDirty()) {
					return aigua.areYouSureText;
				}
			});

			// handle menu item choices
			$('#menu .item ul li').on('click', function(e) {
				e.preventDefault();

				var choice = $(this);
				var itemName = $('h2', choice.parents('.item')).text();
				var result;
				var width, height;

				switch(choice.text()) {
					case 'login':
						open('/github-login', 'popup', 'width=1015,height=500');
					break;

					case 'logout':
						aigua.logOut();
					break;
				}

				switch(itemName) {

					case 'file':
						switch (choice.text()) {
							case 'new':
								aigua.askBeforeNew();
							break;

							case 'save':
								if (!aigua.user) {
									alert('Please login to save your work under your GitHub username.');
								} else {
									aigua.saveAsUser();
								}
								aigua.resetMenu();
							break;

							case 'save anonymously':
								aigua.saveAnonymously();
								aigua.resetMenu();
							break;
						}
					break;

					case 'examples':
						result = aigua.isDirty() ? confirm(aigua.areYouSureText) : true;
						if (result) {
							aigua.loadGist(choice.attr('rel'));
						}
					break;

					case 'view':

						// did we click on a screen layout item?
						if (choice.attr('class').indexOf('screenLayout') != -1) {

							aigua.switchLayout(choice.text());

						}
						else {

							switch (choice.text()) {

								case 'single page':

									result = aigua.isDirty() ? confirm("Are you sure? Your unsaved changes will not be reflected when viewing as a single page.") : true;
									if (result) {
										window.open('/s/' + aigua.getUrlGistId(), '_blank');
									}
									aigua.resetMenu();

								break;

							}

						}

					break;

					case 'libraries':

						if (choice.attr('class').indexOf('selected') == -1 ) {
							choice.addClass('selected');
							frames[0].livecoding.addJs(_.find(aigua.libraries, function(value) {
								return value.name == choice.text();
							}));
							aigua.setToDirty();
						}
						else {
							choice.removeClass('selected');
							frames[0].livecoding.removeJs(_.find(aigua.libraries, function(value) {
								return value.name == choice.text();
							}));
							aigua.setToDirty();
						}

						aigua.resetMenu();

					break;

					case 'resolution':

						aigua.switchResolution(choice);

					break;

					case 'help':

						switch (choice.text()) {

							case 'source code':
								window.open('https://github.com/gabrielflorit/livecoding/', '_blank');
								aigua.resetMenu();
							break;

							case 'contact':
								window.open('http://twitter.com/gabrielflorit', '_blank');
								aigua.resetMenu();
							break;

							case 'about':
								$('#popup').fadeIn();
								$('#popup .about').fadeIn();
								aigua.resetMenu();
							break;

							case 'keyboard shortcuts':
								$('#popup').fadeIn();
								$('#popup .keyboard').fadeIn();
								aigua.resetMenu();
							break;
						}

					break;
				}
			});

			// close popup
			$('#popup .close').click(function(e) {
				e.preventDefault();

				aigua.hidePopup();
			});

		}
	};

	$('#iframeContainer').append('<iframe src="/iframe" scrolling="yes"></iframe>');

});
