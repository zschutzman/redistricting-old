var width = Math.round(1*document.documentElement.clientWidth)
    height = Math.round(1*document.documentElement.clientHeight)
    idno = 0;
    

var w = width;

var h = height;
var lx=-1;
var ly=-1;

var simp_fill = ['#244999','#BBAA90','#D22532'];

// calculate number of rows and columns
var squaresRow = 5;
var squaresColumn = 5;
var square=25;

  
    
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
   

 var request = new XMLHttpRequest();
   request.open("GET", "./dist2html.json", false);
   request.send(null)
   var dist2html = JSON.parse(request.responseText);
   

 var request = new XMLHttpRequest();
   request.open("GET", "./partial_plan_tree.json", false);
   request.send(null)
   var partial_plan_tree = JSON.parse(request.responseText);
   

 var request = new XMLHttpRequest();
   request.open("GET", "./part_plan2html.json", false);
   request.send(null)
   var part_plan2html = JSON.parse(request.responseText);

   
 var request = new XMLHttpRequest();
   request.open("GET", "./dist_lookup.json", false);
   request.send(null)
   var dist_lookup = JSON.parse(request.responseText);

console.log(dist_lookup);
   
for (var key in plan_wins){
    plan_wins[key] = JSON.parse("[" +  plan_wins[key].split("(").join("").split(")").join("") + "]");}
      
var r_win_i = [0,0,0,0,0,0];
var b_win_i = [0,0,0,0,0,0];
var n_win_i = [0,0,0,0,0,0];
var rwin = 0;
var bwin=0;




var hoff = 130;
var voff = 15;


var plan = [];


function testclick(){
    plan.push(parseInt(d3.select(this).attr("distno")));
  
    distbox.selectAll("g").remove();
    if (plan.length ==5){
     
        var newgr = "("+plan.join(", ")+")";
        console.log(newgr);
        newgr = dist_lookup[newgr];
        console.log(newgr);
        var n = 0;
        if (newgr !=idno){
               graph.selectAll("g").each(function(){n++;})
    .transition()
    .duration(200)
    .style("opacity",0)
    .on("end",function(){n--;if(!n){cl_gr();
                                    mk_gr("m5-graphs/whole_trees2/g"+newgr+".json", newgr);
                                    graph.selectAll("g").transition()
    .duration(200)
    .style("opacity",1);
                                   }
                        });
        }
    
        
        
        plan = [];}
    constr_distbox();
    
}



var distbox = d3.select("body").append("svg")
            .attr("width",300)
            .attr("height",800);

distbox.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",100)
    .attr("height",15)
    .style("fill","red")
    .on("click", function(d) {
        plan = [];
        distbox.selectAll("g").remove();
        constr_distbox();
    })
distbox.append("text")
   .attr("x",0)
   .attr("y",7)
   .text("RESET")
   .attr('dy','0.35em')
       .on("click", function(d) {
        plan = [];
        distbox.selectAll("g").remove();
        constr_distbox();
       });
distbox.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",100)
    .attr("height",15)
    .style("fill","red")
    .style("fill-opacity",0)
    .on("click", function(d) {
        plan = [];
        distbox.selectAll("g").remove();
        constr_distbox();
    })


 function constr_distbox(){      
            var wgrp = distbox.append("g").attr("transform","translate(0,15)");
            var i = 0;
            var j = 0;
if (plan.length == 0){
for (var k=0; k<40; k++){
    if (partial_plan_tree["("+k+")"] != null){
        var kk = "("+k+")";
        

            
            
                  wgrp.append("foreignObject")
                    .attr("width",35)
                    .attr("height", 35)
                    .attr("x",30+j*4*voff)
                    .attr("y",30+i*4*voff)
                    .append("xhtml:body").html(function(d) {return '<p style="margin:0;padding:0;font-size:12px;letter-spacing:-1px;line-height:9px;">'+part_plan2html[kk]+'</p>';})
                    
            wgrp.append("rect")
                .attr("width",50)
                .attr("height", 50)
                .attr("x",35+j*4*voff)
                .attr("y",35+i*4*voff)
                .style("stroke-width",2)
                .style("stroke","purple")
                .style("fill-opacity",0)
                .attr("distno", k)
                .on("click",testclick);
            
                
                
            j+=1;
            if (j==4){j=0; i+=1;}
                }
}
}



else if (plan.length >= 1){
    var plkey = "(" + plan.join(", ") + ")";

    var i= 0;
    var j = 0;
    for (var k=0; k<partial_plan_tree[plkey].length; k++){
       var kk = partial_plan_tree[plkey][k];
       var dno =  kk[kk.length-1];
       kk = "(" + kk.join(", ") + ")"
       
       
                  wgrp.append("foreignObject")
                    .attr("width",35)
                    .attr("height", 35)
                    .attr("x",30+j*4*voff)
                    .attr("y",30+i*4*voff)
                    .append("xhtml:body").html(function(d) {return '<p style="margin:0;padding:0;font-size:12px;letter-spacing:-1px;line-height:9px;">'+part_plan2html[kk]+'</p>';})
                    
            wgrp.append("rect")
                .attr("width",50)
                .attr("height", 50)
                .attr("x",35+j*4*voff)
                .attr("y",35+i*4*voff)
                .style("stroke-width",2)
                .style("stroke","purple")
                .style("fill-opacity",0)
                .attr("distno", dno)
                .on("click",testclick);
            
            
                
                
            j+=1;
            if (j==4){j=0; i+=1;}
    }}
    
    
    


 }
 constr_distbox();
