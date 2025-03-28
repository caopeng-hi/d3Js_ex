<template>
  <svg ref="chartRef"></svg>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const chartRef = ref(null);
const data = [
  [10.0, 8.04],
  [8.07, 6.95],
  [13.0, 7.58],
  [9.05, 8.81],
  [11.0, 8.33],
  [14.0, 7.66],
  [13.4, 6.81],
  [10.0, 6.33],
  [14.0, 8.96],
  [12.5, 6.82],
  [9.15, 7.2],
  [11.5, 7.2],
  [3.03, 4.23],
  [12.2, 7.83],
  [2.02, 4.47],
  [1.05, 3.33],
  [4.05, 4.96],
  [6.03, 7.24],
  [12.0, 6.26],
  [12.0, 8.84],
  [7.08, 5.82],
  [5.02, 5.68],
];
const pointSize = 10;

onMounted(() => {
  const width = 500;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height);

  // 创建比例尺
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[0])])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height - margin.bottom, margin.top]);

  // 添加x轴
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  // 添加y轴
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // 添加散点
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d[0]))
    .attr("cy", (d) => y(d[1]))
    .attr("r", pointSize)
    .attr("fill", "steelblue")
    .attr("opacity", 0.7);
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
