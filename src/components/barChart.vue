<template>
  <div class="barChart">
    <div id="barChart"></div>
  </div>
</template>
  
<script>
export default {
  name: "barChart",
  props: ["barData"],
  watch: {
    barData(val) {
      this.render(val)
    },
  },
  data() {
    return {};
  },
  mounted() {
    const barChart = echarts.init(document.getElementById("barChart"), "dark", {
      renderer: "canvas",
    });
    this.barChart = barChart;
    this.render([]);
  },
  methods: {
    render(data) {
    console.log('render chart', data);
      const option = {
        backgroundColor: "#2c343c",

        title: {
          text: "catergory",
          x: "center",
          top: 10,
          textStyle: {
            color: "#ccc",
          },
        },
        xAxis: {
          type: "category",
          data: data.map(item => item.name),
        },
        yAxis: {
          type: "value",
          show: false,
        },
        tooltip: {
          trigger: "item",
          formatter(a, b, c, d) {
            return `${a.name} count：${a.value}`;
          },
        },
        series: [
          {
            data,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)",
            },
          },
        ],
      };
      this.barChart.setOption(option);
    },
  },
};
</script>
  
<style lang='less' scoped>
.barChart,
#barChart {
  width: 100%;
  height: 100%;
}
</style>