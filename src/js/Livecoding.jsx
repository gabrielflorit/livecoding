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
		return (
			<div className='livecoding'>
				<Editor onContentChange={this.handleContentChange} />
				<Output ref='theOutput' />
			</div>
		);
	}

});

React.renderComponent(
	<Livecoding />,
	document.getElementById('main')
);