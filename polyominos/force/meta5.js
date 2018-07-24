var width = Math.round(1*document.documentElement.clientWidth)
    height = Math.round(1*document.documentElement.clientHeight)
    idno = 0;
    

var w = width;

var h = height;
console.log(w,h);    
var lx=-1;
var ly=-1;
  
    
var clsq = false;


 var request = new XMLHttpRequest();
   request.open("GET", "./plan_strings.json", false);
   request.send(null)
   var plan_strings = JSON.parse(request.responseText);

   
 var request = new XMLHttpRequest();
   request.open("GET", "./dist_strings.json", false);
   request.send(null)
   var dist_strings = JSON.parse(request.responseText);

 var request = new XMLHttpRequest();
   request.open("GET", "./dist_wins.json", false);
   request.send(null)
   var dist_wins = JSON.parse(request.responseText);
   
 var request = new XMLHttpRequest();
   request.open("GET", "./plan_wins.json", false);
   request.send(null)
   var plan_wins = JSON.parse(request.responseText);
   
   
for (var key in plan_wins){
    plan_wins[key] = JSON.parse("[" +  plan_wins[key].split("(").join("").split(")").join("") + "]");}
      
var r_win_i = [0,0,0,0,0,0];
var b_win_i = [0,0,0,0,0,0];
var n_win_i = [0,0,0,0,0,0];
var rwin = 0;
var bwin=0;



var hoff = 130;
var voff = 15;
var winbox = d3.select("body").append("svg")
            .attr("width",350)
            .attr("height",200)

            
            var wgrp = winbox.append("g").attr("transform","translate(0,15)");
            
            //wgrp.append("rect").style("fill","none").style("width",100).style("height",100).style("stroke-width",2).style("stroke","black");
            wgrp.append("text") .text("Seat Distribution:")  .attr('dy','0.35em');
            var tr0 = wgrp.append("text").attr("transform","translate(0,"+voff+")").attr('dy','0.35em').attr("i", 0).attr("party",'r');
            var tr1 = wgrp.append("text").attr("transform","translate(0,"+2*voff+")").attr('dy','0.35em').attr("i",1).attr("party",'r');
            var tr2 = wgrp.append("text").attr("transform","translate(0,"+3*voff+")").attr('dy','0.35em').attr("i",2).attr("party",'r');
            var tr3 = wgrp.append("text").attr("transform","translate(0,"+4*voff+")").attr('dy','0.35em').attr("i",3).attr("party",'r');
            var tr4 = wgrp.append("text").attr("transform","translate(0,"+5*+voff+")").attr('dy','0.35em').attr("i",4).attr("party",'r');
            var tr5 = wgrp.append("text").attr("transform","translate(0,"+6*+voff+")").attr('dy','0.35em').attr("i",5).attr("party",'r');
            
            var tb0 = wgrp.append("text").attr("transform","translate("+hoff+","+voff+")").attr('dy','0.35em').attr("i",0).attr("party",'b');
            var tb1 = wgrp.append("text").attr("transform","translate("+hoff+","+2*voff+")").attr('dy','0.35em').attr("i",1).attr("party",'b');
            var tb2 = wgrp.append("text").attr("transform","translate("+hoff+","+3*voff+")").attr('dy','0.35em').attr("i",2).attr("party",'b');
            var tb3 = wgrp.append("text").attr("transform","translate("+hoff+","+4*voff+")").attr('dy','0.35em').attr("i",3).attr("party",'b');
            var tb4 = wgrp.append("text").attr("transform","translate("+hoff+","+5*+voff+")").attr('dy','0.35em').attr("i",4).attr("party",'b');
            var tb5 = wgrp.append("text").attr("transform","translate("+hoff+","+6*+voff+")").attr('dy','0.35em').attr("i",5).attr("party",'b');


var tb_list = [tb0,tb1,tb2,tb3,tb4,tb5];
var tr_list = [tr0,tr1,tr2,tr3,tr4,tr5]
console.log(tb_list);

            
function update_textboxes(){
    
wgrp.selectAll("text").each(function(d){
    
    var i = d3.select(this).attr("i");
    var p = d3.select(this).attr("party");
    console.log(p);
    if (i != null){
        if (p=='r'){
            console.log(d3.select(this).attr("text"));
            d3.select(this).text("Red Wins " + i + ": " + r_win_i[i]);
        }
        if (p=='b'){
                d3.select(this).text("Blue Wins " + i + ": " + b_win_i[i]);
        }
    }
     
 });
}
            
            
var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("opacity", 0);
	

var svg = d3.select("body").append("svg")
        .attr("width", width/3)
    .attr("height", height/1.5)//.attr("transform", "translate(" + (width/3) + ",0)");
 
       
 
    g = svg.append("g") .attr("transform", "translate(" + (width/6 ) + "," + (height/3) + ")");
    //.attr("width",0)
    //.attr("height",0)
    


var tree = d3.tree()
    .size([2 * Math.PI, Math.min(width,height)/7])
    .separation(function(a, b) { return (a.parent == b.parent ? 1000 : 2000) / a.depth; });


    
function mk_gr(fn,num) {
    console.log(idno);
    idno = num;
    console.log(fn,parseInt(num),idno);
    
d3.json(fn, function(error, treeData) {
  if (error) throw error;

  var root = d3.hierarchy(treeData);
  tree(root);

 /* var link = g.selectAll(".link")
    .data(root.links())
    .enter().append("path")
      .attr("class", "link")
      .style("fill","none")
      .style("stroke-width","1.5")
      .style("opacity",.8)
      .style("stroke","red")
      .attr("d", d3.linkRadial()
          .angle(function(d) { return d.x; })
          .radius(function(d) { return d.y; }));*/
var link = g.selectAll(".link")
    .data(root.links())
    .enter().append("line")
      .attr("class", "link")
      .attr("stroke","#ccc")
      .attr("x1", function(d) { return radialPoint(d.source.x,d.source.y)[0]; })
      .attr("y1", function(d) { return radialPoint(d.source.x,d.source.y)[1]; })
      .attr("x2", function(d) { return radialPoint(d.target.x,d.target.y)[0]; })
      .attr("y2", function(d) { return radialPoint(d.target.x,d.target.y)[1]; });

  var node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { return "translate(" + radialPoint(d.x, d.y) + ")"; })
      .attr("districts", function(d) { return d.data.tup;})
            .attr("idno", function(d) {return d.data.name;})
  /*.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))*/

            .on("click",
                swapgraph)

      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})

      .on("mouseover",function(){
        var c = d3.select(this);
        g.selectAll("rect").each(function(){
            if (d3.select(this).data()[0].data.name == c.data()[0].data.name){
                d3.select(this).style("stroke-width",6);
                return;
            }
        });
   
       
        tooltip.style("visibility", "visible");
        tooltip.html('<p style="margin:0;padding:0;font-size:50px;letter-spacing:-10px;line-height:35px;">' + d3.select(this).data()[0].data.html_rep + "</p>");

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

  node.append("rect").attr("width", 27)//90
      .attr("height", 27)//90
      .style("stroke", "#666")
      .style("stroke-width",2)
       .attr("x", -10)//-37
      .attr("y", -10)//-37
      .attr("str_rep", function(d){ return d.data.str_rep.split('\n').join("").split(" ").join("");})
      .attr("idno", function(d) {return d.data.name;})
        .attr("districts", function(d) { return d.data.tup;})
        .style("fill", function(d) {return get_my_col(d);})
  /*node.append("image")
      .attr("xlink:href", function(d) {return "m5-imgs/whole/im_"+d.data.name+".png";})
      .attr("x", -30)
      .attr("y", -30)
      .attr("width", 75)
      .attr("height", 75)
      .attr("html_rep", function(d) {return d.data.html_rep;})*/

 node.append("foreignObject")
 .attr("width",40)
 .attr("height", 27)
 .attr("x",-16)
 .attr("y",-17)
 .append("xhtml:body")
 
 .html(function(d) {return '<p style="margin:0;padding:0;font-size:6px;letter-spacing:-1px;line-height:5px;">'+d.data.html_rep+'</p>';});  
 

});


}
function radialPoint(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}



mk_gr("m5-graphs/whole_trees2/g0.json",0);

  
 function cl_gr(){
       svg.selectAll(".link").remove();
    svg.selectAll(".node").remove();
 }
  



//////////////////////
var grd = d3.select('body').append('svg')
  .attr("width", width/3)
  .attr("height",height/1.5)

  .attr("transform","translate("+width/9+","+height/4+")");
  
  
var chk = "";
var dist1 = 0;
var dist2 = 0;
var dist3 = 0;
var dist4 = 0;
var dist5 = 0;
var cnt = 0;  
  

var simp_fill = ['#244999','#BBAA90','#D22532'];

// calculate number of rows and columns
var squaresRow = 5;
var squaresColumn = 5;
var square=25;

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
    .style("stroke-width",1)
    
    
    
    .on("mouseover",function(d){
        d3.select(this).style("stroke","#000");
        d3.select(this).style("stroke-width","3");
    })
    
    .on("mouseout", function(d){
        d3.select(this).style("stroke","#555");
        d3.select(this).style("stroke-width","1")
    })
    
    .on("click", function(d){
     clsq = true;
     do_update(this);
     //do_update2();
     get_col();
     compute_hists();
    }
    );


});
    
  
function do_update(r){
   
    //if (d3.event != null && d3.event.defaultPrevented) return;
        if (d3.event != null && r != -1){
            var t = parseInt(d3.select(r).attr("party"));
            d3.select(r).attr("party", t+1);
            if (d3.select(r).attr("party") == 2){d3.select(r).attr("party",-1);}
        }
  


    grd.selectAll('rect').each(function(d){
        //console.log(d3.select(this).attr("party"));
        if (d3.select(this).attr("party") == 0) d3.select(this).style("fill", simp_fill[1]);
        if (d3.select(this).attr("party") == 1) d3.select(this).style("fill", simp_fill[2]);
        if (d3.select(this).attr("party") == -1) d3.select(this).style("fill", simp_fill[0]);

    })

        r_win_i = [0,0,0,0,0,0];
        b_win_i = [0,0,0,0,0,0];
        n_win_i = [0,0,0,0,0,0];


        
}

function get_my_col(rect){
    var cnt = 0;
  var chk = dist_wins;

 distloop = rect.data.tup;
             for(var i=0;i<5;i++){
             cnt += Math.sign(chk[distloop[i]]);
            }
            
            
            var col = Math.sign(cnt) + 1;
            return simp_fill[col];
}
/*
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
        d3.select(this).style("fill", simp_fill[col]);
        });
    clsq = false;
    }
 */   
function get_col(){
        
        var chk = compute_hists();
        
        dist1=0;
        dist2=0;
        dist3=0;
        dist4=0;
        dist5=0;
        cnt=0;

        svg.selectAll("rect").each(function(){
            distloop = d3.select(this).attr("districts");
            distloop = JSON.parse("[" +  distloop.split("(").join("").split(")").join("") + "]")
            for(var i=0;i<5;i++){
             cnt += Math.sign(chk[distloop[i]]);
            }

        
   
        

        var col = Math.sign(cnt) + 1;
        d3.select(this).style("fill", simp_fill[col]);
    
    });
}


/*function compute_hists(){
        r_win_i = [0,0,0,0,0,0];
        b_win_i = [0,0,0,0,0,0];
        n_win_i = [0,0,0,0,0,0];    
    for(var i=0; i<Object.keys(plan_strings).length; i++){
        
        
        var chk = plan_strings[i];

        dist1=0;
        dist2=0;
        dist3=0;
        dist4=0;
        dist5=0;
        cnt=0;
        rwin = 0;
        bwin = 0;

        
        
        grd.selectAll("rect").each(function(e){

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
    
}
    
    console.log(b_win_i,r_win_i);

}*/




function compute_hists() {
    var st;
    r_win_i = [0,0,0,0,0,0];
    b_win_i = [0,0,0,0,0,0];
    n_win_i = [0,0,0,0,0,0];  
    Object.keys(dist_wins).forEach(v => dist_wins[v] = 0);
    Object.keys(plan_wins).forEach(v => plan_wins[v] = [0,0]);

    for(var i=0; i<Object.keys(dist_strings).length; i++){
    var cnt = 0;
    var tot = 0;
        st = dist_strings[i];
        grd.selectAll("rect").each(function(e){

            var b = parseInt(d3.select(this).attr("party"));
            tot = tot + (b*st[cnt]);
            cnt = cnt+1;

        });
        
        dist_wins[i] = Math.sign(tot);
        
        

    }
    for (var key in plan_wins){
            var key2 = JSON.parse("[" +  key.split("(").join("").split(")").join("") + "]");
        for (var d=0;d<5;d++){
            
            var c = dist_wins[key2[d]];
            if (c>0){plan_wins[key][0] +=1;}
            if (c<0){plan_wins[key][1] +=1;}
            
            
            
        }
        
       r_win_i[plan_wins[key][0]] +=1;
       b_win_i[plan_wins[key][1]] +=1;
        
        
    }
    update_textboxes();
  return dist_wins;
}




//get_col();


function swapgraph(){
    var newgr = d3.select(this).data()[0].data.name;
    console.log(newgr);
    if (d3.event.defaultPrevented) return;
    if (idno == d3.select(this).data()[0].data.name) return;
              tooltip.style("visibility", "hidden");
  

            tooltip.transition()		
                .duration(200)		
                .style("opacity", 0);
                
                
                
    tx = d3.select(this).attr("cx");
    ty = d3.select(this).attr("cy");
   
    var n = 0;

    
    
    svg.selectAll("g").each(function(){n++;})
    .transition()
    .duration(200)
    .style("opacity",0)
    .on("end",function(){n--;if(!n){cl_gr();
                                    mk_gr("m5-graphs/whole_trees2/g"+newgr+".json", newgr);
                                    svg.selectAll("g").transition()
    .duration(200)
    .style("opacity",1);
                                   }
                        });
    var cnt = 0;
    var chk = compute_hists();

    do_update(-1);


    
    
    
    //mk_gr("m5-graphs/whole_trees2/g"+d3.select(this).data()[0].data.name+".json", d3.select(this).data()[0].data.name);
    
/*
    var svg2 = jQuery.extend(true, {}, svg);
    svg.transition()		
        .duration(2000)		
        .style("opacity",0);	
    svg.selectAll(".link").remove();
    svg.selectAll(".node").remove();
    mk_gr("m5-graphs/whole_trees2/g"+d3.select(this).data()[0].data.name+".json", d3.select(this).data(

    )[0].data.name);
        svg.transition()
        .duration(2000)
        .style("opacity",1);
            svg2.transition()		
        .duration(2000)		
        .style("opacity",0);	
    delete svg2;*/

    //do_update2();

    
}
compute_hists();
