$(function() {

	var allGists = [];

	var populateGists = function(endpoint, node) {

		// get gists
		$.getJSON(endpoint, function(gists) {

			// iterate over gists
			for (var i = 0; i < gists.length; i++) {

				var gist = gists[i];

				allGists.push(gist);

				var gistId = gist.gists._id;
				var time = new Date(gist.gists.modified).getTime();

				// get gist image
				$.getJSON('http://guarded-castle-8005.herokuapp.com/' + gistId + '/' + time + '?callback=?', function(json) {

					var match = _.find(allGists, function(v) { return v.gists._id == json.gist; });
					var views = match.gists.views;
					var username = match.username ? match.username : 'anonymous';

					var html = '';
					html += '<li data="' + views + '"">';
					html += '  <a href="/' + json.gist + '">';
					html += '    <img class="thumbnail" src="' + json.url + '" />';
					html += '  </a>';
					html += '  <div class="info">';
					html += '    <p class="left"><span class="username">' + username + '</span></p>';
					html += '    <p class="right"><span class="eye">' + views + '</span><img class="eye" src="/static/img/eye.png" /></p>';
					html += '  </div>';
					html += '</li>';
					node.append(html);

					// order thumbnails by view, descending
					// this is done on every thumbnail insertion
					// surely there must be a better way!
					var li = node.children('li');
					li.detach().sort(function(a, b) {
						return Number($(a).attr('data')) < Number($(b).attr('data'));
					});
					node.append(li);

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
