var layouts = (function () {

	var container = $('#menu .item h2:contains("view")').next();
	var	currentLayoutIndex = 1;

	var list = [
		'fullscreen mode (horizontal)',
		'fullscreen mode (vertical)',
		'sketchpad mode'
	];

	function init() {

		// populate screen layout switcher
		_.each(list, function(v, i) {

			var li = $('<li />');
			li.text(v);
			li.addClass('screenLayout');
			li.addClass(i == currentLayoutIndex ? 'disabled' : '');

			container.prepend(li);
		});

		$('body').find('*').addClass('full');

	}

	function getCurrent() {
		return list[currentLayoutIndex];
	}

	function getDefault() {
		return list[1];
	}

	function switchTo(layout) {

		var layoutItems = $('.screenLayout');
		layoutItems.siblings('.screenLayout').removeClass('disabled');
		$('.screenLayout:contains("' + layout + '")').addClass('disabled');

		currentLayoutIndex = _.indexOf(list, layout);
		updateLayout();

		aigua.resetMenu(); // TODO: is this really necessary here? maybe we should have a menu event listener
		// that fires resetMenu() whenever we interact with it?

	}

	function updateLayout() {

		var layout = getCurrent();

		if (layout == 'sketchpad mode') {
			$('body').find('*').removeClass('full horizontal');
		} else {
			$('body').find('*').addClass('full');

			if (layout == 'fullscreen mode (horizontal)') {
				$('body').find('*').addClass('horizontal');
			}
			else {
				$('body').find('*').removeClass('horizontal');
			}
		}

		// render the javascript code
		// but we can't simply call aigua.renderCode(), because
		// if we're on css mode, it doesn't actually render code
		// so... options: we either (1) force it by passing an extra param to aigua.renderCode()
		// or (2) we do it right here
		// or (3) we create a global variable, like aigua.pause,
		// and turn it on, run renderCode(), then turn it off

		// we'll choose (2) - do it right here

		switch(modes.getCurrent().name) {

			case 'html':
				aigua.renderCode();
				// switch modes to css, without tabbing
				modes.switchMode('css', true);
				// switch back
				modes.switchMode('html', true);
			break;

			case 'javascript':
				aigua.renderCode();
				// switch modes to css, without tabbing
				modes.switchMode('css', true);
				// switch back
				modes.switchMode('javascript', true);
			break;

			case 'css':
				// switch modes to javascript, without tabbing
				modes.switchMode('javascript', true);
				// render code
				aigua.renderCode();
				// switch back
				modes.switchMode('css', true);
			break;

			case 'json':
				aigua.renderCode();
				// switch modes to javascript, without tabbing
				modes.switchMode('javascript', true);
				// switch back
				modes.switchMode('json', true);
			break;
		}

	}

	function next() {

		if (currentLayoutIndex == list.length - 1) {
			layouts.switchTo(_.first(list));
		} else {
			layouts.switchTo(list[currentLayoutIndex + 1]);
		}

	}

	function previous() {

		if (currentLayoutIndex == 0) {
			layouts.switchTo(_.last(list));
		} else {
			layouts.switchTo(list[currentLayoutIndex - 1]);
		}

	}

	return {
		init: init,
		getCurrent: getCurrent,
		getDefault: getDefault,
		switchTo: switchTo,
		next: next,
		previous: previous
	};

}());
