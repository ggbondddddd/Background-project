<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene !== 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里将来是有三部分进行切换的，就不能用一个属性和他的!来控制了 -->
      <div v-show="scene === 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column label="Spu名称">
            <template slot-scope="{ row, $index }">
              {{ row.spuName }}
            </template>
          </el-table-column>
          <el-table-column label="Spu描述">
            <template slot-scope="{ row, $index }">
              {{ row.description }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 按钮是封装了的HintButton 这里其实不需要封装 button里面的title属性就可以实现这个功能，我就当练习了 -->
              <!-- 这个地方的命名我差不多搞明白了，就是小驼峰命名法，如果你不像首字母都大写，就可以都小写然后原本字母大写的地方用斜杠-代替 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                value="添加sku"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                value="修改spu"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row, $index)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  value="删除spu"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!--@current-change="handleCurrentChange"是element封装的你点击第几页的时候也就是页数改变的时候会触发的事件
             回调的函数封装了参数，是点击的当前页 但是回调函数这个参数不能在这个事件这里传入。
            @size-change=''  当每一页展示几条数据发生变化触发的事件，回调函数的参数默认带有你改变的每一页应该展示多少条数据 -->
        <el-pagination
          style="text-align: center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          layout="prev,pager,next,jumper,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>

      <!-- SpuForm页面 -->
      <SpuForm
        v-show="scene === 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>

      <!-- SkuForm页面 -->
      <SkuForm
        v-show="scene === 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>

    <!-- 弹出框 -->
    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      @closed="close"
    >
      <el-table :data="skuList" v-loading="loading">
        <!-- table展示sku列表 -->
        <!-- 这里可以看到直接放prop也可实现效果，作用域插槽也可以 -->
        <el-table-column label="名称" prop="skuName">
          <!-- <template slot-scope="{ row, $index }">
            {{ row.skuName }}
          </template> -->
        </el-table-column>
        <el-table-column label="价格">
          <template slot-scope="{ row, $index }">
            {{ row.price }}
          </template>
        </el-table-column>
        <el-table-column label="重量">
          <template slot-scope="{ row, $index }">
            {{ row.weight }}
          </template>
        </el-table-column>
        <el-table-column label="默认图片">
          <!-- 这里不用作用域插槽就搞不定了，因为column里面elementUI没有封装可以放图片的地方 -->
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" style="height: 100px; width: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
import { done } from "nprogress";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      // 三级分类传过来的一二三级id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //   控制三级联动的可操作性
      show: true,
      //   分页器当前处于第几页
      page: 1,
      //   每一页展示多少条数据
      limit: 3,
      //   存储服务器响应回来spu列表的数据
      records: [],
      //   分页器一共展示的数据总条数
      total: 0,
      //   控制spu三个不同内容模块的切换，显示与隐藏的属性
      // 0代表展示spu列表的数据，1代表添加spu|修改spu，2代表添加sku
      scene: 0,
      // elementUI给的控制dialog对话框的显示与隐藏的属性
      dialogTableVisible: false,
      //这里存储你上面点击的hintButton的对应的row
      spu: {},
      // 存储的是sku列表的数据
      skuList: [],
      // 给sku列表展示添加一个loading也就是加载的显示效果，是elementUI封装的
      loading: true,
    };
  },
  mounted() {},
  methods: {
    // 三级联动的自定义事件，可以把三级联动子组件的相应的id传递给父组件
    getCategoryId(category1Id, category2Id, category3Id) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      if (category1Id && category2Id && category3Id) {
        // 发请求获取spu数据进行展示
        this.getSpuList();
      }
    },
    // 获取spu列表数据的方法,并且顺带着作为分页器当前页变化的回调函数
    //  这里的参数是elementUI封装好的可以直接用 任意取名字都行，这个参数就是你点击分页器的当前页，这个pages=1是给当前页一个默认参数,你如果不输入参数
    // 那么pages恒等于1,你只要输入了参数,比如getSpuList(3),那么pages就等于3
    async getSpuList(pages = 1) {
      //当我们没用点击分页器的时候，上面三级分类id传过来会执行这个函数，那么此时pages=1就会传入，当你点击分页器，那么pages就是你当前点击的分页器的页数
      // console.log(pages);
      this.page = pages;
      const { page, limit, category3Id } = this;
      // 需要携带三个参数：page 第几页 limit：每一页需要展示多少条数据 category3Id：第三级分类的id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      // console.log(result);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 当分页器一也展示数据条数发生变化的回调  这个参数也是elementUI封装好的
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit;
      //   再次发请求,并且把三级分类id传过去,保存按钮必须有三级id才行
      this.getSpuList();
    },
    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件SpuForm发请求---两个请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件spuForm子组件,并且把你点击的那一项也就是row传给子组件
      this.$refs.spu.initSpuData(row);
    },
    // spuForm组件里面点击保存或者取消切换场景这个自定义事件的回调
    changeScene({ scene, flag }) {
      // 切换场景
      this.scene = scene;
      // console.log(flag);
      if (flag === "修改") {
        //子组件通知父组件切换场景， 从新获取修改并保存后新的spu列表数据进行展示,如果你切换了分页器的当前页，要把这个当前页传进去，不然就一直默认是第一页
        this.getSpuList(this.page);
      } else {
        // flag等于添加,那么保存默认回到分页器的当前页是第一页
        this.getSpuList();
      }
    },
    // 删除spu按钮的回调,这个回调的触发事件时elementUI封装的点击了那个popconfirm弹出的确认按钮才执行
    async deleteSpu(row, $index) {
      // 传入的id其实就是record数组里面你删除的那个对象的id属性
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code === 200) {
        this.$message({ type: "success", message: "删除成功" });
        // 重新拿到删除过后的数据渲染页面,这里还要进行判断,在重新派发接口之前records的length是还没有改变的
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku按钮的回调
    addSku(row) {
      // 切换场景为scene=2
      this.scene = 2;
      // 让父组件调用子组件的方法,让子组件发请求,需要发三个请求 并且把sku组件发请求需要的id传过去
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // skuFrom点击取消或保存的自定义函数回调，通知父组件修改场景，注意区分不是spuForm
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看sku按钮的自定义事件的回调
    async handler(row) {
      this.dialogTableVisible = true;
      // this.spu = row;
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(row.id);
      if (result.code === 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭dialog对话框的回调，是elementUI封装的关闭对话框事件，这个回调自己写
    close() {
      this.loading = true;
      // 清除sku列表的数据，如果不清除，数据残留，你再次点击获取sku列表数据的时候，当请求回来之前就会展示你上一次获得的数据
      this.skuList = [];
      // done();
    },
  },
};
</script>

<style lang="scss" scoped></style>
