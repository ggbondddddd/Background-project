<template>
  <el-card class="box-card" style="margin: 10px 0">
    <!-- 销售页面的顶部 -->
    <d iv slot="header" class="clearfix">
      <!--  @tab-click="handleClick" -->
      <!-- 头部左侧内容  tabs栏的pane标签的name是和tabs标签的v-model是双向绑定的 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visits"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!--     v-model="value1" -->
        <el-date-picker
          v-model="date"
          class="date"
          size="mini"
          type="daterange"
          rang-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </d>
    <!-- 销售页面的的顶部下面，用el-row分成两份 一封16 一份8 -->
    <div>
      <el-row>
        <el-col :span="18">
          <!-- 容器 放柱状图-->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div>
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rindex">0</span>
                <span class="jiji">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">1</span>
                <span class="jiji">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span class="jiji">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span>3</span>
                <span class="jiji">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span>4</span>
                <span class="jiji">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span>5</span>
                <span class="jiji">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span>6</span>
                <span class="jiji">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  mounted() {
    // 初始化echarts
    this.mycharts = echarts.init(this.$refs.charts);
    // 配置数据
    // this.mycharts.setOption({
    //   title: {
    //     text: "销售额趋势",
    //   },
    //   tooltip: {
    //     trigger: "axis",
    //     axisPointer: {
    //       type: "shadow",
    //     },
    //   },
    //   grid: {
    //     left: "3%",
    //     right: "4%",
    //     bottom: "3%",
    //     containLabel: true,
    //   },
    //   xAxis: [
    //     {
    //       type: "category",
    //       data: [],
    //       axisTick: {
    //         alignWithLabel: true,
    //       },
    //     },
    //   ],
    //   yAxis: [
    //     {
    //       type: "value",
    //     },
    //   ],
    //   series: [
    //     {
    //       name: "Direct",
    //       type: "bar",
    //       barWidth: "60%",
    //       data: [],
    //       color: "skyblue",
    //     },
    //   ],
    // });

    // 顶部是mounted：为什么第一次没有数据，因为第一次没有数据所以不显示
  },
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      // 收集日历的数据
      date: [],
    };
  },
  computed: {
    // 计算标题属性  当tabs栏v-model的值是sale显示销售额，是另外一个就显示访问量
    title() {
      return this.activeName === "sale" ? "销售额" : "访问量";
    },
    ...mapState("home", ["list"]),
  },
  // 监听属性
  watch: {
    // immediate: true,

    title() {
      // console.log(222);
      //当tab栏切换 重新配置echarts的数据，新的值会替换老的值，而没有新值替换的老的值则会继续使用一个新的柱状图

      this.mycharts.setOption({
        title: {
          text: `${this.title}趋势`,
        },
        xAxis: {
          data:
            this.title === "销售额"
              ? this.list.orderFullYearAxis
              : this.list.userFullYearAxis,
        },
        series: [
          {
            data:
              this.title === "销售额"
                ? this.list.orderFullYear
                : this.list.userFullYear,
          },
        ],
      });
    },
    // 监听通过mock获取到的来自vuex的state的柱状图的数据list
    list() {
      // console.log(111);
      this.mycharts.setOption({
        title: {
          text: "销售额趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.list.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.list.orderFullYear,
            color: "skyblue",
          },
        ],
      });
    },
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");

      this.date = [day, day];
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");

      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 本月  获取到本月是从几几年几月几日到几几年几月几日 现在是九月1日到九月31日
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 200px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  /* 这li的小圆点消失 */
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.jiji {
  margin: 0 20px;
}
.rvalue {
  float: right;
}
</style>
