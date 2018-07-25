var width = Math.round(1*document.documentElement.clientWidth)
    height = Math.round(1*document.documentElement.clientHeight)
    idno = 0;
    

var w = width;

var h = height;
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
console.log(part_plan2html);


   
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
    console.log("CLICKY");
    console.log(d3.select(this).attr("distno"));
    plan.push(parseInt(d3.select(this).attr("distno")));
    console.log(plan);
  
    distbox.selectAll("g").remove();
    constr_distbox();
    
}



var distbox = d3.select("body").append("svg")
            .attr("width",600)
            .attr("height",1200);

 function constr_distbox(){           
            var wgrp = distbox.append("g").attr("transform","translate(0,15)");
            var i = 0;
            var j = 0;
if (plan.length == 0){
for (var k=0; k<40; k++){
    if (partial_plan_tree["("+k+")"] != null){
        var kk = "("+k+")";
        

            
            
            wgrp.append("foreignObject")
                    .attr("width",70)
                    .attr("height", 70)
                    .attr("x",70+j*8*voff)
                    .attr("y",100+i*8*voff)
                    .append("xhtml:body").html(function(d) {return '<p style="margin:0;padding:0;font-size:25px;letter-spacing:-1px;line-height:20px;">'+part_plan2html[kk]+'</p>';})
                    
            wgrp.append("rect")
                .attr("width",115)
                .attr("height", 115)
                .attr("x",70+j*8*voff)
                .attr("y",100+i*8*voff)
                .style("stroke-width",5)
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
       console.log(kk);
       var dno =  kk[kk.length-1];
       console.log(dno, "DNO");
       kk = "(" + kk.join(", ") + ")"
       
       
                  wgrp.append("foreignObject")
                    .attr("width",70)
                    .attr("height", 70)
                    .attr("x",70+j*8*voff)
                    .attr("y",100+i*8*voff)
                    .append("xhtml:body").html(function(d) {return '<p style="margin:0;padding:0;font-size:25px;letter-spacing:-1px;line-height:20px;">'+part_plan2html[kk]+'</p>';})
                    
            wgrp.append("rect")
                .attr("width",115)
                .attr("height", 115)
                .attr("x",70+j*8*voff)
                .attr("y",100+i*8*voff)
                .style("stroke-width",5)
                .style("stroke","purple")
                .style("fill-opacity",0)
                .attr("distno", dno)
                .on("click",testclick);
            
                
                
            j+=1;
            if (j==4){j=0; i+=1;}
    }}
    
    
    


 }
 constr_distbox();
