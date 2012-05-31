/* Author:
	Gabriel Florit
*/

var aigua = (function () {
	return {
		samples: ['data/chord.txt']
	}
})();

$(function() {

	d3.text(aigua.samples[0], function(data) {

		aigua.codeMirror = CodeMirror(document.getElementById('code'), {
			lineNumbers: true,
			matchBrackets: true,
			mode:  'javascript',
			theme: 'lesser-dark',
			value: data
		});

	});

});
































