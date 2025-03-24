<template>
  <svg></svg>
</template>

<script setup>
import { onMounted } from "vue";
import * as d3 from "d3";

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
    value: 0, // 补充缺失的 value 值
  },
];

onMounted(() => {
  const svg = d3.select("svg");
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 定义 x 轴比例尺
  const x = d3
    .scalePoint()
    .domain(data.map((d) => d.date))
    .range([0, width])
    .padding(0.01);

  // 定义 y 轴比例尺
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([height, 0]);

  // 添加 x 轴
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${height + margin.top})`)
    .call(d3.axisBottom(x));

  // 添加 y 轴
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(d3.axisLeft(y));

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 定义面积生成器
  const area = d3
    .area()
    .x((d) => x(d.date))
    .y0(y(0)) // 修改此处，让面积区域底部从 x 轴开始
    .y1((d) => y(d.value));

  // 定义折线生成器
  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value));
  // 添加折线
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // 添加面积
  g.append("path")
    .datum(data)
    .attr("fill", "#cce5df")
    .attr("d", area)
    .on("mouseover", function () {
      // 鼠标悬停时，改变透明度为 0.8，修改鼠标样式为小手
      d3.select(this).attr("fill-opacity", 0.8).style("cursor", "pointer");
    })
    .on("mouseout", function () {
      // 鼠标移出时，恢复透明度和鼠标样式
      d3.select(this).attr("fill-opacity", 1).style("cursor", "default");
    });

  // 添加数据点的小圆圈
  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.date))
    .attr("cy", (d) => y(d.value))
    .attr("r", 4) // 圆圈半径
    .attr("fill", "white") // 白色背景色
    .attr("stroke", "black") // 黑色边框
    .attr("stroke-width", 1) // 边框宽度
    .on("mouseover", function () {
      d3.select(this)
        .transition() // 开启过渡动画
        .duration(200) // 动画持续时间
        .attr("r", 4 * 1.2) // 半径扩大 1.2 倍
        .style("cursor", "pointer");
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition() // 开启过渡动画
        .duration(200) // 动画持续时间
        .attr("r", 4); // 恢复原来半径
    });
});
</script>

<style lang="scss" scoped></style>
