// this drives the 'keyboard shortcuts' found in the 'help' dropdown

var lc = lc || {};
lc.snippets = [
	{ keyword: 'bor'   , snippet: 'border: solid #FF0000 1px;' , mode: 'css' },
	{ keyword: 'bac'   , snippet: 'background: #FF0000;'       , mode: 'css' },
	{ keyword: 'mar'   , snippet: 'margin: 0em 0em 0em 0em;'   , mode: 'css' },
	{ keyword: 'pad'   , snippet: 'padding: 0em 0em 0em 0em;'  , mode: 'css' },
	{ keyword: 'each'  , snippet: '.each(function(v, i) {})'   , mode: 'javascript' },
	{ keyword: 'map'   , snippet: '.map(function(v, i) {})'    , mode: 'javascript' },
	{ keyword: 'find'  , snippet: '.find(function(v, i) {})'   , mode: 'javascript' },
	{ keyword: 'filter', snippet: '.filter(function(v, i) {})' , mode: 'javascript' },
	{ keyword: 'reject', snippet: '.reject(function(v, i) {})' , mode: 'javascript' },
	{ keyword: 'sort'  , snippet: '.sortBy(function(v, i) {})' , mode: 'javascript' },
	{ keyword: 'group' , snippet: '.groupBy(function(v, i) {})', mode: 'javascript' },
	{ keyword: 'count' , snippet: '.countBy(function(v, i) {})', mode: 'javascript' }
];
