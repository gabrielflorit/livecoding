// **Livecoding** is the parent component. It includes all other
// components. It listens and responds to events when necessary.
// It maintains the application's state.

// Include React.
var React   = require('react');

// Include libraries.
var PubSub  = require('pubsub-js');

// Include all top-level components.
var MenuBar = require('./MenuBar.jsx');
var Output  = require('./Output.jsx');
var Editor  = require('./Editor.jsx');

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
				<MenuBar />
				<div className='content'>
					<Output
						html={this.state.html}
						js={this.state.js}
						css={this.state.css}
						mode={mode}
					/>
					<Editor content={content} mode={mode} />
				</div>
			</div>
		);
	},

	// This function gets called once, before the initial render.
	componentWillMount: function() {

		var self = this;

		// Setup all the subscriptions.
		PubSub.subscribe(Editor.topics().ContentChange, self.handleContentChange);
		// PubSub.subscribe(Modebar.topics().ModeChange, self.handleModeChange);
	},

	// Every time **Editor**'s content changes it hands **Livecoding**
	// the new content. **Livecoding** then updates its current state
	// with the new content. This setup enforces React's one-way data
	// flow.
	handleContentChange: function(topic, content) {

		// Get the current mode.
		var mode = this.state.mode;

		// Update application state with new content.
		var change = {};
		change[mode] = content;
		this.setState(change);
	},

	// handleModeChange: function(topic, mode) {
	// 	this.setState({
	// 		mode: mode
	// 	});
	// }

});

// Render the entire application to `#main`.
React.render(
	<Livecoding />,
	document.getElementById('main')
);