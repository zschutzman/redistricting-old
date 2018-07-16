



// create the svg
var grd = d3.select('#grid').append('svg')
  .attr({
    width: w,
    height: h
  });


// calculate number of rows and columns
var squaresRow = 4;
var squaresColumn = 4;
var square=70;

// loop over number of columns
_.times(squaresColumn, function(n) {

  // create each set of rows
  var rows = grd.selectAll('rect' + ' .row-' + (n + 1))
    .data(d3.range(squaresRow))
    .enter().append('rect')
    

    
    
    
    
    .attr({
      class: function(d, i) {
        return 'square row-' + (n + 1) + ' ' + 'col-' + (i + 1);
      },
      id: function(d, i) {
        return 's-' + (n + 1) + (i + 1);
      },
      width: square,
      height: square,
      x: function(d, i) {
        return (i * 1.07*square);
      },
      y: (n * 1.07*square),
    })
    
    .attr("party",0)
    .style("fill","#a9d")
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
    
    .on("click", function(){
        var t = parseInt(d3.select(this).attr("party"));
        d3.select(this).attr("party", t+1);
        if (d3.select(this).attr("party") == 2){d3.select(this).attr("party",-1);}
        console.log(d3.select(this).attr("party"));
  

    // test with some feedback
  /*  var test = rows.on('mouseover', function (d, i) {
 
      d3.selectAll('.square').attr('fill', 'white');
      d3.select(this).attr('fill', '#7AC143');
    }); */
    


    grd.selectAll('rect').each(function(d){
        if (d3.select(this).attr("party") == 0) d3.select(this).style("fill", "#555");
        if (d3.select(this).attr("party") == 1) d3.select(this).style("fill", "red");
        if (d3.select(this).attr("party") == -1) d3.select(this).style("fill", "blue");

    });
    vis.selectAll("circle.node").each(function(d){
       var chk = d3.select(this).attr("str_rep");
       var d1 = 0,
           d2 = 0,
           d3 = 0,
           d4 = 0;
        var ct = 0;
        grd.selectAll("rect").each(function(e){
            if (chk[ct] == 1){
            d1 = d1 + parseInt(d3.select(this).attr("party")) * parseInt(chk[ct]);
            } else  if (chk[ct] == 2){
            d2 = d2 + parseInt(d3.select(this).attr("party")) * parseInt(chk[ct]);
            }else   if (chk[ct] == 3){
            d3 = d3 + parseInt(d3.select(this).attr("party")) * parseInt(chk[ct]);
            }else   if (chk[ct] == 4){
            d4 = d4 + parseInt(d3.select(this).attr("party")) * parseInt(chk[ct]);
                       }
        });
        d1 = Math.sign(d1);
        d2 = Math.sign(d2);
        d3 = Math.sign(d3);
        d4 = Math.sign(d4);
        
        var col = 5 + d1 + d2 + d3 + d4;
        d3.select(this).style("fill", fill(col));
        
    });
});
});
    
 
    
  
    
    
    






    
    
    
    
