var resolutions = (function () {

	var	container = $('#menu .item h2:contains("resolution")').next();

	var list = [
		'320 x 480',
		'480 x 320',
		'768 x 1024',
		'1024 x 768'
	];

	function init() {

		// populate dropdown
		_.each(list, function(v, i) {

			var li = $('<li />');

			if (i == 0) {
				li.addClass('disabled');
			}

			li.attr('rel', v.replace(' ', ''));
			li.text(v);

			container.append(li);

		});

	}

	function getCurrent() {

		return $('li[class*="disabled"]', container).text();

	}

	function switchTo(resolution) {

		if (!resolution) {
			resolution = $('li:first', container).text();
		}

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
		switchTo: switchTo

	}

}());
