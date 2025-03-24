<!--
 * @Author: caopeng
 * @Date: 2025-03-20 16:59:38
 * @LastEditors: 
 * @LastEditTime: 2025-03-24 10:18:58
 * @Description: 请填写简介
-->
<template>
  <div class="app-content">
    <div class="side-bar">
      <div
        class="side-bar-item"
        :class="{ 'is-active': $route.path === item.path }"
        @click="$router.push(item.path)"
        v-for="item in sideBar"
        :key="item.path"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import routes from "@/router/routes.js";

const sideBar = routes.map((it) => {
  return {
    path: it.path,
    name: it.meta.title,
  };
});
</script>

<style lang="scss" scoped>
.app-content {
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  .side-bar {
    width: 200px;
    min-height: 100%;
    background-color: #333;
    overflow-y: auto;
    .side-bar-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        background-color: #666;
        color: #2e9ffc;
      }
    }
  }
  .is-active {
    background-color: #666;
    color: #2e9ffc;
  }
  .main {
    flex: 1;
  }
}
</style>
