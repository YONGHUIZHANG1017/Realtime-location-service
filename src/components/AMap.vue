<template>
  <div class="mapWrap">
    <Poptip
      :style="{ position: 'absolute', left: '50px', top: '20px', zIndex: 999 }"
      trigger="hover"
    >
      <Avatar
        :size="45"
        :style="{
          background: '#f56a00',
        }"
        >{{ userInfo.name }}</Avatar
      >
      <el-button slot="content" size="mini" type="danger" @click="logout">退出</el-button>
    </Poptip>

    <div class="toolBar">
      <el-button type="primary" @click="drawer = true">upload file</el-button>
    </div>
    <!-- 上传文件 -->
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      size="40%"
    >
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="readFile"
        :auto-upload="false"
        accept="application/json,text/*"
      >
        <el-button size="small" type="primary"
          >upload<i class="el-icon-upload el-icon--right"></i
        ></el-button>
        <div slot="tip" class="el-upload__tip">only JSON file</div>
      </el-upload>
      <textarea
        class="fileContent"
        disabled
        v-bind:value="fileContent"
      ></textarea>
    </el-drawer>
    <!-- 周边信息table -->
    <el-drawer
      direction="ltr"
      :visible.sync="drawer_around"
      :with-header="false"
      size="50%"
    >
      <aroundPOI :tableData="tableData" @page-change="handlePageChange" />
      <barChart
        ref="barChart"
        :barData="barData"
        :style="{
          width: '100%',
          height: $store.getters.appHeight / 2 - 70 + 'px',
        }"
      />
    </el-drawer>
    <!-- map -->
    <div id="amap"></div>
  </div>
</template>
  
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import aroundPOI from "./aroundPOI";
import barChart from "./barChart";
import { mapGetters } from "vuex";
export default {
  name: "AMap",
  components: {
    aroundPOI,
    barChart,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      query: "",
      fileContent: "file content",
      map: null,
      AMap: null,
      lnglats: [],
      drawer: false,
      drawer_around: false,
      tableData: {},
      barData: [],
    };
  },
  mounted() {
    AMapLoader.load({
      key: "c456a66f90bbed06c6214bc9d5168fcb",
      version: "1.4.15",
      plugins: ["AMap.PlaceSearch"],
    })
      .then((AMap) => {
        this.AMap = AMap;
        console.log(this.AMap);

        var map = new AMap.Map("amap", {
          center: [116.397428, 39.90923],
          zoom: 11,
        });
        this.map = map;
      })
      .catch((e) => {
        console.log(e);
      });

    // Code that will run only after the
    // entire view has been rendered
  },
  methods: {
    logout() {
      localStorage.clear()
      location.reload()
    },
    readFile(file) {
      if (window.FileReader && file) {
        console.log(file);
        let reader = new FileReader();
        reader.onload = (e) => {
          // console.log(e.target.result);
          this.fileContent = e.target.result;

          let tempData = JSON.parse(this.fileContent);

          if (
            tempData instanceof Array &&
            tempData.length > 0 &&
            tempData[0]["Longitude"] &&
            tempData[0]["Latitude"]
          ) {
            console.log("if");
            this.lnglats = tempData;
            this.drawPath();
          } else {
            console.log("else");
          }
        };
        reader.readAsText(file.raw);
      }
    },
    drawPath() {
      let gps = [];
      // console.log(this.lnglats);
      for (let e of this.lnglats) {
        gps.push(new this.AMap.LngLat(e["Longitude"], e["Latitude"]));
      }
      // console.log(gps);
      this.AMap.convertFrom(gps, "gps", (status, result) => {
        if (result.info === "ok") {
          let lnglats = result.locations; // Array.<LngLat>
          // console.log(lnglats);
          // 创建折线实例
          this.polyline = new this.AMap.Polyline({
            path: lnglats,
            strokeWeight: 4, // 线条宽度，默认为 1
            strokeColor: "red", // 线条颜色
            lineJoin: "round", // 折线拐点连接处样式
          });
          this.polyline.on("click", this.handleLineClick);
          // 将折线添加至地图实例
          this.map.add(this.polyline);
          this.map.setCenter(lnglats[500]);
        }
      });
    },
    handleLineClick(e) {
      if (!this.placeSearch)
        this.placeSearch = new this.AMap.PlaceSearch({
          lang: "en",
          map: this.map,
        });
      this.placeSearch.searchInBounds(
        "",
        this.polyline.getBounds(),
        (status, result) => {
          console.log(status, result);
          this.drawer_around = true;
          this.tableData = result.poiList;
        }
      );
      if (!e) return;
      const tmpSearch = new this.AMap.PlaceSearch({
        type: "餐饮|酒店|电影院|运动场",
        lang: "en",
        pageSize: 50,
      });
      tmpSearch.searchInBounds(
        "",
        this.polyline.getBounds(),
        (status, result) => {
          console.log(2222, status, result);
          let types = result.poiList.pois;
          types = types.map((item) => item.type);
          const obj = {};
          types.forEach((item) => {
            let type = item.split(";")[0];
            console.log(type);
            if (obj.hasOwnProperty(type)) {
              obj[type]++;
            } else {
              obj[type] = 0;
            }
          });
          const tmpData = [];
          Object.keys(obj).forEach((key) => {
            tmpData.push({
              name: key,
              value: obj[key],
            });
          });
          this.barData = tmpData;
        }
      );
    },
    handlePageChange(page) {
      console.log(111, page);
      this.placeSearch.setPageIndex(page);
      this.handleLineClick();
    },
  },
};
</script>
  
<style lang='less' scoped>
#amap,
.mapWrap {
  width: 100%;
  height: 100%;
}
.searchBar {
  display: flex;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 99;
}
.toolBar {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 99;
}
.upload-demo {
  margin-top: 20px;
}
.fileContent {
  width: 100%;
  height: 60%;
}
</style>