/**
 * @jsx React.DOM
 */

// reset browser styles
require('../../node_modules/normalize.css/normalize.css');

// require main stylesheet
require('../css/main.css');

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