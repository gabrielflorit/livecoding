/**
 * @jsx React.DOM
 */

require('../css/livecoding.css');
var React  = require('react');
var Editor = require('./Editor.jsx');
var util = require('./util.js');

var Livecoding = React.createClass({

	handleContentChange: function(content) {
		util.log(content);
	},

	render: function() {
		return (
			<div className='livecoding'>
				<Editor onContentChange={this.handleContentChange} />
			</div>
		);
	}

});

React.renderComponent(
	<Livecoding />,
	document.getElementById('main')
);