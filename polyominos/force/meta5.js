
var width = 1200,
    height = 800,
    idno = 0;
    
var w = width;
var h = height;
    
var lx=-1;
var ly=-1;
  
    
var clsq = false;


 var request = new XMLHttpRequest();
   request.open("GET", "../dist_strings.json", false);
   request.send(null)
   var my_JSON_object = JSON.parse(request.responseText);
   console.log(my_JSON_object);

var r_win_i = [0,0,0,0,0,0];
var b_win_i = [0,0,0,0,0,0];
var n_win_i = [0,0,0,0,0,0];
var rwin = 0;
var bwin=0;


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
      .style("fill", function(d) {return get_col(d.data.str_rep.split('\n').join("").split(" ").join(""));})
      .style("stroke","#666")
      .style("stroke-width",2)
       .attr("x", -37)
      .attr("y", -37)
      .attr("str_rep", function(d){ return d.data.str_rep.split('\n').join("").split(" ").join("");})
      .attr("idno", function(d) {return d.name;})
  node.append("image")
      .attr("xlink:href", function(d) {return "m5-imgs/whole/im_"+d.data.name+".png";})
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
    do_update(-1);
    do_update2();
    
}


//////////////////////
var grd = d3.select('body').append('svg')
  .attr("width", width)
  .attr("height",height);
  
  
var chk = "";
var dist1 = 0;
var dist2 = 0;
var dist3 = 0;
var dist4 = 0;
var dist5 = 0;
var cnt = 0;  
  

var simp_fill = ['#0000ff','#808080','#ff0000'];

// calculate number of rows and columns
var squaresRow = 5;
var squaresColumn = 5;
var square=70;

// loop over number of columns
_.times(squaresColumn, function(n) {

  // create each set of rows
  var rows = grd.selectAll('rect' + ' .row-' + (n + 1))
    .data(d3.range(squaresRow))
    .enter().append('rect')
    

    
    
    
    
    .attr("class", function(d, i) {return 'square row-' + (n + 1) + ' ' + 'col-' + (i + 1);})
    .attr("id", function(d, i) {
        return 's-' + (n + 1) + (i + 1);
    })
      .attr("width", square)
      .attr("height",square)
      .attr("x", function(d, i) {
        return (i * 1.07*square);
      })
      .attr("y", (n * 1.07*square))
    
    .attr("party",0)
    .style("fill",simp_fill[1])
    .style("stroke","#555")
    .style("stroke-width",5)
    
    
    
    .on("mouseover",function(d){
        d3.select(this).style("stroke","#000");
        d3.select(this).style("stroke-width","6");
    })
    
    .on("mouseout", function(d){
        d3.select(this).style("stroke","#555");
        d3.select(this).style("stroke-width","5")
    })
    
    .on("click", function(d){
     clsq = true;
     do_update(this);
     do_update2();
    }
    );


});
    
    
function do_update(r){
            console.log("YAAA");
   
    //if (d3.event != null && d3.event.defaultPrevented) return;
        if (d3.event != null && r != -1){
            var t = parseInt(d3.select(r).attr("party"));
            d3.select(r).attr("party", t+1);
            if (d3.select(r).attr("party") == 2){d3.select(r).attr("party",-1);}
        }
  

        console.log("YAAA");

    grd.selectAll('rect').each(function(d){
        //console.log(d3.select(this).attr("party"));
        if (d3.select(this).attr("party") == 0) d3.select(this).style("fill", simp_fill[1]);
        if (d3.select(this).attr("party") == 1) d3.select(this).style("fill", simp_fill[2]);
        if (d3.select(this).attr("party") == -1) d3.select(this).style("fill", simp_fill[0]);

    })

        r_win_i = [0,0,0,0,0,0];
        b_win_i = [0,0,0,0,0,0];
        n_win_i = [0,0,0,0,0,0];


        console.log("HHH");
}
function do_update2(){
        g.selectAll("rect").each(function(d){
            var hld = this;
            chk = d3.select(this).attr("str_rep");
   
    
        dist1=0;
        dist2=0;
        dist3=0;
        dist4=0;
        dist5=0;
        cnt=0;
        console.log("YAAA");

        grd.selectAll("rect").each(function(e){
            rwin = 0;
bwin = 0;
            var b = parseInt(d3.select(this).attr("party"));
            if (chk[cnt] == 1){
            dist1 = dist1 + b;
            } else  if (chk[cnt] == 2){
            dist2 = dist2 + b;
            }else   if (chk[cnt] == 3){
            dist3 = dist3 + b;
            }else   if (chk[cnt] == 4){
            dist4 = dist4 + b;
            }else   if (chk[cnt] == 5){
            dist5 = dist5 + b;
                       }
            cnt = cnt+1;

        });
        dist1 = Math.sign(dist1);
        dist2 = Math.sign(dist2);
        dist3 = Math.sign(dist3);
        dist4 = Math.sign(dist4);
        dist5 = Math.sign(dist5);
        
        if (dist1 > 0) {rwin +=1;}
        if (dist2 > 0) {rwin +=1;}
        if (dist3 > 0) {rwin +=1;}
        if (dist4 > 0) {rwin +=1;}
        if (dist5 > 0) {rwin +=1;}
        if (dist1 < 0) {bwin +=1;}
        if (dist2 < 0) {bwin +=1;}
        if (dist3 < 0) {bwin +=1;}
        if (dist4 < 0) {bwin +=1;}
        if (dist5 < 0) {bwin +=1;}
        
        r_win_i[parseInt(rwin)] += 1;
        b_win_i[parseInt(bwin)] += 1;
        var col = Math.sign(dist1 + dist2 + dist3 + dist4 + dist5) + 1;
        d3.select(this).style("fill", simp_fill[col]);
        });
    clsq = false;
    console.log(r_win_i,b_win_i);
    }
    
function get_col(chkstr){
        var chk = chkstr;
        dist1=0;
        dist2=0;
        dist3=0;
        dist4=0;
        dist5=0;
        cnt=0;
        console.log("YAAA");

        grd.selectAll("rect").each(function(e){
            rwin = 0;
bwin = 0;
            var b = parseInt(d3.select(this).attr("party"));
            if (chk[cnt] == 1){
            dist1 = dist1 + b;
            } else  if (chk[cnt] == 2){
            dist2 = dist2 + b;
            }else   if (chk[cnt] == 3){
            dist3 = dist3 + b;
            }else   if (chk[cnt] == 4){
            dist4 = dist4 + b;
            }else   if (chk[cnt] == 5){
            dist5 = dist5 + b;
                       }
            cnt = cnt+1;

        });
        dist1 = Math.sign(dist1);
        dist2 = Math.sign(dist2);
        dist3 = Math.sign(dist3);
        dist4 = Math.sign(dist4);
        dist5 = Math.sign(dist5);
        

        var col = Math.sign(dist1 + dist2 + dist3 + dist4 + dist5) + 1;
        return simp_fill[col];
    
    
}
