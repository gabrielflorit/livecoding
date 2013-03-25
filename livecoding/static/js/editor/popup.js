var popup = (function () {

	var $popup = $('#popup');

	$('.close', $popup).click(function(e) {
		e.preventDefault();
		hide();
	});

	function hide(duration) {

		// TODO: why fade out containerItem?
		$('.containerItem', $popup).fadeOut(duration || 'normal');
		$popup.fadeOut(duration || 'normal');

	}

	function loading() {
		$('.loading', $popup).fadeIn();
		$popup.fadeIn();
	}

	function keyboard() {
		$('.keyboard', $popup).fadeIn();
		$popup.fadeIn();
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

			if (index % 2 == 0) {
				$('.keyboard .left', $popup).append(h3);
				$('.keyboard .left', $popup).append(ul);
			} else {
				$('.keyboard .right', $popup).append(h3);
				$('.keyboard .right', $popup).append(ul);
			}

		});
	}

	return {
		init: init,
		keyboard: keyboard,
		loading: loading,
		hide: hide
	}

}());

