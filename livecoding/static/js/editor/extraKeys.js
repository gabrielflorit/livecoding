var lc = lc || {}; 
lc.getExtraKeys = function(os) {

	var extraKeys = {};

	{extraKeys[os == 'Mac' ? 'Alt-S' : (os == 'Linux' ? 'Ctrl-S' : 'Ctrl-S')]  = aigua.saveAsUserOrAnonymously};
	{extraKeys[os == 'Mac' ? 'Cmd-/' : (os == 'Linux' ? 'Ctrl-/' : 'Ctrl-/')]  = lc.codemirrorUtil.comment};
	{extraKeys[os == 'Mac' ? 'Cmd-.' : (os == 'Linux' ? 'Ctrl-.' : 'Ctrl-.')]  = lc.codemirrorUtil.uncomment};
	{extraKeys[os == 'Mac' ? 'Cmd-\\': (os == 'Linux' ? 'Ctrl-\\': 'Ctrl-\\')] = aigua.pauseResumeExecution};
	{extraKeys[os == 'Mac' ? 'Cmd-9' : (os == 'Linux' ? 'Ctrl-7' : 'Ctrl-7')]  = aigua.startAnimate};
	{extraKeys[os == 'Mac' ? 'Cmd-0' : (os == 'Linux' ? 'Ctrl-8' : 'Ctrl-8')]  = aigua.stopAnimate};

	{extraKeys[os == 'Mac' ? 'Cmd-1' : (os == 'Linux' ? 'Ctrl-1' : 'Ctrl-1')]  = aigua.switchToHtml};
	{extraKeys[os == 'Mac' ? 'Cmd-2' : (os == 'Linux' ? 'Ctrl-2' : 'Ctrl-2')]  = aigua.switchToJavaScript};
	{extraKeys[os == 'Mac' ? 'Cmd-3' : (os == 'Linux' ? 'Ctrl-3' : 'Ctrl-3')]  = aigua.switchToCss};
	{extraKeys[os == 'Mac' ? 'Cmd-4' : (os == 'Linux' ? 'Ctrl-4' : 'Ctrl-4')]  = aigua.switchToJson};

	{extraKeys[os == 'Mac' ? "Cmd-'" : (os == 'Linux' ? "Ctrl-'" : "Ctrl-'")]  = aigua.switchToPreviousLayout};
	{extraKeys[os == 'Mac' ? 'Cmd-;' : (os == 'Linux' ? 'Ctrl-;' : 'Ctrl-;')]  = aigua.switchToNextLayout};

	{extraKeys[os == 'Mac' ? 'Tab'   : (os == 'Linux' ? 'Tab'    : 'Tab')]     = lc.replaceSnippet};

	return extraKeys;

};