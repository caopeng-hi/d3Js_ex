<template>
  <div class="map-content">
    <svg ref="svgRef" id="svgRef"></svg>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted } from "vue";
import icon from "@/assets/vue.svg";
let timer = null;
let p = [];
let preTarget = null;
let svg = null;
onMounted(() => {
  svg = d3.select("svg");
  // var mapBackground = svg
  //   .append("g")
  //   .append("image")
  //   .attr("xlink:href", icon)
  //   .attr("width", 700)
  //   .attr("height", 700)
  //   .attr("x", 50)
  //   .attr("y", 50);
  var g = svg.append("g").attr("id", "chain-map");
  var mercator = d3.geoMercator().center([100, 45]).scale(750);
  var geoPath = d3.geoPath().projection(mercator);
  let reacts = null;
  d3.json("https://geojson.cn/api/china/china.json").then(function (data) {
    p = data.features.map((it) => {
      return it.properties;
    });
    var defs = svg.append("defs");
    var filter = defs
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "120%");

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");

    filter
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    reacts = g
      .append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("d", function (d, i) {
        return geoPath(d);
      })
      .attr("fill", "rgba(238, 238, 238,0.2)")
      .on("mouseover", function (d, i) {
        if (timer) {
          preTarget && preTarget.attr("fill", "rgba(238, 238, 238,0.2)");
          preTarget = null;
          clearInterval(timer);
          svg.selectAll(".label-overlay-timer").remove();
        }
        d3.select(this)
          .attr("fill", "#45a4df")
          .style("stroke", "#ccc")
          .style("stroke-width", 0)
          .attr("filter", "url(#drop-shadow)");
        onGroupLabel(d, i);
      })
      .on("mouseout", function (d, i) {
        d3.select(this)
          .attr("fill", "rgba(238, 238, 238,0.2)")
          .style("stroke", "gray")
          .style("stroke-width", 1)
          .attr("filter", null);
        removeGroupLabel(d, i);
        tooltipTimer();
      })
      .on("click", function (d, i) {
        showProvinceMap();
      });
    //绘制文字
    g.append("g")
      .selectAll("text")
      .data(data.features)
      .enter()
      .append("text")
      .attr("class", "label-overlay-text")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("x", function (d, i) {
        var position;
        if (d.properties.code == 130000) {
          position = mercator([114.530399, 38.037707]);
        } else if (d.properties.code == 620000) {
          position = mercator([103.826777, 36.060634]);
        } else {
          position = mercator(d.properties.centroid || [0, 0]);
        }
        return position[0];
      })
      .attr("y", function (d, i) {
        var position;
        if (d.properties.code == 130000) {
          position = mercator([114.530399, 38.037707]);
        } else if (d.properties.code == 620000) {
          position = mercator([103.826777, 36.060634]);
        } else {
          position = mercator(d.properties.centroid || [0, 0]);
        }
        return position[1];
      })
      .attr("dy", function (d, i) {
        if (d.properties.name === "澳门特别行政区") {
          return 10;
        }
      })
      .text(function (d, i) {
        return d.properties.name;
      });
  });
  let i = 0;
  const tooltipTimer = () => {
    timer = setInterval(() => {
      const e = p[i];
      let arr = [0, 0];
      if (e.code == 130000) {
        arr = [114.530399, 38.037707];
      } else if (e.code == 620000) {
        arr = [103.826777, 36.060634];
      } else {
        arr = e.centroid || [0, 0];
      }
      const [svgX, svgY] = mercator(arr);

      if (preTarget) {
        preTarget.attr("fill", "#eee");
      }
      const target = reacts
        .filter((d) => {
          return d.properties.code === e.code;
        })
        .attr("fill", "yellow");

      preTarget = target;
      let labelOverlay = svg.selectAll(".label-overlay-timer");
      if (labelOverlay.empty()) {
        labelOverlay = svg
          .append("g")
          .attr("class", "label-overlay-timer")
          .attr("transform", `translate(${svgX + 10}, ${svgY + 10})`);
        labelOverlay
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("width", 100)
          .attr("height", 30)
          .attr("fill", "#ccc");
        labelOverlay
          .append("text")
          .text(e.name)
          .attr("class", "label-text-timer")
          .attr("x", 10)
          .attr("y", 22)
          .attr("fill", "#aaa");
      } else {
        labelOverlay.attr("transform", `translate(${svgX + 10}, ${svgY + 10})`);
        labelOverlay.selectAll(".label-text-timer").text(e.name);
      }

      i++;
      if (i >= p.length) {
        i = 0;
      }
    }, 3000);
  };
  tooltipTimer();
  const flightsData = [
    {
      source: { x: 116.41995, y: 40.18994 },
      target: { x: 120.109913, y: 29.181466 },
    },
  ];
  const lineGenerator = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveBasis); // 使用曲线生成器
  svg
    .selectAll("path.flight")
    .data(flightsData)
    .enter()
    .append("path")
    .attr("class", "flight")
    .attr("d", (d) => {
      // 为每个飞线生成路径
      const [sX, sY] = mercator([d.source.x, d.source.y]);
      const [tX, tY] = mercator([d.target.x, d.target.y]);
      const pathData = [
        { x: sX, y: sY },
        { x: (sX + tX) / 2, y: tY },
        { x: tX, y: tY },
      ];
      return lineGenerator(pathData);
    })
    .style("fill", "none")
    .style("stroke", "aqua")
    .style("stroke-width", 2);

  // 添加一个小圆;
  const circle = svg.append("circle").attr("r", 5).style("fill", "red");

  //计算路径长度并设置动画;
  const flightPaths = svg.selectAll("path.flight");
  flightPaths.each(function (d) {
    const path = d3.select(this);
    // 动画函数
    function animateCircle() {
      circle
        .attr("transform", `translate(${d.source.x},${d.source.y})`)
        .transition()
        .duration(2000)
        .attrTween("transform", translateAlong(path.node()))
        .on("end", () => {
          // 反向动画
          circle
            .transition()
            .duration(2000)
            .attrTween("transform", translateAlong(path.node(), true))
            .on("end", animateCircle); // 递归调用以持续动画
        });
    }

    // 开始动画
    animateCircle();

    // 插值函数，用于沿着路径移动小圆
    function translateAlong(path, reverse = false) {
      const l = path.getTotalLength();
      return function (d, i, a) {
        return function (t) {
          const p = path.getPointAtLength(reverse ? l * (1 - t) : l * t);
          return `translate(${p.x},${p.y})`;
        };
      };
    }
  });

  //创建一个圆圈;
  const [cX, cY] = mercator([117.226884, 31.849254]);
  const shiB = svg
    .append("circle")
    .attr("cx", cX)
    .attr("cy", cY)
    .attr("r", 10)
    .style("fill", "blue")
    .style("opacity", 0.5);

  // 创建水波纹效果的函数;
  function createRipple() {
    const ripple = svg
      .append("circle")
      .attr("cx", cX)
      .attr("cy", cY)
      .attr("r", 0)
      .style("fill", "blue")
      .style("opacity", 0.3);

    ripple
      .transition()
      .duration(2000)
      .attr("r", 40)
      .style("opacity", 0)
      .on("end", function () {
        d3.select(this).remove();
      });

    setTimeout(createRipple, 500);
  }
  createRipple();
});
function onGroupLabel(e, d) {
  const mouseX = e.pageX - 150;
  const mouseY = e.pageY;
  const labelOverlay = svg
    .append("g")
    .attr("class", "label-overlay")
    .attr("transform", `translate(${mouseX}, ${mouseY})`);
  labelOverlay
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("width", 100)
    .attr("height", 40)
    .attr("fill", "#ccc");
  labelOverlay
    .append("text")
    .text(d.properties.name)
    .attr("x", 10)
    .attr("y", 22)
    .attr("fill", "#aaa");
  labelOverlay.selectAll("polyline").append("polyline").data();
  svg.on("mousemove", function (e) {
    labelOverlay.attr(
      "transform",
      `translate(${e.pageX - 150}, ${e.pageY + 20})`
    );
  });
}
function removeGroupLabel(e) {
  svg.selectAll(".label-overlay").remove();
  svg.selectAll("path.label-overlay-line").remove();
  svg.on("mousemove", null);
}
function showProvinceMap() {
  d3.json("https://geojson.cn/api/china/330000.json").then(function (
    provinceData
  ) {
    svg.select("#province-map").remove();
    svg.select("#chain-map").remove();
    svg.select(".label-overlay-text").remove();
    removeGroupLabel();

    //----->
    const g = svg.append("g").attr("id", "province-map");
    var mercator = d3.geoMercator().center([119.476498, 29.898918]).scale(8000);
    var geoPath = d3.geoPath().projection(mercator);
    g.append("g")
      .selectAll("path")
      .data(provinceData.features)
      .enter()
      .append("path")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("d", function (d, i) {
        return geoPath(d);
      })
      .attr("fill", "rgba(238, 238, 238,0.2)");

    g.append("g")
      .selectAll("text")
      .data(provinceData.features)
      .enter()
      .append("text")
      .attr("class", "label-overlay-text")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("x", function (d, i) {
        var position;
        if (d.properties.code == 130000) {
          position = mercator([114.530399, 38.037707]);
        } else if (d.properties.code == 620000) {
          position = mercator([103.826777, 36.060634]);
        } else {
          position = mercator(d.properties.centroid || [0, 0]);
        }
        return position[0];
      })
      .attr("y", function (d, i) {
        var position;
        if (d.properties.code == 130000) {
          position = mercator([114.530399, 38.037707]);
        } else if (d.properties.code == 620000) {
          position = mercator([103.826777, 36.060634]);
        } else {
          position = mercator(d.properties.centroid || [0, 0]);
        }
        return position[1];
      })
      .attr("dy", function (d, i) {
        if (d.properties.name === "澳门特别行政区") {
          return 10;
        }
      })
      .text(function (d, i) {
        return d.properties.name;
      });
  });
}
</script>

<style scoped>
#svgRef {
  width: 50vw;
  height: 99.5vh;
}
</style>
<style>
.label-overlay-text {
  pointer-events: none;
}
.animate-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: dash 2s ease infinite;
  /* color: aqua; */
}
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
.map-content {
  background-color: #eee;
}
</style>
