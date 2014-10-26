/**
 * @jsx React.DOM
 */

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
				{this.state.content}
			</div>
		);
	}

});

module.exports = Output;