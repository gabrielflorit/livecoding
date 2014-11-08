require('../css/output.css');
var React = require('react');
var util = require('./util.js');

var Output = React.createClass({

	render: function() {
		return (
			<div className='output'>
				<iframe src='iframe.html' />
			</div>
		);
	},

	shouldComponentUpdate: function(props, state) {

		if (props.change === 'html') {
			this.getDOMNode().querySelector('iframe').contentWindow.document.body.innerHTML = props.html;
		}

		return false;
	}

});

module.exports = Output;