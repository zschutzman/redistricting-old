var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width, 
    height = canvas.height;

// FAIL
// // http://stackoverflow.com/questions/6838461/can-canvas-context-filltext-be-made-crisp-because-context-translate-0-5-0-5-doe
// canvas.mozOpaque = true;

var tree = d3.tree();
    
    
function mk_gr(fn){
d3.json(fn, function(error, treeData) {
  if (error) throw error;

  var root = d3.stratify(treeData).id(function(d) {return d.id;});
  tree(root);

  var nodes = root.descendants()
      links = root.links();

  var linkDist = function(d) {
    return d.target.children ? 30*d.target.children.length: 200 };
  
  var nodeGrav = function(d) {
      return d.children ? 300:-300};

  var simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-3000))
      .force("centering", d3.forceManyBody())
      .force("link", d3.forceLink(links).strength(0.7)
      .distance(linkDist))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      
      .on("tick", ticked);

  d3.select(canvas)
      .call(d3.drag()
          .container(canvas)
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    links.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    nodes.forEach(drawNode);
    context.fill();
    context.strokeStyle = "#fff";
    context.stroke();

    context.restore();
  }

  function dragsubject() {
    return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
  }

  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }

  function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
  }

  function drawNode(d) {
    context.moveTo(d.x, d.y);
    context.font = "10px Arial";
    //context.fillText(d.data.id.substr(d.data.id.lastIndexOf('/') + 1), d.x, d.y);
  }
});
}

mk_gr("m5-graphs/whole_trees/g0.json");
