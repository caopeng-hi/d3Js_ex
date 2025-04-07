<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
// 引入Vue组合式API和D3.js数据可视化库
import { onMounted, ref } from "vue";
import * as d3 from "d3";

// 定义SVG DOM元素的引用
const chartRef = ref(null);
const value = ref(50);
onMounted(() => {});
</script>
<style scoped></style>
