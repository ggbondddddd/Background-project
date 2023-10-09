<template>
  <div>
    <!-- el-card是行内元素和div一样单独占一行，加了el-row就可以变为行内块元素两个card在一行了 -->
    <el-row :gutter="30">
      <el-col :span="12">
        <Search></Search>
      </el-col>
      <el-col :span="12">
        <Category></Category>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from "./Search";
import Category from "./Category";
export default {
  name: "Observe",
  components: {
    Search,
    Category,
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
