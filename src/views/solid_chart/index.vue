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

  // 创建漏斗图 - 整体为倒等边三角形
  const totalHeight = height - margin.top - margin.bottom;
  const triangleHeight = totalHeight * 0.95; // 增大高度比例
  const triangleBase = width * 0.9; // 增大底部宽度比例

  const rect = svg.append("g").attr("transform", `translate(${25},${50})`);

  rect
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

  // 添加图例
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width / 2},${margin.top - 15})`); // 上移15像素

  legend
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 80 - (data.length * 80) / 2)
    .attr("y", 0)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", (d, i) => d3.schemeCategory10[i]);

  legend
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 80 - (data.length * 80) / 2 + 20)
    .attr("y", 10)
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .text((d) => d.name);

  // 添加标签
  const labels = svg
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
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .style("fill", "#333")
    .style("user-select", "none") // 添加不可选样式
    .style("pointer-events", "none") // 添加不捕获鼠标事件
    .style("cursor", "pointer") // 添加小手样式
    .text((d) => `${d.name}`)
    .attr("transform", `translate(${25},${50})`);

  // 添加鼠标交互效果
  rect
    .selectAll(".funnel")
    .style("cursor", "pointer") // 添加小手样式
    .on("mouseover", function (event, d) {
      labels
        .filter((label) => label.name === d.name)
        .transition()
        .duration(200)
        .style("font-size", "14.4px"); // 12px * 1.2
    })
    .on("mouseout", function (event, d) {
      labels
        .filter((label) => label.name === d.name)
        .transition()
        .duration(200)
        .style("font-size", "12px");
    });
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
