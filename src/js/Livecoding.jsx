/**
 * @jsx React.DOM
 */

require('../css/livecoding.css');

var React  = require('react');

var Editor = require('./Editor.jsx');

var Livecoding = React.createClass({

	render: function() {
		return (
			<div className='livecoding'>
				<Editor />
			</div>
		);
	}

});

React.renderComponent(
	<Livecoding />,
	document.getElementById('main')
);