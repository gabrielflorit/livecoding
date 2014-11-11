var React = require('react/addons');

var PubSub  = require('pubsub-js');

var ModeMenu = React.createClass({

	statics: {
		topics: function() {
			return {
				ModeChange: 'ModeChange'
			};
		}
	},

	handleModeClick: function(e) {
		PubSub.publish(ModeMenu.topics().ModeChange, e.currentTarget.textContent);
	},

	render: function() {

		var cx = React.addons.classSet;

		var self = this;

		var items = ['html', 'css'].map(function(mode) {
			var isCurrent = self.props.mode === mode;

			var classes = cx({
				'current': isCurrent
			});

			return <li className={classes} key={mode}>
				<button onClick={self.handleModeClick} disabled={isCurrent}>{mode}</button>
			</li>;
		});

		return (
			<div className='modemenu'>
				<ul>
					{items}
				</ul>
			</div>
		);
	}

});

module.exports = ModeMenu;