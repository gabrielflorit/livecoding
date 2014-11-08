require('../css/livecoding.css');
var React  = require('react');
var Editor = require('./Editor.jsx');
var Output = require('./Output.jsx');
var Toolbar = require('./Toolbar.jsx');
var util = require('./util.js');
var _ = require('lodash');

var Livecoding = React.createClass({

	handleContentChange: function(content) {
		var selected = this.state.selected;
		var change = {};
		change[selected] = content;
		this.setState(change);
	},

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
	}

});

React.render(
	<Livecoding />,
	document.getElementById('main')
);