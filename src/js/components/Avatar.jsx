// This component renders the avatar.

// Include React (with addons).
var React = require('react');

// Include libraries.
var PubSub = require('pubsub-js');
var util   = require('../util/util.js');

// Create the component.
var Avatar = React.createClass({

	render: function() {

		var avatarUrl = this.props.userAvatarUrl || 'user.png';

		return (
			<div className='avatar'>
				<a href={this.props.userUrl}><img src={avatarUrl} /></a>
			</div>
		);
	}


});

module.exports = Avatar;