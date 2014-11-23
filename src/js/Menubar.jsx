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
				ModeChange: 'ModeChange'
			};
		}
	},

	getInitialState: function() {
		return {
			isActive: false,
			selectedMenu: null,
			selectedItem: null
		};
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
						<button onMouseEnter={this.handleMenuMouseEnter} onClick={this.handleMenuClick}>file</button>
						<ul className={'menu' + (this.state.selectedMenu === 'file' ? ' selected' : '')}>
							<li className={this.state.selectedMenu === 'file' && this.state.selectedItem === 'new file' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>new file</button></li>
							<li className={this.state.selectedMenu === 'file' && this.state.selectedItem === 'open...' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>open...</button></li>
							<li className={this.state.selectedMenu === 'file' && this.state.selectedItem === 'open recent' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>open recent</button></li>
						</ul>
					</li>
					<li className={this.state.selectedMenu === 'edit' ? 'current' : ''}>
						<button onMouseEnter={this.handleMenuMouseEnter} onClick={this.handleMenuClick}>edit</button>
						<ul className={'menu' + (this.state.selectedMenu === 'edit' ? ' selected' : '')}>
							<li className={this.state.selectedMenu === 'edit' && this.state.selectedItem === 'undo' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>undo</button></li>
							<li className={this.state.selectedMenu === 'edit' && this.state.selectedItem === 'repeat' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>repeat</button></li>
							<li className={this.state.selectedMenu === 'edit' && this.state.selectedItem === 'more' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>more</button></li>
						</ul>
					</li>
					<li className={this.state.selectedMenu === 'selection' ? 'current' : ''}>
						<button onMouseEnter={this.handleMenuMouseEnter} onClick={this.handleMenuClick}>selection</button>
						<ul className={'menu' + (this.state.selectedMenu === 'selection' ? ' selected' : '')}>
							<li className={this.state.selectedMenu === 'selection' && this.state.selectedItem === 'split' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>split</button></li>
							<li className={this.state.selectedMenu === 'selection' && this.state.selectedItem === 'add' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>add</button></li>
							<li className={this.state.selectedMenu === 'selection' && this.state.selectedItem === 'single' ? 'current' : ''}><button onMouseEnter={this.handleItemMouseEnter}>single</button></li>
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

	handleItemMouseEnter: function(e) {

		var item = this.state.isActive ? e.currentTarget.textContent : null;

		this.setState({
			selectedItem: item
		});
	},

	handleMenuMouseEnter: function(e) {

		var menu = this.state.isActive ? e.currentTarget.textContent : null;

		this.setState({
			selectedMenu: menu,
			selectedItem: null
		});
	},

	handleMenuClick: function(e) {

		var isActive = !this.state.isActive;

		var menu = isActive ? e.currentTarget.textContent : null;

		this.setState({
			isActive: isActive,
			selectedMenu: menu
		});
	},

	// Handle mode button click.
	handleModeClick: function(e) {
		PubSub.publish(MenuBar.topics().ModeChange, e.currentTarget.textContent);
	}

});

module.exports = MenuBar;