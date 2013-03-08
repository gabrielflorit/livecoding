$(function() {

	$('.thumbnails.new li').click(function() {
		location.href = '/!';
	});

	// are we logged in?
	if (localStorage['aigua.token']) {

		// get token
		$.getJSON('/user/' + localStorage['aigua.token'], function(user) {
			populateThumbnails('/gists_for_user', {user: user.login}, $('.thumbnails.user ul'));
			populateThumbnails('/all_gists_except_user', {user: user.login}, $('.thumbnails.community ul'));
		});

	} else {

		populateThumbnails('/all_gists', null, $('.thumbnails.community ul'));

	}

});
