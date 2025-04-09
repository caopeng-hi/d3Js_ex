<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const chartRef = ref(null); // SVG容器引用
const value = ref(50); // 初始为50
</script>

<style scoped></style>
