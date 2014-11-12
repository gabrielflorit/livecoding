var React = require('react/addons');
var _ = require('lodash');
var util = require('./util.js');
var Moment = require('moment');

// This component gets a list of updates from Livecoding.
// It then displays only those which the user hasn't dismissed.
// When the user closes this drawer it is equivalent to dismissing all updates
// presently visible. We store this information on localStorage.

var Updates = React.createClass({

	statics: {

		// Utility property to prevent typing errors.
		DISMISSED_UPDATE_NUMBERS: 'LIVECODING_DISMISSED_UPDATE_NUMBERS',
	},

	// The component will be visible by default.
	getInitialState: function() {
		return {
			open: true
		};
	},

	render: function() {

		// Get dismissed update numbers from local storage (if present).
		var dismissedUpdateNumbers = [];
		var localNumbers = localStorage.getItem(Updates.DISMISSED_UPDATE_NUMBERS);
		if (localNumbers) {
			dismissedUpdateNumbers = localNumbers.split(',').map(function(v) {
				return +v;
			});
		}

		// Get new update numbers
		var newUpdateNumbers = _.difference(_.pluck(this.props.updates, 'number'), dismissedUpdateNumbers);

		// Chain a series of operations together:
		var updates = _.chain(this.props.updates)

			// only include new updates,
			.filter(function(update) {
				return _.contains(newUpdateNumbers, update.number);
			})

			// and return <li /> tags for the rest of the updates.
			.map(function(update) {
				var moment = Moment(update.closed_at);

				return (<li key={update.number}>
					<time dateTime={update.closed_at}>{moment.fromNow()}</time>
					<span>{update.title}</span>
				</li>);
			})
			.value();

		// Use React's handy classSet helper to set classes based on state.
		var cx = React.addons.classSet;
		var classes = cx({
			'updates': true,
			'closed': !this.state.open || !newUpdateNumbers.length
		});

		return (
			<div className={classes}>
				<header>
					<h3>Updates</h3>
					<button className='close' onClick={this.onButtonClick.bind(this, newUpdateNumbers)}>×</button>
				</header>
				<ul>
					{updates}
				</ul>
			</div>
		);
	},

	// Handle clicking the close button.
	onButtonClick: function(dismissedUpdateNumbers) {

		// Save dismissed update numbers in local storage, so we don't
		// display them again.
		localStorage.setItem(Updates.DISMISSED_UPDATE_NUMBERS, dismissedUpdateNumbers);

		// Change this component's state to closed. This will trigger a
		// re-render.
		this.setState({open: false});
	}

});

module.exports = Updates;