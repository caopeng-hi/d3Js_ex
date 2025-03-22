<!--
 * @Author: caopeng
 * @Date: 2025-03-21 15:06:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-21 16:18:49
 * @Description: 请填写简介
-->
<template>
  <svg></svg>
</template>

<script setup>
// 引入 d3 库，用于数据可视化操作
import * as d3 from "d3";
// 引入 Vue 的 onMounted 钩子，用于在组件挂载后执行代码
import { onMounted } from "vue";

/**
 * 定义图表所需的数据
 * @type {Object}
 * @property {Array<Array<number>>} list - 折线图各线条对应的数据点数组
 * @property {Array<string>} color - 各线条对应的颜色数组
 * @property {Array<string>} date - 日期字符串数组
 * @property {Array<string>} label - 各线条对应的标签数组
 */
const data = {
  list: [
    [15, 20, 36, 10, 55],
    [10, 22, 47, 70, 85],
    [20, 30, 55, 65, 77],
    [30, 40, 50, 60, 70],
    [40, 45, 55, 65, 75],
  ],
  color: ["#5470C6", "#91CC75", "#fac858", "#ee6666", "#73c0de"],
  date: ["01", "02", "03", "04", "05"],
  label: ["苹果", "香蕉", "橙子", "西瓜", "葡萄"],
};

// 创建一个日期解析函数，将日期字符串按 '%d' 格式解析为日期对象
const parseDate = d3.timeParse("%d");
// 将日期字符串数组转换为日期对象数组
const parsedDates = data.date.map(parseDate);

// 定义 SVG 元素变量，后续用于操作 SVG
let svg;
// 定义图表的宽度
const width = 800;
// 定义图表的高度
const height = 500;
// 定义图表的边距，包括上、右、下、左四个方向
const margin = { top: 20, right: 50, bottom: 20, left: 50 };

// 使用 onMounted 钩子，确保在组件挂载后执行以下代码
onMounted(() => {
  // 选择页面中的 SVG 元素，并设置其宽度和高度
  svg = d3.select("svg").attr("width", width).attr("height", height);
  // 在 SVG 中添加一个分组元素 g，用于组织后续的图表元素
  const g = svg.append("g");

  // 创建 x 轴的时间比例尺
  const xScale = d3
    .scaleTime()
    // 设置 x 轴比例尺的定义域，使用日期对象数组的最小和最大值
    .domain(d3.extent(parsedDates))
    // 设置 x 轴比例尺的值域，考虑边距
    .range([margin.left, width - margin.right]);

  // 创建 y 轴的线性比例尺
  const yScale = d3
    .scaleLinear()
    // 设置 y 轴比例尺的定义域，范围从 0 到 100
    .domain([0, 100])
    // 设置 y 轴比例尺的值域，考虑边距
    .range([height - margin.bottom, margin.top]);

  // 创建 x 轴生成器
  const xAxis = d3
    .axisBottom(xScale)
    // 设置 x 轴的刻度数量与日期数组长度一致
    .ticks(data.date.length)
    // 设置 x 轴刻度的显示格式为 '%d'，即只显示日期
    .tickFormat(d3.timeFormat("%d"));

  // 在 SVG 中添加 x 轴元素，并设置其位置和样式
  svg
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // 在 SVG 中添加 y 轴元素，并设置其位置和样式
  svg
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  // 创建折线生成器
  const lineGenerator = d3
    .line()
    // 设置折线的 x 坐标计算方式，根据日期对象和 x 轴比例尺计算
    .x((d, i) => xScale(parsedDates[i]))
    // 设置折线的 y 坐标计算方式，根据数据点和 y 轴比例尺计算
    .y((d) => yScale(d))
    // 定义哪些数据点是有效的，排除 null 值
    .defined((d) => d !== null);

  // 为每条折线创建一个分组元素
  const group = g
    .selectAll(".group")
    .data(data.list)
    .enter()
    .append("g")
    .attr("class", "group");

  // 在每个分组中添加折线元素
  const lines = group
    .append("path")
    .datum((d) => d)
    .attr("class", "line")
    .attr("d", lineGenerator)
    // 根据索引为每条折线设置不同的颜色
    .attr("stroke", (d, i) => data.color[i])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  // 在每个分组中添加文本元素，用于显示折线的标签
  const texts = group
    .append("text")
    .attr("class", "a-txt")
    // 根据索引为每个文本设置不同的颜色
    .attr("fill", (d, i) => data.color[i])
    // 设置文本内容为对应的标签
    .text((d, i) => data.label[i])
    // 设置文本的 x 位置，在折线末尾右侧
    .attr("x", (d) => xScale(parsedDates[d.length - 1]) + 5)
    // 设置文本的 y 位置，在折线末尾
    .attr("y", (d) => yScale(d[d.length - 1]))
    // 设置文本的水平对齐方式
    .attr("text-anchor", "start")
    // 设置文本的垂直对齐方式
    .attr("dominant-baseline", "middle")
    // 初始设置文本为透明
    .style("opacity", 0);

  // 为折线添加动画效果，使其从不可见到可见
  lines
    .attr("stroke-dasharray", function () {
      return `${this.getTotalLength()} ${this.getTotalLength()}`;
    })
    .attr("stroke-dashoffset", function () {
      return this.getTotalLength();
    })
    .transition()
    .ease(d3.easeLinear)
    .delay(300)
    .duration(5000)
    .attr("stroke-dashoffset", 0);

  // 为文本添加动画效果，使其从不可见到可见
  texts
    .transition()
    .ease(d3.easeLinear)
    .delay(200)
    .duration(500)
    .style("opacity", 1);

  // 为每条折线及其对应的文本添加动画效果，使文本跟随折线移动
  lines.each(function (d, i) {
    const line = d3.select(this);
    const text = texts.filter(function (_, j) {
      return j === i;
    });

    const pathEl = line.node();
    const pathLength = pathEl.getTotalLength();
    const interpolator = d3.interpolate(0, pathLength);

    line
      .attr("stroke-dasharray", `${pathLength} ${pathLength}`)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .ease(d3.easeLinear)
      .delay(0)
      .duration(6000)
      .attr("stroke-dashoffset", 0)
      .tween("end", function () {
        return function (t) {
          const length = interpolator(t);
          const point = pathEl.getPointAtLength(length);
          const x = point.x;
          const y = point.y;
          text
            .text(data.label[i])
            .attr("x", x + 10)
            .attr("y", y);
        };
      });
  });

  // 添加垂直辅助线元素
  const line = svg
    .append("line")
    .attr("class", "vertical-line")
    .attr("x1", 0)
    .attr("y1", margin.top)
    .attr("x2", 0)
    .attr("y2", height - margin.bottom)
    .style("stroke", "#aaa")
    .style("stroke-width", 1)
    .style("stroke-dasharray", "5, 5")
    .style("opacity", 0);

  // 添加 tooltip 元素组
  const tooltip = svg.append("g").attr("class", "tooltip").style("opacity", 0);

  // 在 tooltip 中添加矩形元素作为背景
  tooltip
    .append("rect")
    .attr("width", 100)
    .attr("height", 30)
    .attr("fill", "white")
    .attr("rx", 5)
    .attr("ry", 5);

  // 在 tooltip 中添加文本元素用于显示内容
  const tooltipText = tooltip
    .append("text")
    .attr("x", 50)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle");

  // 添加小圆点元素，用于显示鼠标位置对应的交点
  const circles = svg
    .selectAll(".intersection-circle")
    .data(data.list)
    .enter()
    .append("circle")
    .attr("class", "intersection-circle")
    .attr("r", 5)
    .style("fill", "#aaa")
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("opacity", 0);

  // 为 SVG 添加鼠标移动事件监听器
  svg
    .on("mousemove", function (e) {
      const [xCoord] = d3.pointer(e, this);
      const xValue = xScale.invert(xCoord);

      // 检查鼠标是否在绘图区域内
      if (xCoord >= margin.left && xCoord <= width - margin.right) {
        // 显示辅助线
        line.attr("x1", xCoord).attr("x2", xCoord).style("opacity", 1);

        // 找到最接近的日期索引
        const bisectDate = d3.bisector((d) => d).left;
        const index = bisectDate(parsedDates, xValue, 1);
        const d0 = parsedDates[index - 1];
        const d1 = parsedDates[index];
        const d = xValue - d0 > d1 - xValue ? d1 : d0;
        const dateIndex = parsedDates.indexOf(d);

        // 构建 tooltip 内容
        let tooltipContent = `日期: ${data.date[dateIndex]}\n`;
        data.list.forEach((lineData, i) => {
          tooltipContent += `${data.label[i]}: ${lineData[dateIndex]}\n`;
        });

        // 计算辅助线的中间位置
        const middleY = (margin.top + height - margin.bottom) / 2;

        // 显示 tooltip 并将其定位到辅助线的中间
        tooltip
          .attr("transform", `translate(${xCoord + 10}, ${middleY})`)
          .style("opacity", 1);

        tooltipText.text(tooltipContent);

        // 更新小圆点位置
        circles
          .data(data.list)
          .attr("cx", xCoord)
          .attr("cy", (d) => yScale(d[dateIndex]))
          .style("opacity", 1);
      } else {
        // 鼠标移出绘图区域，隐藏辅助线、tooltip 和小圆点
        line.style("opacity", 0);
        tooltip.style("opacity", 0);
        circles.style("opacity", 0);
      }
    })
    .on("mouseout", function () {
      // 隐藏辅助线、tooltip 和小圆点
      line.style("opacity", 0);
      tooltip.style("opacity", 0);
      circles.style("opacity", 0);
    });
});
</script>

<style lang="scss" scoped></style>
