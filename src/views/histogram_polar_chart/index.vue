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

  // 创建极坐标比例尺
  const angleScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([0, 2 * Math.PI]);

  const radiusScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([0, radius]);

  // 添加圆形刻度
  const ticks = radiusScale.ticks(5);
  svg
    .selectAll(".circle")
    .data(ticks)
    .enter()
    .append("circle")
    .attr("r", (d) => radiusScale(d))
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1);

  // 添加刻度标签
  svg
    .selectAll(".tick-label")
    .data(ticks)
    .enter()
    .append("text")
    .attr("x", (d) => radiusScale(d) + 5)
    .attr("y", 0)
    .attr("dy", "0.35em")
    .text((d) => d);

  // 添加径向刻度线
  svg
    .selectAll(".radial-line")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => radius * Math.cos(angleScale(i) - Math.PI / 2))
    .attr("y2", (d, i) => radius * Math.sin(angleScale(i) - Math.PI / 2))
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1);

  // 绘制环形柱状图
  svg
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", (d, i) => {
      const startAngle = angleScale(i);
      const endAngle = angleScale(i + 1);
      const innerRadius = radiusScale(d.value * 0.8); // 内半径
      const outerRadius = radiusScale(d.value); // 外半径

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

  // 添加标签
  svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("transform", (d, i) => {
      const angle = (angleScale(i) + angleScale(i + 1)) / 2;
      const r = radius * 0.6;
      return `translate(${r * Math.cos(angle - Math.PI / 2)},${
        r * Math.sin(angle - Math.PI / 2)
      })`;
    })
    .attr("text-anchor", "middle")
    .text((d) => d.label);
});
</script>

<style scoped>
svg {
  margin: 20px;
}
</style>
