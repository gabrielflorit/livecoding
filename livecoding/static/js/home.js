$(function() {

	$('.new-box').click(function() {
		window.open('/!', '_blank');
	});

	populateThumbnailsFromEndpoint('/all_gists', { limit: 8 }, $('.popular ul'), false);

});
