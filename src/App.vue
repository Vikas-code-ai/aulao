<template>
  <div id="app">
    <DisciplineViewer />
  </div>
</template>

<script setup lang="ts">
import DisciplineViewer from './components/discipline/DisciplineViewer.vue'
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f7fafc;
}
</style>
