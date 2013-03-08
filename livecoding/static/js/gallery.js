$(function() {

	$('.thumbnails.new li').click(function() {
		location.href = '/!';
	});

	// are we logged in?
	if (localStorage['aigua.token']) {

		// get token
		$.getJSON('/user/' + localStorage['aigua.token'], function(user) {
			populateThumbnails('/gists/' + user.login, $('.thumbnails.user ul'));
			populateThumbnails('/gists_except/' + user.login, $('.thumbnails.community ul'));
		});

	} else {

		populateThumbnails('/gists', $('.thumbnails.community ul'));

	}

});
