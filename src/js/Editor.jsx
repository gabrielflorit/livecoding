require('../css/editor.css');
var React = require('react');
var CodeMirror = require('codemirror');

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
	}

});

module.exports = Editor;