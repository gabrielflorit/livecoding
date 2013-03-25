var modes = (function () {

	var currentModeIndex = 0;
	var currentScreenLayoutIndex = 1;

	var	modes = [
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
	];

	var container;

	function getMode(mode) {
		return _.find(modes, function(v) {
			return v == mode;
		});
	}

	function getCurrentMode() {
		return modes[currentModeIndex];
	}

	function switchMode(mode, noTab) {

		// pause aigua: disable code evals from happening on codemirror changes
		aigua.pause = true;

		// if noTab is true, don't highlight/dehighlight the mode tabs
		if (!noTab) {

			$('h2', container).not(":contains('" + mode + "')").addClass('passive');
			$('h2', container).not(":contains('" + mode + "')").removeClass('active');
			$("h2:contains('" + mode + "')", container).addClass('active');
			$("h2:contains('" + mode + "')", container).removeClass('passive');
		}

		var currentMode = modes[currentModeIndex];

		// save current code to this mode's 'code' property
		// modes[currentModeIndex].code = aigua.codeMirror.getValue();
		currentMode.code = aigua.codeMirror.getValue();

		// save cursor line and position to this mode's 'position' property
		// modes[currentModeIndex].cursor = aigua.codeMirror.getCursor();
		currentMode.cursor = aigua.codeMirror.getCursor();

		// save scroll info to this mode's 'scrollInfo' property
		// modes[currentModeIndex].scrollInfo = aigua.codeMirror.getScrollInfo();
		currentMode.scrollInfo = aigua.codeMirror.getScrollInfo();

		// set current mode index to new mode
		currentModeIndex = _.indexOf(_.pluck(modes, 'name'), mode);
		currentMode = modes[currentModeIndex];

		// populate the code mirror tab with the new mode's code
		// aigua.codeMirror.setValue(modes[currentModeIndex].code || '');
		aigua.codeMirror.setValue(currentMode.code || '');

		// set cursor
		// if (modes[currentModeIndex].cursor) {
		// 	aigua.codeMirror.setCursor(modes[currentModeIndex].cursor);
		// }
		if (currentMode.cursor) {
			aigua.codeMirror.setCursor(currentMode.cursor);
		}

		// scroll to saved position
		// if (modes[currentModeIndex].scrollInfo) {
		// 	aigua.codeMirror.scrollTo(modes[currentModeIndex].scrollInfo.x, modes[currentModeIndex].scrollInfo.y);
		// }
		if (currentMode.scrollInfo) {
			aigua.codeMirror.scrollTo(currentMode.scrollInfo.x, currentMode.scrollInfo.y);
		}

		aigua.codeMirror.focus();

		// change codemirror's language syntax to the new mode
		var codeMirrorOptionMode, codeMirrorLoadMode;

		// if (modes[currentModeIndex].name == 'json') {
		if (currentMode.name == 'json') {
			codeMirrorOptionMode = 'application/json';
			codeMirrorLoadMode = 'javascript';
		// } else if (modes[currentModeIndex].name == 'html') {
		} else if (currentMode.name == 'html') {
			codeMirrorOptionMode = 'text/html';
			codeMirrorLoadMode = 'htmlmixed';
		} else {
			codeMirrorOptionMode = currentMode.name;
			codeMirrorLoadMode = currentMode.name;
			// codeMirrorOptionMode = modes[currentModeIndex].name;
			// codeMirrorLoadMode = modes[currentModeIndex].name;
		}

		// remove all code folding markers
		$('.CodeMirror-gutter-text pre').removeClass('codeFolded');

		aigua.codeMirror.setOption("mode", codeMirrorOptionMode);
		CodeMirror.autoLoadMode(aigua.codeMirror, codeMirrorLoadMode);

		aigua.pause = false;

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

	return {
		init: init,
		getCurrentMode: getCurrentMode,
		getMode: getMode
	};

}());
