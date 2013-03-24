var lc = lc || {}; 

/*
	Get the url gist id - e.g. '1234567' in http://livecoding.io/1234567.

	@param {String} url The url string.
	@return {String} The gist id, or null if not found.
*/
lc.getUrlGistId = function(url) {

	var gistId = url.split('/')[3];

	return (gistId.length > 0 && gistId != '!') ? gistId : null;
};

/*
	Get the url gist version id - e.g 'abcdefg' in http://livecoding.io/1234567/abcdefg.

	@param {String} url The url string.
	@return {String} The gist version id, or null if not found.
*/
lc.getUrlGistVersionId = function(url) {

	var parts = url.split('/');

	return parts.length == 5 ? parts[4] : null;
};
