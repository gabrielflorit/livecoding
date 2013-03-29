var modes = (function () {

	var	container = $('#modes');

	var	list = [
		{ name: 'html'      , code: null, cursor: null, scrollInfo: null },
		{ name: 'javascript', code: null, cursor: null, scrollInfo: null },
		{ name: 'css'       , code: null, cursor: null, scrollInfo: null },
		{ name: 'json'      , code: null, cursor: null, scrollInfo: null }
	];

	function clearAll() {

		// clear javascript first
		switchTo('javascript', true);
		aigua.codeMirror.setValue('');

		switchTo('html', true);
		aigua.codeMirror.setValue('');

		switchTo('css', true);
		aigua.codeMirror.setValue('');

		switchTo('json', true);
		aigua.codeMirror.setValue('');

	}

	function get(name) {
		return _.findWhere(list, {name: name});
	}

	function getCurrent() {
		return get($('h2[class*="active"]', container).text());
	}

	// TODO: maybe noTab is not needed after all?
	function switchTo(name, noTab) {

		if (!name) {
			name = list[0].name;
		}

		// TODO: no need to do most of this if we're switching to this same mode
		// on the other hand, how often will that scenario happen?

		// pause aigua: disable code evals from happening on codemirror changes
		aigua.pause = true;

		var currentMode = getCurrent();

		// save current code
		currentMode.code = aigua.codeMirror.getValue();

		// save cursor line and position
		currentMode.cursor = aigua.codeMirror.getCursor();

		// save scroll info
		currentMode.scrollInfo = aigua.codeMirror.getScrollInfo();

		// if noTab is true, don't highlight/dehighlight the mode tabs
		// TODO: this is a problem. when noTab is true,
		// the following bit doesn't execute, which means the h2 doesn't get set yet,
		// which means when we try to get current mode, it will still be the old one
		// if (!noTab) {

		$('h2', container).not(":contains('" + name + "')").addClass('passive').removeClass('active');
		$("h2:contains('" + name + "')", container).addClass('active').removeClass('passive');
		// }

		currentMode = getCurrent();

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

		_.each(list, function(v) {

			// get the mode's name
			var name = v.name;

			// is this the current mode?
			if (getCurrent().name == name) {

				// save the mode's contents directly from codemirror
				payload[name] = aigua.codeMirror.getValue();

			} else {

				// since we're not on the current mode, the contents
				// will be saved on the mode object
				payload[name] = _.findWhere(list, {name: name}).code;
			}

		});

	}

	function init() {

		// populate mode switcher
		_.each(list, function(mode, i) {

			var div = $("<div class='item'></div>");
			var h2 = $("<h2></h2>");
			div.append(h2);

			h2.addClass(i == 0 ? 'active' : 'passive');
			h2.text(mode.name);

			container.append(div);
		});

		// handle modes switcher
		$('.item h2', container).on('click', function(e) {
			switchTo($(this).text());
		});

	}

	return {
		init: init,
		getCurrent: getCurrent,
		get: get,
		storeIn: storeIn,
		switchTo: switchTo,
		clearAll: clearAll,
		switchToCss:        function() { switchTo('css');        },
		switchToHtml:       function() { switchTo('html');       },
		switchToJavaScript: function() { switchTo('javascript'); },
		switchToJson:       function() { switchTo('json');       }
	}

}());
