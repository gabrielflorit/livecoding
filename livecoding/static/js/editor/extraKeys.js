var lc = lc || {}; 
lc.getExtraKeys = function() {

	var extraKeys = {};

	switch(BrowserDetect.OS) {

		case 'Mac':
			{extraKeys['Alt-S']  = aigua.saveAsUserOrAnonymously};
			{extraKeys['Cmd-/']  = lc.codemirrorUtil.comment};
			{extraKeys['Cmd-.']  = lc.codemirrorUtil.uncomment};
			{extraKeys['Cmd-\\'] = aigua.pauseResumeExecution};
			{extraKeys['Cmd-9']  = aigua.startAnimate};
			{extraKeys['Cmd-0']  = aigua.stopAnimate};

			{extraKeys['Cmd-1']  = aigua.switchToHtml};
			{extraKeys['Cmd-2']  = aigua.switchToJavaScript};
			{extraKeys['Cmd-3']  = aigua.switchToCss};
			{extraKeys['Cmd-4']  = aigua.switchToJson};

			{extraKeys["Cmd-'"]  = aigua.switchToPreviousLayout};
			{extraKeys['Cmd-;']  = aigua.switchToNextLayout};

			{extraKeys['Tab']    = aigua.replaceSnippet};
		break;

		case 'Linux':
			key.Name = 'Ctrl';
			key.DisplayName = 'Ctrl';
			key.Code = 17;
		break;

		// windows
		default:
			{extraKeys['Ctrl-S']  = aigua.saveAsUserOrAnonymously};
			{extraKeys['Ctrl-/']  = lc.codemirrorUtil.comment};
			{extraKeys['Ctrl-.']  = lc.codemirrorUtil.uncomment};
			{extraKeys['Ctrl-\\'] = aigua.pauseResumeExecution};
			// {extraKeys['Cmd-9']  = aigua.startAnimate};
			// {extraKeys['Cmd-0']  = aigua.stopAnimate};

			{extraKeys['Ctrl-1']  = aigua.switchToHtml};
			{extraKeys['Ctrl-2']  = aigua.switchToJavaScript};
			{extraKeys['Ctrl-3']  = aigua.switchToCss};
			{extraKeys['Ctrl-4']  = aigua.switchToJson};

			{extraKeys["Ctrl-'"]  = aigua.switchToPreviousLayout};
			{extraKeys['Ctrl-;']  = aigua.switchToNextLayout};

			{extraKeys['Tab']     = aigua.replaceSnippet};
		break;
	}

	return extraKeys;

};