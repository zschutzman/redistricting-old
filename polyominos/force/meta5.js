var width = 1200,
    height = 800
const D2R = Math.PI / 180;
var idno = 0;
var tx = 0;
var ty = 0;
var vis = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
 

function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed=true);
}
   
   
    
var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("opacity", 0);
	

var force = d3.layout.force()
      .charge(-8000)
      .linkDistance(60)
      .gravity(.2)
      
    .size([width, height]);
//var drag = force.drag()
//    .on("dragstart", dragstart);    
function mk_gr(g){
d3.json(g, function(json) {


  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = vis.selectAll(".link")
      .data(json.links)
    .enter().append("line")
    .style("opacity",0)
      .attr("class", "link");

  var node = vis.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .style("r",10)
      .classed("fixed", function(d) {idno == d.name ? d.fixed =true : d.fixed = false;})
      .attr("html_rep", function(d) {return d.html_rep;})
      .attr("idno", function(d) {return d.name;})
      .call(force.drag)
      .style("opacity",0)

      .on("click",swapgraph);
  node.append("rect").attr("width", 75)
      .attr("height", 75)
      .style("fill","none")
      .style("stroke","#666")
      .style("stroke-width",2)
       .attr("x", -37)
      .attr("y", -37)

      .attr("idno", function(d) {return d.name;});
  node.append("image")
      .attr("xlink:href", function(d) {return "m5-imgs/whole/im_"+d.name+".png";})
      .attr("x", -37)
      .attr("y", -37)
      .attr("width", 75)
      .attr("height", 75)
      .attr("html_rep", function(d) {return d.html_rep;})
      .attr("idno", function(d) {return d.name;})

    
      
      
      
      
      
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

      .on("mouseover",function(){
        var c = d3.select(this);
        vis.selectAll("rect").each(function(){
            if (d3.select(this).attr("idno") == c.attr("idno")){
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
        vis.selectAll("rect").each(function(){
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
      

           
           
           
           

    node.transition()
    .duration(1200)
    .style("opacity",1);
    
    link.transition()
    .duration(1200)
    .style("opacity",1);
    
    d3.selectAll("g").each(function(d){
        console.log(d.name==idno);
        if (d.name == idno) {d.x = tx; d.y=ty;}
    });


    
    
    
  force.on("tick", function() {
      
      //moveToRadial();
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
  

});



}
mk_gr("m5-graphs/whole/g0.json");


    d3.selectAll("g").each(function(d){
        console.log(d);
        
        if (d.name == idno) {d.x = 100; d.y=ty; d.fixed=true;}
        console.log(d);
    });


function swapgraph(){
    if (d3.event.defaultPrevented) return;
    if (d3.select(this).attr("idno") == idno) return;
              tooltip.style("visibility", "hidden");
  

            tooltip.transition()		
                .duration(200)		
                .style("opacity", 0);
                
                
                
    tx = d3.select(this).attr("cx");
    ty = d3.select(this).attr("cy");
    
    idno = d3.select(this).attr("idno");
    vis.selectAll(".link").remove();
    vis.selectAll(".node").remove();
    mk_gr("m5-graphs/whole/g"+idno+".json");
    
}


