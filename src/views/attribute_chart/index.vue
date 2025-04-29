<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
import * as d3 from "d3";
import { ref, onMounted } from "vue";

const chartRef = ref(null);
const data = ref({
  name: "冒险者",
  maxValue: 100,
  stats: [
    { axis: "力量", value: 85 },
    { axis: "敏捷", value: 65 },
    { axis: "智力", value: 75 },
    { axis: "耐力", value: 80 },
    { axis: "幸运", value: 50 },
    { axis: "魅力", value: 70 },
  ],
});

onMounted(() => {
  // 1. 设置图表尺寸和边距
  const width = 500;
  const height = 500;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  // 2. 创建SVG容器
  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 3. 计算雷达图参数
  const numAxes = data.value.stats.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const radius = Math.min(width, height) / 2 - margin.top;

  // 4. 创建比例尺
  const rScale = d3
    .scaleLinear()
    .domain([0, data.value.maxValue])
    .range([0, radius]);

  // 5. 绘制轴线
  const axis = svg
    .selectAll(".axis")
    .data(data.value.stats)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr(
      "x2",
      (d, i) =>
        rScale(data.value.maxValue) * Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "y2",
      (d, i) =>
        rScale(data.value.maxValue) * Math.sin(angleSlice * i - Math.PI / 2)
    )
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1);

  // 6. 绘制刻度线
  const levels = 5;
  for (let level = 0; level < levels; level++) {
    const levelFactor = radius * ((level + 1) / levels);

    svg
      .selectAll(".levels")
      .data(data.value.stats)
      .enter()
      .append("line")
      .attr(
        "x1",
        (d, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "y1",
        (d, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "x2",
        (d, i) => levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2)
      )
      .attr(
        "y2",
        (d, i) => levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2)
      )
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5);
  }

  // 7. 绘制属性值区域
  const radarLine = d3
    .lineRadial()
    .angle((d, i) => i * angleSlice)
    .radius((d) => rScale(d.value))
    .curve(d3.curveLinearClosed);

  svg
    .append("path")
    .datum(data.value.stats)
    .attr("class", "radar-area")
    .attr("d", radarLine)
    .attr("fill", "#ffcc00")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "#ff9900")
    .attr("stroke-width", 2);

  // 8. 添加属性标签
  axis
    .append("text")
    .attr("class", "legend")
    .attr(
      "x",
      (d, i) =>
        rScale(data.value.maxValue * 1.1) *
        Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "y",
      (d, i) =>
        rScale(data.value.maxValue * 1.1) *
        Math.sin(angleSlice * i - Math.PI / 2)
    )
    .text((d) => d.axis)
    .style("font-size", "12px")
    .style("text-anchor", "middle");

  // 9. 添加角色名称
  svg
    .append("text")
    .attr("x", -radius)
    .attr("y", -radius - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(data.value.name);
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
