var w = Math.round(.35*document.documentElement.clientWidth)
    h = Math.round(.8*document.documentElement.clientHeight)
    fill = d3.scale.category20()
    wp = Math.round(.20*document.documentElement.clientWidth);
var linkedByIndex = {};
    
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
      .attr("html_rep", function(d) {return d.html_rep;})
      .attr("r", function(d) {return Math.round(2*d.deg);})
      .style("stroke-width", 0)
      .style("stroke", "black")
      .style("opacity", 1.)
      .attr("on",0)
      .style("fill", function(d) { if (d.Type == 20) return 'PapayaWhip'; if (d.Type == 21) return 'Gold'; return fill(d.Type); })
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
      
         vis2.selectAll("circle.node")
            .each(function(d){
                var u = d3.select(this).attr("type");
                if (u==t){d3.select(this).attr("r",20);}
            });
            
            
            
      })
      
      .on("mouseout", function(){
          tooltip.style("visibility", "hidden");
                vis.selectAll("circle.node")
            .each(function(d){
            d3.select(this).attr("r", function(d) {return Math.round(2*d.deg);})
                
            });    
      
         vis2.selectAll("circle.node")
            .each(function(d){
            d3.select(this).attr("r", function(d) {return Math.round(1.2*d.orbit)+3;})

            });
            
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	            
     })
      
  
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
  
  
vis.selectAll("line.link").each(function(d){
     linkedByIndex[d.source.index + "," + d.target.index] = 1;
     linkedByIndex[d.target.index + "," + d.target.index] = 1;
    linkedByIndex[d.target.index + "," + d.source.index] = 1;

});




function connectedNodes() {
            console.log(d3.select(this).attr("on"), "ON", toggle, "TOG");

    if (d3.select(this).attr("on") ==1){
        node.style("opacity", 1);
        node.style("stroke-width",0);
        d3.select(this).attr("on",0);
        var tp = d3.select(this).attr("type");
        vis2.selectAll("circle.node").each(function(d){
           
                d3.select(this).attr("on",0);
                d3.select(this).style("stroke-width",0);
                d3.select(this).style("opacity",1);
            
        });
        
        
        
        toggle = 0;
        return;
    }
    
    else{
        node.style("opacity", 1);
        node.style("stroke-width",0);
        d3.select(this).attr("on",1);
        
        var tp = d3.select(this).attr("type");
        vis2.selectAll("circle.node").each(function(d){
                            //d3.select(this).attr("on",1);
                d3.select(this).style("stroke-width",0);
            var tq = d3.select(this).attr("type");
            if (tp == tq) {
               d3.select(this).attr("on",1);

                d3.select(this).style("opacity",1);
                
            }
        });
        
        
        
        
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
         var oth;
         var oth2;
         var tp = d3.select(this).attr("type");
        vis2.selectAll("circle.node").each(function(e){
            var tq = d3.select(this).attr("type");
            if (tp == tq) {
                oth = d3.select(this);
                
                
            
        

        oth2 = oth.node().__data__;
        return;
            }
        });
        vis2.selectAll("circle.node").each(function(e){
            d3.select(this).style("opacity", function(o){return neighboring2(oth2, o) | neighboring2(o, oth2) | o === d ? 1 : 0.7;});
            d3.select(this).style("stroke-width", function(o) {return neighboring2(oth2, o) | neighboring2(o, oth2) | o === d ? 3 : 0;});
    });
        oth.style("opacity",1);
        oth.style("stroke-width",3);
      

    toggle = 1-toggle;
        
    } 
   
  
  
}









});


function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
}



