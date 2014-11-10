require('../css/menubar.css');
var React   = require('react');

var PubSub  = require('pubsub-js');

var Menubar = React.createClass({

	render: function() {
		return (
			<div className='menubar'>
				menu
			</div>
		);
	}

});

module.exports = Menubar;