var modes = (function () {

	var currentModeIndex = 0;

	var	modes = [
		{ name: 'html'      , code: null, cursor: null, scrollInfo: null },
		{ name: 'javascript', code: null, cursor: null, scrollInfo: null },
		{ name: 'css'       , code: null, cursor: null, scrollInfo: null },
		{ name: 'json'      , code: null, cursor: null, scrollInfo: null }
	];

	var container;

	function getMode(mode) {
		return _.findWhere(modes, {name: mode});
	}

	function getCurrentMode() {
		return modes[currentModeIndex];
	}

	function switchMode(mode, noTab) {

		// pause aigua: disable code evals from happening on codemirror changes
		aigua.pause = true;

		// if noTab is true, don't highlight/dehighlight the mode tabs
		if (!noTab) {

			$('h2', container).not(":contains('" + mode + "')").addClass('passive').removeClass('active');
			$("h2:contains('" + mode + "')", container).addClass('active').removeClass('passive');
		}

		var currentMode = getCurrentMode();

		// save current code
		currentMode.code = aigua.codeMirror.getValue();

		// save cursor line and position
		currentMode.cursor = aigua.codeMirror.getCursor();

		// save scroll info
		currentMode.scrollInfo = aigua.codeMirror.getScrollInfo();

		// set current mode index to new mode
		currentModeIndex = _.indexOf(_.pluck(modes, 'name'), mode);

		currentMode = getCurrentMode();

		// populate the code mirror tab with the new mode's code
		aigua.codeMirror.setValue(currentMode.code || '');

		// set cursor
		if (currentMode.cursor) {
			aigua.codeMirror.setCursor(currentMode.cursor);
		}

		// scroll to saved position
		if (currentMode.scrollInfo) {
			aigua.codeMirror.scrollTo(currentMode.scrollInfo.x, currentMode.scrollInfo.y);
		}

		aigua.codeMirror.focus();

		// change codemirror's language syntax to the new mode
		var codeMirrorOptionMode, codeMirrorLoadMode;

		if (currentMode.name == 'json') {
			codeMirrorOptionMode = 'application/json';
			codeMirrorLoadMode = 'javascript';
		} else if (currentMode.name == 'html') {
			codeMirrorOptionMode = 'text/html';
			codeMirrorLoadMode = 'htmlmixed';
		} else {
			codeMirrorOptionMode = currentMode.name;
			codeMirrorLoadMode = currentMode.name;
		}

		// remove all code folding markers
		$('.CodeMirror-gutter-text pre').removeClass('codeFolded');

		aigua.codeMirror.setOption("mode", codeMirrorOptionMode);
		CodeMirror.autoLoadMode(aigua.codeMirror, codeMirrorLoadMode);

		// resume code execution
		aigua.pause = false;

	}

	function storeIn(payload) {

		_.each(modes, function(v) {

			// get the mode's name
			var name = v.name;

			// is this the current mode?
			if (getCurrentMode().name == name) {

				// save the mode's contents directly from codemirror
				payload[name] = aigua.codeMirror.getValue();

			} else {

				// since we're not on the current mode, the contents
				// will be saved on the mode object
				payload[name] = _.findWhere(modes, {name: name}).code;
			}

		});

	}

	function init() {

		container = $('#modes');

		// populate mode switcher
		_.each(modes, function(mode, index) {

			var div = $("<div class='item'></div>");
			var h2 = $("<h2></h2>");
			div.append(h2);

			h2.addClass(index == currentModeIndex ? 'active' : 'passive');
			h2.text(mode.name);

			container.append(div);
		});

		container.find('*').addClass('full');

		// handle modes switcher
		$('.item h2', container).on('click', function(e) {
			switchMode($(this).text());
		});

	}

	function clearAll() {

		_.each(aigua.modes, function(value) {
			switchMode(value.name, true);
			aigua.codeMirror.setValue('');
		});

	}

	return {
		init: init,
		getCurrentMode: getCurrentMode,
		getMode: getMode,
		storeIn: storeIn,
		switchMode: switchMode,
		clearAll: clearAll
	};

}());
