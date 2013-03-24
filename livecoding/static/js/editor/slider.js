var slider = slider || {}; 

slider = {};

slider.borderWidth        = 2;
slider.lineHeight         = 19;
slider.miniColorsSelector = '.miniColors-selector';
slider.startingBarWidth   = 300;
slider.triangleHeight     = 5;
slider.triangleWidth      = 12;

slider.init = function() {

	// set various dom elements
	slider.ball               = $('#ball');
	slider.bar                = $('#bar');
	slider.filler             = $('#filler');
	slider.handle             = $('#handle');
	slider.marker             = $('#marker');
	slider.miniColorsTrigger  = $('.miniColors-trigger');
	slider.slider             = $('#slider');
	slider.triangle           = $('#triangle');

	// set the handle's default width
	slider.handle.width(slider.startingBarWidth);

	// set the bar's border width and default width
	slider.bar.css('border-width', slider.borderWidth);
	slider.bar.width(slider.startingBarWidth);

	// set the triangle
	slider.triangle.css('border-width',
		[slider.triangleHeight, slider.triangleWidth, 0, slider.triangleWidth].join('px '));
};

slider.resetBar = function(markerCenter) {
	slider.bar.width(slider.startingBarWidth);
	slider.bar.css('left', markerCenter - slider.startingBarWidth/2 - slider.borderWidth);
	slider.filler.removeClass('filler-edge-left');
	slider.filler.removeClass('filler-edge-right');
};


