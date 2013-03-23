var lc = lc || {}; 
lc.getSliderKey = function() {

	var key = {};

	switch(BrowserDetect.OS) {

		case 'Mac':
			key.Name = 'Alt-Alt'; 
			key.DisplayName = 'Alt'; 
			key.Code = 18;
		break;

		case 'Linux':
			key.Name = 'Ctrl';
			key.DisplayName = 'Ctrl';
			key.Code = 17;
		break;

		// windows
		default:
			key.Name = 'Ctrl-Ctrl';
			key.DisplayName = 'Ctrl';
			key.Code = 17;
		break;
	}

	return key;

};