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
var Updates = require('./Updates.jsx');
var updateData = require('./updates.json');

// Create the React component.
var Livecoding = React.createClass({

	// Set the initial state. As the application grows, so
	// will the number of state properties.
	getInitialState: function() {
		return {
			html: '',
			javascript: '',
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
				<MenuBar
					mode={mode}
				/>
				<div className='content'>
					<Output
						html={this.state.html}
						javascript={this.state.javascript}
						css={this.state.css}
						mode={mode}
					/>
					<Editor content={content} mode={mode} />
				</div>
				<Updates updates={updateData} />
			</div>
		);
	},

	// This function gets called once, before the initial render.
	componentWillMount: function() {

		var self = this;

		// Setup all the subscriptions.
		PubSub.subscribe(Editor.topics().ContentChange, self.handleContentChange);
		PubSub.subscribe(MenuBar.topics().ModeChange, self.handleModeChange);
		PubSub.subscribe(MenuBar.topics().ItemClick, self.handleMenuItemClick);
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

	// Handle mode change.
	handleModeChange: function(topic, mode) {
		this.setState({
			mode: mode
		});
	},

	// Handle menu item click.
	handleMenuItemClick: function(topic, menuItem) {

		switch(menuItem) {
			case 'file:new':

				// Reset all three code files
				// and set mode back to html.
				this.setState({
					html: '',
					javascript: '',
					css: '',
					mode: 'html'
				});

			break;
		}
	}

});

// Render the entire application to `.main`.
React.render(
	<Livecoding />,
	document.querySelector('.main')
);