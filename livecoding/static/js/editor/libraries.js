var libraries = (function () {

	var container = $('#menu .item h2:contains("libraries")').next();

	var list = [
		{
			"name": "agentscript",
			"obj": "agentscript",
			"version": "0.6"
		},
		{
			"name": "crossfilter",
			"obj": "crossfilter",
			"version": "1.2.0"
		},
		{
			"name": "canvas2image",
			"obj": "Canvas2Image",
			"version": "0.1"
		},
		{
			"name": "CreateJS",
			"obj": "createjs",
			"version": "none"
		},
		{
			"name": "d3",
			"obj": "d3",
			"version": "3.1.10"
		},
		{
			"name": "d3.chart",
			"obj": "d3.chart",
			"version": "0.1.0"
		},
		{
			"name": "d3.hexbin",
			"obj": "d3.hexbin",
			"version": "none"
		},
		{
			"name": "Handlebars",
			"obj": "Handlebars",
			"version": "1.0.0"
		},
		{
			"name": "heatmap",
			"obj": "h337",
			"version": "1.0"
		},
		{
			"name": "Highcharts",
			"obj": "Highcharts",
			"version": "3.0.2"
		},
		{
			"name": "JointJS",
			"obj": "joint",
			"version": "0.8.0"
		},
		{
			"name": "KineticJS",
			"obj": "Kinetic",
			"version": "4.5.1"
		},
		{
			"name": "Leaflet",
			"obj": "L",
			"version": "0.6-dev"
		},
		{
			"name": "lodash",
			"obj": "_",
			"version": "1.2.1"
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
			"version": "none"
		},
		{
			"name": "skrollr",
			"obj": "skrollr",
			"version": "0.6.9"
		},
		{
			"name": "three.js",
			"obj": "THREE",
			"version": "58"
		},
		{
			"name": "TopoJSON",
			"obj": "topojson",
			"version": "1.1.3"
		},
		{
			"name": "Underscore",
			"obj": "_",
			"version": "1.4.4"
		},
		{
			"name": "vega",
			"obj": "vg",
			"version": "1.3.0"
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
