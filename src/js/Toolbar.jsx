require('../css/toolbar.css');
var React = require('react');

var Toolbar = React.createClass({

	handleModeClick: function(e) {
		this.props.onModeChange(e.currentTarget.textContent);
	},

	render: function() {

		var self = this;

		var items = ['html', 'js', 'css'].map(function(mode) {
			return <li key={mode}>
				<button onClick={self.handleModeClick} disabled={self.props.mode === mode}>{mode}</button>
			</li>;
		});

		return (
			<div className='toolbar'>
				<ul>
					{items}
				</ul>
			</div>
		);
	}

});

module.exports = Toolbar;