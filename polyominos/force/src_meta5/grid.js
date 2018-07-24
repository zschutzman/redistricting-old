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
     get_col();
     compute_hists();
    }
    );


});
    
  
function do_update(r){
   
        if (d3.event != null && r != -1){
            var t = parseInt(d3.select(r).attr("party"));
            d3.select(r).attr("party", t+1);
            if (d3.select(r).attr("party") == 2){d3.select(r).attr("party",-1);}
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
