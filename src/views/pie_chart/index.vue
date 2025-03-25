<template>
  <svg ref="pieChart" width="400" height="400"></svg>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const pieChart = ref(null);
const data = [
  { value: 1048, name: "Search Engine" },
  { value: 735, name: "Direct" },
  { value: 580, name: "Email" },
  { value: 484, name: "Union Ads" },
  { value: 300, name: "Video Ads" },
];
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;
const margin = { top: 120, right: 20, bottom: 30, left: 150 };
let svg;
onMounted(() => {
  svg = d3.select(pieChart.value);
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3.pie().value((d) => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = svg
    .selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr(
      "transform",
      `translate(${width / 2 + margin.left},${height / 2 + margin.top})`
    );

  // 绘制饼状图
  const paths = arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.name))
    // 添加鼠标悬停事件
    .on("mouseover", function () {
      d3.select(this)
        .transition()
        .duration(700)
        .attr("transform", "scale(1.05) translate(0, 0)")
        .attr("filter", "drop-shadow(0px 0 10px rgba(0, 0, 0, .8))");
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .duration(700)
        .attr("transform", "scale(1) translate(0, 0)")
        .attr("filter", "none");
    });

  arcs
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text((d) => d.data.name);

  // 左上角绘制图形图例
  const legend = svg.append("g").attr("transform", `translate(${50},${50})`);

  const legendItems = legend
    .selectAll(".legend-item")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legendItems
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 18)
    .attr("height", 18)
    .attr("rx", 4) // 设置水平圆角半径
    .attr("ry", 4) // 设置垂直圆角半径
    .attr("fill", (d) => color(d.name));

  legendItems
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text((d) => d.name);
});
</script>

<style lang="scss" scoped>
/* 可以添加样式来美化饼图 */
</style>
