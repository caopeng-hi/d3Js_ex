<template>
  <div class="map-content">
    <svg ref="svgRef" id="svgRef"></svg>
  </div>
</template>

<script setup>
// 导入D3.js数据可视化库和Vue的组合式API
import * as d3 from "d3";
import { onMounted, ref } from "vue";

// 创建SVG元素的模板引用
const svgRef = ref(null);

// 组件挂载后执行的初始化函数
onMounted(() => {
  // 1. 图表尺寸设置
  const width = 1000; // 图表总宽度
  const height = 180; // 图表总高度
  const margin = { top: 30, right: 20, bottom: 30, left: 50 }; // 图表边距

  // 2. 创建SVG容器
  const svg = d3
    .select(svgRef.value)
    .attr("width", width) // 设置SVG宽度
    .attr("height", height) // 设置SVG高度
    .attr("viewBox", [0, 0, width, height]); // 设置视口

  // 3. 生成模拟数据（过去一年的每日数据）
  const data = [];
  const now = new Date(2025, 11, 31); // 设置结束日期为2025年12月31日
  const yearAgo = new Date(now); // 创建一年前的日期对象
  yearAgo.setFullYear(yearAgo.getFullYear() - 1); // 设置为一年前

  // 生成从一年前到今天的所有日期数据
  for (let d = new Date(yearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    data.push({
      date: new Date(d), // 日期对象
      count: Math.floor(Math.random() * 10), // 随机生成0-9的贡献数
    });
  }

  // 4. 定义颜色比例尺（根据贡献值映射颜色）
  const colorScale = d3
    .scaleLinear()
    .domain([0, 5, 10]) // 输入值范围
    .range(["#ebedf0", "#9be9a8", "#216e39"]); // 输出颜色范围

  // 5. 计算方块尺寸和布局参数
  const cellSize = 15; // 每个日期方块的尺寸
  const cellMargin = 2; // 方块之间的间距
  const weekWidth = cellSize * 7 + cellMargin * 6; // 每周的总宽度

  // 6. 添加年份标签（左侧）
  svg
    .append("g") // 创建分组
    .selectAll("text.year") // 选择所有年份文本元素
    .data([yearAgo.getFullYear() + 1]) // 绑定数据（当前年份）
    .enter() // 进入数据绑定阶段
    .append("text") // 添加文本元素
    .attr("class", "year") // 设置类名
    .attr("x", 30) // x坐标
    .attr("y", height / 2) // y坐标（垂直居中）
    .text((d) => d) // 设置文本内容
    .style("font-size", "12px") // 字体大小
    .style("fill", "#767676") // 字体颜色
    .style("text-anchor", "middle"); // 文本对齐方式

  // 7. 添加星期标签（右侧）
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]; // 星期名称数组
  svg
    .append("g") // 创建分组
    .selectAll("text.weekday") // 选择所有星期文本元素
    .data(weekDays) // 绑定星期数据
    .enter() // 进入数据绑定阶段
    .append("text") // 添加文本元素
    .attr("class", "weekday") // 设置类名
    .attr("x", width - 20) // x坐标（右侧）
    .attr(
      "y",
      (d, i) => margin.top + i * (cellSize + cellMargin) + cellSize / 2
    ) // y坐标（按行排列）
    .text((d) => d) // 设置文本内容
    .style("font-size", "10px") // 字体大小
    .style("fill", "#767676") // 字体颜色
    .style("text-anchor", "middle"); // 文本对齐方式

  // 8. 创建Tooltip元素（用于鼠标悬停提示）
  const tooltip = d3
    .select("body") // 选择body元素
    .append("div") // 添加div元素
    .attr("class", "tooltip") // 设置类名
    .style("position", "absolute") // 绝对定位
    .style("visibility", "hidden") // 初始隐藏
    .style("background", "#333") // 背景色
    .style("color", "#fff") // 文字颜色
    .style("padding", "5px 10px") // 内边距
    .style("border-radius", "4px") // 圆角
    .style("font-size", "12px"); // 字体大小

  // 9. 绘制日历方块
  svg
    .selectAll("rect") // 选择所有矩形元素
    .data(data) // 绑定日期数据
    .enter() // 进入数据绑定阶段
    .append("rect") // 添加矩形元素
    .attr("width", cellSize) // 设置宽度
    .attr("height", cellSize) // 设置高度
    .attr("x", (d, i) => {
      // 计算x坐标（按周排列）
      const week = d3.timeWeek.count(yearAgo, d.date); // 计算周数
      return margin.left + week * (cellSize + cellMargin); // 返回x坐标
    })
    .attr("y", (d, i) => {
      // 计算y坐标（按星期排列）
      const day = getDayOfWeek(d.date); // 获取星期几
      return margin.top + day * (cellSize + cellMargin); // 返回y坐标
    })
    .attr("fill", (d) => colorScale(d.count)) // 设置填充颜色（根据贡献值）
    .attr("rx", 2) // 水平圆角
    .attr("ry", 2) // 垂直圆角
    .on("mouseover", function (event, d) {
      // 鼠标悬停事件
      d3.select(this).attr("fill", "red"); // 改变颜色为红色
      const weekDays = ["日", "一", "二", "三", "四", "五", "六"]; // 星期名称
      const dayName = weekDays[d.date.getDay()]; // 获取星期名称
      tooltip
        .html(
          // 设置Tooltip内容
          `${d.date.getFullYear()}年${
            d.date.getMonth() + 1
          }月${d.date.getDate()}日 星期${dayName}`
        )
        .style("left", event.pageX + 10 + "px") // 设置Tooltip位置x
        .style("top", event.pageY - 30 + "px") // 设置Tooltip位置y
        .style("visibility", "visible"); // 显示Tooltip
    })
    .on("mouseout", function () {
      // 鼠标移出事件
      d3.select(this).attr("fill", (d) => colorScale(d.count)); // 恢复原色
      tooltip.style("visibility", "hidden"); // 隐藏Tooltip
    });

  // 10. 添加月份标签（顶部）
  const months = d3.timeMonths(yearAgo, now); // 获取所有月份
  svg
    .selectAll("text.month") // 选择所有月份文本元素
    .data(months) // 绑定月份数据
    .enter() // 进入数据绑定阶段
    .append("text") // 添加文本元素
    .attr("class", "month") // 设置类名
    .attr("x", (d) => {
      // 计算x坐标
      const firstDay = d3.timeWeek.floor(d); // 获取该月第一周的第一天
      const diff = d3.timeDay.count(d3.timeYear.floor(d), firstDay); // 计算天数差
      return margin.left + (diff / 7) * (cellSize + cellMargin); // 返回x坐标
    })
    .attr("y", 15) // y坐标
    .text((d) => d.toLocaleString("default", { month: "short" })) // 设置月份缩写文本
    .style("font-size", "10px") // 字体大小
    .style("fill", "#767676"); // 字体颜色
});

// 辅助函数：获取星期几（0-6，0表示周日）
function getDayOfWeek(dateString) {
  const date = new Date(dateString); // 创建日期对象
  if (isNaN(date.getTime())) {
    // 检查日期是否有效
    throw new Error("无效的日期格式");
  }
  return date.getDay(); // 返回星期几（0-6）
}
</script>

<style scoped>
.map-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#svgRef {
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
