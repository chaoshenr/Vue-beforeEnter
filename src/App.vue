<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <div class="tabbar">
      <router-link class="link" :to="{name: 'home'}">home</router-link>
      <router-link class="link" :to="{name: 'find'}">find</router-link>
      <router-link class="link" :to="{name: 'mine'}">mine</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.tabbar {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  padding: 20px;
  width: 100%;
}
a {
  display: inline-block;
  text-decoration: none;
  background: lightgrey;
  padding: 10px;;
}
</style>
