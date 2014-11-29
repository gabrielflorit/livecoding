module.exports = {

	log: function(value) {
		console.log(JSON.stringify(value, null, 4));
	},

	// from https://mathiasbynens.be/notes/xhr-responsetype-json
	getJSON: function(url) {
	  return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
			var status = xhr.status;
			if (status === 200) {
				resolve(xhr.response);
			} else {
				reject(status);
			}
		};
		xhr.send();
	  });
	}

};