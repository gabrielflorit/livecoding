$(function() {

	$('.new-box').click(function() {
		window.open('/!', '_blank');
	});

	populateThumbnailsFromEndpoint('api/gists/0/8', $('.recent ul'), false);

});
