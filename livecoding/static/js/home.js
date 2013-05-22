$(function() {

	$('.new-box').click(function() {
		window.open('/!', '_blank');
	});

	populateThumbnailsFromEndpoint('api/gists/0/8', $('.recent ul'), true);

	function magic(x, minP, min, max) {
		return minP + (x - min) * (100-minP)/(max - min);
	}

	$.getJSON('api/users/0/10', function(json) {

		var users = json.users;

		var maxCount = _.first(users).count;
		var minCount = _.last(users).count;

		var html = _.map(users, function(v, i) {

			var avatar = v.avatar || 'https://i2.wp.com/a248.e.akamai.net/assets.github.com/images/gravatars/gravatar-user-420.png';
			var username = v.username;
			var count = v.count;

			var result = ''
			+ '<div class="user-container">'
			+ '  <div class="user" style="width: ' + magic(count, 30, minCount, maxCount) + '%">'
			+ '    <a href="/gists/user/' + username + '" title="' + username + '">' + count + (i == 0 ? ' gists' : '') + '</a>'
			+ '    <a href="/gists/user/' + username + '" title="' + username + '"><img src="' + avatar + '" /></a>'
			+ '  </div>'
			+ '</div>';

			return result;

		}).join('');

		$('.bars').html(html);

	});

});
