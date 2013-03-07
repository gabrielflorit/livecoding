$(function() {

	var url = 'https://api.github.com/gists/' + gistId;
	var captureUrl = 'http://guarded-castle-8005.herokuapp.com';

	$.ajax({
		url: url + '?callback=?',
		dataType: 'json',
		success: function (json) {

			var history = json.data.history;
			var version;
			var html;
			var $html;
			var counter = 0;
			var totalImagesToLoad = history.length + 1;

			var loadImage = function(node) {
				node.imagesLoaded(function() {
					counter++;
					$('.loading').html('loading images: ' + counter + ' of ' + totalImagesToLoad);

					if (counter == totalImagesToLoad) {
						$('.loading').html('this gist has ' + totalImagesToLoad + ' revisions');

						var imageCounter = totalImagesToLoad - 1;
						var frames = 0;
						$('.revision:eq(' + imageCounter + ')').show();
						(function animloop() {
							requestAnimationFrame(animloop);

							frames++;
							if (frames > 30) {
								frames = 0;
								$('.revision:eq(' + imageCounter + ')').hide();
								imageCounter--;
								if (imageCounter < 0) {
									imageCounter = totalImagesToLoad - 1;
								}
								$('.revision:eq(' + imageCounter + ')').show();
							}
						})();

					}
				});
			};

			html = '<div class="revision">';
			html +=   '<a href="http://livecoding.io' + '/' + gistId + '">';
			html +=     '<img src="' + captureUrl + '/' + gistId + '">';
			html +=     '</img>';
			html +=   '</a>';
			html +=   '<div class="dateAndNumber">';
			html +=     '<p class="number">' + totalImagesToLoad + '</p>';
			html +=     '<p class="date">';
			html +=       new Date(json.data['updated_at']).toLocaleString();
			html +=     '</p>';
			html +=   '</div>';
			html += '</div>';

			$html = $(html);
			loadImage($('img', $html));
			$('#gallery').append($html);

			for (var i = 0; i < history.length; i++) {
				version = history[i].version;
				html = '<div class="revision">';
				html +=   '<a href="http://livecoding.io' + '/' + gistId + '/' + version + '">';
				html +=     '<img src="' + captureUrl + '/' + gistId + '/' + version + '">';
				html +=     '</img>';
				html +=   '</a>';
				html +=   '<div class="dateAndNumber">';
				html +=     '<p class="number">' + (totalImagesToLoad - (i + 1)) + '</p>';
				html +=     '<p class="date">';
				html +=       new Date(history[i]['committed_at']).toLocaleString();
				html +=     '</p>';
				html +=   '</div>';
				html += '</div>';

				$html = $(html);
				loadImage($('img', $html));
				$('#gallery').append($html);

			}

			$('h2 span').html(history.length);

		}
	});

});