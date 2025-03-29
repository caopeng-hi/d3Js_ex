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
  const segmentHeight = (height - margin.top - margin.bottom) / data.length;

  svg
    .selectAll(".funnel")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "funnel")
    .attr("d", (d, i) => {
      const centerX = width / 2;
      const topWidth = width * (i === 0 ? 1 : data[i - 1].value / 100) * 0.8;
      const bottomWidth = width * (d.value / 100) * 0.8;
      const topY = margin.top + i * segmentHeight;
      const bottomY = topY + segmentHeight;

      // 最后一个图形改为三角形
      if (i === data.length - 1) {
        const triangleBottomY =
          bottomY + (bottomWidth / 2) * Math.tan(Math.PI / 6);
        return `
          M${centerX - topWidth / 2},${topY}
          L${centerX + topWidth / 2},${topY}
          L${centerX},${triangleBottomY}
          Z
        `;
      }

      return `
        M${centerX - topWidth / 2},${topY}
        L${centerX + topWidth / 2},${topY}
        L${centerX + bottomWidth / 2},${bottomY}
        L${centerX - bottomWidth / 2},${bottomY}
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
    .attr("y", (d, i) => margin.top + i * segmentHeight + segmentHeight / 2)
    .attr("text-anchor", "middle")
    .text((d) => `${d.name}: ${d.value}%`);
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
