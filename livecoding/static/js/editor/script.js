/* Author:
	Gabriel Florit
*/

var aigua = (function () {

	var token = null;

	return {

		// if user clicks 'new', ask for confirmation if the editor
		// contents have changed.
		// it reads user-related info, but mostly
		// modifies editor and dropdown
		// editor.js ?
		askBeforeNew: function() {
			var result = aigua.isDirty() ? confirm(aigua.areYouSureText) : true;

			if (result) {
				aigua.resetScreen();
				aigua.resetUrl();
				aigua.resetMenu();

				if (aigua.currentGistUserId == aigua.user.id) {
					// disable 'save as public gist' or 'save as private gist', depending
					// on whether this is a private or public gist
					$('#menu li:contains("save as public gist"), #menu li:contains("save as private gist")').removeClass('disabled');
				}
			}
		},

		// create payload with all sorts of data to be sent to server
		// this object will contain all code data, plus editor options, libraries, etc
		// github.js ?
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
				layout: aigua.screenLayouts[aigua.currentScreenLayoutIndex]
			};

			// don't include resolution if it's set to nothing
			if (options.resolution != 'reset') {
				// add current resolution (e.g. 320x480)
				options.resolution = $('li[class*="disabled"]', $('#menu .item h2:contains("resolution")').next()).text();
			}

			result.options = JSON.stringify(options, null, 4); // pretty print

			return result;
		},

		// convenience function to return a private var
		// github.js ?
		getOAuthToken: function() {
			return token;
		},

		// get url gist id - e.g the 1234567 part in http://livecoding.io/1234567
		// editor.js ?
		getUrlGistId: function() {

			var a = document.createElement('a');
			a.href = location.href;

			var gistId = a.pathname.split('/')[1];

			return (gistId.length > 0 && gistId != '!') ? gistId : null;
		},

		// get url gist id - e.g the abcdefg part in http://livecoding.io/1234567/abcdefg
		// editor.js ?
		getUrlGistVersionId: function() {

			var a = document.createElement('a');
			a.href = location.href;

			var parts = a.pathname.split('/');

			return parts.length == 3 ? parts[2] : null;
		},

		// hide popup overlay
		// editor.js ?
		hidePopup: function() {

			if ($('#popup .about').is(':visible')) {
				localStorage.livecoding_about = $('#popup .about').attr('rel');
			}

			$('#popup .containerItem').fadeOut();
			$('#popup').fadeOut();
		},

		// get gist data from server
		// github.js ?
		loadGist: function(gistId, versionId) {

			aigua.isLoading = true;

			aigua.resetScreen();
			aigua.resetMenu();
			aigua.setToClean();

			$.ajax({
				url: '/gist/' + gistId + (versionId ? '/' + versionId : ''),
				dataType: 'json',
				success: function (data) {

					aigua.currentGistUserId = data.user ? data.user.id : null;

					var html = data.files['water.html'];
					var javascript = data.files['water.js'];
					var css = data.files['water.css'];
					var json = data.files['water.json'];

					var options;
					if (data.files['options.json']) {
						options = JSON.parse(data.files['options.json'].content);
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

					if (!options.resolution || options.resolution.indexOf('(') != -1) {
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

					aigua.setUrl(gistId, versionId);

					aigua.isLoading = false;

					if (aigua.currentGistUserId == aigua.user.id) {
						// disable 'save as public gist' or 'save as private gist', depending
						// on whether this is a private or public gist
						$('#menu li:contains("save as ' + (/^\d+$/g.test(gistId) ? 'public' : 'private') + ' gist")').removeClass('disabled');
						$('#menu li:contains("save as ' + (/^\d+$/g.test(gistId) ? 'private' : 'public') + ' gist")').addClass('disabled');
					}
				}
			});

		},

		// get github auth token from server, also get user info
		// github.js ?
		logIn: function(oauthToken, callback) {
			token = oauthToken;
			localStorage['aigua.token'] = token;

			aigua.resetMenu();

			$.get('/user/' + token, function(user) {
				aigua.user = JSON.parse(user);
				var userh2 = $('#controls .item h2.user');
				userh2.css('background-image', 'url(' + aigua.user.avatar_url + ')');
				userh2.css('cursor', 'pointer');
				userh2.click(function(e) {
					window.open(aigua.user.html_url);

					aigua.resetMenu();
				});
				$('li:contains("login")').text('logout');
				$('#menu li:contains("save as private gist"), #menu li:contains("save as public gist")').removeClass('disabled');
				callback();
			});
		},

		// clear token from local storage, and modify editor menus accordingly
		// github.js ?
		logOut: function() {
			token = null;
			aigua.user = null;
			localStorage.removeItem('aigua.token');

			aigua.resetMenu();

			var userh2 = $('#controls .item h2.user');
			userh2.removeAttr('style');
			userh2.unbind('click');
			$('li:contains("logout")').text('login');
			$('#menu li:contains("save as private gist"), #menu li:contains("save as public gist")').addClass('disabled');
		},

		// set a flag to pause / resume code evaluation
		// editor.js ?
		pauseResumeExecution: function() {
			if (!aigua.pauseExecution) {
				aigua.pauseExecution = !aigua.pauseExecution;
				$('#pauseExecution').show();
			} else {
				aigua.pauseExecution = !aigua.pauseExecution;
				$('#pauseExecution').hide();
				aigua.renderCode();
			}
		},

		// run the code and update the display
		// editor.js ?
		renderCode: function() {

			// get the current code
			if (!aigua.pauseExecution) {

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
			}
		},

		// TODO: improve by creating a list of snippet objects, each
		// object containing the snippet as key, and two properties,
		// the replacement, and the mode to run under
		// editor.js ?
		replaceSnippet: function(cm) {
			var cursor = cm.getCursor();
			var line = cursor.line;
			var ch = cursor.ch;

			var token = cm.getTokenAt({line: line, ch: ch});

			// is there a snippet for this keyword?
			var snippet = _.find(aigua.snippets, function(value) {
				return value.keyword == token.string;
			});

			// if we found a snippet, replace it only if we're on the right mode
			if (snippet && aigua.modes[aigua.currentModeIndex].name == snippet.mode) {
				cm.replaceRange(snippet.snippet, {line: line, ch: ch - token.string.length}, {line: line, ch: ch});
			}
		},

		// reset bar position and width:
		// center bar over the token
		// set bar width to default starting width
		// slider.js ?
		resetBar: function(markerCenter) {
			aigua.bar.width(aigua.startingBarWidth);
			aigua.bar.css('left', markerCenter - aigua.startingBarWidth/2 - aigua.borderWidth);
			aigua.filler.removeClass('filler-edge-left');
			aigua.filler.removeClass('filler-edge-right');
		},

		// menu.js ?
		resetMenu: function() {

			var menu = $('#menu');
			$('ul', menu).hide(); // hide all the dropdowns
			$('h2', menu).removeClass('hover'); // remove hover class from all the h2's
		},

		// editor.js ?
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

		// editor.js ?
		resetUrl: function() {
			history.pushState(null, null, '/!');
			$('#gist').attr('href', '');
			$('#gist').html('');
		},

		// editor.js ?
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

					// is this not a hex?
					if (!hex.isHex()) {
						return;
					}

					aigua.showColorSelector(cm, hex);
				}
			}
		},

		// TODO: clean up all the code duplication
		// github.js ?
		saveAsUser: function(publicGist) {

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
				saveUrl = '/create-new?public=' + publicGist;
			} else {

				postData['id'] = aigua.getUrlGistId();

				// 2) this is an existing gist, but not owned by user
				//			fork gist (POST /gists/:id/fork)
				if (!aigua.currentGistUserId || aigua.currentGistUserId != aigua.user.id) {
					saveUrl = '/fork?public=' + publicGist;
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

				$('#menu li:contains("save as ' + (publicGist ? 'private' : 'public') + ' gist")').addClass('disabled');
				$('#menu li:contains("save as ' + (publicGist ? 'public' : 'private') + ' gist")').removeClass('disabled');
			});

		},

		// github.js ?
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

				$('#menu li:contains("save as public gist"), #menu li:contains("save as private gist")').removeClass('disabled');
			});
		},

		// github.js ?
		saveAsUserOrAnonymously: function() {

			if (localStorage['aigua.token']) {
				aigua.saveAsUser(true);
			} else {
				aigua.saveAnonymously();
			}

		},

		// editor.js ?
		isDirty: function() {
			return $('.dirty').css('visibility') == 'visible';
		},

		// editor.js ?
		setToClean: function() {
			$('.dirty').css('visibility', 'hidden');
		},

		// editor.js ?
		setToDirty: function() {
			$('.dirty').css('visibility', 'visible');
		},

		// editor.js ?
		setUrl: function(gistId, versionId) {
			var gistAndVersionIds = '/' + gistId + (versionId ? '/' + versionId : '');

			history.pushState(null, null, gistAndVersionIds);

			var gistBaseUrl = 'https://gist.github.com';
			gistUrl = gistBaseUrl + gistAndVersionIds;

			$('#gist').attr('href', gistUrl);
			$('#gist').html(gistUrl);
		},

		// editor.js / colorpicker.js ?
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

		// editor.js ?
		showSaveConfirmation: function() {
			$('.save-confirmation').text('saved at ' + new Date().toLocaleTimeString());
			$('.save-confirmation').fadeOut(1500, function() {
				$('#gist').fadeIn(250);
			});
		},

		// slider.js ?
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

		// editor.js ?
		startAnimate: function() {
			frames[0].livecoding.startAnimate();
			$('#startAnimation').show();
		},

		// editor.js ?
		stopAnimate: function() {
			frames[0].livecoding.stopAnimate();
			$('#startAnimation').hide();
		},

		// editor.js ?
		switchLayout: function(choice) {

			var layoutItems = $('.screenLayout');
			layoutItems.siblings('.screenLayout').removeClass('disabled');
			$('.screenLayout:contains("' + choice + '")').addClass('disabled');

			aigua.currentScreenLayoutIndex = _.indexOf(aigua.screenLayouts, choice);
			aigua.updateScreenLayout();
			aigua.resetMenu();
		},

		// editor.js ?
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

			// save cursor line and position to this mode's 'position' property
			aigua.modes[aigua.currentModeIndex].cursor = aigua.codeMirror.getCursor();

			// save scroll info to this mode's 'scrollInfo' property
			aigua.modes[aigua.currentModeIndex].scrollInfo = aigua.codeMirror.getScrollInfo();

			// set current mode index to new mode
			aigua.currentModeIndex = _.indexOf(_.pluck(aigua.modes, 'name'), mode);

			// populate the code mirror tab with the new mode's code
			aigua.codeMirror.setValue(aigua.modes[aigua.currentModeIndex].code || '');

			// set cursor 
			if (aigua.modes[aigua.currentModeIndex].cursor) {
				aigua.codeMirror.setCursor(aigua.modes[aigua.currentModeIndex].cursor);
			}

			// scroll to saved position
			if (aigua.modes[aigua.currentModeIndex].scrollInfo) {
				aigua.codeMirror.scrollTo(aigua.modes[aigua.currentModeIndex].scrollInfo.x, aigua.modes[aigua.currentModeIndex].scrollInfo.y);
			}


			aigua.codeMirror.focus();

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

		// editor.js ?
		switchToCss: function() {
			aigua.switchMode('css');
		},

		// editor.js ?
		switchToHtml: function() {
			aigua.switchMode('html');
		},

		// editor.js ?
		switchToJavaScript: function() {
			aigua.switchMode('javascript');
		},

		// editor.js ?
		switchToJson: function() {
			aigua.switchMode('json');
		},

		// editor.js ?
		switchToNextLayout: function() {

			// if we're on the last one, go to the first one
			// else go to the next one
			if (aigua.currentScreenLayoutIndex == aigua.screenLayouts.length - 1) {
				aigua.switchLayout(aigua.screenLayouts[0]);
			} else {
				aigua.switchLayout(aigua.screenLayouts[aigua.currentScreenLayoutIndex + 1]);
			}
		},

		// editor.js ?
		switchToPreviousLayout: function() {

			// if we're on the first one, go to the last one
			// else go to the previous one
			if (aigua.currentScreenLayoutIndex == 0) {
				aigua.switchLayout(aigua.screenLayouts[aigua.screenLayouts.length - 1]);
			} else {
				aigua.switchLayout(aigua.screenLayouts[aigua.currentScreenLayoutIndex - 1]);
			}
		},

		// editor.js ?
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

				// take into account the scrollbar width
				while($('html', $('iframe').contents()).width() != width) {
					$('iframe').css('width', $('iframe').width() + 1);
				}
			}

			aigua.renderCode();
			aigua.resetMenu();
		},

		// editor.js ?
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
		currentScreenLayoutIndex: 1,
		currentSelection: null,
		filler: null,
		handle: null,
		iframeLoaded: null,
		isLoading: null,
		key: null,
		libraries: lc.libraries,
		lineHeight: 19,
		marker: null,
		modes: [
			{
				name: 'html',
				code: null,
				cursor: null,
				scrollInfo: null
			}, {
				name: 'javascript',
				code: null,
				cursor: null,
				scrollInfo: null
			}, {
				name: 'css',
				code: null,
				cursor: null,
				scrollInfo: null
			}, {
				name: 'json',
				code: null,
				cursor: null,
				scrollInfo: null
			}
		],
		originalNumber: null,
		pause: false,
		pauseExecution: false,
		pulseColors: true,
		pulseColorsInterval: null,
		pulseMessageInterval: null,
		pulseNumbers: true,
		pulseNumbersInterval: null,
		screenLayouts: ['fullscreen mode (horizontal)', 'fullscreen mode (vertical)', 'sketchpad mode'],
		slider: null,
		snippets: lc.snippets,
		startingBarWidth: 300,
		triangle: null,
		triangleHeight: 5,
		triangleWidth: 12,
		user: null

	}
}());

$(function() {

	$('body').find('*').addClass('full');

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

			var extraKeys = {};
			aigua.key = {};

			var shortcuts = [];

			// setup the key correctly (mac/linux/windows)
			// aigua.key.Name: CodeMirror will listen for this key - it's the key that triggers slider/color picker
			// aigua.key.DisplayName: we display this string to the user - it's to inform them of what key to use
			if (BrowserDetect.OS == 'Mac') {
				aigua.key.Name = 'Alt-Alt'; 
				aigua.key.DisplayName = 'Alt'; 
				aigua.key.Code = 18;

				{extraKeys['Alt-S']  = aigua.saveAsUserOrAnonymously};
				{extraKeys['Cmd-/']  = lc.codemirrorUtil.comment};
				{extraKeys['Cmd-.']  = lc.codemirrorUtil.uncomment};

				{extraKeys['Cmd-1']  = aigua.switchToHtml};
				{extraKeys['Cmd-2']  = aigua.switchToJavaScript};
				{extraKeys['Cmd-3']  = aigua.switchToCss};
				{extraKeys['Cmd-4']  = aigua.switchToJson};

				{extraKeys["Cmd-'"]  = aigua.switchToPreviousLayout};
				{extraKeys['Cmd-;']  = aigua.switchToNextLayout};

				{extraKeys['Tab']    = aigua.replaceSnippet};

				{extraKeys['Cmd-\\'] = aigua.pauseResumeExecution};

				{extraKeys['Cmd-9'] = aigua.startAnimate};
				{extraKeys['Cmd-0'] = aigua.stopAnimate};

				shortcuts = [
					{
						section: 'general', shortcuts: [
							{ shortcut: 'Alt + S', name: 'save document'       },
							{ shortcut: '⌘ + /',  name: 'comment selection'   },
							{ shortcut: "⌘ + .",  name: 'uncomment selection' },
							{ shortcut: "⌘ + \\",  name: 'pause/resume execution' },
							{ shortcut: "⌘ + 9",  name: 'start animation' },
							{ shortcut: "⌘ + 0",  name: 'stop animation' }
						]
					},
					{
						section: 'modes', shortcuts: [
							{ shortcut: '⌘ + 1', name: 'html'       },
							{ shortcut: '⌘ + 2', name: 'javascript' },
							{ shortcut: '⌘ + 3', name: 'css'        },
							{ shortcut: '⌘ + 4', name: 'json'       }
						]
					},
					{
						section: 'layouts', shortcuts: [
							{ shortcut: "⌘ + '", name: 'next layout'     },
							{ shortcut: '⌘ + ;', name: 'previous layout' }
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

				{extraKeys['Ctrl-S']  = aigua.saveAsUserOrAnonymously};
				{extraKeys['Ctrl-/']  = lc.codemirrorUtil.comment};
				{extraKeys['Ctrl-.']  = lc.codemirrorUtil.uncomment};

				{extraKeys['Ctrl-1']  = aigua.switchToHtml};
				{extraKeys['Ctrl-2']  = aigua.switchToJavaScript};
				{extraKeys['Ctrl-3']  = aigua.switchToCss};
				{extraKeys['Ctrl-4']  = aigua.switchToJson};

				{extraKeys["Ctrl-'"]  = aigua.switchToPreviousLayout};
				{extraKeys['Ctrl-;']  = aigua.switchToNextLayout};

				{extraKeys['Tab']    = aigua.replaceSnippet};

				shortcuts = [
					{
						section: 'general', shortcuts: [
							{ shortcut: 'Ctrl + S', name: 'save document'       },
							{ shortcut: 'Ctrl + /',  name: 'comment selection'   },
							{ shortcut: "Ctrl + .",  name: 'uncomment selection' }
						]
					},
					{
						section: 'modes', shortcuts: [
							{ shortcut: 'Ctrl + 1', name: 'html'       },
							{ shortcut: 'Ctrl + 2', name: 'javascript' },
							{ shortcut: 'Ctrl + 3', name: 'css'        },
							{ shortcut: 'Ctrl + 4', name: 'json'       }
						]
					},
					{
						section: 'layouts', shortcuts: [
							{ shortcut: "Ctrl + '", name: 'next layout'     },
							{ shortcut: 'Ctrl + ;', name: 'previous layout' }
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
			_.each(shortcuts, function(value, index) {

				var h3 = $('<h3></h3>');
				h3.text(value.section);

				var ul = $('<ul class="keys"></ul>');

				_.each(value.shortcuts, function(value) {
					var li = $('<li></li>');
					var span = $('<span></span>');
					span.text(value.shortcut);
					li.append(span);
					li.append(value.name);
					ul.append(li);
				});

				if (index % 2 == 0) {
					$('#popup .keyboard .left').append(h3);
					$('#popup .keyboard .left').append(ul);
				} else {
					$('#popup .keyboard .right').append(h3);
					$('#popup .keyboard .right').append(ul);
				}

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

			// only continue loading when logging in/out has happened
			var continueLoading = function() {

				// try to grab the gist id from the url
				// e.g. the '3072416' bit in http://livecoding.io/3072416
				var gistId = aigua.getUrlGistId();

				// show the 'click a number' message
				$('#message').show();

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
						newNumber = lc.util.modifyNumber(aigua.originalNumber.value, offset);

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

					$('body').find('*').addClass('full');
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

				// is there an id in the url?
				if (gistId) {

					var versionId = aigua.getUrlGistVersionId();

					// yes - load its contents
					aigua.loadGist(gistId, versionId);

				}

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

								case 'save as public gist':
									if (!aigua.user) {
										alert('Please login to save your work under your GitHub username.');
									} else {
										if ($(this).attr('class').indexOf('disabled') != -1) {
											alert('You cannot save a private gist as public.');
										} else {
											aigua.saveAsUser(true);
										}
									}
									aigua.resetMenu();
								break;

								case 'save as private gist':
									if (!aigua.user) {
										alert('Please login to save your work under your GitHub username.');
									} else {
										if ($(this).attr('class').indexOf('disabled') != -1) {
											alert('You cannot save a public gist as private.');
										} else {
											aigua.saveAsUser(false);
										}
									}
									aigua.resetMenu();
								break;

								case 'save as anonymous gist':
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
											window.open('/s' + location.pathname, '_blank');
										}
										aigua.resetMenu();

									break;

									case 'gallery':
										window.open('/gallery' + location.pathname, '_blank');
										aigua.resetMenu();
									break;

									case 'stats':

										$('#stats').toggle();

										if ($('#stats').is(':visible')) {
											choice.addClass('selected');
										} else {
											choice.removeClass('selected');
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

								case 'about / source code':
									window.open('https://github.com/gabrielflorit/livecoding/', '_blank');
									aigua.resetMenu();
								break;

								case 'contact':
									window.open('http://twitter.com/gabrielflorit', '_blank');
									aigua.resetMenu();
								break;

								case 'keyboard shortcuts':
									$('#popup').fadeIn();
									$('#popup .keyboard').fadeIn();
									aigua.resetMenu();
								break;

								case 'google group':
									window.open('http://groups.google.com/group/livecoding_io', '_blank');
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

			}; // end of continueLoading()

			// if token is in localstorage, log in
			if (localStorage['aigua.token']) {
				aigua.logIn(localStorage['aigua.token'], continueLoading);
			} else {
			// we still call log out to make sure all UI-related elements are set correctly
				aigua.logOut();
				continueLoading();
			}

		}
	};

	$('#iframeContainer').append('<iframe src="/iframe" scrolling="yes"></iframe>');

});
