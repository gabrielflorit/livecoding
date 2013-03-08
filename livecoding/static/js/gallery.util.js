var orderThumbnails = function(node) {

	var li = node.children('li');
	li.detach().sort(function(a, b) {

	    // convert to integers from strings
	    a = parseInt($(a).attr("data"), 10);
	    b = parseInt($(b).attr("data"), 10);

	    // compare
	    if(a > b) {
	        return -1;
	    } else if(a < b) {
	        return 1;
	    } else {
	        return 0;
	    }

	});
	node.append(li);

};

var populateThumbnails = function(gists, node) {

	var allGists = [];

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
			html += '<li data="' + views + '">';
			html += '  <a href="/' + json.gist + '">';
			html += '    <img class="thumbnail" src="' + json.url + '" />';
			html += '  </a>';
			html += '  <div class="info">';
			html += '    <p class="left"><a class="username" href="/gists/user/' + username + '">' + username + '</a></p>';
			html += '    <p class="right"><span class="eye">' + views + '</span><img class="eye" src="/static/img/eye.png" /></p>';
			html += '  </div>';
			html += '</li>';
			node.append(html);

			orderThumbnails(node);

		});

	}

};

var populateThumbnailsFromEndpoint = function(endpoint, data, node) {

	// get gists
	$.post(endpoint, data, function(gists) {

		populateThumbnails(JSON.parse(gists), node);

	});

};

