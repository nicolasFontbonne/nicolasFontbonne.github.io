RepDemPlot();

function RepDemPlot() {

var h = 500;
//var svg = d3.select("#RepDemPlot").append("svg");
var margin = {top: 20, right: 20, bottom: 110, left: 40},
    width = document.getElementById('RepDemPlot').clientWidth - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

var svg = d3.select("#RepDemPlot").append("svg").attr("width", document.getElementById('RepDemPlot').clientWidth).attr("height", h);

var parseDate = d3.timeParse("%Y-%m");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);



var curve_rep = d3.line()
    .curve(d3.curveStep)
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Republican); });

var curve_dem = d3.line()
    .curve(d3.curveStep)
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Democrat); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/RepDem.csv", type, function(error, data) {
  if (error) throw error;
  console.log(data);
  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain([0, 100]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("class", "curve_rep")
      .attr("d", curve_rep);

  focus.append("path")
      .datum(data)
      .attr("class", "curve_dem")
      .attr("d", curve_dem);

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);
});

function type(d) {
  d.Date = parseDate(d.Date);
  d.Republican = +d.Republican;
  d.Democrat = +d.Democrat;

  return d;
}

}
