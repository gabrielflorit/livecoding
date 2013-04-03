clean:
	rm *.js

install:
	curl -o d3.js          'http://d3js.org/d3.v3.min.js'
	curl -o KineticJS.js   'http://d3lp1msu2r81bx.cloudfront.net/kjs/js/lib/kinetic-v4.4.0.min.js'
	curl -o Highcharts.js  'http://github.highcharts.com/master/highcharts.js'
	curl -o Underscore.js  'http://underscorejs.org/underscore-min.js'
	curl -o TopoJSON.js    'https://raw.github.com/mbostock/topojson/master/topojson.js'
	curl -o crossfilter.js 'https://raw.github.com/square/crossfilter/master/crossfilter.js'
	curl -o Leaflet.js     'https://raw.github.com/Leaflet/Leaflet/master/dist/leaflet.js'
	curl -o Raphael.js     'https://raw.github.com/DmitryBaranovskiy/raphael/master/raphael-min.js'
	curl -o Handlebars.js  'https://raw.github.com/wycats/handlebars.js/master/dist/handlebars.js'
	curl -o Processing.js  'http://cloud.github.com/downloads/processing-js/processing-js/processing-1.4.1-api.min.js'
	curl -o three.js.js    'http://mrdoob.github.com/three.js/build/three.min.js'
	sed -i.bak "s/'use strict';//" three.js.js
	rm *.bak
	curl -o CreateJS.js    'http://code.createjs.com/createjs-2013.02.12.min.js'
	curl -o Rickshaw.js    'https://raw.github.com/gabrielflorit/rickshaw/master/rickshaw.js'
	curl -o vega.js        'https://raw.github.com/trifacta/vega/master/vega.min.js'
