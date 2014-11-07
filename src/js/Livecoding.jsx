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

		var selected = this.state.selected;
		var content = this.state[selected];

		return (
			<div className='livecoding'>
				<Toolbar />
				<div className='content'>
					<Output />
					<Editor
						content={content}
						language={selected}
						onContentChange={this.handleContentChange}
					/>
				</div>
			</div>
		);
	},

	componentDidMount: function() {

		// eventually we'll check if url has gist id, and if so,
		// load gist and pass it to Editor.
		// but for now we'll just pass it documents manually.
		this.setState({
			html: '<h1>the html</h1>',
			js: 'console.log("the js")',
			css: 'body { background: red; }',
			selected: 'html'
		});
	}

});

React.render(
	<Livecoding />,
	document.getElementById('main')
);