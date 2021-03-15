<template>
  <div class="home">
    <AMap />
    
  </div>
</template>

<script>
// @ is an alias to /src
import AMap from "@/components/AMap.vue";

export default {
  name: "Home",
  components: {
    AMap,
  },
  data() {
    return {
   
    };
  },
  created() {
    this.$axios.get('/user/info').then(res => {
      console.log(1111, res);
      this.$store.commit('SET_USER_INFO', res.result)
    })
  }

};
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;

}
</style>
