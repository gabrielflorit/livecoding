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
	// TODO: diff new + old code before passing to iframe
	shouldComponentUpdate: function(nextProps) {

		// Get the iframe.
		var iframe = window.frames[0];
		var doc = iframe.document;

		// If the current mode is `html`, replace the iframe's `body` contents.
		if (nextProps.mode === 'html' || nextProps.renderAll) {
			doc.body.innerHTML = nextProps.html;
			console.log('rendering html');
		}

		// If the current mode is `css`, replace the iframe's `style` contents.
		if (nextProps.mode === 'css' || nextProps.renderAll) {
			doc.head.querySelector('style.custom').textContent = nextProps.css;
			console.log('rendering css');
		}

		// If the current mode is `javascript`,
		if (nextProps.mode === 'javascript' || nextProps.renderAll) {

			var AST;
			var isValid = false;
			try {
				// use esprima to validate the code
				AST = esprima.parse(nextProps.javascript, {tolerant: true, loc: true});
				isValid = !AST.errors.length;
			} catch(e) {}

			// and only pass in the javascript string if code is valid.
			if (isValid) {
				iframe.livecoding.callCode(nextProps.javascript);
			}

			console.log('rendering javascript');
		}

		return false;
	}

});

module.exports = Output;