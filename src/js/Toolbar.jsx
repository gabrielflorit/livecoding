require('../css/toolbar.css');
var React   = require('react');

var PubSub  = require('pubsub-js');

var Toolbar = React.createClass({

	statics: {
		topics: function() {
			return {
				ModeChange: 'ModeChange'
			};
		}
	},

	handleModeClick: function(e) {
		PubSub.publish(Toolbar.topics().ModeChange, e.currentTarget.textContent);
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