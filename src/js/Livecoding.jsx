/**
 * @jsx React.DOM
 */

// require main stylesheet
require('../css/livecoding.css');

var React  = require('react');

var Editor = require('./Editor.jsx');

var Livecoding = React.createClass({

	render: function() {
		return (
			<div>
				<Editor />
			</div>
		);
	}

});

React.renderComponent(
	<Livecoding />,
	document.getElementById('livecoding')
);