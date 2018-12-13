var parsedate = d3.utcParse("%Y-%B");

var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d");

var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = canvas.width - margin.left - margin.right,
    height = canvas.height - margin.top - margin.bottom;

var x = d3.scaleUtc()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var symbol = d3.symbol()
    .context(context);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); })
    .curve(kernelSmooth, 50, 100)
    .context(context);

context.translate(margin.left, margin.top);

d3.requestCsv("data.csv", function(d) {
  d.date = parseTime(d.date);
  d.count = +d.count;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; })).nice(d3.utcDay);
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

  context.globalAlpha = 0.5;
  context.lineWidth = 1;
  context.strokeStyle = "steelblue";
  data.forEach(function(d) {
    context.save();
    context.translate(x(d.date), y(d.count));
    context.beginPath();
    symbol(d);
    context.stroke();
    context.restore();
  });

  context.beginPath();
  line(data);
  context.globalAlpha = 1;
  context.lineWidth = 2;
  context.strokeStyle = "black";
  context.stroke();
});

function epanechnikov(u) {
  return (u *= u) <= 1 ? 0.75 * (1 - u) : 0;
}

function kernelSmooth(context, bandwidth, count) {
  var linear = d3.curveLinear(context), x0 = Infinity, x1 = -x0, xv, yv;
  return {
    lineStart: function() {
      xv = [], yv = [];
    },
    lineEnd: function() {
      linear.lineStart();
      for (var x = x0, dx = (x1 - x0) / count; x <= x1; x += dx) {
        for (var j = 0, yi = 0, wi = 0, m = xv.length; j < m; ++j) {
          var wji = epanechnikov((xv[j] - x) / bandwidth);
          wi += wji, yi += yv[j] * wji;
        }
        linear.point(x, yi / wi);
      }
      linear.lineEnd();
    },
    point: function(x, y) {
      xv.push(x = +x), yv.push(+y);
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
    }
  };
}
