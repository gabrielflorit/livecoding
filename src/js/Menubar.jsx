var React = require('react');

var FileMenu = require('./FileMenu.jsx');
var ModeMenu = require('./ModeMenu.jsx');

var MenuBar = React.createClass({

	render: function() {
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
							<li><button>html</button></li>
							<li><button>js</button></li>
							<li><button>css</button></li>
						</ul>
					</li>
				</ul>
			</div>
		);
	}

});

module.exports = MenuBar;