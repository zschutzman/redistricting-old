
var width = 1200,
    height = 800,
    idno = 0;
    
var lx=-1;
var ly=-1;
  
    
    
function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
  console.log(d3.select(this).attr("x"));
    
    console.log(lx,ly,0);
}

function dragged(d) {
console.log(d3.event.x,d3.event.y);

  d3.select(this).attr("transform", "translate(" + d3.event.x + (width/2 + 40) + "," + d3.event.y + (height/2) + ")");
  
}

function dragended(d) {
  d3.select(this).classed("active", false);
  console.log("done");
}



var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("opacity", 0);
	

var svg = d3.select("body").append("svg")
        .attr("width", width)
    .attr("height", height)
 
    g = svg.append("g").attr("transform", "translate(" + (width / 2 + 40) + "," + (height / 2) + ")");

var tree = d3.tree()
    .size([2 * Math.PI, Math.min(width,height)/2.5])
    .separation(function(a, b) { return (a.parent == b.parent ? 1000 : 2000) / a.depth; });

var stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    
function mk_gr(fn,num) {
    console.log(idno);
    idno = num;
    console.log(fn,parseInt(num),idno);
    
d3.json(fn, function(error, treeData) {
  if (error) throw error;

  var root = d3.hierarchy(treeData);
  tree(root);

  var link = g.selectAll(".link")
    .data(root.links())
    .enter().append("path")
      .attr("class", "link")
      .style("fill","none")
      .style("stroke-width","1.5")
      .style("opacity",.8)
      .style("stroke","red")
      .attr("d", d3.linkRadial()
          .angle(function(d) { return d.x; })
          .radius(function(d) { return d.y; }));
/*var link = g.selectAll(".link")
    .data(root.links())
    .enter().append("line")
      .attr("class", "link")
      .attr("stroke","#ccc")
      .attr("x1", function(d) { return radialPoint(d.source.x,d.source.y)[0]; })
      .attr("y1", function(d) { return radialPoint(d.source.x,d.source.y)[1]; })
      .attr("x2", function(d) { return radialPoint(d.target.x,d.target.y)[0]; })
      .attr("y2", function(d) { return radialPoint(d.target.x,d.target.y)[1]; });*/

  var node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { return "translate(" + radialPoint(d.x, d.y) + ")"; })
            .attr("idno", function(d) {return d.name;})
  /*.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))*/

            .on("click",swapgraph)

      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

      .on("mouseover",function(){
        var c = d3.select(this);
        g.selectAll("rect").each(function(){
            if (d3.select(this).data()[0].data.name == c.data()[0].data.name){
                d3.select(this).style("stroke-width",6);
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
          
          
          
        var c = d3.select(this);
        g.selectAll("rect").each(function(){
            if (d3.select(this).attr("idno") == c.attr("idno")){
                d3.select(this).style("stroke-width",2);
                return;
            }
        });
          tooltip.style("visibility", "hidden");
  

            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	            
     });

  node.append("rect").attr("width", 75)
      .attr("height", 75)
      .style("fill","none")
      .style("stroke","#666")
      .style("stroke-width",2)
       .attr("x", -37)
      .attr("y", -37)
      .attr("idno", function(d) {return d.name;})
  node.append("image")
      .attr("xlink:href", function(d) {console.log(d.data.name);return "m5-imgs/whole/im_"+d.data.name+".png";})
      .attr("x", -37)
      .attr("y", -37)
      .attr("width", 75)
      .attr("height", 75)
      .attr("html_rep", function(d) {return d.data.html_rep;})

      
  node.append("text")
      .attr("dy", 3)
      .attr("x", function(d) { return d.children ? -8 : 8; })
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { 
        return d.data.name;
      });
});


}
function radialPoint(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

mk_gr("m5-graphs/whole_trees2/g0.json",0);

function swapgraph(){
    if (d3.event.defaultPrevented) return;
    console.log(idno==d3.select(this).data()[0].data.name);
    if (idno == d3.select(this).data()[0].data.name) return;
              tooltip.style("visibility", "hidden");
  

            tooltip.transition()		
                .duration(200)		
                .style("opacity", 0);
                
                
                
    tx = d3.select(this).attr("cx");
    ty = d3.select(this).attr("cy");
    
    svg.selectAll(".link").remove();
    svg.selectAll(".node").remove();
    mk_gr("m5-graphs/whole_trees2/g"+d3.select(this).data()[0].data.name+".json", d3.select(this).data()[0].data.name);
    
}

