var lc = lc || {}; 
lc.getSliderKey = function(os) {

	var key = {};
	key.Name        = os == 'Mac' ? 'Alt-Alt' : (os == 'Linux' ?  'Ctrl' : 'Ctrl-Ctrl' ); 
	key.DisplayName = os == 'Mac' ?     'Alt' : (os == 'Linux' ?  'Ctrl' :      'Ctrl' ); 
	key.Code        = os == 'Mac' ?        18 : (os == 'Linux' ?      17 :          17 );

	return key;

};