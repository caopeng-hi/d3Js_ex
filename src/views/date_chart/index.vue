<template>
  <div class="map-content">
    <svg ref="svgRef" id="svgRef"></svg>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const svgRef = ref(null);

onMounted(() => {
  // 1. 设置图表尺寸和边距
  const width = 800;
  const height = 150;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  // 2. 创建SVG容器
  const svg = d3
    .select(svgRef.value)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // 3. 生成模拟数据（一年365天的随机贡献数据）
  const data = [];
  const now = new Date();
  const yearAgo = new Date(now);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  for (let d = new Date(yearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    data.push({
      date: new Date(d),
      count: Math.floor(Math.random() * 10), // 随机生成0-9的贡献数
    });
  }

  // 4. 定义颜色比例尺
  const colorScale = d3
    .scaleLinear()
    .domain([0, 5, 10])
    .range(["#ebedf0", "#9be9a8", "#216e39"]);

  // 5. 计算方块尺寸和位置
  const cellSize = 15;
  const cellMargin = 2;
  const weekWidth = cellSize * 7 + cellMargin * 6;

  // 6. 绘制日历方块
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", (d, i) => {
      const week = Math.floor(i / 7);
      return week * (cellSize + cellMargin);
    })
    .attr("y", (d, i) => {
      const day = i % 7;
      return day * (cellSize + cellMargin);
    })
    .attr("fill", (d) => colorScale(d.count))
    .attr("rx", 2)
    .attr("ry", 2);

  // 7. 添加月份标签
  const months = d3.timeMonths(yearAgo, now);
  svg
    .selectAll("text.month")
    .data(months)
    .enter()
    .append("text")
    .attr("class", "month")
    .attr("x", (d) => {
      const firstDay = d3.timeWeek.floor(d);
      const diff = d3.timeDay.count(d3.timeYear.floor(d), firstDay);
      return (diff / 7) * (cellSize + cellMargin);
    })
    .attr("y", -5)
    .text((d) => d.toLocaleString("default", { month: "short" }))
    .style("font-size", "10px")
    .style("fill", "#767676");
});
</script>

<style scoped>
.map-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#svgRef {
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
