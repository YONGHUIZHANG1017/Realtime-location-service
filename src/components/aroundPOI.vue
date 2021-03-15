<template>
  <div class="aroundPOIWrap">
    <h3 style="text-align:left;padding-left:10px;margin:5px 0">Nearby facilities：</h3>
    <el-table :data="tableData.pois" style="width: 100%"  :height="appHeight/2">
      <el-table-column prop="type" label="type"> </el-table-column>
      <el-table-column prop="name" label="name"> </el-table-column>
      <el-table-column prop="address" label="address"> </el-table-column>
      <el-table-column prop="tel" label="tel"> </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="tableData.count" @current-change="pageChange" style="text-align:right;"> </el-pagination>
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex';
export default {
  name: "aroundPOI",
  props: ["tableData"],
  computed: {
    ...mapGetters(['appHeight'])
  },
  data() {
    return {};
  },
  methods: {
    pageChange(val) {
      console.log(val);
      this.$emit('page-change', val)
    }
  }
};
</script>
  
<style lang='less' scoped>
.aroundPOIWrap {
}
</style>