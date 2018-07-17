
var w = 1200,
    h = 768,
    fill = d3.scale.category20();
var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("opacity", 0);
	


 
var vis = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

function mk_gr(g) {
    d3.json(g, function(json) {
  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(80)
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
      .start();

  var link = vis.selectAll("line.link")
      .data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  var node = vis.selectAll("circle.node")
      .data(json.nodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 8)
      .style("fill", function(d) { return fill(d.name); })
      .attr("idno", function(d) {return d.name;})
      .attr("html_rep", function(d) {return d.html_rep;})
      .call(force.drag)
      .on("click",swapgraph)
      
      
      
      
      
      
      
        .on("mouseover",function(){
        var t = d3.select(this).attr("type");
        var c = d3.select(this)          
        tooltip.style("visibility", "visible");
        tooltip.html('<p style="margin:0;padding:0;font-size:50px;letter-spacing:-10px;line-height:35px;">' + c.attr( "html_rep" ) + "</p>");
        
        
        
        tooltip.transition()		
        .duration(200)		
        .style("opacity",.95);		


     
       vis.selectAll("circle.node")
            .each(function(d){
            var u = d3.select(this).attr("type");
        
            if (u==t){d3.select(this).attr("r",8);}  });    
      

            
            
            
      })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

      .on("mouseout", function(){
          tooltip.style("visibility", "hidden");
                vis.selectAll("circle.node")
            .each(function(d){
            d3.select(this).attr("r", function(d) {return 8;});
                
            });    
      

            
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	            
     });
      
      
      
      

  node.append("svg:title")
      .text(function(d) { return d.name; });

  vis.style("opacity", 1e-6)
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
}
mk_gr("m5-graphs/reduced/g0.json")



function swapgraph(){
    var idno = d3.select(this).attr("idno");
    vis.selectAll("circle.node").remove();
    vis.selectAll("line.link").remove();
    mk_gr("m5-graphs/reduced/g" + idno + ".json");
}
