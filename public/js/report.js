$(document).ready(function(){
  var testdata = [{"keyword":"game", "rank":6},{"keyword":"fun", "rank":10},{"keyword":"child", "rank":2},{"keyword":"racing", "rank":15},{"keyword":"fast", "rank":12},{"keyword":"wow", "rank":13}];
  var url = $(location).attr('href');
  var id = url.split('/');
  fetch(id);
  
  // table(testdata);
  // pieChart(testdata);
  // barChart(testdata);

  function fetch(id){
    $.getJSON('http://'+id[2]+'/fetchdata/'+id[3], function(data){
      if (data){
        table(data);
        pieChart(data);
        barChart(data);
      }
    });
  }

  function table(allData){
    var data = allData.keywords;
    for (var i=0; i<data.length; i++){
      var ranklevel;
      if(data[i].rank <= 10){
        ranklevel = "Keyword is well ranked!";
      } else {
        ranklevel = "This keyword is crap. Swap it out!";
      }
      $("#tablebody").append("<tr><td>" + data[i].keyword + "</td><td>" + data[i].rank + "</td><td>" + ranklevel + "</td></tr");
    }
  }

  function pieChart(allData){
    var data = allData.keywords;
    var goodwords = [];
    var badwords = [];

    goodwords.push("test","test","test","test","test");
    for (var i=0; i<data.length; i++){
      if(data[i].rank < 10){
        goodwords.push(data[i].keyword);
      } else {
        badwords.push(data[i].keyword);
      }
    }

    var piedata = [goodwords.length, badwords.length];

    var r =100;
    var color = d3.scale.ordinal()
          .range(["rgb(148, 210, 142)", "#D84343"]);

    var canvas = d3.select("#piechart").append("svg")
                .attr("width", 200)
                .attr("height", 200)
                .attr("class", "svg");
    var arc = d3.svg.arc()
          .innerRadius(r-40)
          .outerRadius(r);

    var group = canvas.append("g")
            .attr("transform", "translate(100,100)");

    var pie = d3.layout.pie()
          .value(function(d){console.log(d); return d.rank;})

    var arcs = group.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class","arc")
            
          arcs.append("path")
            .attr("d", arc)
            .attr("fill", function(d){ console.log(d); return color(d.data.rank);})
            .on("mouseenter", function(d) {
                text = arcs.append("text")
                  .attr("dy", ".5em")
                  .style("text-anchor", "middle")
                  .style("fill", "black")
                  .attr("class", "on")
                  .text(d.data.keyword + " - " + d.data.rank);
            })
            .on("mouseout", function(d) {
                text.remove();
            });

  }

  function barChart(allData){
    var dataset = allData.keywords;
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

    var svg = d3.select("#barchart").append("svg")
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


});