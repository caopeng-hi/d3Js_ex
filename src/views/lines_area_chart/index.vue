<template>
  <svg></svg>
</template>

<script setup>
// 引入 Vue 的 onMounted 钩子，用于在组件挂载后执行代码
import { onMounted } from "vue";
// 引入 D3 库，用于数据可视化
import * as d3 from "d3";

// 定义数据数组，包含日期和对应的值
const data = [
  {
    date: "Mon",
    value: 820,
  },
  {
    date: "Tue",
    value: 932,
  },
  {
    date: "Wed",
    value: 901,
  },
  {
    date: "Thu",
    value: 934,
  },
  {
    date: "Fri",
    value: 1290,
  },
  {
    date: "Sat",
    value: 1330,
  },
  {
    date: "Sun",
    value: 0,
  },
];

// 在组件挂载后执行的代码
onMounted(() => {
  // 选择页面中的 svg 元素
  const svg = d3.select("svg");
  // 定义 svg 的宽度
  const width = 600;
  // 定义 svg 的高度
  const height = 400;
  // 定义 svg 的边距，包括上、右、下、左
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

  // 设置 svg 的宽度和高度，并添加一个 g 元素进行平移
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 定义 x 轴比例尺，使用点比例尺
  const x = d3
    .scalePoint()
    // 设置比例尺的定义域为数据中的日期
    .domain(data.map((d) => d.date))
    // 设置比例尺的范围为 0 到 svg 的宽度
    .range([0, width])
    // 设置点之间的间距
    .padding(0.01);

  // 定义 y 轴比例尺，使用线性比例尺
  const y = d3
    .scaleLinear()
    // 设置比例尺的定义域为 0 到数据中的最大值
    .domain([0, d3.max(data, (d) => d.value)])
    // 设置比例尺的范围为 svg 的高度到 0
    .range([height, 0]);

  // 添加 x 轴到 svg 中，并进行平移
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${height + margin.top})`)
    .call(d3.axisBottom(x));

  // 添加 y 轴到 svg 中，并进行平移
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(d3.axisLeft(y).ticks(8));

  // 添加一个新的 g 元素用于绘制折线和面积
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 定义面积生成器
  const area = d3
    .area()
    // 设置面积的 x 坐标
    .x((d) => x(d.date))
    // 设置面积的底部 y 坐标，从 x 轴开始
    .y0(y(0))
    // 设置面积的顶部 y 坐标
    .y1((d) => y(d.value));

  // 定义折线生成器
  const line = d3
    .line()
    // 设置折线的 x 坐标
    .x((d) => x(d.date))
    // 设置折线的 y 坐标
    .y((d) => y(d.value));

  // 添加折线到 svg 中
  g.append("path")
    .datum(data)
    // 折线不填充颜色
    .attr("fill", "none")
    // 设置折线的颜色
    .attr("stroke", "#69b3a2")
    // 设置折线的宽度
    .attr("stroke-width", 1.5)
    // 设置折线的路径
    .attr("d", line);

  // 添加面积到 svg 中
  g.append("path")
    .datum(data)
    // 设置面积的填充颜色
    .attr("fill", "#cce5df")
    // 设置面积的路径
    .attr("d", area)
    // 鼠标悬停时的事件处理
    .on("mouseover", function () {
      // 鼠标悬停时，改变透明度为 0.8，修改鼠标样式为小手
      d3.select(this).attr("fill-opacity", 0.8).style("cursor", "pointer");
    })
    // 鼠标移出时的事件处理
    .on("mouseout", function () {
      // 鼠标移出时，恢复透明度和鼠标样式
      d3.select(this).attr("fill-opacity", 1).style("cursor", "default");
    });

  // 添加数据点的小圆圈
  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    // 设置圆圈的 x 坐标
    .attr("cx", (d) => x(d.date))
    // 设置圆圈的 y 坐标
    .attr("cy", (d) => y(d.value))
    // 设置圆圈的半径
    .attr("r", 4)
    // 设置圆圈的填充颜色为白色
    .attr("fill", "white")
    // 设置圆圈的边框颜色为黑色
    .attr("stroke", "black")
    // 设置圆圈的边框宽度
    .attr("stroke-width", 1)
    // 鼠标悬停时的事件处理
    .on("mouseover", function () {
      // 开启过渡动画
      d3.select(this)
        .transition()
        // 动画持续时间为 200 毫秒
        .duration(200)
        // 半径扩大 1.2 倍
        .attr("r", 4 * 1.2)
        // 修改鼠标样式为小手
        .style("cursor", "pointer");
    })
    // 鼠标移出时的事件处理
    .on("mouseout", function () {
      // 开启过渡动画
      d3.select(this)
        .transition()
        // 动画持续时间为 200 毫秒
        .duration(200)
        // 恢复原来半径
        .attr("r", 4);
    });
});
</script>

<style lang="scss" scoped></style>
