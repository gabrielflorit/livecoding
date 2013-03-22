$(function() {

	// possible paths (for the time being);
	// /gists
	// /gists/user/gabrielflorit

	var isUser = location.pathname.indexOf('/gists/user/') != -1;

	if (isUser) {
		var user = _.last(location.pathname.split('/'));
		$('.thumbnails-wrapper .title').html('<span>sketches by: <a target="_blank" href="http://github.com/' + user + '">' + user + '</a></span> <span class="total"></span>');
	}

	var _start = 0;
	var _count = 20; 

	var afterGistsPopulate = function(data) {

		if (data.total) {
			var thumbnailsCount = $('.thumbnails-wrapper .thumbnails li').length;
			var count = '(' + thumbnailsCount + ' of ' + data.total + ')';
			$('.thumbnails-wrapper .title .total').text(count);

			if (thumbnailsCount >= data.total) {
				$('.more a').hide();
			}
		}

		scrollToBottom();
	};

	var scrollToBottom = function() {
		$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	};

	var getGists = function(start, count, callback) {
		var path = '/api' + location.pathname + '/' + start + '/' + count;
		populateThumbnailsFromEndpoint(path, $('ul.thumbnails'), isUser, callback);
	};
	getGists(_start, _count, afterGistsPopulate);

	$('.more a').click(function(e) {
		e.preventDefault();

		_start += _count;
		getGists(_start, _count, afterGistsPopulate);
	});

});
