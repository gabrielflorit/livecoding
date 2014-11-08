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

		var doc = this.getDOMNode().querySelector('iframe').contentWindow.document;

		if (props.change === 'html') {
			doc.body.innerHTML = props.html;
		}

		if (props.change === 'css') {
			doc.head.querySelector('style').textContent = props.css;
		}

		return false;
	}

});

module.exports = Output;