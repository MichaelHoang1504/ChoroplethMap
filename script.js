let countyData = [];
let educationData= [];
let svgMap = d3.select('#canvas');
let tooltip = d3.select('.chart')
                .append('div')
                .attr('id','tooltip')
                .style('opacity',0);
let color = ['#eff3ff',
             '#c6dbef',
             '#9ecae1',
             '#6baed6',
             '#4292c6',
             '#2171b5',
             '#084594']

fetch( 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
.then(response=> response.json())
.then(data => {
  countyData = topojson.feature(data,data.objects.counties).features;
 console.log(countyData);
  fetch( 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
.then(response=> response.json())
.then(data => {
    educationData = data;
    let legendContainer = d3.select('#legend');
  let legend = legendContainer
      .selectAll('#legend')
      .data(color)
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (250 /2 - i * 20) + ')';
      });
  legend
      .append('rect')
      .attr('x', 250)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d=> d);
  legend
      .append('text')
      .attr('x', 245)
      .attr('y', 9)
      .attr('dy', '.15em')
      .style('text-anchor', 'end')
      .text(function (d,i) {
        if (i==0) {
          return '< 12%';
        } else if(i==1){
          return '<21%';
        }else if(i==2){
          return '<30%';
        }else if(i==3){
          return '<39%';
        }else if(i==4){
          return '<48%';
        } else if(i==5){
          return '<57%';
        }else return '<60%'
      });

   
    svgMap.selectAll('path')
          .data(countyData)
          .enter()
          .append('path')
          .attr('d',d3.geoPath())
          .attr('class','county')
          .attr('fill', d => {
        let id = d['id'];
        let county = educationData.find( d=> {
          return d['fips'] === id;
        })
        let percentage = county['bachelorsOrHigher'];
      if(percentage <= 12){
        return color[0];
      }else if(percentage <= 21){
        return color[1];
      } else if(percentage <= 30){
        return color[2];
      }else if(percentage <= 39){
        return color[3];
      } else if(percentage <= 48){
        return color[4];
      }else if(percentage <= 57){
        return color[5];
      } else return color[6];
    })
    .attr('data-fips', d => {
      return d['id'];
    })
    .attr('data-education', d => {
      let id = d['id'];
      let county = educationData.find( d=> {
          return d['fips'] === id;
        });
        let percentage =  county['bachelorsOrHigher'];
      return percentage; 
    })
    .on('mouseover', (event, d) => {
      tooltip.style('opacity', 0.9);
      tooltip
        .html(function () {
          var result = educationData.filter(function (obj) {
            return obj.fips === d.id;
          });
          if (result[0]) {
            return (
              result[0]['area_name'] +
              ', ' +
              result[0]['state'] +
              ': ' +
              result[0].bachelorsOrHigher +
              '%'
            );
          }
          return 0;
        })
        .attr('data-education', function () {
          var result = educationData.filter(function (obj) {
            return obj.fips === d.id;
          });
          if (result[0]) {
            return result[0].bachelorsOrHigher;
          }

          return 0;
        })
        .style('left',  event.pageX + 10 + 'px')
        .style('top', event.pageY - 28 + 'px');
    })
    .on('mouseout', function () {
      tooltip.style('opacity', 0);
    });
    
   }).catch(e => console.log(e));
  }).catch(e => console.log(e));