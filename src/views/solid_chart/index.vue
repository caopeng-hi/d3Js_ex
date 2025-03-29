<template>
  <svg ref="chartRef"></svg>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";
const data = [
  { value: 60, name: "Visit" },
  { value: 40, name: "Inquiry" },
  { value: 20, name: "Order" },
  { value: 80, name: "Click" },
  { value: 100, name: "Show" },
];
onMounted(() => {});
</script>
<style lang="scss" scoped></style>
