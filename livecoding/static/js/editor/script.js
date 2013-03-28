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
				aigua.resetEditor();
				aigua.resetUrl();
				aigua.resetMenu();

				if (aigua.user && aigua.currentGistUserId == aigua.user.id) {
					$('#menu li:contains("save as public gist"), #menu li:contains("save as private gist")').removeClass('disabled');
				}
			}
		},

		// create payload with all sorts of data to be sent to server
		// this object will contain all code data, plus editor options, libraries, etc
		// github.js ?
		createPostDataObject: function() {

			var result = {};
			modes.storeIn(result);

			var options = {

				libraries: libraries.getSelected(),

				// add current mode (e.g. html)
				mode: modes.getCurrentMode().name,

				// add current mode (e.g. sketchpad mode)
				layout: layouts.getCurrent()
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

		getOriginalNumber: function() {
			return aigua.originalNumber;
		},

		// get gist data from server
		// github.js ?
		loadGist: function(gistId, versionId) {

			popup.loading();

			aigua.isLoading = true;

			aigua.resetEditor();
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
						options.mode = modes.getDefaultMode().name;
					}

					if (!options.layout) {
						options.layout = layouts.getDefault();
					}

					if (!options.resolution || options.resolution.indexOf('(') != -1) {
						options.resolution = $('li:first', $('#menu .item h2:contains("resolution")').next());
					} else {
						options.resolution = $('li:contains("' + options.resolution + '")', $('#menu .item h2:contains("resolution")').next());
					}

					// switch to gist layout
					layouts.switchTo(options.layout);

					// switch to gist resolution
					aigua.switchResolution(options.resolution);

					// add gist libraries
					libraries.addMany(options.libraries);

					modes.switchMode('json', true);
					if (json) {
						aigua.codeMirror.setValue(json.content);
					}

					modes.switchMode('css', true);
					if (css) {
						aigua.codeMirror.setValue(css.content);
					}

					modes.switchMode('html', true);
					if (html) {
						aigua.codeMirror.setValue(html.content);
					}

					modes.switchMode('javascript');
					if (javascript) {
						aigua.codeMirror.setValue(javascript.content);
						aigua.codeMirror.setValue(javascript.content); // don't know why i have to do this twice
					}

					// switch to the default mode
					modes.switchMode(options.mode);

					aigua.setUrl(gistId, versionId);

					aigua.isLoading = false;

					if (aigua.user && aigua.currentGistUserId == aigua.user.id) {
						// disable 'save as public gist' or 'save as private gist', depending
						// on whether this is a private or public gist
						$('#menu li:contains("save as ' + (/^\d+$/g.test(gistId) ? 'public' : 'private') + ' gist")').removeClass('disabled');
						$('#menu li:contains("save as ' + (/^\d+$/g.test(gistId) ? 'private' : 'public') + ' gist")').addClass('disabled');
					}

					popup.hide(10);
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
				var currentMode = modes.getCurrentMode();

				switch (currentMode.name) {

					case 'html':

						// replace html
						$('body #livecoding-main', $('iframe').contents()).html(code);

						// run the javascript code
						frames[0].livecoding.renderCode(modes.getMode('javascript').code || '');
		
					break;

					case 'javascript':

						// replace html
						$('body #livecoding-main', $('iframe').contents()).html(modes.getMode('html').code || '');

						// run the javascript code
						frames[0].livecoding.renderCode(code);

					break;

					case 'css':

						// set css
						$('#style', $('iframe').contents()).get(0).textContent = code;

						// replace html
						$('body #livecoding-main', $('iframe').contents()).html(modes.getMode('html').code || '');

						// run the javascript code
						frames[0].livecoding.renderCode(modes.getMode('javascript').code || '');

					break;

					case 'json':

						if (code.length > 0) {
		
							try {
			
								// update the global json object
								frames[0].livecoding.json = JSON.parse(code);

								// replace html
								$('body #livecoding-main', $('iframe').contents()).html(modes.getMode('html').code || '');

								// run the javascript code
								frames[0].livecoding.renderCode(modes.getMode('javascript').code || '');
			
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

		// reset bar position and width:
		// center bar over the token
		// set bar width to default starting width
		// menu.js ?
		resetMenu: function() {

			var menu = $('#menu');
			$('ul', menu).hide(); // hide all the dropdowns
			$('h2', menu).removeClass('hover'); // remove hover class from all the h2's
		},

		// editor.js ?
		resetEditor: function() {

			// clear out all the modes (html, css, etc)
			modes.clearAll();

			// remove all js libraries
			libraries.removeAll();

			modes.switchMode('html');
		},

		// editor.js ?
		resetUrl: function() {
			History.pushState(null, null, '/!');
			$('#gist').attr('href', '');
			$('#gist').html('');
		},

		// editor.js ?
		respondToSliderKey: function(cm) {

			var cursor;
			var token;
			var hex = '';

			// is the slider and mini colors hidden?
			if (!slider.isVisible()) {

				// grab the current token
				cursor = cm.getCursor();
				token = cm.getTokenAt(cursor);

				// handle numbers
				if (token.className == 'number' || token.className == 'cm-number') {
					aigua.showSlider(cm, cursor, token);
				}

				// handle colors
				if (token.string.length > 1) {

					switch (modes.getCurrentMode().name) {

						case 'javascript':
							hex = token.string.substring(1, token.string.length - 1);
							aigua.currentSelectionStart = {line: cursor.line, ch: token.start + 1};
							aigua.currentSelectionEnd   = {line: cursor.line, ch: token.end - 1};
						break;

						case 'css':
							hex = token.string;
							aigua.currentSelectionStart = {line: cursor.line, ch: token.start};
							aigua.currentSelectionEnd   = {line: cursor.line, ch: token.end};
						break;
					}

					// is this not a hex?
					if (!hex.isHex()) {
						return;
					}

					aigua.showColorSelector(cm, hex, aigua.currentSelectionStart, aigua.currentSelectionEnd);
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
			if (!lc.getUrlGistId(location.href)) {
				saveUrl = '/create-new?public=' + publicGist;
			} else {

				postData['id'] = lc.getUrlGistId(location.href);

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

			History.pushState(null, null, gistAndVersionIds);

			var gistBaseUrl = 'https://gist.github.com';
			gistUrl = gistBaseUrl + gistAndVersionIds;

			$('#gist').attr('href', gistUrl);
			$('#gist').html(gistUrl);
		},

		showColorSelector: function(cm, hex, start, end) {

			var coords = lc.getTokenCoords(cm, start, end);

			// position and show the color picker
			slider.showMiniColors(coords, hex.substring(1));

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

			var coords = lc.getTokenCoords(cm, aigua.currentSelectionStart, aigua.currentSelectionEnd);

			// show slider at given coords
			slider.showSlider(coords);
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

		areYouSureText: 'Are you sure? You will lose any unsaved changes.',
		areYouSureSinglePageText: 'Are you sure? Your unsaved changes will not be reflected when viewing as a single page.',
		currentGistUserId: null,
		currentSelectionEnd: null,
		currentSelectionStart: null,
		iframeLoaded: null,
		isLoading: null,
		originalNumber: null,
		pause: false,
		pauseExecution: false,
		pleaseLoginText: 'Please login to save your work under your GitHub username.',
		user: null

	}
}());

$(function() {

	$('body').find('*').addClass('full');

	// do a slow fade in
	$('#main').fadeIn(1000);

	aigua.iframeLoaded = function() {

		// ----------- initialization section ----------------------

		var sliderKey = lc.getSliderKey(BrowserDetect.OS);
		var extraKeys = lc.getExtraKeys(BrowserDetect.OS);

		// this object will be used by codemirror to respond to the slider key
		{extraKeys[sliderKey.Name] = aigua.respondToSliderKey};

		var shortcuts = lc.getShortcuts(BrowserDetect.OS);

		// add snippets to the shortcuts object
		_.chain(lc.snippets)
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

		popup.init(shortcuts);

		// display the key DisplayName to the user - 'Alt', or 'Ctrl', etc
		$('#message .key').text(sliderKey.DisplayName);
		
		// create codemirror instance
		aigua.codeMirror = lc.codeMirrorInit($('#code'), extraKeys);

		// only continue loading when logging in/out has happened
		var continueLoading = function() {

			// try to grab the gist id from the url
			// e.g. the '3072416' bit in http://livecoding.io/3072416
			var gistId = lc.getUrlGistId(location.href);

			// show the 'click a number' message
			$('#message').show();

			// initialize slider
			slider.init(aigua.codeMirror);

			// populate mode switcher
			modes.init();

			// populate screen layout switcher
			layouts.init();

			// populate libraries dropdown
			libraries.init();

			// is there an id in the url?
			if (gistId) {

				var versionId = lc.getUrlGistVersionId(location.href);

				// yes - load its contents
				aigua.loadGist(gistId, versionId);

			}

			// ----------- event handlers section ----------------------

			// if we mouseup, and the slider is showing, AND nothing is selected,
			// select the previously selected token
			$(window).mouseup(function(e) {

				if (slider.isVisible() && aigua.codeMirror.getSelection() == '') {
					aigua.codeMirror.setSelection(aigua.currentSelectionStart, aigua.currentSelectionEnd);
				}
			});

			// if 'esc', hide popup
			$(window).keydown(function(e) {

				if (e.which == 27) {
					popup.hide();
				}

			});

			// did we keyup the handle key?
			$(window).keyup(function(e) {

				if (e.which == sliderKey.Code) {

					// if slider is visible
					if (slider.isVisible()) {

						slider.reset();
		
						// clear out the original number
						aigua.originalNumber = null;
					}

				}
			});

			// force svg contents to occupy the entire svg container
			// by rerendering code on window resize
			$(window).on('resize', function() {
				aigua.renderCode();
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
									alert(aigua.pleaseLoginText);
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
									alert(aigua.pleaseLoginText);
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

							layouts.switchTo(choice.text());

						}
						else {

							switch (choice.text()) {

								case 'single page':

									result = aigua.isDirty() ? confirm(aigua.areYouSureSinglePageText) : true;
									if (result) {
										window.open('/s' + location.pathname, '_blank');
									}
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

						libraries.toggle(choice.text());
						aigua.setToDirty();
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
								popup.keyboard();
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

		}; // end of continueLoading()

		// if token is in localstorage, log in
		if (localStorage['aigua.token']) {
			aigua.logIn(localStorage['aigua.token'], continueLoading);
		} else {
		// we still call log out to make sure all UI-related elements are set correctly
			aigua.logOut();
			continueLoading();
		}
	};

	$('#iframeContainer').append('<iframe src="/iframe" scrolling="yes"></iframe>');

});
