<template>
  <!-- 放折线图的容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts  这里貌似必须用* as echarts 才能引入成功 import echarts from 'echarts' 引入不成功
// import * as echarts from "echarts";
let echarts = require("echarts");
export default {
  name: "LineCharts",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    // console.log(lineCharts);
    //   配置数据
    lineCharts.setOption({
      // x轴和y轴不能不写，不写折线图会报错，但是可以隐藏
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
      // 系列
      series: [
        {
          type: "line",
          data: [30, 5, 53, 88, 10, 30, 2, 60],
          // 拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          // 弧度设置
          smooth: true,
          // 线条的样式
          lineStyle: {
            color: "purple",
          },
          // 填充颜色
          areaStyle: {
            color: "skyblue",
            // 不知道为啥，渐变效果无法实现
            // color: {
            //   type: "linear",
            //   x: 0,
            //   y: 0,
            //   x2: 0,
            //   y2: 0,
            //   colorStops: [
            //     { offset: 0, color: "purple" },
            //     { offset: 1, color: "#fff" },
            //   ],
            //   global: false,
            // },
          },
        },
      ],
      // 布局的调试  这个折线图在指定位置太大了
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
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
