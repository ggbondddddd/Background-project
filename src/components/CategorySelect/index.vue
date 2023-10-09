<template>
  <div>
    <!-- inline：代表是行内表单，代表一行可以放置多个表单元素 -->
    <!-- 此处：model属性的作用是把表单的数据收集到cForm对象上  :model="cForm"  这里貌似不需要这个属性-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <!-- 这里的v-model就是value 一定要记住  -->
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          :disabled="show"
        >
          <!-- 注意option里面的:value="c1.id"应该可以帮助select找到与这个id对应的option的label进行展示，且选择了某个option，这个option的value会赋给
            select的value，label是option的显示值，label如果没用设置，默认label就等于option设置的value的值，也就是选项值显示的是value值，
            如果设置了label那么选项值优先显示是label，不显示value -->
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          :disabled="show"
          v-model="cForm.category2Id"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          :disabled="show"
          v-model="cForm.category3Id"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  // 通过父组件传过来的控制三级分类select的disabled
  props: ["show"],
  mounted() {
    //   当组件挂在完毕，立即就要向服务器发请求，获取相应一级分类的数据
    this.getCategory1List();
  },
  data() {
    return {
      // 通过接口获取到的一级分类地址存放的地方
      list1: [],
      //  通过接口获得的对应的一级分类的二级分类存放地方
      list2: [],
      //   通过接口获取对应二级分类的三级分类
      list3: [],
      //   收集相应的一级二级三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    // 获取一级分类的方法,不需要携带参数
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code === 200) {
        this.list1 = result.data;
      }
    },
  },

  watch: {
    // 深度检测 因为检测的是对象里面的属性，这里不需要开启，因为这里检测的都是直接的某一个具体属性
    // deep: true,
    //   选择了一级分类的某个option，也就是select标签被选择以后，select双向绑定的cForm.category1Id发生变化请求得到对应的二级分类
    "cForm.category1Id": {
      async handler(newCategory1Id, oldCategory1Id) {
        //  当你从新选择了一个一级分类，应该让二级和三级分类的select框显示的上一次数据消失，不然你选择的一级分类改变了，但是二级三级分类还显示上一次你
        // 选择的数据，是不合理的，所以清空二级三级id即可，这样select框选择的数据会自动消失
        this.list2 = [];
        this.list3 = [];
        this.cForm.category2Id = "";
        this.cForm.category3Id = "";
        // 把一级分类的id传给父组件
        // this.$emit("getCategoryId", newCategory1Id);
        let result = await this.$API.attr.reqCategory2List(newCategory1Id);
        if (result.code === 200) {
          this.list2 = result.data;
        }
      },
    },
    // 二级分类如上类似
    "cForm.category2Id": {
      async handler(newCategory2Id, oldCategory2Id) {
        this.list3 = [];
        this.cForm.category3Id = "";
        // 把二级分类的id传给父组件
        // this.$emit("getCategoryId", newCategory2Id);
        let result = await this.$API.attr.reqCategory3List(newCategory2Id);
        if (result.code === 200) {
          this.list3 = result.data;
        }
      },
    },
    // 三级分类的数据发生变化需要干的操作，暂时先这样写着
    "cForm.category3Id": {
      handler(newCategory3Id, oldCategory3Id) {
        // 把三级分类的三个id全都传给父组件
        this.$emit(
          "getCategoryId",
          this.cForm.category1Id,
          this.cForm.category2Id,
          newCategory3Id
        );
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
