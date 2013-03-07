$(function() {

	var populateGists = function(endpoint, node) {

		// get gists
		$.getJSON(endpoint, function(gists) {

			// iterate over gists
			_.each(gists, function(v) {

				var time = new Date(v.modified).getTime();

				// get gist image
				$.getJSON('http://guarded-castle-8005.herokuapp.com/' + v._id + '/' + time + '?callback=?', function(json) {

					var html = '';
					html += '<li>';
					html += '  <a href="http://livecoding.io/' + json.gist + '">';
					html += '    <img src="' + json.url + '" />';
					html += '  </a>';
					html += '</li>';
					node.append(html);

				});

			});

		});

	};

	$('.thumbnails.new li').click(function() {
		location.href = 'http://livecoding.io';
	});

	// are we logged in?
	if (localStorage['aigua.token']) {

		// get token
		$.getJSON('/user/' + localStorage['aigua.token'], function(user) {
			populateGists('/gists/' + user.login, $('.thumbnails.user ul'));
		});

	}

	populateGists('/gists', $('.thumbnails.community ul'));

});
