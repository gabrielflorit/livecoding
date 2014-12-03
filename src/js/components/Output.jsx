// This component renders the current code.

// Include React.
var React = require('react');

// We'll use esprima to validate javascript code.
var esprima = require('esprima');

// Create the component.
var Output = React.createClass({

	renderHTML: function(code) {
		var iframe = window.frames[0];
		var doc = iframe.document;

		doc.body.innerHTML = code;
	},

	renderCSS: function(code) {
		var iframe = window.frames[0];
		var doc = iframe.document;

		doc.head.querySelector('style.custom').textContent = code;
	},

	renderJavaScript: function(code) {
		var iframe = window.frames[0];

		var AST;
		var isValid = false;
		try {
			// use esprima to validate the code
			AST = esprima.parse(code, {tolerant: true, loc: true});
			isValid = !AST.errors.length;
		} catch(e) {}

		// and only pass in the javascript string if code is valid.
		if (isValid) {
			iframe.livecoding.callCode(code);
		}
	},

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
	shouldComponentUpdate: function(nextProps) {

		// Get the iframe.
		var iframe = window.frames[0];
		var doc = iframe.document;

		// If `renderAll` is true, then render all codes.
		if (nextProps.renderAll) {
			this.renderHTML(nextProps.html);
			this.renderJavaScript(nextProps.javascript);
			this.renderCSS(nextProps.css);
		} else {

			// If the current mode is `html`,
			if (this.props.html !== nextProps.html) {

				// render html
				this.renderHTML(nextProps.html);

				// and javascript.
				this.renderJavaScript(nextProps.javascript);
			}

			// If the current mode is `css`,
			if (this.props.css !== nextProps.css) {

				// render css.
				this.renderCSS(nextProps.css);
			}

			// If the current mode is `javascript`,
			if (this.props.javascript !== nextProps.javascript) {

				// render html
				this.renderHTML(nextProps.html);

				// and javascript.
				this.renderJavaScript(nextProps.javascript);
			}

		}

		return false;
	}

});

module.exports = Output;