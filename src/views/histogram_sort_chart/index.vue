<template>
  <svg></svg>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted } from "vue";
let svg;
onMounted(() => {
  svg = d3.select("svg");
});
</script>

<style lang="scss" scoped></style>
