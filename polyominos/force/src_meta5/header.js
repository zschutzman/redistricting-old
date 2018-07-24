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
   
   
for (var key in plan_wins){
    plan_wins[key] = JSON.parse("[" +  plan_wins[key].split("(").join("").split(")").join("") + "]");}
      
var r_win_i = [0,0,0,0,0,0];
var b_win_i = [0,0,0,0,0,0];
var n_win_i = [0,0,0,0,0,0];
var rwin = 0;
var bwin=0;

console.log(partial_plan_tree);

for (var key in partial_plan_tree){
    var k = JSON.parse("[" +  key.split("(").join("").split(")").join("") + "]")
    console.log(k.length);
}

var hoff = 130;
var voff = 15;









var distbox = d3.select("body").append("svg")
            .attr("width",200)
            .attr("height",70000);

            
            var wgrp = distbox.append("g").attr("transform","translate(0,15)");
            
            for (var i=0;i<Object.keys(dist2html).length;i++){
                console.log(dist2html[i]);
            wgrp.append("foreignObject")
                    .attr("width",70)
                    .attr("height", 70)
                    .attr("x",70)
                    .attr("y",100+i*8*voff)
                    .append("xhtml:body").html(function(d) {return '<p style="margin:0;padding:0;font-size:25px;letter-spacing:-1px;line-height:20px;">'+dist2html[i]+'</p>';});  
                }
            
