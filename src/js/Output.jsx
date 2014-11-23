// This component renders the current code.

// Include React.
var React = require('react');

// We'll use esprima to validate javascript code.
var esprima = require('esprima');

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
		var iframe = window.frames[0];
		var doc = iframe.document;

		// If the current mode is `html`, replace the iframe's `body` contents.
		if (props.mode === 'html') {
			doc.body.innerHTML = props.html;
		}

		// If the current mode is `css`, replace the iframe's `style` contents.
		if (props.mode === 'css') {
			doc.head.querySelector('style.custom').textContent = props.css;
		}

		// If the current mode is `javascript`,
		if (props.mode === 'javascript') {

			var AST;
			var isValid = false;
			try {
				// use esprima to validate the code
				AST = esprima.parse(props.javascript, {tolerant: true, loc: true});
				isValid = !AST.errors.length;
			} catch(e) {}

			// and only pass in the javascript string if code is valid.
			if (isValid) {
				iframe.livecoding.callCode(props.javascript);
			}

		}

		return false;
	}

});

module.exports = Output;