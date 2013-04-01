var libraries = (function () {

	var container = $('#menu .item h2:contains("libraries")').next();

	var list = [
		{ name: 'd3'       , version: '3.1.4' },
		{ name: 'KineticJS', version: '4.4.0' }
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: '', file: '.js', version: '' },
		// { name: 'crossfilter'      , obj: 'crossfilter' },
		// { name: 'd3'               , obj: 'd3' },
		// { name: 'iScroll'          , obj: 'iScroll' },
		// { name: 'Handlebars'       , obj: 'Handlebars' },
		// { name: 'Highcharts'       , obj: 'Highcharts' },
		// { name: 'KineticJS'        , obj: 'Kinetic' },
		// { name: 'jQuery.Flickable' , obj: '$.fn.flickable' },
		// { name: 'jQuery.TouchSwipe', obj: '$.fn.swipe' },
		// { name: 'Leaflet'          , obj: 'L' },
		// { name: 'Raphael'          , obj: 'Raphael' },
		// { name: 'SwipeView'        , obj: 'SwipeView' },
		// { name: 'Processing'       , obj: 'Processing' },
		// { name: 'three.js'         , obj: 'THREE' },
		// { name: 'TopoJSON'         , obj: 'topojson' },
		// { name: 'Underscore'       , obj: '_' }
	];

	function init() {

		// populate dropdown
		var html = _.map(list, function(v) {
			return '<li rel="' + v.name + '">' + v.name + ' (' + v.version + ')</li>';
		}).join('');

		container.append(html);

	}

	function getSelected() {

		// get checked items from the dropdown
		var selectedLibraries = $('li[class*="selected"]', container);
		return _.map(selectedLibraries, function(value) {
			return $(value).attr('rel');
		});

	}

	function toggleByName(name) {

		var library = _.findWhere(list, {name:name});

		var isSelected = $('li', container).filter(function() {
			return $(this).attr('rel') == library.name;
		}).hasClass('selected');

		if (isSelected) {
			removeOne(library);
		} else {
			addOne(library);
		}

		aigua.setToDirty();

	}

	function addOne(library) {

		// add library to dom
		frames[0].livecoding.addJs(library);

		// find the library menu item and select it
		$('li', container).filter(function() {
			return $(this).attr('rel') == library.name;
		}).addClass('selected');

	}

	function removeOne(library) {

		// remove library from dom
		frames[0].livecoding.removeJs(library);

		// find the library menu item and deselect it
		$('li', container).filter(function() {
			return $(this).attr('rel') == library.name;
		}).removeClass('selected');

	}

	function addManyByName(names) {

		var libraries = _.map(names, function(v) {
			return _.findWhere(list, {name: v});
		});

		addMany(libraries);

	}

	function addMany(libraries) {
		_.each(libraries, addOne);
	}

	function removeMany(libraries) {
		_.each(libraries, removeOne);
	}

	function removeAll() {
		removeMany(list);
	}

	return {
		init: init,
		list: list,
		getSelected: getSelected,
		addMany: addManyByName,
		removeAll: removeAll,
		toggle: toggleByName
	};

}());
