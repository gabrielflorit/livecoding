require('../css/livecoding.css');
var React  = require('react');
var Editor = require('./Editor.jsx');
var Output = require('./Output.jsx');

var Livecoding = React.createClass({

	render: function() {

		return (
			<div className='livecoding'>
				<Output />
				<Editor />
			</div>
		);
	}

});

React.render(
	<Livecoding />,
	document.getElementById('main')
);