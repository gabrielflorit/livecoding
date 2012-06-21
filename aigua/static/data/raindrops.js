// from http://bl.ocks.org/849853

var randomNumbers;
if ($('svg').data('randomNumbers')) {
    randomNumbers = $('svg').data('randomNumbers');
} else {
    randomNumbers = [];
    for (var i = 0; i < 500; i++) {
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

var w = $('svg').width(),
    h = $('svg').height();

var svg = d3.select('svg').append("g")
  .attr("width", w)
  .attr("height", h)
  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

var gradient = svg.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "20%")
    .attr("x2", "20%")
    .attr("y2", "100%");

gradient.append("svg:stop")
    .attr("offset", "20%")
    .attr("stop-color", "#ccf");

gradient.append("svg:stop")
    .attr("offset", "50%")
    .attr("stop-color", "#1C425C");

gradient.append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", "#19162B");

// could use transparent gradient overlay to vary raindrop color
svg.selectAll("path")
    .data(d3.range(0, 358, 1))
  .enter().append("svg:path")
    .attr("fill", "url(#gradient)")
    .attr("d", function() { return raindrop(10 + getNextRandomNumber() * 200); })
    .attr("transform", function(d) {
      return "rotate(" + d + ")"
          + "translate(" + (h / 4 + getNextRandomNumber() * h / 6) + ",0)"
          + "rotate(90)";
    });

// size is linearly proportional to square pixels (not exact, yet)
function raindrop(size) {
  var r = Math.sqrt(size / Math.PI);
  return "M" + r + ",0"
      + "A" + r + "," + r + " 0 1,1 " + -r + ",0"
      + "C" + -r + "," + -r + " 0," + -r + " 0," + -3*r
      + "C0," + -r + " " + r + "," + -r + " " + r + ",0"
      + "Z";
}
