// mouseover the graph!
// from http://bl.ocks.org/1062544

var w = $('svg').width(),
    h = $('svg').height(),
    z = d3.scale.category20c(),
    i = 0;

var svg = d3.select('svg')
    .attr("width", w)
    .attr("height", h)
    .style("pointer-events", "all")
    .on("mousemove", particle);

function particle() {
  var m = d3.svg.mouse(this);

  svg.append("svg:circle")
      .attr("cx", m[0])
      .attr("cy", m[1])
      .attr("r", 1e-6)
      .style("stroke", z(++i))
      .style("stroke-opacity", 1)
    .transition()
      .duration(2000)
      .ease(Math.sqrt)
      .attr("r", 100)
      .style("stroke-opacity", 1e-6)
      .remove();
}