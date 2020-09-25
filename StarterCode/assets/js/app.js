// @TODO: YOUR CODE HERE!
//Healthcare vs. Poverty 

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);
var textGroup =svg.append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

    // Step 2: Create scale functions
    // ==============================
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare)-3, d3.max(healthData,d => d.healthcare) +3])
      .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.poverty)-1, d3.max(healthData,d => d.poverty) +1])
      .range([0, width]);

    // Step 3: Create axis functions
    // ==============================
    var yAxis = d3.axisLeft(yLinearScale);
    var xAxis = d3.axisBottom(xLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Step 5: Create Circles
    // and state abbrv. for circles 
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "black")
    .attr("opacity", ".5");

    var circlesText = textGroup.selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr(function(d){return(d.abbr);})

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${(d.poverty)} ${(d.healthcare)}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    circlesGroup.call(toolTip);
    circlesText.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    
    circlesText.on("mouseover", function(d) {
        toolTip.show(d);
      })
        // onmouseout event
        .on("mouseout", function(d){
            toolTip.hide(d);
        })


    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Number of Billboard 100 Hits");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Hair Metal Band Hair Length (inches)");
  }).catch(function(error) {
    console.log(error);
  });
