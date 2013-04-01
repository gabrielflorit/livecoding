var libraries = (function () {

	var container = $('#menu .item h2:contains("libraries")').next();

	var list = [
	    {
	        "name": "crossfilter",
	        "obj": "crossfilter",
	        "version": "1.1.3"
	    },
	    {
	        "name": "CreateJS",
	        "obj": "createjs",
	        "version": "2013.02.12"
	    },
	    {
	        "name": "d3",
	        "obj": "d3",
	        "version": "3.1.4"
	    },
	    {
	        "name": "Handlebars",
	        "obj": "Handlebars",
	        "version": "1.0.0-rc.3"
	    },
	    {
	        "name": "Highcharts",
	        "obj": "Highcharts",
	        "version": "3.0.0"
	    },
	    {
	        "name": "KineticJS",
	        "obj": "Kinetic",
	        "version": "4.4.0"
	    },
	    {
	        "name": "Leaflet",
	        "obj": "L",
	        "version": "0.6-dev"
	    },
	    {
	        "name": "Processing",
	        "obj": "Processing",
	        "version": "1.4.1-API"
	    },
	    {
	        "name": "Raphael",
	        "obj": "Raphael",
	        "version": "2.1.0"
	    },
	    {
	        "name": "Rickshaw",
	        "obj": "Rickshaw",
	        "version": "1.1.2"
	    },
	    {
	        "name": "three.js",
	        "obj": "THREE",
	        "version": "57"
	    },
	    {
	        "name": "TopoJSON",
	        "obj": "topojson",
	        "version": "0.0.39"
	    },
	    {
	        "name": "Underscore",
	        "obj": "_",
	        "version": "1.4.4"
	    }
	];

	function init() {

		// populate dropdown
		var html = _.map(list, function(v) {
			return '<li rel="' + v.name + '">' + v.name + ' (v' + v.version + ')</li>';
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
