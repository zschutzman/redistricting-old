var winbox = d3.select("body").append("svg")
            .attr("width",350)
            .attr("height",200)
            .attr("transform","translate(0,-400)")


            
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

            
function update_textboxes(){
    
wgrp.selectAll("text").each(function(d){
    
    var i = d3.select(this).attr("i");
    var p = d3.select(this).attr("party");
    if (i != null){
        if (p=='r'){
            d3.select(this).text("Red Wins " + i + ": " + r_win_i[i]);
        }
        if (p=='b'){
                d3.select(this).text("Blue Wins " + i + ": " + b_win_i[i]);
        }
    }
     
 });
}

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
