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

/*
	Get the coords for the currently selected codemirror token.

	@param {object} cm The CodeMirror instance.
	@param {Number} start The selection start.
	@param {Number} end The selection end.
	@return {object} The coords object.
*/
lc.getTokenCoords = function(cm, start, end) {

	// select token
	cm.setSelection(start, end);

	// find coords at token start
	var startCoords = cm.cursorCoords(true);
	var endCoords = cm.cursorCoords(false);

	// center marker on token
	var center = startCoords.x + (endCoords.x - startCoords.x)/2;

	return { x: center, y: startCoords.y };

};
