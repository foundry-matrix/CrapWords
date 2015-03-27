$(document).ready(function(){
  var url = $(location).attr('href');
  var id = url.split('/');
  fetch(id);
  
  function fetch(id){
    $.getJSON('http://'+id[2]+'/fetchdata/'+id[3], function(data){
      if (data){
          console.log("TABLE");
        table(data);
          console.log("piearray");
        createPieArray(data);
          console.log("barchart");
        barChart(data);
          console.log("piechart");
        pieChart(data);
      }
    });
  }

  function table(allData){
    console.log("rendering table");
    $("#reporttable").append(allData.html);
    $("#appname").append(allData.appName);
  }


  function createPieArray(data){
    console.log("creating pie array");
    allKeywords = JSON.parse(data.keywords);
    var approved_keywords = [];
    var disapproved_keywords = [];
    allKeywords.forEach(function(keywordObject){
      if (keywordObject.rank >= 15 && keywordObject.single_keyword === true && keywordObject.good_combinations === false){
        disapproved_keywords.push(keywordObject.keyword);
      }
      else if (keywordObject.rank >= 15 && keywordObject.single_keyword === true && keywordObject.good_combinations === true){
        approved_keywords.push(keywordObject.keyword);
      }
      else if (keywordObject.rank < 15 && keywordObject.single_keyword === true){
        approved_keywords.push(keywordObject.keyword);
      }
    });
    console.log('approved_keywords:', approved_keywords);
    console.log('disapproved_keywords:', disapproved_keywords);

    
    createPieText(approved_keywords,disapproved_keywords);
  }

  function createPieText(approved_keywords,disapproved_keywords){
    console.log("creating pie text");

    var data = [approved_keywords.length, disapproved_keywords.length];
    var itunes_keywords_length = parseInt(data[0]) + parseInt(data[1]);

    $("#pietext").append('<h3 class="pie_title">Approved keywords</h3>');
    $("#pietext").append("<p class='pie_text'>" + parseInt(data[0]) + " of the " + itunes_keywords_length + " keywords you've added in iTunes are ranked well. However, we don't have data on how trafficed they are. This is up to you to figure out.</p>");
    
    approved_keywords.forEach(function(approved_word){
    $("#pietext").append('<li class="item">'+ approved_word +'</li>');
    });

    $("#pietext").append('<h3 class="pie_title">Crappy keywords</h3>');
    $("#pietext").append("<p class='pie_text'>" + parseInt(data[1]) + " of the " + itunes_keywords_length + " keywords you've added in iTunes are crapwords and should be swapped out.</p>");
   

    disapproved_keywords.forEach(function(crapword){
    $("#pietext").append('<li class="item red">'+ crapword+'</li>');
    });

  }

  function pieChart(data){
    console.log("rendering pie");

    var piedata = data.pieData;

    var r = 100;
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
          .value(function(d){return d;})

    var arcs = group.selectAll(".arc")
            .data(pie(piedata))
            .enter()
            .append("g")
            .attr("class","arc")
            
          arcs.append("path")
            .attr("d", arc)
            .attr("fill", function(d){return color(d.data);})
    
    $("#pietext").append('<h3 class="pie_title">Keyword quality ratio</h3>');
    $("#pietext").append("<p class='pie_text'>Below is a pie chart displaying you the ratio between the approved keywords and the crappy ones.</p>");

    }

  function barChart(data){
    console.log("rendering bar");

    var dataset = JSON.parse(data.keywords);
    var margin = {top: 40, right: 20, bottom:150, left: 40},
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
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .style("font-size","15px")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")

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