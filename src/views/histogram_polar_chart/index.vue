<template>
  <svg ref="chart"></svg>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const data = [
  {
    label: "a",
    value: 2,
  },
  {
    label: "b",
    value: 1.2,
  },
  {
    label: "c",
    value: 2.4,
  },
  {
    label: "d",
    value: 3.6,
  },
];

const chart = ref(null);

onMounted(() => {
  const width = 500;
  const height = 500;
  const radius = 150;

  const svg = d3
    .select(chart.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 添加最外围的y轴圆圈
  svg
    .append("circle")
    .attr("r", radius - 10)
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 1);

  // 添加中心圆圈
  svg
    .append("circle")
    .attr("r", 5)
    .attr("fill", "#fff") // 修改为白色填充
    .attr("stroke", "#000");

  // 添加y轴刻度线
  const ticks = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]; // 刻度值以0.5为间隔
  const tickLength = 10; // 刻度线长度
  const angleStep = 360 / ticks.length; // 计算等分角度

  ticks.forEach((tick, i) => {
    const tickEnd =
      radius - 10 + (tick % 1 === 0 ? tickLength : tickLength / 2);
    const isInsideCircle = tickEnd <= radius - 10; // 判断刻度终点是否在外圈内

    svg
      .append("line")
      .attr("x1", 5)
      .attr("y1", 0)
      .attr("x2", tickEnd)
      .attr("y2", 0)
      .attr("stroke", isInsideCircle ? "#aaa" : "#000") // 圆圈内#aaa，圆圈外#000
      .attr("stroke-width", tick % 1 === 0 ? 1 : 0.5)
      .attr("transform", `rotate(${i * angleStep})`);

    svg
      .append("text")
      .attr("x", radius - 10 + tickLength + 5)
      .attr("y", -2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .text(tick)
      .attr(
        "transform",
        `rotate(${i * angleStep}) rotate(${-(i * angleStep)}, ${
          radius - 10 + tickLength + 10
        } , 0)`
      );
  });

  // 绘制环形柱状图
  svg
    .append("g")
    .attr("transform", `rotate(90)`)
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("fill", "steelblue")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .transition() // 添加过渡动画
    .duration(1000) // 动画持续时间1秒
    .attrTween("d", function (d, i) {
      const ringWidth = 20;
      const spacing = 10;
      const baseRadius = 10;
      const innerRadius = baseRadius + i * (ringWidth + spacing);
      const outerRadius = innerRadius + ringWidth;

      const interpolate = d3.interpolate(0, d.value);

      return function (t) {
        const currentValue = interpolate(t);
        const endAngle = (currentValue / 3.9) * 2 * Math.PI;

        return d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(0)
          .endAngle(endAngle)();
      };
    });

  // 添加文本标签 位于每个圆环的中间
  svg
    .append("g")
    .attr("transform", `rotate(90)`)
    .selectAll(".ring-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "ring-label")
    .attr("transform", (d, i) => {
      const ringWidth = 20;
      const spacing = 10;
      const baseRadius = 10;
      const innerRadius = baseRadius + i * (ringWidth + spacing);
      const outerRadius = innerRadius + ringWidth;
      const midRadius = (innerRadius + outerRadius) / 2;
      const maxValue = 3.9;
      const startAngle = 0;
      const endAngle = (d.value / maxValue) * 2 * Math.PI;

      // 计算柱状图的几何中心点
      const arcCenter = d3
        .arc()
        .innerRadius(midRadius)
        .outerRadius(midRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .centroid();

      return `translate(${arcCenter[0]},${arcCenter[1]}) rotate(-90)`;
    })
    .style("opacity", 0) // 初始透明度为0
    .transition() // 添加过渡动画
    .delay(1000) // 延迟1秒(与柱状图动画时间一致)
    .duration(500) // 动画持续时间0.5秒
    .style("opacity", 1) // 最终透明度为1
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .style("fill", "#000")
    .style("font-weight", "bold")
    .text((d) => d.label);
});
</script>

<style scoped>
svg {
  margin: 20px;
}
</style>
