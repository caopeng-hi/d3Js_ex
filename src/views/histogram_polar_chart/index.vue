<template>
  <svg ref="chart"></svg>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const data = [
  {
    label: "a",
    value: 2,
  },
  {
    label: "b",
    value: 1.2,
  },
  {
    label: "c",
    value: 2.4,
  },
  {
    label: "d",
    value: 3.6,
  },
];

const chart = ref(null);

onMounted(() => {
  const width = 500;
  const height = 500;
  const radius = Math.min(width, height) / 2;

  const svg = d3
    .select(chart.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 绘制环形柱状图
  svg
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", (d, i) => {
      const value = d.value;
      const startAngle = 0;
      // 计算结束角度
      const maxValue = 3.9;
      const endAngle = (value / maxValue) * 2 * Math.PI;

      const ringWidth = 20; // 固定圆环宽度
      const spacing = 10; // 固定圆环间距
      const baseRadius = 10; // 基础半径
      const innerRadius = baseRadius + i * (ringWidth + spacing); // 内半径
      const outerRadius = innerRadius + ringWidth; // 外半径

      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);

      return arc();
    })
    .attr("fill", "steelblue")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1);

  // 添加文本标签 位于每个圆环的中间
  svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("transform", (d, i) => {
      const ringWidth = 20;
      const spacing = 10;
      const baseRadius = 10;
      const innerRadius = baseRadius + i * (ringWidth + spacing);
      const outerRadius = innerRadius + ringWidth;
      const midRadius = (innerRadius + outerRadius) / 2;
      const maxValue = 3.9;
      const startAngle = 0;
      const endAngle = (d.value / maxValue) * 2 * Math.PI;

      // 计算柱状图的几何中心点
      const arcCenter = d3
        .arc()
        .innerRadius(midRadius)
        .outerRadius(midRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .centroid();

      return `translate(${arcCenter[0]},${arcCenter[1]})`;
    })
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text((d) => d.label);
});
</script>

<style scoped>
svg {
  margin: 20px;
}
</style>
