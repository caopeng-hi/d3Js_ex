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
const margin = { top: 120, right: 120, bottom: 30, left: 150 };
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
    .attr("fill", (d) => color(d.data.name));

  // 创建 tooltip
  const tooltip = svg.append("g").attr("class", "tooltip").style("opacity", 0);

  tooltip
    .append("rect")
    .attr("width", 100)
    .attr("height", 30)
    .attr("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 1);

  tooltip
    .append("text")
    .attr("x", 50)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "12px");

  paths
    // 添加鼠标悬停事件
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(700)
        .attr("transform", "scale(1.05) translate(0, 0)")
        .attr("filter", "drop-shadow(0px 0 10px rgba(0, 0, 0, .8))");

      // 显示 tooltip
      tooltip.transition().duration(200).style("opacity", 1);

      tooltip.select("text").text(`${d.data.name}: ${d.data.value}`);

      tooltip.attr(
        "transform",
        `translate(${event.pageX - 50},${event.pageY - 30})`
      );
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .duration(700)
        .attr("transform", "scale(1) translate(0, 0)")
        .attr("filter", "none");

      // 隐藏 tooltip
      tooltip.transition().duration(200).style("opacity", 0);
    });

  // 添加引线和外部文字
  arcs
    .append("polyline")
    .attr("points", (d) => {
      const pos = arc.centroid(d);
      const midAngle = Math.atan2(pos[1], pos[0]);
      const outerPos = [
        Math.cos(midAngle) * (radius + 20),
        Math.sin(midAngle) * (radius + 20),
      ];

      return [pos, outerPos].join(" ");
    })
    .attr("fill", "none")
    .attr("stroke", (d) => color(d.data.name)) // 修改引线颜色为对应的饼图颜色
    .attr("stroke-width", 1);

  arcs
    .append("text")
    .attr("transform", (d) => {
      const pos = arc.centroid(d);
      const midAngle = Math.atan2(pos[1], pos[0]);
      const outerPos = [
        Math.cos(midAngle) * (radius + 30),
        Math.sin(midAngle) * (radius + 30),
      ];
      return `translate(${outerPos})`;
    })
    .attr("text-anchor", (d) => {
      const pos = arc.centroid(d);
      const midAngle = Math.atan2(pos[1], pos[0]);
      return midAngle > Math.PI / 2 || midAngle < -Math.PI / 2
        ? "end"
        : "start";
    })
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
    .attr("fill", (d) => color(d.name))
    .on("mouseover", function (event, d) {
      const targetPath = paths.filter((p) => p.data.name === d.name);
      targetPath
        .transition()
        .duration(700)
        .attr("transform", "scale(1.05) translate(0, 0)")
        .attr("filter", "drop-shadow(0px 0 10px rgba(0, 0, 0, .8))");
    })
    .on("mouseout", function (event, d) {
      const targetPath = paths.filter((p) => p.data.name === d.name);
      targetPath
        .transition()
        .duration(700)
        .attr("transform", "scale(1) translate(0, 0)")
        .attr("filter", "none");
    });

  legendItems
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text((d) => d.name)
    .on("mouseover", function (event, d) {
      const targetPath = paths.filter((p) => p.data.name === d.name);
      targetPath
        .transition()
        .duration(700)
        .attr("transform", "scale(1.05) translate(0, 0)")
        .attr("filter", "drop-shadow(0px 0 10px rgba(0, 0, 0, .8))");
    })
    .on("mouseout", function (event, d) {
      const targetPath = paths.filter((p) => p.data.name === d.name);
      targetPath
        .transition()
        .duration(700)
        .attr("transform", "scale(1) translate(0, 0)")
        .attr("filter", "none");
    });
});
</script>

<style lang="scss" scoped>
/* 可以添加样式来美化饼图 */
.arc path {
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.arc path:hover {
  fill-opacity: 0.8; /* 鼠标悬停时降低填充不透明度 */
}

.legend-item rect {
  transition: all 0.3s ease; /* 图例方块过渡效果 */
}

.legend-item rect:hover {
  fill-opacity: 0.8; /* 图例方块鼠标悬停时降低填充不透明度 */
}

.legend-item text {
  font-family: Arial, sans-serif; /* 设置图例文字字体 */
  font-size: 12px; /* 设置图例文字大小 */
  fill: #333; /* 设置图例文字颜色 */
}

.polyline {
  stroke-linecap: round; /* 设置引线端点为圆角 */
}
</style>
