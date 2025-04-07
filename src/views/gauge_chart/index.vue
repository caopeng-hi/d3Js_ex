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

  // 添加指针 - 替换为更美观的指针样式
  const pointer = svg
    .append("g")
    .attr("transform", `rotate(${(scale(value.value) * 180) / Math.PI})`);

  // 指针主体 - 加长并改用柔和蓝色
  pointer
    .append("path")
    .attr("d", "M0,0 L-8,-15 L0,-70 L8,-15 Z") // 加长指针
    .attr("fill", "#64B5F6") // 柔和蓝色
    .attr("stroke", "#1976D2") // 深蓝色边框
    .attr("stroke-width", 1);

  // 指针中心装饰 - 颜色与指针匹配
  pointer
    .append("circle")
    .attr("r", 10) // 稍大一些
    .attr("fill", "#64B5F6")
    .attr("stroke", "#1976D2")
    .attr("stroke-width", 1.5);

  // 添加中心指示器 - 替换原有简单圆点
  const centerGroup = svg.append("g");

  // 添加背景圆环
  centerGroup
    .append("circle")
    .attr("r", 20)
    .attr("fill", "#f5f5f5")
    .attr("stroke", "#333")
    .attr("stroke-width", 1.5);

  // 添加当前值文本
  centerGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .text(value.value)
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("fill", "#4CAF50");
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
