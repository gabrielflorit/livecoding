// This component renders the current code.

// Include React.
var React = require('react');

// Create the component.
var Output = React.createClass({

	// Render the component. We use an iframe to prevent
	// the user's JS/CSS from interfering with the application.
	render: function() {
		return (
			<div className='output'>
				<iframe src='iframe.html' />
			</div>
		);
	},

	// Tell React not to manage this component's DOM.
	shouldComponentUpdate: function(props, state) {

		// Get the iframe.
		var doc = this.getDOMNode().querySelector('iframe').contentWindow.document;

		// If the current mode is `html`, replace the iframe's `body` contents.
		if (props.mode === 'html') {
			doc.body.innerHTML = props.html;
		}

		// If the current mode is `css`, replace the iframe's `style` contents.
		if (props.mode === 'css') {
			doc.head.querySelector('style').textContent = props.css;
		}

		return false;
	}

});

module.exports = Output;