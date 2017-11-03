// accepts data as argument and assigns circle fill based on doping allegations
function color(data) {
  if (data.Doping !== '') {
    return '#ff4819'; // returns red
  }
  return '#64b214'; // returns green
}
// main function of program
function main(dataSet) {
  // assigns constants for svg
  const width = 1100;
  const height = 600;
  const padding = 100;
  const radius = 10;
  // sets x scale based on performance times in seconds, sorted largest to smallest
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataSet, d => d.Seconds).sort((a, b) => b - a))
    .range([padding, width - padding]); // accounts for padding
  // sets y scale based on all time ranking for cyclist, lowest finish to best
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataSet, d => d.Place).sort((a, b) => b - a))
    .range([height - padding, padding]); // accounts for padding
  // sets x axis
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d')) // removes commas from numbers
    .tickSizeOuter(0)
    .tickSizeInner(-height + (2 * padding)); // sets up inner grid for graph

  const yAxis = d3.axisLeft(yScale)
    .tickValues([35, 30, 25, 20, 15, 10, 5, 1]) // manually assigns tick values
    .tickSizeOuter(0)
    .tickSizeInner(-width + (2 * padding)); // sets up inner grid for graph
  // appends svg to empty #main div
  const svg = d3.select('#main')
    .append('svg')
    // assigns predetermined values to dimensions
    .attr('height', height)
    .attr('width', width)
    .style('margin-left', `${-width / 2}px`) // responsive margin to account for setting 50% left in CSS
    .classed('svg', true);
  // properly positions and calls x axis
  svg.append('g')
    // translates down
    .attr('transform', `translate(0, ${(height - padding)})`)
    .classed('info', true)
    .classed('xAxis', true)
    .call(xAxis);
  // properly positions and calls y axis
  svg.append('g')
    // translates right
    .attr('transform', `translate(${padding}, 0)`)
    .classed('info', true)
    .classed('yAxis', true)
    .call(yAxis);
  // appends data circles to svg
  const circles = svg.selectAll('circle')
    .data(dataSet)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.Seconds)) // x coordinate based on time
    .attr('cy', d => yScale(d.Place)) // y coordinate based on ranking
    .attr('r', radius)
    .classed('circles', true)
    .style('fill', d => color(d)) // calls color() to assign color based on doping allegations
    .style('stroke', '#2a2a2a');
  // title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', padding / 2.2)
    .classed('info', true)
    .style('font-size', '2em')
    .style('text-anchor', 'middle')
    .text('Doping in Pro Cycling');
  // subtitle
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', (padding / 2.2) + 25)
    .classed('info', true)
    .style('font-size', '1em')
    .style('text-anchor', 'middle')
    .text('35 Fastest Times Ascending Alpe d\'Huez, Auvergne-Rhone-Alpes');
  // subtitle
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', (padding / 2.2) + 50)
    .classed('info', true)
    .style('font-size', '1em')
    .style('text-anchor', 'middle')
    .text('Performance Place/Time (cyclists with doping allegations/associations noted by orange circles)');
  // y axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('dy', padding / 2)
    .classed('info', true)
    .style('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .text('Ranking (All Time)');
  // x axis label
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - (padding / 2.2))
    .classed('info', true)
    .style('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .text('Time (Seconds)');
  // footer text
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - (padding / 6))
    .classed('info', true)
    .style('font-size', '0.8em')
    .style('letter-spacing', '0.5px')
    .style('text-anchor', 'middle')
    .text('Design & Development By Jonathan M. Brunt | 2017 | Data Courtesy of FCC, https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
  // data tooltip
  const tooltip = d3.select('body')
    .append('div')
    .classed('tooltip', true);

  // reveals tooltip data for circles
  function tooltipOn(d) {
    tooltip
      .style('left', `${d3.event.x + 15}px`)
      .style('top', `${d3.event.y - (tooltip.node().offsetHeight / 1.5)}px`)
      .style('opacity', '0.95')
      .html(`
        <p>${d.Name}</p>
        <p>${d.Year}</p>
        <p>${d.Doping}</p>
      `);
  }
  // hides tooltip data display
  function tooltipOff() {
    tooltip
      .style('opacity', '0');
  }
  // tooltip activation/deactivation
  circles
    .on('mousemove', tooltipOn)
    .on('touchstart', tooltipOn)
    .on('mouseout', tooltipOff)
    .on('touchend', tooltipOff);
}
// AJAX
const makeRequest = async () => {
  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
  let dataSet = [];
  await $.getJSON(url, (results) => {
    dataSet = [...results]; // spread operator to assign data to constant
  });
  main(dataSet); // calls main() passing JSON as argument
};
// initializes on page load when DOM ready
document.addEventListener('DOMContentLoaded', makeRequest());
