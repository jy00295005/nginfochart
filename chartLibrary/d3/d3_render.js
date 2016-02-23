function d3_render_sankey (container,sankeydata,chart_height) {
  // color(蓝、绿、金黄、橘黄、紫色、红色)
  var color_arr = [
    'rgb(173, 219, 252)',
    'rgb(5, 157, 5)',
    'yellow',
    'rgb(249, 173, 37)',
    'rgb(232, 42, 129)',
    'red'
  ];

  $(container).empty();

  var margin = {top: 12, right: 1, bottom: 20, left: 40},
      width = 1000 - margin.left - margin.right,
      height = chart_height - margin.top - margin.bottom;

  var formatNumber = d3.format(",.0f"),
      format = function(d) { return formatNumber(d) + " TWh"; },
      color = d3.scale.category20();

  var svg = d3.select(container).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, .3);
  var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

  // var path = sankey.link();
  var path = d3.svg.diagonal()
    .source(function(d) {
        return {"x":d.source.y + d.source.dy / 2,
                "y":d.source.x + sankey.nodeWidth()/2};
    })            
    .target(function(d) {
        return {"x":d.target.y + d.target.dy / 2,
                "y":d.target.x + sankey.nodeWidth()/2};
    })
    .projection(function(d) { return [d.y, d.x]; });

  var renderSankey = function(sandata) {

    window.width = 800;
    sankey
        .nodes(sandata.nodes)
        .links(sandata.links)
        .layout(32);

    var link = svg.append("g").selectAll(".link")
        .data(sandata.links)
      .enter().append("path")
        .attr("class", function (d) {
          if (d.display == 0) {
            return "fake_link";
          }else{
            // console.log(d.value);
            if (d.value > 0.2) {
              return "red_link";
            } else{
              return "link";
            };
          };
        })
        .attr("d", path)
        .style("stroke-width", function(d) { 
          return Math.max(1, d.value*20); 
        })
        .sort(function(a, b) { return b.dy - a.dy; });

    link.append("title")
        .text(function(d) { return d.source.name + " -- " + d.target.name + "\n" + format(d.value); });

    var node = svg.append("g").selectAll(".node")
        .data(sandata.nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("class", function (d) {
          if (d.display == 0) {
            return "fake_node";
          };
        })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", function() { this.parentNode.appendChild(this); })
        .on("drag", dragmove));

    node.append("circle")
        .attr("cx", sankey.nodeWidth()/2)
        .attr("cy", function (d) {
            return d.dy/2;
        })
        .attr("r", function (d) {
            return Math.sqrt(d.size*1.5);
        })
        .style("fill", function(d) { 
          // return color(d.colorfill); 
          return color_arr[d.colorfill]; 
        })
        .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
      .append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
        .attr("class", "ra_label")
        .attr("x", 30)
        .attr("y", function(d) { 
          return d.dy/4; 
          // return '30px'; 
        })
        // .attr("dy", "1em")
        .attr("text-anchor", "start")
        .attr("transform", null)
        .html(function(d) { 
          if (d.description1) {
            return d.name + ' - ' + d.description1 ; 
          } else{
            return d.name
          };
        })
      .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start")

    var insertLinebreaks = function (d) { 
        var el = d3.select(this);
        
        if (d.description1) {
          var words = (d.name + ' - ' + d.description1).split(' - ');
          el.text('');

          for (var i = 0; i < words.length; i++) {
            if (words[i].length > 20) {
              var text = words[i];
              var middle = Math.floor(text.length / 2);

              var s1 = text.substr(0, middle);
              var s2 = text.substr(middle);
              inwords = [s1,s2];
              // console.log(inwords);
              for (var j = 0; j < inwords.length; j++) {
                  var intspan = tspan.append('tspan').text(inwords[j]);

                  var attrx = 25;
                  if (d.xPos == 3) {
                    attrx = 30;
                  };
                  if (d.xPos == 1) {
                    attrx = 33;
                  };
                  intspan.attr('x', attrx).attr('dy', '18');
              }
            }
            else{
              var tspan = el.append('tspan').text(words[i]);
              if (i > 0)
                  var attrx = 30;
                  // console.log(d);
                  if (d.xPos == 0 || d.xPos == 1) {
                    attrx = 29;
                  };
                  tspan.attr('x', attrx).attr('dy', '18');
            }
          }
        };
    };

    svg.selectAll('.ra_label').each(insertLinebreaks);

    function dragmove(d) {
      d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
  }

  renderSankey(sankeydata);
}
