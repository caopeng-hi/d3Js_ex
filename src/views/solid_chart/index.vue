<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const chartRef = ref(null);
const data = [
  { value: 100, name: "Show" },
  { value: 80, name: "Click" },
  { value: 60, name: "Visit" },
  { value: 40, name: "Inquiry" },
  { value: 20, name: "Order" },
];

onMounted(() => {
  const width = 500;
  const height = 400;
  const margin = { top: 30, right: 30, bottom: 50, left: 30 };

  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height);

  // 计算比例尺
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([height - margin.bottom, margin.top]);

  // 创建漏斗图
  svg
    .selectAll(".funnel")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "funnel")
    .attr("d", (d, i) => {
      const xPos = x(d.name);
      const width = x.bandwidth();
      const height = y(0) - y(d.value);

      // 计算漏斗形状路径
      const topWidth = width * (i === 0 ? 1 : data[i - 1].value / 100);
      const bottomWidth = width * (d.value / 100);

      return `
        M${xPos + (width - topWidth) / 2},${y(d.value)}
        L${xPos + (width + topWidth) / 2},${y(d.value)}
        L${xPos + (width + bottomWidth) / 2},${y(0)}
        L${xPos + (width - bottomWidth) / 2},${y(0)}
        Z
      `;
    })
    .attr("fill", (d, i) => d3.schemeCategory10[i])
    .attr("stroke", "#fff")
    .attr("stroke-width", 1);

  // 添加标签
  svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.value) - 5)
    .attr("text-anchor", "middle")
    .text((d) => `${d.name}: ${d.value}%`);
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
