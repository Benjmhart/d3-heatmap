/*global fetch*/
import * as d3 from "d3";
import 'd3-selection-multi'

import styles from './index.scss'

window.d3=d3
const height = window.innerHeight * 0.7;
const width = window.innerWidth * 0.9;
const svg = d3
  .select("body")
  .append("svg")
  .attrs({
    height,
    width
  });

fetch(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
    .then(r=>r.json()).then(j=>{
        const data = j.monthlyVariance
        const months = d3.range([1,12])
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN','JUL','AUG','SEP', 'OCT', 'NOV', 'DEC' ]
        const pad = 90
        const monthHeight = (height-(pad*2))/12
        
        const monthScale = d3.scaleLinear()
          .domain([1,12])
          .range([pad, height-(pad*2)])
        const monthAxis = d3.axisLeft(monthScale)
          .tickValues([  1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5,8.5,9.5, 10.5, 11.5, 12.5])
          .tickFormat(x => monthNames[Math.floor(x-1) ]);
        const years = data.map(x=>x.year)
        const yearWidth = Math.ceil(((width-(pad*2))/years.length)*(width/150))
        const yearScale = d3.scaleLinear()
          .domain([d3.min(years), d3.max(years)])
          .range([pad, width-(pad*2)])
        const yearsAxis= d3.axisBottom(yearScale).tickFormat(d3.format("d"))
        const temps = data.map(x=>x.variance)
        const colorScale = d3.scaleLinear()
          .domain([d3.min(temps), 0, d3.max(temps)])
          .range(["blue", "yellow",  "red"])
        
        svg.selectAll('rect.datapoint')
          .data(data)
          .enter()
          .append('rect')
          .attrs({
            "class": "datapoint",
            height: monthHeight,
            width: yearWidth,
            x: d=>yearScale(d.year),
            y: d=>monthScale(d.month),
            fill: d=>colorScale(d.variance)
          })
          
          svg
      .append("g")
      .attrs({
        transform: `translate(${[0, height - pad- 50]})`
      })
      .call(yearsAxis);
      
    svg
      .append("g")
      .attrs({
        transform: `translate(${[pad, 0]})`
      })
      .call(monthAxis);
    svg.append('text')
      .attrs({
        "text-anchor":"center",
        x:(width/2)-(pad/2),
        y:height-pad
      }).text("Year")
      svg
        .append("text")
        .attrs({
          fill: "black",
          "text-anchor": "center",
          x: (height/2)* -1,
          y: pad/2,
          transform: "rotate(-90)"
        })
        .text("Month")
      svg.append('text')
      .attrs({
        "text-anchor":"center",
        x:(width)-(pad * 4.125),
        y:height-pad
      }).text("Legend")
      
      const legendArr=[-8, -6, -4, -2, 0, 2, 4, 6, 8]
      const legendScale = d3. scaleLinear()
        .domain([-8, 8])
        .range([(width)-(pad * 5), (width)-(pad * 3)])
      const legendWidth= ((width-(pad*3)) - (width-(pad*5))) / legendArr.length
      
      const legendAxis = d3.axisBottom(legendScale)
          .tickFormat(x => `${x}°C`);
      
      const legend = svg.selectAll('rect.legend')
        .data(legendArr)
        .enter()
        .append('rect')
        .attrs({
          "class":"legend",
          x:d=>legendScale(d),
          y:height-(pad-8),
          fill: d=>colorScale(d),
          height:15,
          width:legendWidth
        })
      
      svg.append('g')
        .attrs({
          transform: `translate(${[10, height - (pad/1.35)]})`,
        }).call(legendAxis)
      
      function handleMouseOver(d,i) {
        
      const fo = svg.append("foreignObject").attrs({
        fill: "black",
        x: yearScale(d.year) - 175/2,
        y: monthScale(d.month) - (monthHeight*1.5),
        width: 175,
        class: `svg-tooltip-${i}`,
        height: monthHeight* 1.5
      })
      
      
      const div = fo
        .append("xhtml:div")
        .append("div")
        .attrs({ class: "tooltip", "background-color": "black" });
        
      div.append('p')
       .attrs({
         color:"white"
       }).text(`${d.year} - ${monthNames[d.month-1]}`)
       
      div.append('p')
       .attrs({
         color:"white"
       }).text(`Variance: ${d.variance}°C`)
      }
      
      function handleMouseOut(d,i){
        svg.select(`.svg-tooltip-${i}`).remove()
      }
      
      const datapoints = svg.selectAll('rect.datapoint')
      datapoints.on('mouseover', (d,i)=>handleMouseOver(d,i))
      datapoints.on('mouseout', (d,i)=>handleMouseOut(d,i))
    })