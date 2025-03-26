<template>
  <svg></svg>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted, onUnmounted } from "vue";

let svg;
const label = ["A", "B", "C", "D", "E"];
const data = [];
for (let i = 0; i < label.length; ++i) {
  data.push(Math.round(Math.random() * 200));
}

const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

let timer;
let xAxisG; // 新增：用于存储 x 轴的 g 元素
let yAxisG; // 新增：用于存储 y 轴的 g 元素

onMounted(() => {
  svg = d3
    .select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 创建比例尺，让 x 轴最大值大于 data 最大值
  const paddingFactor = 1.2; // 调整此系数可改变 x 轴最大值超出 data 最大值的比例
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data) * paddingFactor]) // 这里将最大值乘以一个系数
    .range([0, width]);
  const y = d3.scaleBand().domain(label).range([0, height]).padding(0.1);

  // 添加 X 轴
  xAxisG = svg.append("g").attr("transform", `translate(0,${height})`).call(
    d3
      .axisBottom(x)
      .tickSize(-height) // 设置刻度线长度为图标高度
      .tickSizeOuter(0) // 取消首尾刻度线额外的部分
      // 修改刻度数量为 4
      .ticks(4)
  );

  // 修改 X 轴刻度线和文本的样式
  function updateXAxisStyle() {
    xAxisG.selectAll("line").attr("stroke", "#aaa"); // 设置刻度线颜色为 #aaa
    xAxisG.selectAll("path").attr("stroke", "none"); // 取消 X 轴的横向线段
  }
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
    .attr("x", (d) => x(d) + 5) // 使标签在柱状图右侧并留出一定间距
    .attr("dy", ".35em")
    .attr("text-anchor", "start") // 文本从左侧开始对齐
    .text((d) => d);

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

  // 动态排序和更新柱状图
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
    labels
      .data(sortedData)
      .attr("y", (d, i) => y(sortedLabels[i]) + y.bandwidth() / 2)
      // 设置初始 x 位置为柱状图起始位置
      .attr("x", 0)
      .text((d) => d)
      .transition()
      .duration(1000)
      .attr("x", (d) => x(d) + 5);
  }

  // 初始更新
  update();

  // 启动定时器
  timer = setInterval(tick, 1000);
});

// 组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.bar {
  fill: steelblue;
}
</style>
