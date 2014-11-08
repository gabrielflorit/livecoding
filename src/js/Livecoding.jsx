// Livecoding is the parent component. It includes all other
// components, handling and responding to events when necessary.
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

	// Set the initial state.
	getInitialState: function() {
		return {
			html: '',
			js: '',
			css: '',
			selected: 'html'
		};
	},

	render: function() {

		var state = this.state;

		var selected = state.selected;
		var content = state[selected];

		return (
			<div className='livecoding'>
				<Toolbar />
				<div className='content'>
					<Output
						html={state.html}
						js={state.js}
						css={state.css}
						change={selected}
					/>
					<Editor
						content={content}
						language={selected}
						onContentChange={this.handleContentChange}
					/>
				</div>
			</div>
		);
	},

	handleContentChange: function(content) {
		var selected = this.state.selected;
		var change = {};
		change[selected] = content;
		this.setState(change);
	}

});

React.render(
	<Livecoding />,
	document.getElementById('main')
);