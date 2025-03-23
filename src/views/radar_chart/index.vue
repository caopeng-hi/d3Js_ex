<!--
 * @Author: caopeng
 * @Date: 2025-03-23 11:47:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-23 11:56:29
 * @Description: 雷达图示例
-->
<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const chartRef = ref(null);

const data = [
  [
    { axis: "Email", value: 1 },
    { axis: "Social Networks", value: 0.86 },
    { axis: "Internet Banking", value: 0.62 },
    { axis: "News Sportsites", value: 0.54 },
    { axis: "Search Engine", value: 0.88 },
    { axis: "View Shopping sites", value: 0.14 },
  ],
  [
    { axis: "Email", value: 0.78 },
    { axis: "Social Networks", value: 0.68 },
    { axis: "Internet Banking", value: 0.47 },
    { axis: "News Sportsites", value: 0.45 },
    { axis: "Search Engine", value: 0.46 },
    { axis: "View Shopping sites", value: 0.69 },
    { axis: "Paying Online", value: 0 },
  ],
];

onMounted(() => {
  const width = 800;
  const height = 800;
  const margin = { top: 150, right: 180, bottom: 20, left: 80 };
  const radius =
    Math.min(width, height) / 2 - Math.max(margin.top, margin.bottom);

  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 提取所有的轴
  const allAxis = data[0].map((i) => i.axis);
  const total = allAxis.length;
  const angleSlice = (2 * Math.PI) / total;

  // 定义半径比例尺
  const rScale = d3.scaleLinear().domain([0, 1]).range([0, radius]);

  // 绘制网格线
  for (let j = 0.2; j <= 1; j += 0.2) {
    const dataValues = [];
    for (let i = 0; i < total; i++) {
      dataValues.push([
        rScale(j) * Math.cos(angleSlice * i - Math.PI / 2),
        rScale(j) * Math.sin(angleSlice * i - Math.PI / 2),
      ]);
    }
    svg
      .append("polygon")
      .attr("points", dataValues.map((d) => d.join(",")).join(" "))
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", 0.5);
  }

  // 绘制坐标轴
  allAxis.forEach((axis, i) => {
    const x = rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    const y = rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2);

    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", y)
      .attr("stroke", "gray")
      .attr("stroke-width", 1);

    svg
      .append("text")
      .attr("x", x * 1.1)
      .attr("y", y * 1.1)
      .attr("text-anchor", "middle")
      .text(axis);
  });

  // 绘制每个数据系列的多边形
  data.forEach((d, i) => {
    const dataValues = [];
    allAxis.forEach((axis, j) => {
      const value = d.find((item) => item.axis === axis)?.value || 0;
      dataValues.push([
        rScale(value) * Math.cos(angleSlice * j - Math.PI / 2),
        rScale(value) * Math.sin(angleSlice * j - Math.PI / 2),
      ]);
    });

    svg
      .append("polygon")
      .attr("points", dataValues.map((d) => d.join(",")).join(" "))
      .attr("fill", d3.schemeCategory10[i])
      .attr("fill-opacity", 0.3)
      .attr("stroke", d3.schemeCategory10[i])
      .attr("stroke-width", 2);

    // 添加节点
    allAxis.forEach((axis, j) => {
      const value = d.find((item) => item.axis === axis)?.value || 0;
      const x = rScale(value) * Math.cos(angleSlice * j - Math.PI / 2);
      const y = rScale(value) * Math.sin(angleSlice * j - Math.PI / 2);

      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3) // 节点半径
        .attr("fill", d3.schemeCategory10[i]);
    });
  });

  // 绘制图例
  const legend = svg
    .append("g")
    .attr(
      "transform",
      `translate(${width / 2 - margin.right + 20}, -${
        height / 2 - margin.top + 20
      })`
    );

  const legendItems = legend
    .selectAll(".legend-item")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendItems
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d, i) => d3.schemeCategory10[i]);

  legendItems
    .append("text")
    .attr("x", 20)
    .attr("y", 12)
    .text((d, i) => `Series ${i + 1}`);
});
</script>

<style lang="scss" scoped></style>
