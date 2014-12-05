var CodeMirror = require('codemirror');
var util       = require('./util.js');
var acorn      = require('acorn');

CodeMirror.registerHelper('lint', 'javascript', function(text) {

	var AST;
	var errors = [];

	try {
		acorn.parse(text);
	} catch(e) {

		errors.push({
			from: {
				line: e.loc.line - 1,
				ch: e.loc.column
			},
			to: {
				line: e.loc.line - 1,
				ch: e.raisedAt
			},
			message: e.message.replace(/ \(\d+:\d+\)$/, ''),
			severity: 'error'
		});
	}

	return errors;
});