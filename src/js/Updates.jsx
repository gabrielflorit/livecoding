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
				var url = 'https://github.com/gabrielflorit/livecoding/issues/' + update.number;

				return (<li key={update.number}>
					<time dateTime={update.closed_at}>{moment.fromNow()}</time>
					<a href={url}>{update.title}</a>
				</li>);
			})
			.value();

		// Should we close the drawer?
		var closeDrawer = !this.state.open || !newUpdateNumbers.length;

		// If we close the drawer, return null. We need this so React knows
		// how to add an exit transition before removing component from DOM.
		var drawer = closeDrawer ? null :
				<div className='updates' key={'drawer'}>
					<header>
						<h3>Updates</h3>
						<button className='close' onClick={this.onButtonClick.bind(this, newUpdateNumbers)}>×</button>
					</header>
					<ul>
						{updates}
					</ul>
				</div>;

		var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

		return (
			<ReactCSSTransitionGroup transitionName='drawer' transitionEnter={false}>
				{drawer}
			</ReactCSSTransitionGroup>
		);
	},

	// Handle clicking the close button.
	onButtonClick: function(newUpdateNumbers) {

		// Save dismissed update numbers in local storage, so we don't
		// display them again.
		var dismissedUpdateNumbers = [];
		var localNumbers = localStorage.getItem(Updates.DISMISSED_UPDATE_NUMBERS);
		if (localNumbers) {
			dismissedUpdateNumbers = localNumbers.split(',').map(function(v) {
				return +v;
			});
		}

		var allDismissedNumbers = _.uniq(dismissedUpdateNumbers.concat(newUpdateNumbers));

		localStorage.setItem(Updates.DISMISSED_UPDATE_NUMBERS, allDismissedNumbers);

		// Change this component's state to closed. This will trigger a
		// re-render.
		this.setState({open: false});
	}

});

module.exports = Updates;