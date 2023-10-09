<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column
        label="序号"
        width="80px"
        type="index"
        prop="prop"
        align="center"
      ></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" prop="prop" width="110">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="80"></el-table-column>
      <el-table-column label="价格" prop="price" width="80"></el-table-column>
      <el-table-column label="操作" prop="prop">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            title="下架"
            v-if="row.isSale === 0"
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            title="上架"
            v-else
            @click="sale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="编辑"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            title="查看详情"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器  -->
    <el-pagination
      style="text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 抽屉效果  :before-close="handleClose" :direction="direction"-->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元 </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <!-- 这里根本就不需要用插槽 -->
          <!-- <template> -->
          <el-tag
            type="success"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
          <!-- </template> -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <!-- 轮播图 -->
          <el-carousel height="150px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  mounted() {
    // 打开sku页面就立马请求服务器数据渲染页面
    this.getSkuList();
  },
  data() {
    return {
      page: 1, //代表当前第几页
      limit: 10, //代表当前页面有几个数据
      records: [], //存储sku列表的数据
      total: 0, //存储分页器一共展示多少条数据
      skuInfo: {}, //存储sku详情信息
      show: false, //控制抽屉显示与隐藏
    };
  },
  methods: {
    //获取sku列表数据的方法
    //分页器 @current-change 点击事件的回调 参数可以获得你当前点击的那一页
    async getSkuList(pages = 1) {
      // 如果没有参数传进来，默认让当前页page=第一页也就是pages
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 分页器当前页显示多少条数据
    handleSizeChange(limit) {
      // 修改参数然后发请求即可
      this.limit = limit;
      this.getSkuList();
    },
    // 点击上架按钮  这里我和老师写的是相反的
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code === 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    // 下架按钮
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code === 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    //点击详情按钮 获取sku详情
    async getSkuInfo(row) {
      // 展示抽屉
      this.show = true;
      // 获取sku的数据
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code === 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}

/* elementUI轮播图的样式 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
/* 这里是深度选择器，哪怕style带有scoped，父组件可以影响轮播图子组件里面的样式 用div包裹就不会飘红报错，因为所有的子组件都被根节点div包裹*/
div >>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>
