var CodeMirror = require('codemirror');
var util       = require('./util.js');
var esprima    = require('esprima');

CodeMirror.registerHelper('lint', 'javascript', function(text) {

	var AST;
	var errors = [];

	try {

		AST = esprima.parse(text, {tolerant: true, loc: true});
		if (AST.errors.length) {
			errors = AST.errors;
		}
	} catch(e) {
		errors = [e];
	}

	var messages = errors.map(function(error) {

		return {
			from: {
				line: error.lineNumber - 1,
				ch: error.column
			},
			to: {
				line: error.lineNumber - 1,
				ch: error.column + 1
			},
			message: error.description,
			severity: 'error'
		};

	});

	return messages;
});