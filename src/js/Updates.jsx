var React = require('react');

var Updates = React.createClass({

	render: function() {
		return (
			<div className='updates'>
				<header>
					<h3>Updates</h3>
					<button className='close'>×</button>
				</header>
				<ul>
					<li>
						<time dateTime='2014-11-11'>(November 09)</time> Gist integration - save your work as an anonymous, public, or private gist.
					</li>
					<li>
						<time dateTime='2014-11-11'>(November 03)</time> Ability to see your work separate from the editor.
					</li>
					<li>
						<time dateTime='2014-11-11'>(November 01)</time> Popup slider for numerical variables and hexadecimal (color) strings.
					</li>
				</ul>
			</div>
		);
	}

});

module.exports = Updates;