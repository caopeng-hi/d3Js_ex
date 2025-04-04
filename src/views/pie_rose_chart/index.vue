<template>
  <svg ref="pieChart"></svg>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const pieChart = ref(null);
const data = [
  { value: 40, name: "rose 1" },
  { value: 38, name: "rose 2" },
  { value: 32, name: "rose 3" },
  { value: 30, name: "rose 4" },
  { value: 28, name: "rose 5" },
  { value: 26, name: "rose 6" },
  { value: 22, name: "rose 7" },
  { value: 18, name: "rose 8" },
];

onMounted(() => {
  // 设置图表尺寸
  const width = 600;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };

  // 创建SVG容器
  const svg = d3
    .select(pieChart.value)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // 计算半径比例尺
  const radius = d3
    .scaleSqrt()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([
      0,
      Math.min(width, height) / 2 - Math.max(margin.top, margin.bottom),
    ]);

  // 创建弧形生成器
  const arc = d3
    .arc()
    .innerRadius(radius(5)) // 将内半径从10减小到5
    .outerRadius((d) => radius(d.value))
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle)
    .padAngle(0.01)
    .cornerRadius(15);

  // 创建饼图布局
  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  // 计算每个扇形的角度
  const arcs = pie(data);

  // 创建颜色比例尺
  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(d3.schemeCategory10);

  // 添加图例
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width / 2},${margin.top})`);

  legend
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 80 - (data.length * 80) / 2)
    .attr("y", 0)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", (d, i) => color(d.name));

  legend
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 80 - (data.length * 80) / 2 + 20)
    .attr("y", 10)
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .text((d) => d.name);

  // 绘制玫瑰图
  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  g.selectAll("path")
    .data(arcs)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.name))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .attr("opacity", 0.8)
    .attr("rx", 5) // 添加圆角属性
    .attr("ry", 5); // 添加圆角属性

  // 添加标签
  g.selectAll("text")
    .data(arcs)
    .enter()
    .append("text")
    .attr("transform", (d) => {
      const angle = (d.startAngle + d.endAngle) / 2;
      const r = radius(d.data.value) * 0.7;
      const x = Math.sin(angle) * r;
      const y = -Math.cos(angle) * r;
      return `translate(${x},${y})`;
    })
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text((d) => d.data.name)
    .style("font-size", "12px")
    .style("fill", "#333");
  // 添加中心空白圆
  g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", radius(5)) // 同步调整为5
    .attr("fill", "#fff");
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
