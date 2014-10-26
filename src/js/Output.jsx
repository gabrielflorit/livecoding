/**
 * @jsx React.DOM
 */

require('../css/output.css');
var React = require('react');

var Output = React.createClass({

	getInitialState: function() {
		return {
			content: 'gabriel'
		};
	},

	render: function() {
		return (
			<div className='output'>
				<iframe src='iframe.html' />
			</div>
		);
	},

	shouldComponentUpdate: function(props, state) {
		return false;
	}

});

module.exports = Output;