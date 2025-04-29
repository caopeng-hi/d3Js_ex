<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
// 引入 D3.js 库，用于数据可视化
import * as d3 from "d3";
// 引入 Vue 的 onMounted 钩子，用于在组件挂载后执行代码
import { ref, onMounted } from "vue";
const data = ref({
  name: "冒险者",
  maxValue: 100, // 最大属性值
  stats: [
    { axis: "力量", value: 85 },
    { axis: "敏捷", value: 65 },
    { axis: "智力", value: 75 },
    { axis: "耐力", value: 80 },
    { axis: "幸运", value: 50 },
    { axis: "魅力", value: 70 },
  ],
});
</script>
<style scoped></style>
