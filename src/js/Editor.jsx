/**
 * @jsx React.DOM
 */

// the Editor's responsibility is limited:
// NOW: notify listeners when its contents change
// (TODO: display the contents of one file, e.g. file.js, file.css)

require('../css/editor.css');
var React = require('react');
var CodeMirror = require('codemirror');
var util = require('./util.js');
var esprima = require('esprima');
var escodegen = require('imports?this=>window!!exports?window.escodegen!../../node_modules/escodegen/escodegen.browser.min.js');

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

		this.codemirror.on('change', function(cm) {

			// grab codemirror contents
			var content = cm.getValue();

			// let's try to parse contents
			// this way we will only render contents that pass validation
			var AST;
			var isValid = false;
			try {
				AST = esprima.parse(content, {tolerant: true, loc: true});
				isValid = !AST.errors.length;
				// TODO: display errors info on line gutters
				if (!isValid) {
					util.log(AST.errors);
				}
			} catch(e) {
				util.log(e);
				// TODO: display e info on line gutter
			}

			if (isValid) {
				var code = escodegen.generate(AST);

				// new Function() is better than eval, since the latter
				// has access to context scope
				var func = new Function(code);

				// publish content change event
				self.props.onContentChange(func);
			}

		});
	},

	shouldComponentUpdate: function(props, state) {
		return false;
	}

});

module.exports = Editor;