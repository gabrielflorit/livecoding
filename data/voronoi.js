// from http://mbostock.github.com/d3/ex/voronoi.html

var randomNumbers;
if ($('svg').data('randomNumbers')) {
    randomNumbers = $('svg').data('randomNumbers');
} else {
    randomNumbers = [];
    for (var i = 0; i < 1000; i++) {
        randomNumbers.push(Math.random());
    }
    randomNumbers = $('svg').data('randomNumbers', randomNumbers);
}

var randomIndex = 0;
function getNextRandomNumber() {
    if (randomIndex >= randomNumbers.length) {
        randomIndex = 0;
    }
    return randomNumbers[randomIndex++];
}

var width = $('svg').width(),
    height = $('svg').height();

var svg = d3.select('svg').append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "PiYG")
    .on("mousemove", update);

var vertices = d3.range(100).map(function(d) {
    return [getNextRandomNumber() * width, getNextRandomNumber() * height];
});

svg.selectAll("path")
    .data(d3.geom.voronoi(vertices))
    .enter().append("path")
    .attr("class", function(d, i) { return i ? "q" + (i % 9) + "-9" : null; })
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

svg.selectAll("circle")
    .data(vertices.slice(1))
    .enter().append("circle")
    .attr("transform", function(d) { return "translate(" + d + ")"; })
    .attr("r", 2);

function update() {
    vertices[0] = d3.mouse(this);
    svg.selectAll("path")
        .data(d3.geom.voronoi(vertices)
        .map(function(d) { return "M" + d.join("L") + "Z"; }))
        .filter(function(d) { return this.getAttribute("d") != d; })
        .attr("d", function(d) { return d; });
}