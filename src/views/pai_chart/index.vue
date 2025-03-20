<!--
 * @Author: caopeng
 * @Date: 2025-02-28 09:14:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-04 18:06:05
 * @Description: 请填写简介
-->
<template>
  <!-- 定义一个 SVG 元素，用于后续绘制环形图 -->
  <svg></svg>
  <button @click="handelClick">随机</button>
</template>

<script setup>
// 引入 D3.js 库，用于数据可视化
import * as d3 from "d3";
// 引入 Vue 的 onMounted 钩子，用于在组件挂载后执行代码
import { ref, onMounted } from "vue";

/**
 * 定义图表所需的数据
 * 每个对象包含水果名称和对应的值
 */
// 使用 ref 创建响应式数据
let data = ref([
  {
    name: "苹果",
    value: 10,
  },
  {
    name: "橘子",
    value: 20,
  },
  {
    name: "香蕉",
    value: 30,
  },
  {
    name: "西瓜",
    value: 40,
  },
]);

// 声明一个变量用于存储 SVG 选择器
let svg;
// 定义环形图的外半径
const outerRadius = 150;
// 定义环形图的内半径，为 0 则中间没有空白
const innerRadius = 130;

/**
 * 组件挂载后执行的函数
 * 选择 SVG 元素并设置其宽度和高度
 * 调用 createRect 函数创建环形图
 */
onMounted(() => {
  // 选择 SVG 元素并设置宽度和高度
  svg = d3.select("svg").attr("width", 500).attr("height", 500);
  // 调用 createRect 函数创建环形图
  createRect();
});
// 定义一个函数来生成随机数据
const generateRandomData = () => {
  return [
    {
      name: "苹果",
      value: Math.floor(Math.random() * 100),
    },
    {
      name: "橘子",
      value: Math.floor(Math.random() * 100),
    },
    {
      name: "香蕉",
      value: Math.floor(Math.random() * 100),
    },
    {
      name: "西瓜",
      value: Math.floor(Math.random() * 100),
    },
  ];
};

const handelClick = () => {
  // 更新数据
  data.value = generateRandomData();
  // 重新绘制图表
  createRect();
};
/**
 * 创建环形图的函数
 * 包含颜色比例尺、饼图生成、弧生成等操作
 * 并绘制环形图、引线和标签
 */
const createRect = () => {
  // 清空之前的图表
  svg.selectAll("*").remove();
  // 定义颜色比例尺，使用 D3 内置的方案
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  // 创建饼图生成器，指定值的获取方式
  const pie = d3.pie().value((d) => d.value);
  // 计算数据的饼图布局，使用响应式数据的 value 属性
  const piedata = pie(data.value);
  // 创建弧生成器，用于生成环形图的每个扇形
  const arc = d3
    .arc() // 弧生成器
    .innerRadius(innerRadius) // 设置内半径
    .outerRadius(outerRadius); // 设置外半径

  // 创建用于绘制标签位置的外弧生成器
  const outerArc = d3
    .arc()
    .innerRadius(outerRadius + 20)
    .outerRadius(outerRadius + 20);

  // 选择所有的弧形组元素，如果不存在则创建
  const arcs = svg
    .selectAll(".arc")
    .data(piedata)
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(250,250)");

  // 为每个弧形组添加路径元素，绘制环形图的扇形
  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i));

  /**
   * 计算扇形中间角度的函数
   * @param {Object} d - 扇形数据对象
   * @returns {number} - 扇形的中间角度
   */
  const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

  // 为每个弧形组添加折线元素，绘制引线
  arcs
    .append("polyline")
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .transition() // 开启过渡动画
    .duration(1000) // 设置过渡时间
    .attrTween("points", function (d) {
      // 定义插值函数，从初始状态过渡到最终状态
      const interpolate = d3.interpolate(0, d);

      return function (t) {
        const d2 = interpolate(t);
        const pos = outerArc.centroid(d2);
        const pos2 = arc.centroid(d2);
        // 根据中间角度调整引线终点的水平位置
        pos[0] = (outerRadius + 30) * (midAngle(d2) < Math.PI ? 1 : -1);
        const pos1 = [];
        pos1[0] = (pos2[0] + pos[0]) / 2;
        pos1[1] = (pos2[1] + pos[1]) / 2 + 30;
        pos[1] = pos1[1];
        return [pos2, pos1, pos].join(" ");
      };
    });

  // 为每个弧形组添加文本元素，绘制标签
  arcs
    .append("text")
    .transition() // 开启过渡动画
    .duration(1000) // 设置过渡时间
    .attrTween("transform", function (d) {
      // 定义插值函数，从初始状态过渡到最终状态
      const interpolate = d3.interpolate(0, d);
      return function (t) {
        const d2 = interpolate(t);
        const pos = outerArc.centroid(d2);
        // 根据中间角度调整标签的水平位置
        pos[0] = (outerRadius + 10) * (midAngle(d2) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      };
    })
    .attr("text-anchor", (d) => {
      // 根据中间角度设置文本的对齐方式
      return midAngle(d) < Math.PI ? "start" : "end";
    })
    .attr("dy", ".35em") // 垂直居中标签文本
    .text((d) => d.data.name); // 显示数据名称
};
</script>

<style>
/* 设置 x 轴文本的样式 */
.x-axis text {
  font-size: 10px;
  color: #abe5ff;
  font-size: 14px; /* 设置坐标轴文字的大小 */
}
</style>
