<template>
  <!-- 这里不能放div，如果放的div那么这个封装的按钮就是一行一行显示的了，我们要并排显示 -->
  <a :title="title" style="margin: 10px">
    <!-- $attrs可以接收父组件传来的没用被props接收的其余props，$listeners能接收父组件传过来的自定义事件 -->
    <!-- v-bind='type:'success'这样的写法和type='success',我的理解是这是两种不同的写法 -->
    <!-- 不是特别理解此处的$listeners为什么进来就可以直接被调用的原理 -->
    <el-button v-bind="$attrs" v-on="$listeners">{{ value }} </el-button>
  </a>
</template>

<script>
// v-bind="$attrs"
export default {
  name: "HintButton",
  props: ["title", "value"],
  mounted() {
    // console.log(this.$listeners);
  },
};
</script>

<style lang="scss" scoped></style>
