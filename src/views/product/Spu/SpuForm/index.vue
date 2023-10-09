<template>
  <div>
    <el-form label-width="80px">
      <!-- label就是form表单item那一排的文字 -->
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片墙组件 action：图片上传的地址  注意这个action一定要用你完成了跨域的那个地址，不用elementUI自带的那个action，这样图片不会消失报错
        list-type：文件列表的类型，是照片还是照片墙；on-remove：当删除图片的时候会触发；file-list：照片墙需要展示的数据（数组），里面必须有name，url属性
      on-preview：图片预览功能  on-remove：删除图片的时候会触发 -->
        <el-upload
          action="/brand-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- select同时收集到选择option的id和name用冒号分隔 -->
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}属性可供选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="(unSelect, index) in unSelectSaleAttr"
            :key="unSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示的是当前spu属于自己的销售属性 -->
        <!-- spu是一个对象，spu的spuSaleAttrList属性是一个数组，这个数组里面的属性是对象  这个对象里面的其中一个属性是spuSaleAttrValueList，是一个数组，
          这个数组的属性是对象，我们需要用到的就是这个对象的属性。
        不用作用域插槽我们根本无法获取到这个对应的对象，其中作用域插槽的row就是spu.spuSaleAttrList的每一个属性，也就是拿到了这个数组里面分别每一个对象
      row.spuSaleAttrValueList就拿到spu.spuSaleAttrList数组每一个对象的spuSaleAttrValueList数组，然后遍历row.spuSaleAttrValueList可以拿到这个数组
    的每一个对象，给这遍历的对象起名item，item.saleAttrValueName属性就是我们要用到的每一个真实数据。里面好多好多层。row实际就是帮你遍历拿到下一层数据，
    而for其实更厉害,可以帮你直接拿到下一层或者下下一层的数据 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <!-- 此处这个el-table-column是列的遍历，是elementUI帮我们封装好了的自动的遍历,假设table的data是a，a的具体结构a[{c},{c}]，那么table-column
            的prop值也就是这一列里面竖着每一行的值就是a数组里面每个对象的c属性，我们直接在prop里面写入c就行，当我们把table的data写入a，elementUI就帮我们
            遍历了a里面的每一个属性我们这需要prop=c 这一列的每一行就是c了。
            由于row会遍历，所有每一列的row都是el-table的data属性的
            下一层具体每一个属性，假设table的数据是a:[{}，{}，{}] 那么row就是a里面的每一个{}
            而内部的template是我们自己写的遍历，是每一列内部行的遍历 -->
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 下面的v-if和v-else可以当作是我们之前写的span和input切换 并且控制用的属性是新创建在row里面的，直接写data里面会出现一切换全部切换的情况 -->
              <!-- 下面的v-model="row.inputValue" row也是没有这个属性的，这属于是自己新建的 -->
              <!-- @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="quXiao">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  mounted() {},
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 存储spu信息属性,初始化是一个空的对象，修改spu的时候，会向服务器发请求，返回spu信息（对象），然后赋值给这里的spu属性
      // 而添加spu的时候没有向服务器发请求，数据也应该收集在spu
      spu: {
        // 三级分类的id
        category3Id: 0,

        // 描述
        description: "",
        // spu的名称
        spuName: "",
        // 品牌的id
        tmId: "",
        // 收集spu图片的信息
        spuImageList: [
          // {
          //   name: "ggb.jpg",
          //   url: "http://139.198.127.41:9000/sph/20230914/ggb.jpg",
          // },
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储spu图片的数据
      spuImageList: [],
      // 销售属性的数据
      saleAttrList: [],
      // 收集未选择销售属性的id
      attrIdAndAttrName: "",
      aaa: [],
    };
  },

  methods: {
    // 照片墙删除某一张图片的时候触发的回调
    handleRemove(file, fileList) {
      // file代表你删除的那张图片
      // fileList代表照片墙删除某一张图片以后，剩余的其他图片
      // 收集照片墙图片的数据，照片墙由elementUI封装的时候要求必须属性名由url，name，而向服务器发请求不需要这两个数据，因为有两个和这个数据相同
      // 但是属性名不同的数据存在，并会携带发给服务器，将来在提交数据的时候需要删除这两个数据，这两个数据是在发请求获取照片墙默认url数据时候加上去的
      // console.log(fileList);
      this.spuImageList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      // 对话框，也就是那个类似放大镜效果的框显示
      this.dialogVisible = true;
    },
    // 初始化spuForm数据
    async initSpuData(spu) {
      // 获取spu信息的数据 9.12日接口获取成功，但是里面的信息全部被删除了，服了
      // console.log(spu);
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code === 200) {
        // 在点击修改spu按钮的时候，需要向服务器发请求，把服务器返回的数据赋值给spu属性
        this.spu = spuResult.data;
        // console.log(spuResult.data);
      }
      // 获取品牌的信息，不需要携带参数
      let tradeResult = await this.$API.spu.reqTradeMarkList();
      if (tradeResult.code === 200) {
        this.tradeMarkList = tradeResult.data;
      }
      // 获取spu图片的数据 ,图片的其他数据都在，但是imgUrl地址是空了
      let spuImageResult = await this.$API.spu.reqSpuImage(spu.id);
      if (spuImageResult.code === 200) {
        // console.log(spuImageResult.data);
        let listArr = spuImageResult.data;
        //  由于照片墙显示图片的数据需要数组，数组里面的元素需要有name和url字段，可以把服务器返回的不同属性名的相应数据进行修改
        listArr.forEach((item) => {
          item.name = item.imageName;
          item.url = item.imageUrl;
        });
        // 把整理好的数据赋值给spuImageList,这里是是在原数据基础上新增了两个照片墙需要的固定属性名的属性
        // this.spuImageList = listArr;
        this.spuImageList = listArr;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(saleResult);
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },

    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集上传图片的信息  fileList:上传成功后照片墙现在存在的所有图片信息
      // console.log(fileList);
      this.spuImageList = fileList;
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 上面data里面已经收集到了需要添加的销售属性的信息，把收集到的销售属性数据进行分割,因为上面使用：分隔收集到的select框选择的属性的id和name
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      // 向spu的属性spuSaleAttrList的属性里面添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 清空数据,select框就不会显示数据
      this.attrIdAndAttrName = "";
    },
    // 添加属性值按钮的回调
    addSaleAttrValue(row) {
      //  点击销售属性值当作添加按钮的时候，需要把button变为input，通过当前销售属性的inputVisble控制
      // 由于是后添加进row对象里面的属性，只有用$set才是响应式的，row.inputVisible控制button与input的切换
      this.$set(row, "inputVisible", true);
      // 通过响应式数据inputValue收集新增的销售属性值 这个属性是row里面新增的
      this.$set(row, "inputValue", "");
    },
    // el-input失去焦点的事件
    handleInputConfirm(row) {
      // 结构出当前需要的数据，在row里面就已经存在了
      const { baseSaleAttrId, inputValue } = row;
      // 新增的销售属性值的名称不能为空
      if (inputValue.trim() === "") {
        this.$message("属性值不能为空");
        return;
      }
      // 属性值不能重复
      let result = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName === inputValue
      );
      if (result) {
        this.$message("属性值不能重复");
        return;
      }
      // 新增的销售属性值对象
      let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      // 修改属性的值未false，就显示botton了
      row.inputVisible = false;
    },
    // 点击修改spu里面取消按钮的回调,要清除掉点击修改获得的所有数据，不然你再点击新增spu的时候这个数据就会显示出来,
    quXiao() {
      this.$emit("changeScene", { scene: 0, flag: "" });
    },
    // 保存按钮的回调  async
    async addOrUpdateSpu() {
      // 整理参数：需要整理照片墙的数据，自己新增的照片墙数据是利用elementUI封装的上传成功回调里面自带的参数赋值给spuImageList的，
      // 这个参数里面只有url，name，需要把这个两个数据修改为服务器想要的名字
      // 携带参数：对于图片，需要携带imageNmae与imageUrl，这两个参数对于发请求得来的照片墙数据是自带了，而新增的照片墙数据就需要修改一下获得
      // this.spuImageList.forEach((item) => {
      //   if (!item.name) {
      //     item.name = "ggb.jpg";
      //     item.url = "http://139.198.127.41:9000/sph/20230914/ggb.jpg";
      //   }
      // });
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          // 这个data貌似是渲染数据的时候还没有获取到(item.response && item.response.data) || item.url
          imageUrl: (item.response && item.response.data) || item.url, //前者是你后面上传图片url，后者是你点击修改按钮服务器发给你的
        };
      });

      // 此处我发现一个问题，我只有在照片墙没有图片的情况下上传图片才能保存成功，照片墙第一张图片确实有问题,可以删除然后再保存
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      // console.log(result);
      if (result.code === 200) {
        // 提示
        this.$message({ type: "success", message: "保存成功" });
        // 通知父组件回到scene=0的页面，这里有一个自定义事件可以用。
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
    },
    // 点击添加spu属性按钮的回调
    async addSpuData(category3Id) {
      // Object.assign:es6中新增的方法,可以合并对象
      // 组件实例this._data可以获得组件实例全部的响应式数据,也就是你输入了值,里面就有你输入的值
      // this.$options可以获取配置对象,配置对象的data函数执行,返回的响应式数据为空
      // 然后让后面这个为空的响应式数据覆盖前面的不就完成了数据清空的操作吗
      Object.assign(this._data, this.$options.data());
      // 收集父组件传过来的三级分类id,修改按钮不需要,因为修改按钮的category3Id是请求服务器传回来的
      this.spu.category3Id = category3Id;
      // 获取品牌的信息，不需要携带参数
      let tradeResult = await this.$API.spu.reqTradeMarkList();
      // console.log(tradeResult);
      if (tradeResult.code === 200) {
        this.tradeMarkList = tradeResult.data;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(saleResult);
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
  },
  computed: {
    // 计算出还未选择的销售属性，当此处未被选择的属性在select里面被选择以后会添加进spu里面，那么option的选项里面这个属性会自动由这里过滤掉
    unSelectSaleAttr() {
      // 这里简单的做法，直接用总共有多少个销售属性的那个对象的length-已经使用的那个销售属性有几个的length
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          // 这里很恶心，后面这个销售属性带空格，要去掉再判断
          return item.name != item1.saleAttrName.trim();
        });
      });
      return result;
    },
  },
};
</script>

<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
