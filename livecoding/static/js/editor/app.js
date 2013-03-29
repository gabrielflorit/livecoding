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