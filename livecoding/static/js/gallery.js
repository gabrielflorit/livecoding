$(function() {

	var allGists = [];

	var populateGists = function(endpoint, node) {

		// get gists
		$.getJSON(endpoint, function(gists) {

			// iterate over gists
			for (var i = 0; i < gists.length; i++) {

				var gist = gists[i].gists;

				allGists.push(gist);

				var gistId = gist._id;
				var time = new Date(gist.modified).getTime();

				// get gist image
				$.getJSON('http://guarded-castle-8005.herokuapp.com/' + gistId + '/' + time + '?callback=?', function(json) {

					var views = _.find(allGists, function(v) { return v._id == json.gist; }).views;

					var html = '';
					html += '<li>';
					html += '  <a href="http://livecoding.io/' + json.gist + '">';
					html += '    <img src="' + json.url + '" />';
					html += '  </a>';
					html += '  <p class="info">views: ' + views + '</p>';
					html += '</li>';
					node.append(html);

				});

			}

		});

	};

	$('.thumbnails.new li').click(function() {
		location.href = '/!';
	});

	// are we logged in?
	if (localStorage['aigua.token']) {

		// get token
		$.getJSON('/user/' + localStorage['aigua.token'], function(user) {
			populateGists('/gists/' + user.login, $('.thumbnails.user ul'));
			populateGists('/gists_except/' + user.login, $('.thumbnails.community ul'));
		});

	} else {

		populateGists('/gists', $('.thumbnails.community ul'));

	}

});
