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
    .scaleBand()
    .domain(data.map((d) => d.date))
    .range([0, width])
    .padding(0.1);

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
    .y0(height)
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
      // 鼠标悬停时，改变透明度为 0.8
      d3.select(this).attr("fill-opacity", 0.8);
    })
    .on("mouseout", function () {
      // 鼠标移出时，恢复透明度
      d3.select(this).attr("fill-opacity", 1);
    });
});
</script>

<style lang="scss" scoped></style>
