var lc = lc || {}; 
lc.getExtraKeys = function(os) {

	var extraKeys = {};

	// {extraKeys[os == 'Mac' ? 'Cmd-/' : (os == 'Linux' ? 'Ctrl-/' : 'Ctrl-/')]  = lc.codemirrorUtil.comment};
	// {extraKeys[os == 'Mac' ? 'Cmd-.' : (os == 'Linux' ? 'Ctrl-.' : 'Ctrl-.')]  = lc.codemirrorUtil.uncomment};

	{extraKeys[os == 'Mac' ? 'Tab'   : (os == 'Linux' ? 'Tab'    : 'Tab')]     = lc.replaceSnippet};

	return extraKeys;

};

lc.initGlobalKeys = function(os) {

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? 'alt+s' : (os == 'Linux' ? 'ctrl+s' : 'ctrl+s'), function() {
			aigua.saveAsUserOrAnonymously();
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? 'meta+\\' : (os == 'Linux' ? 'ctrl+\\' : 'ctrl+\\'), function() {
			aigua.pauseResumeExecution();
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? 'meta+9' : (os == 'Linux' ? 'ctrl+7' : 'ctrl+7'), function() {
			aigua.startAnimate();
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? 'meta+0' : (os == 'Linux' ? 'ctrl+8' : 'ctrl+8'), function() {
			aigua.stopAnimate();
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? 'meta+1' : (os == 'Linux' ? 'ctrl+1' : 'ctrl+1'), function() {
			modes.switchTo('html');
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? 'meta+2' : (os == 'Linux' ? 'ctrl+2' : 'ctrl+2'), function() {
			modes.switchTo('javascript');
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? 'meta+3' : (os == 'Linux' ? 'ctrl+3' : 'ctrl+3'), function() {
			modes.switchTo('css');
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? 'meta+4' : (os == 'Linux' ? 'ctrl+4' : 'ctrl+4'), function() {
			modes.switchTo('json');
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? "meta+'" : (os == 'Linux' ? "ctrl+'" : "ctrl+'"), function() {
			layouts.previous();
			return false;
		});
	});

	_.each([$(document), $('textarea')], function(v) {
		v.bind('keydown', os == 'Mac' ? "meta+;" : (os == 'Linux' ? "ctrl+;" : "ctrl+;"), function() {
			layouts.next();
			return false;
		});
	});

};











