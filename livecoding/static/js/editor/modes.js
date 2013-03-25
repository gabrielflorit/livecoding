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

	function switchMode(mode) {
		debugger;

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
		init: init
	};

}());


