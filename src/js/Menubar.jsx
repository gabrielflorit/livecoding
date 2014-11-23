// This component renders the menu bar.

// Include React (with addons).
var React = require('react/addons');

// Include libraries.
var PubSub  = require('pubsub-js');

// Create the component.
var MenuBar = React.createClass({

	statics: {
		topics: function() {
			return {
				ModeChange: 'ModeChange'
			};
		}
	},

	// Render the component.
	render: function() {

		var cx = React.addons.classSet;

		var self = this;

		// Create the mode items.
		var modeItems = ['html', 'javascript', 'css'].map(function(mode) {

			// Highlight the current mode.
			var isCurrent = self.props.mode === mode;

			var classes = cx({
				'current': isCurrent
			});

			return <li className={classes} key={mode}>
				<button onClick={self.handleModeClick} disabled={isCurrent}>{mode}</button>
			</li>;
		});

		return (
			<div className='menubar'>
				<ul className='menugroup file'>
					<li>
						<button>File</button>
						<ul className='menu'>
							<li><button>New file</button></li>
							<li><button>Open...</button></li>
							<li><button>Open recent</button></li>
						</ul>
					</li>
					<li>
						<button>Edit</button>
						<ul className='menu'>
							<li><button>Undo paste</button></li>
							<li><button>Repeat paste</button></li>
							<li><button>Undo selection</button></li>
						</ul>
					</li>
					<li>
						<button>Selection</button>
						<ul className='menu'>
							<li><button>Split into lines</button></li>
							<li><button>Add previous line</button></li>
							<li><button>Add next line</button></li>
						</ul>
					</li>
				</ul>
				<ul className='menugroup mode'>
					<li>
						<ul className='menu'>
							{modeItems}
						</ul>
					</li>
				</ul>
			</div>
		);
	},

	// Handle mode button click.
	handleModeClick: function(e) {
		PubSub.publish(MenuBar.topics().ModeChange, e.currentTarget.textContent);
	}

});

module.exports = MenuBar;