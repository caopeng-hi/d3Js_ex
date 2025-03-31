<!--
 * @Author: caopeng
 * @Date: 2025-03-31 09:08:46
 * @LastEditors: 
 * @LastEditTime: 2025-03-31 09:09:20
 * @Description: 请填写简介
-->
<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
// 引入Vue组合式API和D3.js数据可视化库
import { onMounted, ref } from "vue";
import * as d3 from "d3";

// 定义SVG DOM元素的引用
const chartRef = ref(null);
</script>
<style scoped>
/* 定义SVG元素的样式 */
</style>
