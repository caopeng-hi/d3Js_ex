<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const chartRef = ref(null);
const value = ref(50);

onMounted(() => {
  // 仪表盘参数设置
  const width = 500; // 增大宽度
  const height = 350; // 增大高度
  const radius = Math.min(width, height) / 2; // 调整半径比例
  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 创建刻度生成器
  const scale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([-Math.PI * 0.8, Math.PI * 0.8]);

  // 添加刻度线 - 修改为显示所有刻度
  const ticks = Array.from({ length: 101 }, (_, i) => i); // 生成0-100的数组
  svg
    .append("g")
    .selectAll("line")
    .data(ticks)
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("y1", -radius * 0.8)
    .attr("x2", 0)
    .attr("y2", (d) => -radius * (d % 10 === 0 ? 0.7 : 0.78)) // 10的倍数刻度更长
    .attr("stroke", "#666")
    .attr("stroke-width", (d) => (d % 10 === 0 ? 2 : 0.5)) // 10的倍数刻度更粗
    .attr("transform", (d) => `rotate(${(scale(d) * 180) / Math.PI})`);

  // 添加刻度文本 - 只显示10的倍数
  svg
    .append("g")
    .selectAll("text")
    .data(ticks.filter((d) => d % 10 === 0))
    .enter()
    .append("text")
    .attr("x", (d) => Math.sin(scale(d)) * (radius * 0.6)) // 调整文本位置
    .attr("y", (d) => -Math.cos(scale(d)) * (radius * 0.6))
    .text((d) => d)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#333");

  // 绘制背景弧
  const backgroundArc = d3
    .arc()
    .innerRadius(radius * 0.85)
    .outerRadius(radius * 0.9)
    .startAngle(scale(0))
    .endAngle(scale(100))
    .cornerRadius(5); // 添加圆角效果

  svg.append("path").attr("d", backgroundArc).attr("fill", "#eee");

  // 绘制前景弧（值指示）
  const foregroundArc = d3
    .arc()
    .innerRadius(radius * 0.85)
    .outerRadius(radius * 0.9)
    .startAngle(scale(0));

  svg
    .append("path")
    .attr("d", foregroundArc.endAngle(scale(value.value)))
    .attr("fill", "#4CAF50");

  // 添加指针
  const pointerLine = d3.line()([
    [0, 0],
    [0, -radius * 0.5],
  ]);

  svg
    .append("path")
    .attr("d", pointerLine)
    .attr("stroke", "#333")
    .attr("stroke-width", 2)
    .attr("transform", `rotate(${(scale(value.value) * 180) / Math.PI})`);

  // 添加中心圆点和文本
  svg.append("circle").attr("r", 5).attr("fill", "#333");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .text(`${value.value}`)
    .style("font-size", "24px");
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
