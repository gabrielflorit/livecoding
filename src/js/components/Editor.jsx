// This component contains the code editor.

// Include React.
var React      = require('react');

// Include libraries.
var PubSub     = require('pubsub-js');
var util       = require('../util/util.js');

// We'll use CodeMirror as the code editor.
var CodeMirror = require('codemirror');

// Load CodeMirror HTML/JS/CSS modes.
require('../../../node_modules/codemirror/mode/htmlmixed/htmlmixed.js');

// Require lint framework.
require('../../../node_modules/codemirror/addon/lint/lint.js');

// Add CSSLint to window,
window.CSSLint = require('csslint').CSSLint;

// because this file expects it to be on window.
require('../../../node_modules/codemirror/addon/lint/css-lint.js');

// Require our custom linters.
require('../util/html-lint.js');
require('../util/javascript-lint.js');

// Create the component.
var Editor = React.createClass({

	statics: {
		topics: function() {
			return {
				ContentChange: 'Editor_ContentChange'
			};
		}
	},

	documents: {},

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
			lint: function(text, options, cm) {

				// Use CodeMirror's "getHelper" to return the linter
				// associated with this mode.
				var linter = cm.getHelper(CodeMirror.Pos(0, 0), 'lint');
				return linter(text, options);
			},
			gutters: ['CodeMirror-lint-markers'],
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
	shouldComponentUpdate: function(nextProps) {

		// Get current CodeMirror document.
		var currentDoc = this.codemirror.getDoc();

		// Let's compare new and current properties. First, mode.
		// Even though Livecoding thinks there are three modes (html, javascript, css)
		// we'll use the 'htmlmixed' CodeMirror mode, which lets us
		// write html/javascript/css in the same document.
		var newMode = nextProps.mode.replace('html', 'htmlmixed');

		// Get mode of current document.
		var currentMode = currentDoc.getMode().name;

		// If new mode doesn't match current mode, get the correct document
		// (or create it first) and then swap documents.
		var newDoc;
		if (newMode !== currentMode) {
			newDoc = this.documents[newMode] || CodeMirror.Doc('', newMode);
			this.documents[currentMode] = this.codemirror.swapDoc(newDoc);
		}

		// Next up, compare content.
		var currentContent = this.codemirror.getValue();
		var newContent = nextProps.content;

		// If new content doesn't match current content, replace.
		if (currentContent !== newContent) {
			this.codemirror.setValue(newContent);
		}

		// Tell React not to manage this component's DOM.
		return false;
	}

});

module.exports = Editor;