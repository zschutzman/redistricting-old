
 var linkedByIndex2 = {};   
var vis2 = d3.select("#chart2")
  .append("svg")
    .attr("width", w)
    .attr("height", h);
    

d3.json("graph5-r.json", function(json) {
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
      .attr("on",0)
      .style("stroke-width", 0)
      .style("stroke", "black")
      .style("opacity", 1.)
      .on("click",connectedNodes2)
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
  
  
  

 
  


vis2.selectAll("line.link").each(function(d){
     linkedByIndex2[d.source.index + "," + d.target.index] = 1;
});



function connectedNodes2() {
        console.log(d3.select(this).attr("on"), "ON", toggle, "TOG");

          vis.selectAll("circle.node").each(function(d){
           
                d3.select(this).attr("on",0);
                d3.select(this).style("stroke-width",0);
                d3.select(this).style("opacity",1);
            
        });       
    
    if (d3.select(this).attr("on") ==1){
        node.style("opacity", 1);
        node.style("stroke-width",0);
        d3.select(this).attr("on",0);
        var tp = d3.select(this).attr("type");

        
        
        
        toggle = 0;
        return;
    }
    
    else{
   
        node.style("opacity", 1);
        node.style("stroke-width",0);
        d3.select(this).attr("on",1);
        
        var tp = d3.select(this).attr("type");
        vis.selectAll("circle.node").each(function(d){
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
            return neighboring2(d, o) | neighboring2(o, d) | o === d ? 1 : 0.7;
        });
        node.style("stroke-width", function(o) {
                        return neighboring2(d, o) | neighboring2(o, d) | o === d ? 3 : 0;
        });
         var oth;
         var oth2;
         var tp = d3.select(this).attr("type");
         
         vis.selectAll("circle.node").each(function(e){
             var tq = d3.select(this).attr("type");
                if (tp == tq) {
                oth = d3.select(this);
                oth2 = oth.node().__data__;
             
                     oth.style("opacity",1);
        oth.style("stroke-width",3);
             
            vis.selectAll("circle.node").each(function(e){
                var c = d3.select(this).style("opacity");
                var f = d3.select(this).style("stroke-width");
            d3.select(this).style("opacity", function(o){return neighboring(oth2, o) | neighboring(o, oth2) | o === d ? 1 : .7;});
            d3.select(this).style("stroke-width", function(o) {return neighboring(oth2, o) | neighboring(o, oth2) | o === d ? 3 : f;});
            
            });
                }
             
             
         });
         
         vis.selectAll("circle.node").each(function(e){
             var sw = d3.select(this).style("stroke-width");
             console.log("SW",sw);
   d3.select(this).style("opacity", function(o){ if (sw == '3px') return 1; return .7;});
         });
    

    toggle = 1-toggle;
        
    } 
   
  
  
}
















});

function neighboring2(a, b) {
    return linkedByIndex2[a.index + "," + b.index];
}
