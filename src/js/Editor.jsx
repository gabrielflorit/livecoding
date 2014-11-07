/**
 * @jsx React.DOM
 */

// The Editor's responsibility is limited to the following:
// - Notify listeners when its contents change.
// - Allow for multiple files, each with its own syntax highlighting and validation (optional).
//		- A file might be created via a keyboard shortcut. All keyboard shortcuts will be handled elsewhere,
//			so this should expose an API to create a file.
//		- A file might be created via a new tab. The tab control will be managed here.
//
// The metaphor here is a stack of papers. Livecoding receives a stack of papers and promptly gives them
// to Editor. Editor keeps those papers, making modifications when necessary, and informing Livecoding
// of each modification. If prompted, Editor can show the papers to Livecoding, but they're always in
// Editor's control.

// In other words: Livecoding receives a gist of files, sets as state on Editor.
// Editor notifies Livecoding on every key change.
// Livecoding can then request to get either files of this type, including the current one.
// Livecoding can also request to get all files, period.

require('../css/editor.css');
var React = require('react');
var CodeMirror = require('codemirror');
var util = require('./util.js');
var esprima = require('esprima');
var escodegen = require('imports?this=>window!exports?window.escodegen!../../node_modules/escodegen/escodegen.browser.min.js');

var Editor = React.createClass({

	codemirror: null,

	render: function() {
		return (
			<div className='editor'>
				<div className='editor-codemirror'>
				</div>
			</div>
		);
	},

	componentDidMount: function() {
		var self = this;

		this.codemirror = CodeMirror(this.getDOMNode().querySelector('.editor-codemirror'), {
			lineNumbers: true
		});

		// this.codemirror.on('change', function(cm) {

		// 	// grab codemirror contents
		// 	var content = cm.getValue();

		// 	// let's try to parse contents
		// 	// this way we will only render contents that pass validation
		// 	var AST;
		// 	var isValid = false;
		// 	try {
		// 		AST = esprima.parse(content, {tolerant: true, loc: true});
		// 		isValid = !AST.errors.length;
		// 		// TODO: display errors info on line gutters
		// 		if (!isValid) {
		// 			util.log(AST.errors);
		// 		}
		// 	} catch(e) {
		// 		util.log(e);
		// 		// TODO: display e info on line gutter
		// 	}

		// 	if (isValid) {
		// 		var code = escodegen.generate(AST);

		// 		// new Function() is better than eval, since the latter
		// 		// has access to context scope
		// 		var func = new Function(code);

		// 		// publish content change event
		// 		self.props.onContentChange(func);
		// 	}

		// });
	},

	shouldComponentUpdate: function(props, state) {
		return false;
	}

});

module.exports = Editor;