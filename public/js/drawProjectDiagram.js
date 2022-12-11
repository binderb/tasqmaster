async function drawGraph(svgEl,projectID) {

  const projectDataResponse = await fetch('/api/projects/'+projectID);
  const projectData = await projectDataResponse.json();

  const svg = d3.select(svgEl);
  const margin = 20;
  const diameter = 500; // Same as svg viewBox dimensions
    
  const g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  const pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  const root = d3.hierarchy(projectData)
    .sum(function(d) { return d.size; })
    .sort(function(a, b) { return b.value - a.value; });

  let focus = root;
  let nodes = pack(root).descendants();
  let view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function(d) { 
      return pickClasses(d, focus);
    })
    .style("fill", function(d) { 
      return pickColors(d, focus);
    })
    .on("click", function(d) { 
      // if (focus.children.includes(d) || focus.parent === d) {
      //   zoom(d);
      //   helpers.displayTaskDetails(d.data);
      //   d3.event.stopPropagation();
      // } else if (d === focus) {
      //   helpers.displayTaskDetails(d.data);
      //   d3.event.stopPropagation();
      // } else {
      //   d3.event.stopPropagation();
      // }
      if (!d.parent) {
        zoom(d);
        helpers.displayProjectDetails();
        d3.event.stopPropagation();
        return;
      }
      if (d.children) {
        zoom(d);
        helpers.displayTaskDetails(d.data);
        d3.event.stopPropagation();
      } else {
        helpers.displayTaskDetails(d.data);
        d3.event.stopPropagation();
      }
    });

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
    .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
    .text(function(d) { return d.data.title; });

  var node = g.selectAll("circle,text");

  svg.style("background", null).on("click", function(d) { 
    zoom(root);
    helpers.displayProjectDetails();
  });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom (d) {
    var focus0 = focus; 
    focus = d;
  
    var transition = d3.transition()
    .duration(d3.event.altKey ? 7500 : 750)
    .tween("zoom", function(d) {
      var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
      return function(t) { zoomTo(i(t)); };
    });

    transition.selectAll("circle")
      .attr('class', d => pickClasses(d, focus));

    // transition.on('end', function() {
    //   transition.selectAll("circle")
    //   .attr('class', d => pickClasses(d, focus));
    // });
  
    transition.selectAll("text")
    .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
    .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
    .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
    .on("end", function(d) { 
      if (d.parent !== focus) this.style.display = "none"; 
    });
  }
  
  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
}

function pickColors (d, focus) {
  const color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  let fill;
  // if (d.children) {
  //   fill = color(d.depth);
  // } else {
  //   fill = 'white';
  // }
  fill = color(d.depth);
  if (d.parent === focus) {
    // fill = 'red';
  }
  return fill;
}

function pickClasses (d, focus) {
  const color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  let nodeClass;
  if (focus.children.includes(d) || focus.parent === d) {
    nodeClass = 'node';
  } else if (d === focus) {
    nodeClass = 'node selected';
  } else {
    nodeClass = 'node disabled';
  }
  // if (d.parent === focus) {
  //   nodeClass = 'node';
  // } else {
  //   nodeClass = 'node disabled';
  // }
  return nodeClass;
}

const projectID = document.querySelector('#diagram').getAttribute('data-project-id');
drawGraph('#diagram',projectID);