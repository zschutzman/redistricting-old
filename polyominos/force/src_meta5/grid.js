var parties = [-1,1];

var grd = d3.select('body').append('svg')
  .attr("width", (square*6))
  .attr("height",square*6)

  .attr("transform","translate(-50,-500)");
  
  
var chk = "";
var dist1 = 0;
var dist2 = 0;
var dist3 = 0;
var dist4 = 0;
var dist5 = 0;
var cnt = 0;  

var ptmp;


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
    
    .attr("party",function(d) {return parties[Math.floor(Math.random() * 2)];})
    .style("fill",function(d) {console.log(1+parseInt(d3.select(this).attr("party"))); return simp_fill[1+parseInt(d3.select(this).attr("party"))];})
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
     get_col();
     //compute_hists();
     update_textboxes();
    }
    );


});
    
  
function do_update(r){
        if (d3.event != null && r != -1){
            var t = parseInt(d3.select(r).attr("party"));
            d3.select(r).attr("party", t+2);
            if (d3.select(r).attr("party") == 3){d3.select(r).attr("party",-1);}
        }
  

    grd.selectAll('rect').each(function(d){
        if (d3.select(this).attr("party") == 0) d3.select(this).style("fill", simp_fill[1]);
        if (d3.select(this).attr("party") == 1) d3.select(this).style("fill", simp_fill[2]);
        if (d3.select(this).attr("party") == -1) d3.select(this).style("fill", simp_fill[0]);

    })

        r_win_i = [0,0,0,0,0,0];
        b_win_i = [0,0,0,0,0,0];
        n_win_i = [0,0,0,0,0,0];


        
}
