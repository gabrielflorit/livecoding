var popup = (function () {

	var container = $('#popup');

	$('.close', container).click(function(e) {
		e.preventDefault();
		hide();
	});

	function hide(duration) {

		// TODO: why fade out containerItem?
		$('.containerItem', container).fadeOut(duration || 'normal');
		container.fadeOut(duration || 'normal');
		$('.loading', container).hide();
		$('.keyboard', container).hide();

	}

	function loading() {
		$('.loading', container).fadeIn();
		container.fadeIn();
	}

	function keyboard() {
		$('.keyboard', container).fadeIn();
		container.fadeIn();
	}

	function init(shortcuts) {

		// add keyboard shortcuts to popup
		_.each(shortcuts, function(value, index) {

			var h3 = $('<h3></h3>');
			h3.text(value.section);

			var ul = $('<ul class="keys"></ul>');

			_.each(value.shortcuts, function(value) {
				var li = $('<li></li>');
				var span = $('<span></span>');
				span.text(value.shortcut);
				li.append(span);
				li.append(value.name);
				ul.append(li);
			});

			if (index % 2 === 0) {
				$('.keyboard .left', container).append(h3);
				$('.keyboard .left', container).append(ul);
			} else {
				$('.keyboard .right', container).append(h3);
				$('.keyboard .right', container).append(ul);
			}

		});
	}

	return {
		init: init,
		keyboard: keyboard,
		loading: loading,
		hide: hide
	};

}());

