<!--
 * @Author: caopeng
 * @Date: 2025-03-31 09:08:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-31 09:25:08
 * @Description: 请填写简介
-->
<template>
  <svg ref="chartRef"></svg>
</template>

<script setup>
/**
 * 需要完善的功能
 *   1. 添加交互功能，例如点击节点展开或折叠子节点
 *   2. 添加节点和连接线的样式，例如颜色、粗细等
 *   3. 添加节点和连接线的动画效果，例如展开或折叠时的过渡效果
 *   4. 添加节点和连接线的事件处理，例如点击节点时的回调函数
 *   5. 添加节点和连接线的标签，例如节点名称、连接线的权重等
 *   ......
 */
// 引入Vue组合式API和D3.js数据可视化库
import { onMounted, ref } from "vue";
import * as d3 from "d3";
const data = {
  name: "flare",
  children: [
    {
      name: "analytics",
      children: [
        {
          name: "cluster",
          children: [
            { name: "AgglomerativeCluster", value: 3938 },
            { name: "CommunityStructure", value: 3812 },
            { name: "HierarchicalCluster", value: 6714 },
            { name: "MergeEdge", value: 743 },
          ],
        },
        {
          name: "graph",
          children: [
            { name: "BetweennessCentrality", value: 3534 },
            { name: "LinkDistance", value: 5731 },
            { name: "MaxFlowMinCut", value: 7840 },
            { name: "ShortestPaths", value: 5914 },
            { name: "SpanningTree", value: 3416 },
          ],
        },
        {
          name: "optimization",
          children: [{ name: "AspectRatioBanker", value: 7074 }],
        },
      ],
    },
    {
      name: "animate",
      children: [
        { name: "Easing", value: 17010 },
        { name: "FunctionSequence", value: 5842 },
        {
          name: "interpolate",
          children: [
            { name: "ArrayInterpolator", value: 1983 },
            { name: "ColorInterpolator", value: 2047 },
            { name: "DateInterpolator", value: 1375 },
            { name: "Interpolator", value: 8746 },
            { name: "MatrixInterpolator", value: 2202 },
            { name: "NumberInterpolator", value: 1382 },
            { name: "ObjectInterpolator", value: 1629 },
            { name: "PointInterpolator", value: 1675 },
            { name: "RectangleInterpolator", value: 2042 },
          ],
        },
        { name: "ISchedulable", value: 1041 },
        { name: "Parallel", value: 5176 },
        { name: "Pause", value: 449 },
        { name: "Scheduler", value: 5593 },
        { name: "Sequence", value: 5534 },
        { name: "Transition", value: 9201 },
        { name: "Transitioner", value: 19975 },
        { name: "TransitionEvent", value: 1116 },
        { name: "Tween", value: 6006 },
      ],
    },
    {
      name: "data",
      children: [
        {
          name: "converters",
          children: [
            { name: "Converters", value: 721 },
            { name: "DelimitedTextConverter", value: 4294 },
            { name: "GraphMLConverter", value: 9800 },
            { name: "IDataConverter", value: 1314 },
            { name: "JSONConverter", value: 2220 },
          ],
        },
        { name: "DataField", value: 1759 },
        { name: "DataSchema", value: 2165 },
        { name: "DataSet", value: 586 },
        { name: "DataSource", value: 3331 },
        { name: "DataTable", value: 772 },
        { name: "DataUtil", value: 3322 },
      ],
    },
    {
      name: "display",
      children: [
        { name: "DirtySprite", value: 8833 },
        { name: "LineSprite", value: 1732 },
        { name: "RectSprite", value: 3623 },
        { name: "TextSprite", value: 10066 },
      ],
    },
    {
      name: "flex",
      children: [{ name: "FlareVis", value: 4116 }],
    },
    {
      name: "physics",
      children: [
        { name: "DragForce", value: 1082 },
        { name: "GravityForce", value: 1336 },
        { name: "IForce", value: 319 },
        { name: "NBodyForce", value: 10498 },
        { name: "Particle", value: 2822 },
        { name: "Simulation", value: 9983 },
        { name: "Spring", value: 2213 },
        { name: "SpringForce", value: 1681 },
      ],
    },
    {
      name: "query",
      children: [
        { name: "AggregateExpression", value: 1616 },
        { name: "And", value: 1027 },
        { name: "Arithmetic", value: 3891 },
        { name: "Average", value: 891 },
        { name: "BinaryExpression", value: 2893 },
        { name: "Comparison", value: 5103 },
        { name: "CompositeExpression", value: 3677 },
        { name: "Count", value: 781 },
        { name: "DateUtil", value: 4141 },
        { name: "Distinct", value: 933 },
        { name: "Expression", value: 5130 },
        { name: "ExpressionIterator", value: 3617 },
        { name: "Fn", value: 3240 },
        { name: "If", value: 2732 },
        { name: "IsA", value: 2039 },
        { name: "Literal", value: 1214 },
        { name: "Match", value: 3748 },
        { name: "Maximum", value: 843 },
        {
          name: "methods",
          children: [
            { name: "add", value: 593 },
            { name: "and", value: 330 },
            { name: "average", value: 287 },
            { name: "count", value: 277 },
            { name: "distinct", value: 292 },
            { name: "div", value: 595 },
            { name: "eq", value: 594 },
            { name: "fn", value: 460 },
            { name: "gt", value: 603 },
            { name: "gte", value: 625 },
            { name: "iff", value: 748 },
            { name: "isa", value: 461 },
            { name: "lt", value: 597 },
            { name: "lte", value: 619 },
            { name: "max", value: 283 },
            { name: "min", value: 283 },
            { name: "mod", value: 591 },
            { name: "mul", value: 603 },
            { name: "neq", value: 599 },
            { name: "not", value: 386 },
            { name: "or", value: 323 },
            { name: "orderby", value: 307 },
            { name: "range", value: 772 },
            { name: "select", value: 296 },
            { name: "stddev", value: 363 },
            { name: "sub", value: 600 },
            { name: "sum", value: 280 },
            { name: "update", value: 307 },
            { name: "variance", value: 335 },
            { name: "where", value: 299 },
            { name: "xor", value: 354 },
            { name: "-", value: 264 },
          ],
        },
        { name: "Minimum", value: 843 },
        { name: "Not", value: 1554 },
        { name: "Or", value: 970 },
        { name: "Query", value: 13896 },
        { name: "Range", value: 1594 },
        { name: "StringUtil", value: 4130 },
        { name: "Sum", value: 791 },
        { name: "Variable", value: 1124 },
        { name: "Variance", value: 1876 },
        { name: "Xor", value: 1101 },
      ],
    },
    {
      name: "scale",
      children: [
        { name: "IScaleMap", value: 2105 },
        { name: "LinearScale", value: 1316 },
        { name: "LogScale", value: 3151 },
        { name: "OrdinalScale", value: 3770 },
        { name: "QuantileScale", value: 2435 },
        { name: "QuantitativeScale", value: 4839 },
        { name: "RootScale", value: 1756 },
        { name: "Scale", value: 4268 },
        { name: "ScaleType", value: 1821 },
        { name: "TimeScale", value: 5833 },
      ],
    },
    {
      name: "util",
      children: [
        { name: "Arrays", value: 8258 },
        { name: "Colors", value: 10001 },
        { name: "Dates", value: 8217 },
        { name: "Displays", value: 12555 },
        { name: "Filter", value: 2324 },
        { name: "Geometry", value: 10993 },
        {
          name: "heap",
          children: [
            { name: "FibonacciHeap", value: 9354 },
            { name: "HeapNode", value: 1233 },
          ],
        },
        { name: "IEvaluable", value: 335 },
        { name: "IPredicate", value: 383 },
        { name: "IValueProxy", value: 874 },
        {
          name: "math",
          children: [
            { name: "DenseMatrix", value: 3165 },
            { name: "IMatrix", value: 2815 },
            { name: "SparseMatrix", value: 3366 },
          ],
        },
        { name: "Maths", value: 17705 },
        { name: "Orientation", value: 1486 },
        {
          name: "palette",
        },
        { name: "Property", value: 5559 },
        { name: "Shapes", value: 19118 },
        { name: "Sort", value: 6887 },
        { name: "Stats", value: 6557 },
        { name: "Strings", value: 22026 },
      ],
    },
    {
      name: "vis",
      children: [
        {
          name: "axis",
          children: [
            { name: "Axes", value: 1302 },
            { name: "Axis", value: 24593 },
            { name: "AxisGridLine", value: 652 },
            { name: "AxisLabel", value: 636 },
            { name: "CartesianAxes", value: 6703 },
          ],
        },
        {
          name: "controls",
        },
        {
          name: "data",
          children: [
            { name: "Data", value: 20544 },
            { name: "DataList", value: 19788 },
            { name: "DataSprite", value: 10349 },
            { name: "EdgeSprite", value: 3301 },
            { name: "NodeSprite", value: 19382 },
            {
              name: "render",
            },
            { name: "ScaleBinding", value: 11275 },
            { name: "Tree", value: 7147 },
            { name: "TreeBuilder", value: 9930 },
          ],
        },
        {
          name: "events",
        },
        {
          name: "legend",
        },
        {
          name: "operator",
          children: [
            {
              name: "distortion",
            },
            {
              name: "encoder",
            },
            {
              name: "filter",
            },
            { name: "IOperator", value: 1286 },
            {
              name: "label",
            },
            {
              name: "layout",
            },
            { name: "Operator", value: 2490 },
            { name: "OperatorList", value: 5248 },
            { name: "OperatorSequence", value: 4190 },
            { name: "OperatorSwitch", value: 2581 },
            { name: "SortOperator", value: 2023 },
          ],
        },
        { name: "Visualization", value: 16540 },
      ],
    },
  ],
};

// 定义SVG DOM元素的引用
const chartRef = ref(null);
/* 定义SVG元素的样式 */
onMounted(() => {
  // 设置图表尺寸和边距
  const width = 1200;
  const height = 800;
  const margin = { top: 50, right: 90, bottom: 30, left: 90 };

  // 创建SVG容器
  const svg = d3
    .select(chartRef.value)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // 创建树布局
  const treeLayout = d3
    .tree()
    .size([
      height - margin.top - margin.bottom,
      width - margin.left - margin.right,
    ])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2));
  // 层次化数据
  const root = d3.hierarchy(data);

  // 默认折叠三级及以下节点
  root.descendants().forEach((node) => {
    if (node.depth >= 2) {
      // 修改为2表示从第三级开始折叠
      node._children = node.children;
      node.children = null;
    }
  });

  const treeData = treeLayout(root);

  // 添加节点组
  const node = svg
    .append("g")
    .selectAll("g")
    .data(treeData.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  // 默认折叠三级以下节点
  root.descendants().forEach((node) => {
    if (node.depth >= 3) {
      node._children = node.children;
      node.children = null;
    }
  });

  // 添加节点圆圈时添加点击事件
  node
    .append("circle")
    .attr("r", 5)
    .attr("fill", (d) => (d.children ? "#555" : "#999"))
    .on("click", (event, d) => {
      if (d._children) {
        d.children = d._children;
        d._children = null;
      } else if (d.children) {
        d._children = d.children;
        d.children = null;
      }
      update(d);
    });

  // 添加更新函数
  function update(source) {
    const treeData = treeLayout(root);

    // 更新节点位置
    svg
      .selectAll("g.node")
      .data(treeData.descendants(), (d) => d.id)
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // 更新连接线
    svg
      .selectAll("path.link")
      .data(treeData.links(), (d) => d.target.id)
      .attr("d", linkGenerator);
  }

  // 创建连接线生成器
  const linkGenerator = d3
    .linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);

  // 添加连接线
  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(treeData.links())
    .join("path")
    .attr("d", linkGenerator);

  // 添加节点文本
  node
    .append("text")
    .attr("dy", "0.31em")
    .attr("x", (d) => (d.children ? -8 : 8))
    .attr("text-anchor", (d) => (d.children ? "end" : "start"))
    .text((d) => d.data.name)
    .clone(true)
    .lower()
    .attr("stroke", "white")
    .attr("stroke-width", 3);
});
</script>

<style scoped>
svg {
  background-color: #f8f8f8;
}
</style>
