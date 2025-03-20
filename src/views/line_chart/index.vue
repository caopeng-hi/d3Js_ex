<template>
  <svg></svg>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted } from "vue";
const data = [
  {
    date: "01-01",
    value: 40,
  },
  {
    date: "01-02",
    value: 60,
  },
  {
    date: "01-03",
    value: 55,
  },
  {
    date: "01-04",
    value: 65,
  },
  {
    date: "01-05",
    value: 70,
  },
];
const parseDate = d3.timeParse("%m-%d");
data.forEach((d) => {
  d.date = parseDate(d.date);
});

let svg;
const width = 500;
const height = 500;
const margin = { top: 20, right: 20, bottom: 20, left: 50 };
onMounted(() => {
  svg = d3.select("svg").attr("width", width).attr("height", height);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([margin.left, width - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.timeFormat("%m-%d"))
    .ticks(data.length);
  // x轴
  svg
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // y轴
  svg
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  // 折线
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr(
      "d",
      d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value))
        .defined((d) => !isNaN(d.value))
    );
  // 给每个点画小圆圈
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.value))
    .attr("r", 4)
    .attr("stroke", "#000")
    .attr("fill", "#fff")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("class", "active").transition().attr("r", 10);
      // 在鼠标悬停时显示提示框
      svg
        .append("rect")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .attr("width", 150)
        .attr("height", 50)
        .attr("x", event.pageX - 180)
        .attr("y", event.pageY + 10)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("stroke-width", 1);
      svg
        .append("text")
        .attr("class", "tooltip-date")
        .attr("x", event.pageX - 170)
        .attr("y", event.pageY + 30)
        .attr("fill", "#000")
        .text(`日期: ${d3.timeFormat("%m-%d")(d.date)}`);

      svg
        .append("text")
        .attr("class", "tooltip-value")
        .attr("x", event.pageX - 170)
        .attr("y", event.pageY + 50)
        .attr("fill", "#000")
        .text(`数值: ${d.value}`);
    })
    .on("mouseout", function () {
      d3.select(this).attr("class", "").transition().attr("r", 4);
      svg.select("#tooltip").remove();
      svg.select(".tooltip-date").remove();
      svg.select(".tooltip-value").remove();
    });
});
</script>

<style lang="scss" scoped></style>
