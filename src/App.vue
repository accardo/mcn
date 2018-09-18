<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

html,body{ position: relative; height: 100%;width: 100%;margin: 0;}
#app,.content{
  width: 100%;
  height: 100%;
  min-height: 100%;
  margin: 0;
}
</style>
<style scoped>
    @import '../static/css/common.css';
</style>
