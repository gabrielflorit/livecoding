// This component renders the menu bar.

// Include React (with addons).
var React = require('react/addons');

// Include libraries.
var PubSub = require('pubsub-js');
var util   = require('./util.js');

// Create the component.
var MenuBar = React.createClass({

	statics: {
		topics: function() {
			return {
				ItemClick: 'ItemClick',
				ModeChange: 'ModeChange'
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

		return (
			<div className='menubar'>
				<ul className='menugroup file'>
					<li className={this.state.selectedMenu === 'file' ? 'current' : ''}>
						<button className='menubutton' onMouseEnter={this.handleMenuMouseEnter} onClick={this.handleMenuClick}>file</button>
						<ul className={'menu' + (this.state.selectedMenu === 'file' ? ' selected' : '')}>
							<li className={this.state.selectedMenu === 'file' && this.state.selectedItem === 'save' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>save</button></li>
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

					// <li className={this.state.selectedMenu === 'file' ? 'current' : ''}>
					// 	<button className='menubutton' onMouseEnter={this.handleMenuMouseEnter} onClick={this.handleMenuClick}>file</button>
					// 	<ul className={'menu' + (this.state.selectedMenu === 'file' ? ' selected' : '')}>
					// 		<li className={this.state.selectedMenu === 'file' && this.state.selectedItem === 'new file' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>new file</button></li>
					// 		<li className={this.state.selectedMenu === 'file' && this.state.selectedItem === 'open...' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>open...</button></li>
					// 		<li className={this.state.selectedMenu === 'file' && this.state.selectedItem === 'open recent' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>open recent</button></li>
					// 	</ul>
					// </li>
					// <li className={this.state.selectedMenu === 'edit' ? 'current' : ''}>
					// 	<button className='menubutton' onMouseEnter={this.handleMenuMouseEnter} onClick={this.handleMenuClick}>edit</button>
					// 	<ul className={'menu' + (this.state.selectedMenu === 'edit' ? ' selected' : '')}>
					// 		<li className={this.state.selectedMenu === 'edit' && this.state.selectedItem === 'undo' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>undo</button></li>
					// 		<li className={this.state.selectedMenu === 'edit' && this.state.selectedItem === 'repeat' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>repeat</button></li>
					// 		<li className={this.state.selectedMenu === 'edit' && this.state.selectedItem === 'more' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>more</button></li>
					// 	</ul>
					// </li>
					// <li className={this.state.selectedMenu === 'selection' ? 'current' : ''}>
					// 	<button className='menubutton' onMouseEnter={this.handleMenuMouseEnter} onClick={this.handleMenuClick}>selection</button>
					// 	<ul className={'menu' + (this.state.selectedMenu === 'selection' ? ' selected' : '')}>
					// 		<li className={this.state.selectedMenu === 'selection' && this.state.selectedItem === 'split' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>split</button></li>
					// 		<li className={this.state.selectedMenu === 'selection' && this.state.selectedItem === 'add' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>add</button></li>
					// 		<li className={this.state.selectedMenu === 'selection' && this.state.selectedItem === 'single' ? 'current' : ''}><button onClick={this.handleItemClick} className='menubutton' onMouseEnter={this.handleItemMouseEnter}>single</button></li>
					// 	</ul>
					// </li>
