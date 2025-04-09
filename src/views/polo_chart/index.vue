<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const chartRef = ref(null);
const value = ref(50); // 水球液位值，范围0-100

onMounted(() => {
  // 1. 基础设置
  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  // 创建SVG容器
  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 2. 绘制外圆
  svg
    .append("circle")
    .attr("r", radius)
    .attr("fill", "#e0f7fa")
    .attr("stroke", "#00838f")
    .attr("stroke-width", 2);

  // 3. 创建液位剪切路径
  const clipPath = svg
    .append("clipPath")
    .attr("id", "liquid-clip")
    .append("circle")
    .attr("r", radius * 0.9);

  // 4. 绘制液位
  const liquid = svg
    .append("circle")
    .attr("r", radius * 0.9)
    .attr("fill", "#00acc1")
    .attr("clip-path", "url(#liquid-clip)")
    .attr("transform", `translate(0,${radius * 0.9 * (1 - value.value / 50)})`);

  // 5. 添加波浪效果
  const waveGroup = svg.append("g").attr("clip-path", "url(#liquid-clip)");

  const waveHeight = radius * 0.05;
  const waveLength = radius * 0.5;

  const wave = waveGroup
    .append("path")
    .attr("fill", "#00838f")
    .attr("opacity", 0.3);

  // 6. 添加中心文本
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .text(`${value.value}%`)
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .style("fill", "#006064");

  // 波浪动画
  function animateWave() {
    wave.attr("d", function () {
      const points = [];
      for (let x = -radius; x <= radius; x += 5) {
        const y = Math.sin(x / waveLength + Date.now() / 1000) * waveHeight;
        points.push([x, y + radius * 0.9 * (1 - value.value / 50)]);
      }
      points.push([radius, radius * 2], [-radius, radius * 2]);
      return d3.line()(points);
    });
    requestAnimationFrame(animateWave);
  }
  animateWave();
});
</script>

<style scoped>
svg {
  background-color: #f5f5f5;
  border-radius: 50%;
}
</style>
