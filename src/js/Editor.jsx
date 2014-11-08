// This component contains the code editor.

// Include this component's stylesheet.
require('../css/editor.css');

// Include React.
var React = require('react');

// We'll use CodeMirror as the code editor.
var CodeMirror = require('codemirror');

// Create the component.
var Editor = React.createClass({

	// Convenience property.
	codemirror: null,

	// Render the component.
	render: function() {
		return (
			<div className='editor'>
				<div className='editor-codemirror'>
				</div>
			</div>
		);
	},

	// This method is fired once, after the initial render. We'll use
	// it to initialize the CodeMirror instance.
	componentDidMount: function() {

		var self = this;

		// Initialize the CodeMirror instance with various options.
		this.codemirror = CodeMirror(this.getDOMNode().querySelector('.editor-codemirror'), {
			lineNumbers: true
		});

		// When the code editor's contents change,
		this.codemirror.on('change', function(cm, o) {

			// get the contents,
			var content = cm.getValue();

			// and pass them off to **Livecoding**.
			self.props.onContentChange(content);
		});
	},

	// This method is called every time **Livecoding's** state changes, e.g.
	// when we load a new gist, or when the user makes a change to the
	// current code editor contents.
	shouldComponentUpdate: function(props, state) {

		// Get CodeMirror's current contents.
		var currentContent = this.codemirror.getValue();

		// Don't update CodeMirror if incoming and current contents
		// are identical. We need this because of our one-way data flow.
		if (currentContent !== props.content) {
			this.codemirror.setValue(props.content);
		}

		// Tell React not to manage this component's DOM.
		return false;
	}

});

module.exports = Editor;