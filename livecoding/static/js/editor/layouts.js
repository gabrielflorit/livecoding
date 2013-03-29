var layouts = (function () {

	var container = $('#menu .item h2:contains("view")').next();

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
			li.addClass(i == 1 ? 'disabled' : '');

			container.prepend(li);
		});

		$('body').find('*').addClass('full');

	}

	function getCurrent() {

		return $('li[class*="disabled"]', container).text();

	}

	function switchTo(layout) {

		if (!layout) {
			layout = getCurrent();
		}

		var layoutItems = $('.screenLayout');
		layoutItems.siblings('.screenLayout').removeClass('disabled');
		$('.screenLayout:contains("' + layout + '")').addClass('disabled');

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
				modes.switchTo('css', true);
				// switch back
				modes.switchTo('html', true);
			break;

			case 'javascript':
				aigua.renderCode();
				// switch modes to css, without tabbing
				modes.switchTo('css', true);
				// switch back
				modes.switchTo('javascript', true);
			break;

			case 'css':
				// switch modes to javascript, without tabbing
				modes.switchTo('javascript', true);
				// render code
				aigua.renderCode();
				// switch back
				modes.switchTo('css', true);
			break;

			case 'json':
				aigua.renderCode();
				// switch modes to javascript, without tabbing
				modes.switchTo('javascript', true);
				// switch back
				modes.switchTo('json', true);
			break;
		}

	}

	function next() {

		var index = _.indexOf(list, getCurrent());

		if (index == list.length - 1) {
			layouts.switchTo(_.first(list));
		} else {
			layouts.switchTo(list[index + 1]);
		}

	}

	function previous() {

		var index = _.indexOf(list, getCurrent());

		if (index == 0) {
			layouts.switchTo(_.last(list));
		} else {
			layouts.switchTo(list[index - 1]);
		}

	}

	return {
		init: init,
		getCurrent: getCurrent,
		switchTo: switchTo,
		next: next,
		previous: previous
	};

}());
