/*
 * Define some variables
 *
 */
const color = [
 'rgba(164, 193, 66, 0.4)',
 'rgba(15, 66, 117, 0.4)'
];
const margin = {
  top: 120,
  bottom: 120,
  left: 200,
  right: 200,
}
const svgWidth = window.innerWidth,
  svgHeight = 800,
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

/*
 * Create the svg and axis container and data container
 *
 */
const svg = d3.select('#canvas').append('svg')
  .attr('id', 'data-svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const axisContainer = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// /*
//  * Create another svg as legend
//  *
//  */
// const legend = d3.select('#canvas').append('svg')
//   .attr('id', 'legend-svg')
//   .attr('width', svgWidth)
//   .attr('height', svgHeight)
//   .append('g')
//   .attr('transform', `translate(${margin.left}, 0)`);
//
// legend.append('circle')
//   .attrs({
//     'r': '50',
//     'cx': '50',
//     'cy': '50',
//     'fill': color[0]
//   });
//
// const text = legend.append('text')
//   .attrs({
//     'text-anchor': 'middle',
//     x: 50,
//     y: 0
//   });
//
// text.append('tspan')
//   .text('Public outrage is higher ')
//   .attrs({
//     x: 50,
//     dy: '1em'
//   });
// text.append('tspan')
//   .text('than the actual hazard')
//   .attrs({
//     x: 50,
//     dy: '1em'
//   });




d3.csv('data/outrage-vs-hazard.csv').then(function(data) {

  let hazard = data.map((d) => +d['Actual Hazard']);
  let outrage = data.map((d) => +d['Public Outrage']);
  let difference = data.map((d) => +d['Absolute difference']);
  const maxRadius = 100;

  /*
   * Define the scales
   *
   */
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(hazard)])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(outrage)])
    .range([height, 0]);

  const diffScale = d3.scaleLinear()
    .domain([0, d3.max(difference)])
    .range([0, maxRadius]);

  /*
   * Create axis and data container
   *
   */
  let bottomAxis = axisContainer.append('g')
    .attr("class", "bottomAxis")
    .attr('transform', `translate(0,${height + 50})`)
    .call(d3.axisBottom(xScale));

  let leftAxis = axisContainer.append('g')
    .attr("class", "leftAxis")
    .call(d3.axisLeft(yScale));


  let bottomAxisLabel = bottomAxis.selectAll('.bottomAxisLabel').data([null]);
  bottomAxisLabel.enter().append('text')
    .attrs({
      class: "bottomAxisLabel",
      fill: "black",
      transform: `translate(${width/2},50)`,
    })
    .style('font-size', '2em')
    .style('font-family', "'Prata', serif")
    .merge(bottomAxisLabel)
    .text('Actual risk of happening');

  let leftAxisLabel = leftAxis.selectAll('.bottomAxisLabel').data([null]);
  leftAxisLabel.enter().append('text')
    .attrs({
      class: "leftAxisLabel",
      fill: "black",
      transform: `translate(-60,${height/2})`,
    })
    .style('font-size', '2em')
    .style('font-family', "'Prata', serif")
    .merge(leftAxisLabel)
    .text('Public outrage');




  /*
   * Draw my data
   *
   */
  const dataContainer = axisContainer.append('g')
    .attr("class", "data");
  dataContainer.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .on('click', bringToTop)
    .attr('id', (d, i) => `c${i}`)
    .attr('cx', (d) => xScale(+d['Actual Hazard']))
    .attr('cy', (d) => yScale(+d['Public Outrage']))
    .attr('r', (d) => diffScale(+d['Absolute difference']))
    .attr('fill', (d) => {
      if (+d['Difference'] < 0) {
        return color[0]
      } else {
        return color[1]
      }
    });

  dataContainer.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text((d) => d['Cause'])
    .attr('x', (d) => xScale(+d['Actual Hazard']))
    .attr('y', (d) => yScale(+d['Public Outrage']))
    .attr('text-anchor', "middle")
    .attr('alignment-baseline', "middle")
    .style('pointer-events', "none")
    .style('user-select', "none");

});

function bringToTop() {
  const use = document.getElementById('use');
  use.setAttribute('xlink:href', `#${this.getAttribute('id')}`);
  console.log(`#${this.getAttribute('id')}`);
}