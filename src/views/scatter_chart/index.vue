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
    .domain([0, 15])
    .range([margin.left, width - margin.right]);

  // 创建比例尺
  const y = d3
    .scaleLinear()
    .domain([0, 10]) // 增加10%的上边距
    .range([height - margin.bottom, margin.top]);

  // 添加y轴
  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6));
  const arr = yAxis.selectAll(".tick line");
  arr.each(function (d, i) {
    if (i !== 0) {
      // 需要获取把d传进去，然后获取高度
      const y1 = y(d);
      const x1 = x(0);
      const x2 = x(15);
      const y2 = y1;
      svg
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "#aaa")
        .attr("stroke-width", 0.5);
    }
  });

  // 添加x轴
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickValues([0, 3, 6, 9, 12, 15])); // 使用tickValues替代ticks().ticksValue()

  // 添加y轴
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickValues([0, 2, 4, 6, 8, 10]));

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
