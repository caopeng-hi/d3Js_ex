<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

// 定义图表引用和数据
const chartRef = ref(null);
const data = [
  { value: 100, name: "Show" }, // 展示阶段，转化率100%
  { value: 80, name: "Click" }, // 点击阶段，转化率80%
  { value: 60, name: "Visit" }, // 访问阶段，转化率60%
  { value: 40, name: "Inquiry" }, // 咨询阶段，转化率40%
  { value: 20, name: "Order" }, // 订单阶段，转化率20%
];

onMounted(() => {
  // 1. 设置图表尺寸和边距
  const width = 500; // 图表宽度
  const height = 400; // 图表高度
  const margin = {
    // 边距设置
    top: 30, // 上边距
    right: 30, // 右边距
    bottom: 50, // 下边距
    left: 30, // 左边距
  };

  // 2. 创建SVG容器
  const svg = d3
    .select(chartRef.value)
    .attr("width", width) // 设置宽度
    .attr("height", height); // 设置高度

  // 3. 计算漏斗图尺寸
  const totalHeight = height - margin.top - margin.bottom; // 可用高度
  const triangleHeight = totalHeight * 0.95; // 漏斗图实际高度(留出空间)
  const triangleBase = width * 0.9; // 漏斗图底部宽度

  // 4. 创建漏斗图容器组并平移
  const rect = svg.append("g").attr("transform", `translate(${25},${50})`); // 向右下平移

  // 5. 绘制漏斗图形
  rect
    .selectAll(".funnel")
    .data(data) // 绑定数据
    .enter() // 进入数据
    .append("path") // 创建路径元素
    .attr("class", "funnel") // 设置类名
    .attr("d", (d, i) => {
      // 定义路径
      const centerX = width / 2; // 中心X坐标
      // 当前层顶部Y坐标
      const segmentTop = margin.top + (i / data.length) * triangleHeight;
      // 当前层底部Y坐标
      const segmentBottom =
        margin.top + ((i + 1) / data.length) * triangleHeight;

      // 计算当前层顶部和底部宽度
      const topWidth = triangleBase * (1 - i / data.length);
      const bottomWidth = triangleBase * (1 - (i + 1) / data.length);

      // 返回路径字符串
      return `
        M${centerX - topWidth / 2},${segmentTop}    // 移动到左上角
        L${centerX + topWidth / 2},${segmentTop}    // 画线到右上角
        L${centerX + bottomWidth / 2},${segmentBottom} // 画线到右下角
        L${centerX - bottomWidth / 2},${segmentBottom} // 画线到左下角
        Z`; // 闭合路径
    })
    .attr("fill", (d, i) => d3.schemeCategory10[i]) // 设置填充颜色
    .attr("stroke", "#fff") // 设置边框颜色
    .attr("stroke-width", 1); // 设置边框宽度

  // 添加图例
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width / 2},${margin.top - 15})`); // 上移15像素

  legend
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 80 - (data.length * 80) / 2)
    .attr("y", 0)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", (d, i) => d3.schemeCategory10[i]);

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

  // 添加标签
  const labels = svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", width / 2)
    .attr(
      "y",
      (d, i) => margin.top + (i + 0.5) * (triangleHeight / data.length)
    )
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .style("fill", "#333")
    .style("user-select", "none") // 添加不可选样式
    .style("pointer-events", "none") // 添加不捕获鼠标事件
    .style("cursor", "pointer") // 添加小手样式
    .text((d) => `${d.name}`)
    .attr("transform", `translate(${25},${50})`);

  // 添加鼠标交互效果
  rect
    .selectAll(".funnel")
    .style("cursor", "pointer") // 添加小手样式
    .on("mouseover", function (event, d) {
      labels
        .filter((label) => label.name === d.name)
        .transition()
        .duration(200)
        .style("font-size", "14.4px"); // 12px * 1.2
    })
    .on("mouseout", function (event, d) {
      labels
        .filter((label) => label.name === d.name)
        .transition()
        .duration(200)
        .style("font-size", "12px");
    });
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
