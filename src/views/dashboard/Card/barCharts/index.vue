<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
let echarts = require("echarts");
export default {
  name: "barCharts",
  mounted() {
    let barCharts = echarts.init(this.$refs.charts);
    barCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 均匀分配
        type: "category",
      },
      yAxis: {
        // 隐藏y轴
        show: false,
      },
      series: [
        {
          // 柱状图
          type: "bar",
          data: [30, 9, 53, 88, 15, 50, 90, 60, 23],
          color: "red",
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip: {},
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
