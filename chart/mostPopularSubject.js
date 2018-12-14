mostPopularSubject();

function mostPopularSubject() {
//<div class="col-lg-10 col-md-10" id="chart"></div>
var h = 300;
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = document.getElementById('mostPopularSubject').clientWidth - margin.left - margin.right,
    height = h - margin.top - margin.bottom

var svg = d3.select("#mostPopularSubject").append("svg").attr("width", document.getElementById('mostPopularSubject').clientWidth).attr("height", h),
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// set x scale
var x_MPS = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

// set y scale
var y_MPS = d3.scaleLinear()
    .rangeRound([height, 0]);

// set the colors
var z = d3.scaleOrdinal().range(["#FEF035", "#F1F3F2"]);

// load the csv and create the chart
d3.csv("data/mostPopularSubject.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  console.log(d)
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);
  console.log("key : " + keys);

  data.sort(function(a, b) { return b.total - a.total; });
  x_MPS.domain(data.map(function(d) { return d.Label; }));
  y_MPS.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x_MPS(d.data.Label); })
      .attr("y", function(d) { return y_MPS(d[1]); })
      .attr("height", function(d) { return y_MPS(d[0]) - y_MPS(d[1]); })
      .attr("width", x_MPS.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_MPS));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y_MPS).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y_MPS(y_MPS.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

});
}
