<template>
  <svg></svg>
</template>

<script setup>
/**
 *  1.需要增加柱状图排序动画
 *   2.需要修改x轴刻度线的样式
 */

// 引入 d3 库，用于数据可视化
import * as d3 from "d3";
// 引入 Vue 的生命周期钩子函数，onMounted 用于在组件挂载后执行代码，onUnmounted 用于在组件卸载前执行清理操作
import { onMounted, onUnmounted } from "vue";

// 定义 svg 变量，用于存储对 SVG 元素的引用
let svg;
// 定义柱状图的标签数组
const label = ["A", "B", "C", "D", "E"];
// 定义存储柱状图数据的数组
const data = [];
// 循环生成随机数据并添加到 data 数组中
for (let i = 0; i < label.length; ++i) {
  // 生成 0 到 200 之间的随机整数并添加到 data 数组
  data.push(Math.round(Math.random() * 200));
}

// 定义图表的边距，分别为上、右、下、左的边距
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
// 计算图表的实际宽度，减去左右边距
const width = 600 - margin.left - margin.right;
// 计算图表的实际高度，减去上下边距
const height = 400 - margin.top - margin.bottom;

// 定义定时器变量，用于定时更新数据
let timer;
// 定义变量用于存储 x 轴的 g 元素
let xAxisG;
// 定义变量用于存储 y 轴的 g 元素
let yAxisG;

// 组件挂载后执行的函数
onMounted(() => {
  // 选择 SVG 元素并设置其宽度和高度，同时添加一个 g 元素并进行平移
  svg = d3
    .select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 调整此系数可改变 x 轴最大值超出 data 最大值的比例
  const paddingFactor = 1.2;
  // 创建 x 轴的线性比例尺，设置定义域和值域
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data) * paddingFactor])
    .range([0, width]);
  // 创建 y 轴的带状比例尺，设置定义域和值域，并设置间隔
  const y = d3.scaleBand().domain(label).range([0, height]).padding(0.1);

  // 添加 X 轴
  xAxisG = svg.append("g").attr("transform", `translate(0,${height})`).call(
    d3
      .axisBottom(x)
      .tickSize(-height)
      .tickSizeOuter(0)
      // 修改刻度数量为 4
      .ticks(4)
  );

  /**
   * 修改 X 轴刻度线和文本的样式
   */
  function updateXAxisStyle() {
    // 设置刻度线颜色为 #aaa
    xAxisG.selectAll("line").attr("stroke", "#aaa");
    // 取消 X 轴的横向线段
    xAxisG.selectAll("path").attr("stroke", "none");
    // 将 x 轴元素提升到最上层
    xAxisG.raise();
  }
  // 调用函数更新 X 轴样式
  updateXAxisStyle();

  // 添加 Y 轴
  yAxisG = svg.append("g").call(d3.axisLeft(y));

  // 创建柱状图
  const bars = svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d, i) => y(label[i]))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("fill", "steelblue")
    .attr("width", 0);

  // 添加数据标签到柱状图右侧
  const labels = svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("y", (d, i) => y(label[i]) + y.bandwidth() / 2)
    .attr("x", (d) => x(d) + 5)
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .text((d) => d);

  /**
   * 定时更新数据的函数
   */
  function tick() {
    // 随机增加数据
    for (let i = 0; i < data.length; i++) {
      data[i] += Math.round(Math.random() * 10);
    }
    // 更新 X 轴比例尺，同样让最大值大于 data 最大值
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data) * paddingFactor])
      .range([0, width]);
    // 更新 X 轴
    xAxisG.call(d3.axisBottom(x));
    // 更新 X 轴样式
    updateXAxisStyle();
    // 调用更新函数
    update();
  }

  // 新增标志位，用于控制文字动画是否执行
  let isFirstUpdate = true;

  /**
   * 动态排序和更新柱状图的函数
   */
  function update() {
    // 对数据进行排序
    const sortedData = data.slice().sort((a, b) => b - a);
    const sortedLabels = label
      .slice()
      .sort((a, b) => data[label.indexOf(b)] - data[label.indexOf(a)]);
    // 更新 Y 轴比例尺
    y.domain(sortedLabels);
    // 更新 Y 轴
    yAxisG.call(d3.axisLeft(y));
    // 更新 X 轴比例尺，保证最大值大于 data 最大值
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data) * paddingFactor])
      .range([0, width]);
    // 更新 X 轴
    xAxisG.call(d3.axisBottom(x).ticks(4));
    // 更新 X 轴样式
    updateXAxisStyle();

    // 更新柱状图
    bars
      .data(sortedData)
      .transition()
      .duration(1000)
      .attr("y", (d, i) => y(sortedLabels[i]))
      .attr("width", (d) => x(d));

    // 更新数据标签
    const labelUpdate = labels
      .data(sortedData)
      .attr("y", (d, i) => y(sortedLabels[i]) + y.bandwidth() / 2);

    if (isFirstUpdate) {
      // 第一次更新时添加动画
      labelUpdate
        .attr("x", 0)
        .text((d) => d)
        .transition()
        .duration(1000)
        .attr("x", (d) => x(d) + 5);
      // 更新标志位，后续不再执行动画
      isFirstUpdate = false;
    } else {
      // 非第一次更新时直接更新位置和文本
      labelUpdate.attr("x", (d) => x(d) + 5).text((d) => d);
    }
  }

  // 初始更新
  update();

  // 启动定时器，每隔 1000 毫秒调用一次 tick 函数
  timer = setInterval(tick, 1000);
});

// 组件卸载时清除定时器，避免内存泄漏
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.bar {
  fill: steelblue;
}
</style>
