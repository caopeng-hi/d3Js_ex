<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
import * as d3 from "d3";
import { ref, onMounted } from "vue";

const chartRef = ref(null);
const data = ref({
  name: "冒险者",
  maxValue: 100,
  stats: [
    { axis: "力量", value: 85 },
    { axis: "敏捷", value: 65 },
    { axis: "智力", value: 75 },
    { axis: "耐力", value: 80 },
    { axis: "幸运", value: 50 },
    { axis: "魅力", value: 70 },
  ],
});

onMounted(() => {
  // 1. 设置图表尺寸和边距
  const width = 500;
  const height = 500;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  // 2. 创建SVG容器
  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 3. 计算雷达图参数
  const numAxes = data.value.stats.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const radius = Math.min(width, height) / 2 - margin.top;

  // 4. 创建比例尺
  const rScale = d3
    .scaleLinear()
    .domain([0, data.value.maxValue])
    .range([0, radius]);

  // 5. 绘制轴线
  const axis = svg
    .selectAll(".axis")
    .data(data.value.stats)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr(
      "x2",
      (d, i) =>
        rScale(data.value.maxValue) * Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "y2",
      (d, i) =>
        rScale(data.value.maxValue) * Math.sin(angleSlice * i - Math.PI / 2)
    )
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1);

  // 6. 绘制刻度线
  const levels = 5;
  for (let level = 0; level < levels; level++) {
    const levelFactor = radius * ((level + 1) / levels);

    svg
      .selectAll(".levels")
      .data(data.value.stats)
      .enter()
      .append("line")
      .attr(
        "x1",
        (d, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "y1",
        (d, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "x2",
        (d, i) => levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2)
      )
      .attr(
        "y2",
        (d, i) => levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2)
      )
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5);
  }

  // 7. 绘制属性值区域
  const radarLine = d3
    .lineRadial()
    .angle((d, i) => i * angleSlice)
    .radius((d) => rScale(d.value))
    .curve(d3.curveLinearClosed);

  svg
    .append("path")
    .datum(data.value.stats)
    .attr("class", "radar-area")
    .attr("d", radarLine)
    .attr("fill", "#ffcc00")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "#ff9900")
    .attr("stroke-width", 2);

  // 新增：在交点处添加小圆圈
  svg
    .selectAll(".intersection-point")
    .data(data.value.stats)
    .enter()
    .append("circle")
    .attr("class", "intersection-point")
    .attr(
      "cx",
      (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "cy",
      (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
    )
    .attr("r", 3) // 初始半径
    .attr("fill", "#ff00ee")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .style("cursor", "pointer") // 添加鼠标小手样式
    .on("mouseover", function () {
      d3.select(this).transition().duration(200).attr("r", 3.6); // 放大1.2倍
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).attr("r", 3); // 恢复原样
    })
    .on("mousedown", function () {
      d3.select(this).attr("fill", "#90EE90"); // 长按时改为淡绿色
    })
    .on("mouseup", function () {
      d3.select(this).attr("fill", "#ff00ee"); // 松开时恢复原色
    })
    .call(
      d3
        .drag()
        .on("start", function (event, d) {
          // 拖拽开始时改变样式
          d3.select(this).attr("fill", "#90EE90");
        })
        .on("drag", function (event, d) {
          // 计算新的值
          const i = data.value.stats.indexOf(d);
          const angle = angleSlice * i - Math.PI / 2;

          // 计算鼠标在对应轴上的投影
          const x = event.x;
          const y = event.y;

          // 计算鼠标相对于原点的方向
          const mouseDirection = Math.atan2(y, x);
          const dotDirection = Math.atan2(
            rScale(d.value) * Math.sin(angle),
            rScale(d.value) * Math.cos(angle)
          );

          // 判断鼠标是往原点移动还是远离原点
          const isMovingTowardsOrigin =
            Math.abs(mouseDirection - dotDirection) < Math.PI / 2 &&
            Math.sqrt(x * x + y * y) < rScale(d.value);
          console.log(isMovingTowardsOrigin);

          // 根据鼠标移动方向调整 newValue
          const delta = isMovingTowardsOrigin ? -1 : 1;

          const newValue = d.value + delta * 1;

          // 限制值在0到maxValue之间
          d.value = Math.max(0, Math.min(data.value.maxValue, newValue));

          // 更新圆点位置
          d3.select(this)
            .attr("cx", rScale(d.value) * Math.cos(angle))
            .attr("cy", rScale(d.value) * Math.sin(angle));

          // 更新雷达图区域
          svg.select(".radar-area").attr("d", radarLine);
          // 更新属性标签
          svg
            .selectAll(".legend")
            .data(data.value.stats)
            .text((d) => `${d.axis} (${d.value})`);
        })
        .on("end", function (event, d) {
          // 拖拽结束时恢复样式
          d3.select(this).attr("fill", "#ff00ee");
        })
    );

  // 8. 添加属性标签
  axis
    .append("text")
    .attr("class", "legend")
    .attr(
      "x",
      (d, i) =>
        rScale(data.value.maxValue * 1.1) *
        Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "y",
      (d, i) =>
        rScale(data.value.maxValue * 1.1) *
        Math.sin(angleSlice * i - Math.PI / 2)
    )
    .text((d) => `${d.axis} (${d.value})`) // 在属性名称后添加数值
    .style("font-size", "12px")
    .style("text-anchor", "middle");

  // 9. 添加角色名称
  svg
    .append("text")
    .attr("x", -radius)
    .attr("y", -radius - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(data.value.name);
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
