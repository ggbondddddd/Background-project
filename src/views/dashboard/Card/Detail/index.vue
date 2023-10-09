<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg
        t="1694849943418"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4001"
        width="16"
        height="16"
      >
        <path
          d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m3.008-92.992a416 416 0 1 0 0-832 416 416 0 0 0 0 832zM448 448h128v384H448V448z m0-256h128v128H448V192z"
          fill="#cdcdcd"
          p-id="4002"
        ></path>
      </svg>
    </div>
    <div class="card-contain">{{ count }}</div>
    <div class="card-charts">
      <!-- 这里先放一个插槽，将来根据父组件给的数据形成结构 -->
      <slot name="charts">插槽charts内容还没传递过来</slot>
    </div>
    <div class="card-footer">
      <slot name="footer">插槽footer内容还传递过来</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "VueAdminTemplateMasterIndex",
  props: ["title", "count"],
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.card-header {
  /* 弹性布局 */
  display: flex;
  /* 两个标签一左一右 */
  justify-content: space-between;
  color: #d9d9d9;
}
.card-contain {
  font-size: 30px;
  padding: 10px 0;
}
.card-charts {
  height: 50px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>
