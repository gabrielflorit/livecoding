// **Livecoding** is the parent component. It includes all other
// components. It listens and responds to events when necessary.
// It maintains the application's state.

// Include this component's stylesheet.
require('../css/livecoding.css');

// Include React.
var React   = require('react');

// Include all top-level components.
var Editor  = require('./Editor.jsx');
var Output  = require('./Output.jsx');
var Toolbar = require('./Toolbar.jsx');

// Create the React component.
var Livecoding = React.createClass({

	// Set the initial state. As the application grows, so
	// will the number of state properties.
	getInitialState: function() {
		return {
			html: '',
			js: '',
			css: '',
			// Specify what mode we're currently editing.
			mode: 'html'
		};
	},

	// Each React component has a `render` method. It gets called
	// every time the application's state changes.
	render: function() {
		// Get the current mode.
		var mode = this.state.mode;

		// Get the current mode's content.
		var content = this.state[mode];

		// Render the application. This will recursively call
		// `render` on all the components.
		return (
			<div className='livecoding'>
				<Toolbar />
				<div className='content'>
					<Output
						html={this.state.html}
						js={this.state.js}
						css={this.state.css}
						mode={mode}
					/>
					<Editor
						content={content}
						mode={mode}
						onContentChange={this.handleContentChange}
					/>
				</div>
			</div>
		);
	},

	// Every time **Editor**'s content changes it hands **Livecoding**
	// the new content. **Livecoding** then updates its current state
	// with the new content. This setup enforces React's one-way data
	// flow.
	handleContentChange: function(content) {

		// Get the current mode.
		var mode = this.state.mode;

		// Update application state with new content.
		var change = {};
		change[mode] = content;
		this.setState(change);
	}

});

// Render the entire application to `#main`.
React.render(
	<Livecoding />,
	document.getElementById('main')
);