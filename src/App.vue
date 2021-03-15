<template>
  <div id="app" ref="app">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    const height = this.$refs.app.clientHeight
    this.$store.commit('SET_APP_HEIGHT', height)
  }
}
</script>

<style lang="less">
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
