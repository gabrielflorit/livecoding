$(function() {

	$('.thumbnails.new li').click(function() {
		location.href = '/!';
	});

	// are we logged in?
	if (localStorage['aigua.token']) {

		// get token
		$.getJSON('/user/' + localStorage['aigua.token'], function(user) {
			populateThumbnailsFromEndpoint('/gists_for_user', {user: user.login}, $('.thumbnails.user ul'), true);
			populateThumbnailsFromEndpoint('/all_gists_except_user', {user: user.login}, $('.thumbnails.community ul'), false);
		});

	} else {

		populateThumbnailsFromEndpoint('/all_gists', null, $('.thumbnails.community ul'), false);

	}

});
