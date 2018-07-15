
    
var vis2 = d3.select("#chart2")
  .append("svg")
    .attr("width", w)
    .attr("height", h);
    

d3.json("gr2.json", function(json) {
  var force = d3.layout.force()
      .charge(-150)
      .linkDistance(50)
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
      .start();

  var link = vis2.selectAll("line.link")
      .data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .attr("stroke", "#555")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  var node = vis2.selectAll("circle.node")
      .data(json.nodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) {return Math.round(1.2*d.orbit)+3;})
      .attr("type", function(d) {return d.Type;})
      .style("fill", function(d) { if (d.Type == 20) return 'PapayaWhip'; if (d.Type == 21) return 'Gold'; return fill(d.Type); })
      .call(force.drag)
 
      
      .on("mouseover",function(){
        var t = d3.select(this).attr("type");
       d3.select(this).attr("r",20);          
          
      
         vis.selectAll("circle.node")
            .each(function(d){
                var u = d3.select(this).attr("type");
                 if (u==t){d3.select(this).attr("r",20);}
               
                
            });

      })
      
      .on("mouseout", function(){
            vis.selectAll("circle.node")
            .each(function(d){
            d3.select(this).attr("r", function(d) {return Math.round(2*d.deg);})
                
            });    
      
         vis2.selectAll("circle.node")
            .each(function(d){
            d3.select(this).attr("r", function(d) {return Math.round(1.2*d.orbit)+3;})

            });
     });
     
      
      
      

    
                


      
  node.append("svg:title")
      .text(function(d) { return d.name; });

  vis2.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});
