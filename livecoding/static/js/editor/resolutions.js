var resolutions = (function () {

	var container;

	function init() {

		container = $('#menu .item h2:contains("resolution")').next();
	}

	function getCurrent() {

		return $('li[class*="disabled"]', container).text();

	}

	function getDefault() {

		return $('li:first', container).text();

	}

	function switchTo(resolution) {

		$('li', container)
			.removeClass('disabled')
			.filter(function() {
				return $(this).text() == resolution;
			}).addClass('disabled');

		// reset
		var iframe = $('iframe');

		if (resolution == 'reset') {

			iframe
				.css('width', '')
				.css('height', '')
				.css('border', '');

		}
		// set width and height
		else {

			width = resolution.split('x')[0].replace(' ', '');
			height = resolution.split('x')[1].replace(' ', '');

			iframe
				.css('width', width)
				.css('height', height)
				.css('border', 'solid gray 1px');

			// take into account the scrollbar width
			while($('html', iframe.contents()).width() != width) {
				iframe.css('width', iframe.width() + 1);
			}
		}

		aigua.renderCode();
		aigua.resetMenu();

	}

	return {

		init: init,
		getCurrent: getCurrent,
		getDefault: getDefault,
		switchTo: switchTo

	}

}());
