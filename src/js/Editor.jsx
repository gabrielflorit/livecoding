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
			var content = cm.getValue();
			self.props.onContentChange(content);
		});
	}

});

module.exports = Editor;