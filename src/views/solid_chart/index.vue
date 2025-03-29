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

  // 创建漏斗图 - 整体为倒等边三角形
  const totalHeight = height - margin.top - margin.bottom;
  const triangleHeight = totalHeight * 0.95; // 增大高度比例
  const triangleBase = width * 0.9; // 增大底部宽度比例

  svg
    .selectAll(".funnel")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "funnel")
    .attr("d", (d, i) => {
      const centerX = width / 2;
      const segmentTop = margin.top + (i / data.length) * triangleHeight;
      const segmentBottom =
        margin.top + ((i + 1) / data.length) * triangleHeight;

      // 计算每层的宽度
      const topWidth = triangleBase * (1 - i / data.length);
      const bottomWidth = triangleBase * (1 - (i + 1) / data.length);

      return `
        M${centerX - topWidth / 2},${segmentTop}
        L${centerX + topWidth / 2},${segmentTop}
        L${centerX + bottomWidth / 2},${segmentBottom}
        L${centerX - bottomWidth / 2},${segmentBottom}
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
    .attr("x", width / 2)
    .attr(
      "y",
      (d, i) => margin.top + (i + 0.5) * (triangleHeight / data.length)
    )
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em") // 垂直居中
    .style("font-size", "12px")
    .style("fill", "#333")
    .text((d) => `${d.name}`);
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
