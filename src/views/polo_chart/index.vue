<template>
  <div class="chart-container">
    <svg ref="chartRef"></svg>
    <button @click="changeValue" class="value-button">改变数值</button>
  </div>
</template>

<script setup>
// 导入Vue组合式API和D3.js库
import { onMounted, ref } from "vue";
import * as d3 from "d3";

// 定义模板引用和响应式数据
const chartRef = ref(null); // SVG容器引用
const value = ref(50); // 水球液位值，初始为50

// 声明需要在多个函数中共享的变量
let radius, // 水球半径
  waveHeight, // 波浪高度
  waveLength; // 波浪波长

// 组件挂载后执行水球图初始化
onMounted(() => {
  // 1. 基础设置
  const width = 300; // SVG宽度
  const height = 300; // SVG高度
  radius = Math.min(width, height) / 2; // 计算半径(取宽高中的较小值)
  waveHeight = radius * 0.1; // 设置波浪高度为半径的10%
  waveLength = radius * 0.25; // 设置波浪长度为半径的25%

  // 创建SVG容器并设置居中变换
  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 2. 绘制外圆(水球容器)
  svg
    .append("circle")
    .attr("r", radius)
    .attr("fill", "#ffffff") // 白色填充
    .attr("stroke", "#00838f") // 蓝绿色边框
    .attr("stroke-width", 8); // 边框宽度

  // 3. 创建液位剪切路径(限制波浪显示范围)
  const clipPath = svg
    .append("clipPath")
    .attr("id", "liquid-clip") // 设置clipPath ID
    .append("circle")
    .attr("r", radius * 0.9); // 剪切区域半径(比外圆稍小)

  // 4. 绘制液位(实际显示波浪的部分)
  const liquid = svg
    .append("circle")
    .attr("r", radius * 0.9) // 设置半径
    .attr("fill", "#ffffff") // 白色填充
    .attr("clip-path", "url(#liquid-clip)") // 应用剪切路径
    .attr("transform", `translate(0,${radius * 0.9 * (1 - value.value / 50)})`); // 根据value设置初始高度

  // 5. 添加波浪效果
  const waveGroup = svg.append("g").attr("clip-path", "url(#liquid-clip)");
  const waveCount = 3; // 波浪层数

  // 创建多层波浪(增强视觉效果)
  for (let i = 0; i < waveCount; i++) {
    const wave = waveGroup
      .append("path")
      .attr("fill", "#00838f") // 波浪颜色
      .attr("opacity", 0.2 + i * 0.1); // 透明度递增

    // 波浪动画函数
    function animateWave(waveElement, offset) {
      waveElement.attr("d", function () {
        const points = [];
        // 生成波浪路径点
        for (let x = -radius; x <= radius; x += 5) {
          const y =
            Math.sin(x / waveLength + Date.now() / 1000 + offset) * waveHeight;
          points.push([x, y + radius * 0.9 * (1 - value.value / 50)]);
        }
        // 闭合路径
        points.push([radius, radius * 2], [-radius, radius * 2]);
        return d3.line()(points); // 生成SVG路径
      });
      requestAnimationFrame(() => animateWave(waveElement, offset)); // 持续动画
    }
    animateWave(wave, i * 0.5); // 启动动画，每层有不同相位偏移
  }

  // 6. 添加中心文本(显示当前值)
  svg
    .append("text")
    .attr("text-anchor", "middle") // 文本居中
    .attr("dy", "0.3em") // 垂直居中
    .text(`${value.value}%`) // 显示当前值
    .style("font-size", "24px") // 字体大小
    .style("font-weight", "bold") // 加粗
    .style("fill", "#006064"); // 文本颜色
});

// 改变数值的函数
const changeValue = () => {
  // 生成0-100的随机整数
  const newValue = Math.floor(Math.random() * 101);

  // 更新中心文本(带过渡动画)
  d3.select(chartRef.value)
    .select("text")
    .transition() // 开始过渡
    .duration(1000) // 动画持续时间1秒
    .tween("text", function () {
      const current = +this.textContent.replace("%", ""); // 当前值
      const interpolator = d3.interpolateNumber(current, newValue); // 插值器
      return function (t) {
        this.textContent = `${Math.round(interpolator(t))}%`; // 更新文本
      };
    });

  value.value = newValue; // 更新响应式数据
};
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.value-button {
  padding: 10px 20px;
  background-color: #00838f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.value-button:hover {
  background-color: #006064;
}

/* 保持原有样式 */
svg {
  background-color: #f5f5f5;
  border-radius: 50%;
}
</style>
