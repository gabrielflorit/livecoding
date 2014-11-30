// This component renders the menu bar.

// Include React (with addons).
var React = require('react/addons');

// Include libraries.
var PubSub = require('pubsub-js');
var util   = require('../util/util.js');

// Create the component.
var MenuBar = React.createClass({

	statics: {
		topics: function() {
			return {
				ItemClick: 'MenuBar_ItemClick',
				ModeChange: 'MenuBar_ModeChange'
			};
		}
	},

	// Set the initial state: no selected menu or item.
	getInitialState: function() {
		return {
			selectedMenu: null,
			selectedItem: null
		};
	},

	// Listen to click events. We need this to close the menu.
	componentDidMount: function() {
		document.addEventListener('click', this.handleDocumentClick);
	},

	componentWillUnmount: function() {
		document.removeEventListener('click', this.handleDocumentClick);
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

		var gistUrl = this.props.gistUrl;

		// Assign gist id as key (react transition needs this).
		var saved = gistUrl ?
			<div className='saved' key={gistUrl.match(/[a-z\d]*$/i)[0]}>
				<a href={gistUrl}>{gistUrl}</a>
			</div> : null;

		var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

		return (
			<div className='menubar'>
				<ul className='menugroup file'>
					<li className={this.state.selectedMenu === 'file' ? 'current' : ''}>
						<button className='menubutton' onMouseEnter={this.handleMenuMouseEnter} onClick={this.handleMenuClick}>file</button>
						<ul className={'menu' + (this.state.selectedMenu === 'file' ? ' selected' : '')}>
							<li className={this.state.selectedMenu === 'file' && this.state.selectedItem === 'save' ? 'current' : ''}>
								<button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>save</button>
							</li>
						</ul>
					</li>
				</ul>
				<ReactCSSTransitionGroup transitionName='saved' transitionLeave={false}>
					{saved}
				</ReactCSSTransitionGroup>
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

	// Convenience function.
	isOpen: function() {
		return this.getDOMNode().querySelector('.menugroup > li.current') !== null;
	},

	// Handle document clicks. If we click outside the menu, close menu.
	handleDocumentClick: function(e) {

		// This event will fire before all others.
		// If the target isn't one of the menu buttons,
		// set menu to closed.
		if (!this.getDOMNode().querySelector('.menugroup.file').contains(e.target)) {
			this.setState({
				selectedMenu: null,
				selectedItem: null
			});
		}
	},

	// Handle item hovers. Select the item.
	handleItemMouseEnter: function(e) {

		var item = this.isOpen() ? e.currentTarget.textContent : null;

		this.setState({
			selectedItem: item
		});
	},

	// Handle menu hovers. Deselect items and select the menu.
	handleMenuMouseEnter: function(e) {

		var menu = this.isOpen() ? e.currentTarget.textContent : null;

		this.setState({
			selectedMenu: menu,
			selectedItem: null
		});
	},

	// Handle item clicks.
	handleItemClick: function(e) {

		// Get the menu button.
		var itemButton = e.currentTarget;
		var menuButton = itemButton.parentNode.parentNode.parentNode.querySelector('button');

		// Publish the command.
		PubSub.publish(MenuBar.topics().ItemClick, [menuButton.textContent, itemButton.textContent].join(':'));

		// Close the menu.
		this.setState({
			selectedMenu: null,
			selectedItem: null
		});
	},

	// Handle menu clicks. Toggle the menu.
	handleMenuClick: function(e) {

		var menu = !this.isOpen() ? e.currentTarget.textContent : null;

		this.setState({
			selectedMenu: menu
		});
	},

	// Handle mode button click. Publish the command.
	handleModeClick: function(e) {
		PubSub.publish(MenuBar.topics().ModeChange, e.currentTarget.textContent);
	}

});

module.exports = MenuBar;