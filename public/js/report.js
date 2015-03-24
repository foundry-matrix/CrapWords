function fetch(){
    $.getJSON('http://localhost:8000/fetchdata', function(data){
      if (data){
        create(data);
      }
    });
}

fetch();

function create(dataset){
  console.log(dataset);

  var margin = {top: 40, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1)
      .domain(dataset.map(function(d) { return d.keyword; }));

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(dataset, function(d) { return d.rank; })]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Rank:</strong> <span style='color:red'>" + d.rank + "</span>";
    })

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Rank");

  svg.selectAll(".bar")
      .data(dataset)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.keyword); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.rank); })
      .attr("height", function(d) { return height - y(d.rank); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  function type(d) {
    d.rank = +d.rank;
    return d;
  }

}