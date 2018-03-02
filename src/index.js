/*global fetch*/
import * as d3 from "d3";
import 'd3-selection-multi'

import styles from './index.scss'

const height = window.innerHeight * 0.7;
const width = window.innerWidth * 0.7;
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
        console.log(j)
        
    })