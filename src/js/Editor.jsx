require('../css/editor.css');
var React = require('react');
var CodeMirror = require('codemirror');
var util = require('./util.js');
var _ = require('lodash');

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

		this.codemirror.on('change', function(cm, o) {

			// grab codemirror contents
			var content = cm.getValue();

			// notify Livecoding of change event
			self.props.onContentChange(content);
		});
	},

	shouldComponentUpdate: function(props, state) {

		// if incoming content is different than current content
		// set content on CM.
		var currentContent = this.codemirror.getValue();
		if (currentContent !== props.content) {
			this.codemirror.setValue(props.content);
		}

		return false;
	}

});

module.exports = Editor;