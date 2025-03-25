<template>
  <svg ref="pieChart" width="400" height="400"></svg>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const pieChart = ref(null);
const data = [
  { value: 1048, name: "Search Engine" },
  { value: 735, name: "Direct" },
  { value: 580, name: "Email" },
  { value: 484, name: "Union Ads" },
  { value: 300, name: "Video Ads" },
];
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;
const margin = { top: 120, right: 20, bottom: 30, left: 150 };
let svg;
onMounted(() => {
  svg = d3.select(pieChart.value);
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3.pie().value((d) => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = svg
    .selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr(
      "transform",
      `translate(${width / 2 + margin.left},${height / 2 + margin.top})`
    );

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.name));

  arcs
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text((d) => d.data.name);
});
</script>

<style lang="scss" scoped>
/* 可以添加样式来美化饼图 */
</style>
