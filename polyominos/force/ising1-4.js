var w = Math.round(.35*document.documentElement.clientWidth)
    h = Math.round(.8*document.documentElement.clientHeight)
fill = ['#0000ff','#5934df','#7250c0','#7d69a0','#808080','#aa7264','#ca6048','#e6462a','#ff0000']
   wp = Math.round(.20*document.documentElement.clientWidth);


var toggle = 0;
 
var vis = d3.select("#chart1")
  .append("svg")
    .attr("width", w+wp)
    .attr("height", h);

var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("opacity", 0);
	


 
// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    
d3.json("gr.json", function(json) {
  var force = d3.layout.force()
      .charge(-150)
      .linkDistance(50)
      .nodes(json.nodes)
      .links(json.links)
      .size([w+wp, h])
      .start();

  var link = vis.selectAll("line.link")
      .data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .attr("stroke","#555")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .attr("u",function(d) {return d3.select(d.source);})
      .attr("v", function(d) {return d.target;});

  var node = vis.selectAll("circle.node")
      .data(json.nodes)
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("type", function(d) {return d.Type;})
      .attr("str_rep", function(d){ return d.str_rep.split('\n').join("").split(" ").join("");})
      .attr("html_rep", function(d) {return d.html_rep;})
      .attr("r", function(d) {return Math.round(2*d.deg);})
      .style("stroke-width", 0)
      .style("stroke", "black")
      .style("opacity", 1.)
      .attr("on",0)
      .style("fill", fill[4])
      .call(force.drag)
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

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
        
            if (u==t){d3.select(this).attr("r",20);}  });    
      
 
            
            
            
      })
      
      .on("mouseout", function(){
          tooltip.style("visibility", "hidden");
                vis.selectAll("circle.node")
            .each(function(d){
            d3.select(this).attr("r", function(d) {return Math.round(2*d.deg);})
                
            });    
      

            
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	            
     })
      
     /* 
    .on("click", function(){

        var x = d3.select(this).attr("cx");
        var y = d3.select(this).attr("cy");       

        vis.selectAll("circle.node").each(function(d){
            d3.select(this).style("opacity",.6);});
  

        
        d3.select(this).style("opacity",1.);
        
        
        
        vis.selectAll("line.link").each(function(d){
            var u1 = d3.select(this).attr("x1");
            var u2 = d3.select(this).attr("x2");
            var v1 = d3.select(this).attr("y1");
            var v2 = d3.select(this).attr("y2");
            d3.select(this).attr("stroke-width", function(d){if ((u1 == x || u2 == x) && (v1==y || v2 == y)) return 8;  return Math.sqrt(d.value);});
            d3.select(this).attr("stroke", function(d){  if ((u1 == x || u2 == x) && (v1==y || v2 == y)) return "#000"; return "#555";});
            


         

            
        });
    
    })*/
    .on("click", connectedNodes);
    

      



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
  
  
 var linkedByIndex = {};
vis.selectAll("line.link").each(function(d){
     linkedByIndex[d.source.index + "," + d.target.index] = 1;
});


function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
}

function connectedNodes() {
        if (d3.event.defaultPrevented) return;

    if (d3.select(this).attr("on") ==1){
        node.style("opacity", 1);
        console.log("1");
        node.style("stroke-width",0);
        d3.select(this).attr("on",0);
        toggle = 0;
        return;
    }
    
    else{
        node.style("opacity", 1);
        console.log("2");
        node.style("stroke-width",0);
        d3.select(this).attr("on",1);
        toggle = 0;
    }

    if (toggle == 0) {
        d = d3.select(this).node().__data__;
        node.style("opacity", function (o) {
            return neighboring(d, o) | neighboring(o, d) | o === d ? 1 : 0.7;
        });
        node.style("stroke-width", function(o) {
                        return neighboring(d, o) | neighboring(o, d) | o === d ? 3 : 0;
        });

    }
    

    toggle = 1-toggle;
} 
  
  
  
  
});






