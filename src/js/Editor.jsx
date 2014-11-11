// This component contains the code editor.

// Include React.
var React      = require('react');

// Include libraries.
var PubSub     = require('pubsub-js');

// We'll use CodeMirror as the code editor.
var CodeMirror = require('codemirror');

// Load CodeMirror HTML/JS/CSS modes.
require('../../node_modules/codemirror/mode/htmlmixed/htmlmixed.js');

// Create the component.
var Editor = React.createClass({

	statics: {
		topics: function() {
			return {
				ContentChange: 'ContentChange'
			};
		}
	},

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
			lineNumbers: true,
			mode: 'htmlmixed',
			theme: 'solarized dark'
		});

		// When the code editor's contents change,
		this.codemirror.on('change', function(cm) {

			// get the contents,
			var content = cm.getValue();

			// and publish a change event containing the new content.
			PubSub.publish(Editor.topics().ContentChange, content);
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