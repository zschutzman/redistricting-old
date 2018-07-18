var width = 1200,
    height = 800
    
var idno = 0;

var vis = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    
    
    
var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("opacity", 0);
	

var force = d3.layout.force()
    .distance(200)
    .charge(-1000)
    .size([width, height]);
function mk_gr(g){
d3.json(g, function(json) {


  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = vis.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");

  var node = vis.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .style("r",10)
      .attr("html_rep", function(d) {return d.html_rep;})
      .attr("idno", function(d) {return "i"+d.name;})
      .call(force.drag)
      .on("click",swapgraph);
  node.append("rect").attr("width", 75)
      .attr("height", 75)
      .style("fill","none")
      .style("stroke","black")
      .style("stroke-width",5)
            .attr("x", -8)
      .attr("y", -8)
      .attr("idno", function(d) {return "i"+d.name;});
  node.append("image")
      .attr("xlink:href", "m5-imgs/whole/im_"+idno+".png")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 75)
      .attr("height", 75)
      .attr("html_rep", function(d) {return d.html_rep;})
      .style("border",5)
      .attr("idno", function(d) {return "i"+d.name;})


      
      
      
      
      
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

      .on("mouseover",function(){
        var c = d3.select(this);
        vis.selectAll("rect").each(function(){
            if (d3.select(this).attr("idno") == c.attr("idno")){
                d3.select(this).style("fill","green");
                return;
            }
        });
   
       
        tooltip.style("visibility", "visible");
        tooltip.html('<p style="margin:0;padding:0;font-size:50px;letter-spacing:-10px;line-height:35px;">' + c.attr( "html_rep" ) + "</p>");

        tooltip.transition()		
        .duration(200)		
        .style("opacity",.95);		

   

      })
      
      .on("mouseout", function(){
          tooltip.style("visibility", "hidden");
  

            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	            
     });
      
      


  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});
}
mk_gr("m5-graphs/whole/g0.json");

function swapgraph(){
    if (d3.event.defaultPrevented) return;
              tooltip.style("visibility", "hidden");
  

            tooltip.transition()		
                .duration(200)		
                .style("opacity", 0);
    idno = d3.select(this).attr("idno");
    vis.selectAll(".link").remove();
    vis.selectAll(".node").remove();
    mk_gr("m5-graphs/whole/g"+idno+".json");
    
}


