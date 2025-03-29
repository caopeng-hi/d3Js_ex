<template>
  <svg ref="chartRef"></svg>
</template>
<script setup>
// 引入Vue组合式API和D3.js库
import { onMounted, ref } from "vue";
import * as d3 from "d3";

// 定义SVG DOM引用
const chartRef = ref(null);

// 散点图数据 - 每个子数组代表一个点的[x,y]坐标
const data = [
  [10.0, 8.04], // 点1坐标
  [8.07, 6.95], // 点2坐标
  [13.0, 7.58],
  [9.05, 8.81],
  [11.0, 8.33],
  [14.0, 7.66],
  [13.4, 6.81],
  [10.0, 6.33],
  [14.0, 8.96],
  [12.5, 6.82],
  [9.15, 7.2],
  [11.5, 7.2],
  [3.03, 4.23],
  [12.2, 7.83],
  [2.02, 4.47],
  [1.05, 3.33],
  [4.05, 4.96],
  [6.03, 7.24],
  [12.0, 6.26],
  [12.0, 8.84],
  [7.08, 5.82],
  [5.02, 5.68], // 最后一个点
];

// 散点半径大小
const pointSize = 10;

// 组件挂载后执行
onMounted(() => {
  // 1. 设置图表尺寸
  const width = 500; // 图表宽度
  const height = 400; // 图表高度
  const margin = {
    // 边距设置
    top: 20, // 上边距
    right: 20, // 右边距
    bottom: 30, // 下边距
    left: 40, // 左边距
  };

  // 2. 创建SVG容器
  const svg = d3
    .select(chartRef.value)
    .attr("width", width) // 设置宽度
    .attr("height", height); // 设置高度

  // 3. 创建x轴比例尺(线性比例尺)
  const x = d3
    .scaleLinear()
    .domain([0, 15]) // 数据范围(最小0,最大15)
    .range([margin.left, width - margin.right]); // 映射到画布范围

  // 4. 创建y轴比例尺(线性比例尺)
  const y = d3
    .scaleLinear()
    .domain([0, 10]) // 数据范围(最小0,最大10)
    .range([height - margin.bottom, margin.top]); // 映射到画布范围

  // 5. 添加y轴
  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`) // 移动到左侧
    .call(d3.axisLeft(y).tickValues([0, 2, 4, 6, 8, 10])); // 指定刻度值

  // 6. 添加y轴网格线
  const arr = yAxis.selectAll(".tick line");
  arr.each(function (d, i) {
    if (i !== 0) {
      // 跳过第一个刻度线(避免与x轴重叠)
      const y1 = y(d); // 获取y坐标
      svg
        .append("line") // 创建网格线
        .attr("x1", x(0)) // 起点x坐标(最左侧)
        .attr("y1", y1) // 起点y坐标
        .attr("x2", x(15)) // 终点x坐标(最右侧)
        .attr("y2", y1) // 终点y坐标
        .attr("stroke", "#aaa") // 灰色线条
        .attr("stroke-width", 0.5); // 细线
    }
  });

  // 添加x轴
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickValues([0, 3, 6, 9, 12, 15]));
  const arr1 = xAxis.selectAll(".tick line");
  arr1.each(function (d, i) {
    if (i !== 0) {
      // 需要获取把d传进去，然后获取高度
      const x1 = x(d);
      const y1 = y(0);
      const x2 = x1;
      const y2 = y(10);
      svg
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "#aaa")
        .attr("stroke-width", 0.5);
    }
  });

  // 添加散点
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d[0]))
    .attr("cy", (d) => y(d[1]))
    .attr("r", pointSize)
    .attr("fill", "steelblue")
    .attr("opacity", 0.7)
    // 鼠标样式小手
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      // 点扩大1.2倍动画700ms
      d3.select(this)
        .transition()
        .duration(700)
        .attr("fill", "red")
        .attr("r", pointSize * 1.2);
    })
    .on("mouseout", function (event, d) {
      d3.select(this)
        .transition()
        .duration(700)
        .attr("r", pointSize)
        .attr("fill", "steelblue");
    });
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
