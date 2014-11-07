/**
 * @jsx React.DOM
 */

require('../css/livecoding.css');
var React  = require('react');
var Editor = require('./Editor.jsx');
var Output = require('./Output.jsx');
var util = require('./util.js');

var Livecoding = React.createClass({

	handleContentChange: function(content) {
		this.refs.theOutput.setState({
			content: content
		});
	},

	render: function() {

		var files = {
			'water.js': {
				'content': 'console.log("I am water.js")'
			},
			'water.css': {
				'content': 'console.log("I am water.css")'
			}
		};

		return (
			<div className='livecoding'>
				<Editor onContentChange={this.handleContentChange} />
				<Output ref='theOutput' />
			</div>
		);
	},

	component

});

React.renderComponent(
	<Livecoding />,
	document.getElementById('main')
);