<template>
  <svg ref="chartRef"></svg>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";

const chartRef = ref(null);
onMounted(() => {});
</script>

<style scoped></style>
