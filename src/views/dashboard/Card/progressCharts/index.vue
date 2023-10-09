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
        // 最大值和最小值的设置 就是x轴方向的底部和顶部是0-100
        min: 0,
        max: 100,
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        type: "category",
      },
      series: [
        {
          // 柱状图
          type: "bar",
          //   这里的data没有指定是x的data还是y的 所有如果让x轴均匀分配的意思就是就是series里面的data向着y轴方向铺过去，如果让y轴平均分配就是沿着x轴方向铺。
          data: [78],
          //   柱状图的宽度
          barWidth: 10,
          color: "yellowgreen",
          //   背景颜色设置 改为true才允许
          showBackground: true,
          //   设置背景颜色
          backgorundStyle: {
            color: "#eee",
          },
          //   文本标签
          label: {
            show: true,
            // 改变文本内容
            formatter: "|",
            // 文本标签位置调试
            position: "right",
          },
        },
      ],
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
