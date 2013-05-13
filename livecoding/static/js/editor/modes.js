var modes = (function () {

	var	container = $('#modes');

	var defaultIndex = 1;

	var	list = [
		{ name: 'html'      , doc: null, mime: 'text/html' },
		{ name: 'javascript', doc: null, mime: 'text/javascript' },
		{ name: 'css'       , doc: null, mime: 'text/css' },
		{ name: 'json'      , doc: null, mime: 'application/json' }
	];

	function clearAll() {

		// clear javascript first
		switchTo('javascript');
		aigua.codeMirror.setValue('');

		switchTo('html');
		aigua.codeMirror.setValue('');

		switchTo('css');
		aigua.codeMirror.setValue('');

		switchTo('json');
		aigua.codeMirror.setValue('');

	}

	function get(name) {
		return _.findWhere(list, {name: name});
	}

	function getCurrent() {
		return get($('h2[class*="active"]', container).text());
	}

	// TODO: get rid of noTab references
	function switchTo(name) {

		if (!name) {
			name = list[defaultIndex].name;
		}

		// no need to do most of this if we're switching to this same mode
		var currentMode = getCurrent();
		if (name != currentMode.name) {

			// pause aigua: disable code evals from happening on codemirror changes
			aigua.pause = true;

			// what mode are we switching to?
			var nextMode = get(name);

			// get the mode's doc, or create a new one if null
			var nextModeDoc = nextMode.doc || CodeMirror.Doc('', nextMode.mime);

			// swap docs
			currentMode.doc = aigua.codeMirror.swapDoc(nextModeDoc);

			// select the correct mode tab
			$('h2', container).not(":contains('" + name + "')").addClass('passive').removeClass('active');
			$("h2:contains('" + name + "')", container).addClass('active').removeClass('passive');

			// resume code execution
			aigua.pause = false;

		}

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
				var modeDoc = _.findWhere(list, {name: name}).doc;
				payload[name] = modeDoc ? modeDoc.getValue() : '';
			}

		});

	}

	function init() {

		// populate mode switcher
		_.each(list, function(mode, i) {

			var div = $("<div class='item'></div>");
			var h2 = $("<h2></h2>");
			div.append(h2);

			h2.addClass(i == 1 ? 'active' : 'passive');
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
		clearAll: clearAll
	}

}());
