/**
 * @jsx React.DOM
 */

require('../css/output.css');
var React = require('react');

var Output = React.createClass({

	render: function() {
		return (
			<div className='output'>
				<iframe src='iframe.html' />
			</div>
		);
	},

	shouldComponentUpdate: function(props, state) {

		// we assume state.content is a function
		this.getDOMNode().querySelector('iframe').contentWindow.callCode(state.content);

		return false;
	}

});

module.exports = Output;