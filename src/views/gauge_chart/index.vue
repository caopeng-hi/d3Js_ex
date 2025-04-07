<template>
  <div class="gauge-container">
    <svg ref="chartRef"></svg>
    <button @click="randomizeValue" class="random-button">随机变化</button>
  </div>
</template>

<script setup>
/**
 *  1.增加鼠标悬停显示当前值
 *  2.增加鼠标悬停tooltip显示当前值
 *  3.鼠标悬停颜色变化效果
 */
// 导入Vue组合式API和D3.js库
import { onMounted, ref } from "vue";
import * as d3 from "d3";

// 定义模板引用和响应式数据
const chartRef = ref(null); // SVG容器引用
const value = ref(50); // 仪表盘当前值，初始为50

// 导入watch用于监听value变化
import { watch } from "vue";

// 声明需要在多个函数中共享的变量
let pointer, // 指针元素组
  foregroundPath, // 前景弧路径
  foregroundArc, // 前景弧生成器
  scale; // 刻度比例尺

// 组件挂载后执行仪表盘初始化
onMounted(() => {
  // 1. 仪表盘基础设置
  const width = 500; // SVG宽度
  const height = 350; // SVG高度
  const radius = Math.min(width, height) / 2; // 计算半径

  // 创建SVG容器并设置居中变换
  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 2. 创建刻度比例尺
  // 将0-100的数值范围映射到-144°到144°的角度范围(保留36°空白)
  scale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([-Math.PI * 0.8, Math.PI * 0.8]);

  // 3. 绘制刻度线
  const ticks = Array.from({ length: 101 }, (_, i) => i); // 0-100的刻度数组
  svg.append("g").selectAll("line").data(ticks).enter().append("line");
  // ...刻度线样式设置...

  // 4. 添加刻度文本(仅显示10的倍数)
  svg
    .append("g")
    .selectAll("text")
    .data(ticks.filter((d) => d % 10 === 0))
    .enter()
    .append("text");
  // ...刻度文本样式设置...

  // 5. 绘制背景弧(静态灰色背景)
  const backgroundArc = d3.arc();
  // ...弧线参数设置...
  svg.append("path").attr("d", backgroundArc).attr("fill", "#eee");

  // 6. 创建前景弧(动态绿色指示条)
  foregroundArc = d3
    .arc()
    .innerRadius(radius * 0.85)
    .outerRadius(radius * 0.9)
    .startAngle(scale(0)); // 固定从0刻度开始

  foregroundPath = svg
    .append("path")
    .attr("d", foregroundArc.endAngle(scale(value.value)))
    .attr("fill", "#4CAF50");

  // 7. 创建指针元素
  pointer = svg
    .append("g")
    .attr("transform", `rotate(${(scale(value.value) * 180) / Math.PI})`);

  // 指针形状(三角形箭头)
  pointer.append("path").attr("d", "M0,0 L-8,-15 L0,-70 L8,-15 Z");
  // ...指针样式设置...

  // 指针中心圆点
  pointer.append("circle");
  // ...中心圆点样式设置...

  // 8. 创建中心指示器
  const centerGroup = svg.append("g");

  // 背景圆环
  centerGroup.append("circle");
  // ...圆环样式设置...

  // 当前值文本显示
  centerGroup
    .append("text")
    .attr("class", "value-text")
    // ...文本样式设置...
    .text(value.value);
});

// 监听value变化，执行动画效果
watch(value, (newVal, oldVal) => {
  const currentValue = oldVal !== undefined ? oldVal : value.value;

  // 1. 前景弧动画
  foregroundPath
    .transition()
    .duration(800)
    .attrTween("d", function () {
      return function (t) {
        // 计算插值: 从当前值平滑过渡到新值
        const interpolatedValue = currentValue + (newVal - currentValue) * t;
        return foregroundArc.endAngle(scale(interpolatedValue))();
      };
    });

  // 2. 指针旋转动画
  pointer
    .transition()
    .duration(800)
    .attrTween("transform", function () {
      return function (t) {
        const interpolatedValue = currentValue + (newVal - currentValue) * t;
        // 计算旋转角度(弧度转度数)
        return `rotate(${(scale(interpolatedValue) * 180) / Math.PI})`;
      };
    });

  // 3. 数值文本动画
  d3.select(chartRef.value)
    .select(".value-text")
    .transition()
    .duration(800)
    .tween("text", function () {
      const current = +this.textContent;
      const interpolator = d3.interpolateNumber(current, newVal);
      return function (t) {
        this.textContent = Math.round(interpolator(t)); // 四舍五入显示整数
      };
    });
});

// 随机生成0-100的值
const randomizeValue = () => {
  value.value = Math.floor(Math.random() * 101);
};
</script>

<style scoped>
.gauge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.random-button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.random-button:hover {
  background-color: #45a049;
}

svg {
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
