var CodeMirror = require('codemirror');
require('../../node_modules/codemirror/lib/codemirror.css');

var myCodeMirror = CodeMirror(document.body);

$('button').click(function() {
	alert('clicked');
});