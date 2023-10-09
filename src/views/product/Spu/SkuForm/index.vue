<template>
  <div>
    <el-form>
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(kg)">
        <el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <!-- 这个里面应该放一个行内form,因为里面有多个下拉框 -->
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <!-- 这里select框 -->
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 这里也应该放一个行内form 这里不会显示 -->
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- elementUI里面定义的事件@selection-change="handleSelectionChange"，当选中状态改变会触发 -->
        <el-table
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            width="80px"
            align="center"
            type="selection"
          ></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault === 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  mounted() {},
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集sku数据
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0, //就是每一个row里面的id
        tmId: 0, //品牌id，父组件给的

        // 第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "", //描述字段

        // 第三类收集的数据需要自己书写
        // 默认图片
        skuDefaultImg: "",
        // 收集图片数据
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 品牌属性
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 收集销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 临时收集图片数据，等保存的时候在整理放入skuInfo作为参数发给服务器,目前收集的数据缺少isDefault
      imageList: [],
    };
  },
  methods: {
    // 获取skuForm的数据
    async getData(category1Id, category2Id, row) {
      // 收集skuInfo需要的父组件给予的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
      // 这个row就是你点击的那一个row，里面的id就是我们需要的，这个id并不是category3Id
      // 获取图片的数据
      let result = await this.$API.spu.reqSpuImageList(row.id);
      // console.log(result);
      if (result.code === 200) {
        let list = result.data;
        list.forEach((element) => {
          element.isDefault = 0;
        });
        // 没有深拷贝，这里的数据是相互影响的，但是不妨碍这里是响应式数据，因为用数组的方法添加的数据内置化响应式
        this.spuImageList = list;
      }
      // 获取销售属性的数据   请求回来数据是空
      let result1 = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      // console.log(result2);
      if (result2.code === 200) {
        this.attrInfoList = result2.data;
      }
    },
    // table表格复选框按钮，elementUI封装的选中状态改变触发的事件的回调 自带参数 ，当你取消选中的时候这个参数就是空，选中的时候才带有数据
    handleSelectionChange(params) {
      // 获取到用户选中图片的信息数据，但是需要注意，发给服务器的数据还需要带有是否设为默认isDefault这一个数据，我们可以添加进去
      // console.log(params);
      this.imageList = params;
    },
    // 排他的操作
    changeDefault(row) {
      // 图片列表全部的isDefault都变为0，
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      // 只有点击的变为1
      row.isDefault = 1;
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 点击取消按钮，通知父组件切换场景，scene=0
    cancel() {
      // 自定义事件,让父组件切换为scene=0的场景
      this.$emit("changeScenes", 0);
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮的事件
    async save() {
      // 整理参数
      // 整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      // 方法二 用reduce   更高级
      // 将这个对象一个个一次放入指定的skuInfo的数组里面
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        // 如果某一些平台属性用户选择了将这些数据带给skuInfo
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性 这里用的是foreach，比上面方法低级一些
      spuSaleAttrList.forEach((item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          skuInfo.skuSaleAttrValueList.push({ saleAttrId, saleAttrValueId });
        }
      });
      // 整理图片的数据  这里是将imageList这个数组的元素，选取想要的部分，返回给一个新的数组
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code === 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
