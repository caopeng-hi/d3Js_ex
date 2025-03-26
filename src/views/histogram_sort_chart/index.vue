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

  // 创建比例尺
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, width]);
  const y = d3.scaleBand().domain(label).range([0, height]).padding(0.1);

  // 添加 X 轴
  xAxisG = svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

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

  // 定时器函数，每隔 3 秒增加数据并更新图表
  function tick() {
    // 随机增加数据
    for (let i = 0; i < data.length; i++) {
      data[i] += Math.round(Math.random() * 10);
    }
    // 更新 X 轴比例尺
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data)]) // 根据 data 中的最大值更新 x 轴的定义域
      .range([0, width]);
    // 更新 X 轴
    xAxisG.call(d3.axisBottom(x));
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
    // 更新 X 轴比例尺
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data)]) // 根据 data 中的最大值更新 x 轴的定义域
      .range([0, width]);
    // 更新柱状图
    bars
      .data(sortedData)
      .transition()
      .duration(1000)
      .attr("y", (d, i) => y(sortedLabels[i]))
      .attr("width", (d) => x(d));
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
