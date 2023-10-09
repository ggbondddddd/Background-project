<template>
  <div>
    <!-- 貌似你给这个el-card了样式 自动其他的el-card也会用 不需要额外再去引入 -->
    <el-card style="margin: 20px 0px">
      <!-- 三级联动全局组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable">
      </CategorySelect>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格:展示平台属性 -->
        <el-table :data="attrList" border width="100%">
          <!-- type:index展示序号,从1开始 -->
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="180"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <!-- 这里又是自定义插槽 这个row数据就是将attrList遍历出来的每一个对象,可能这里插槽就是为了 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 0px 10px"
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <!-- 这里的修改和删除按钮不用作用域插槽也可显示出来,用的好处在于row可以拿到你点击删除修改对应的这组数据    -->
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                >修改</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 这里是点击修改属性和添加属性显示的新页面,上面隐藏就展示下面添加属性|修改属性的结构,相当于是切换 -->
      <div v-show="!isShowTable">
        <!-- 这是一个行内表单 -->
        <el-form
          :inline="true"
          ref="form"
          label-width="80px "
          v-model="attrInfo"
        >
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button>取消</el-button>
        <!-- el-table-column要显示需要el-table的data里面有数据才行 -->
        <el-table
          border
          style="width: 100%; margin: 20px 0px"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构要用到span和input来回切换 -->
              <el-input
                size="mini"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                :ref="$index"
                v-if="row.flag"
                @blur="toLook($event, row)"
                @keyup.native.enter="toLook($event, row)"
              >
              </el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <!-- popconfirm：气泡确认框，在button里面的slot：reference就是拿到title里面的属性，点击的hi和显示出来 -->
            <template slot-scope="{ row, $index }">
              <!-- 此处这个onConfirm事件是elementUI给这个气泡确定框封装的事件，点击确认按钮的时候触发,这个项目模板是老版本，新版本事件名是confirm -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1 || !right"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  mounted() {},
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //   接收发送请求回来的平台属性数据
      attrList: [],
      // 这个属性控制table表格的显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值,因为属性值可以有多个因此用数组
          // {
          // attrId: 0, //相应属性名的id
          // valueName: "",
          // },
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //服务器需要用这个level区分是几级分类id,这里我们没用用老师的方法写所以没用level,自己创建一个即可
      },
      // 如果blur失去焦点的时候，添加的属性值是不符合规则的就让保存按钮不能点击
      right: true,
    };
  },
  methods: {
    // 自定义事件的回调，拿到三级联动组件传过来的三个id
    getCategoryId(category1Id, category2Id, category3Id) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      // 当三个id都得到了发请求
      if (category1Id && category2Id && category3Id) {
        // 发请求获取品牌属性
        this.getAttrList();
      }
    },
    // 获取平台属性的数据 当用户确定三级分类的数据的时候,可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      // 获取分类的id
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值的点击事件回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        // attrId是你相应属性的id,是服务器给的,现在没用相应的属性的id,所以目前带给服务i去的id为undefined
        // valueName:相应属性值的名称
        attrId: this.attrInfo.id, //当修改某一个属性的时候,可以在已有的属性值基础之上新增新的属性
        valueName: "",
        // 这里是控制每一个属性值的input和span的切换
        flag: true,
      });
      // 点击添加属性，在数组末尾添加一个元素，并且自动获取焦点，$index其实就是数组长度-1 因为$index是从0开始，这里无法获取$index所以可以这样
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table的显示与隐藏
      this.isShowTable = false;
      // 收集三级分类id,当你上面三级分类都选择了,category3Id就有了,现在把这个id拿到放进attrInfo,因为下一步就是在添加或者修改属性里面发请求,需要用到这个数据
      // 清除数据,如果不清除数据,当你在添加属性里面点击取消返回到了三级列表展示页面,然后再点击添加属性值回去,原本你没用添加的哪些属性就都还存在,所以清除
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改某一个属性
    updateAttr(row) {
      // 显示修改添加属性页面
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo
      // this.attrInfo = row;
      // 上面这个代码属于把复杂数据类型row直接赋给attrInfo，会出现改变attrInfo的属性值，row也会改变的情况，这个时候我们就可以使用深拷贝，什么意思呢
      // 就是把attrInfo对象里面的具体的值赋给row的对应的属性，而不是简单的把里面的对象或者数组赋给row的属性，这样赋得其实是地址，而不是真正的属性值
      // 如果只是把简单数据类型对象赋给一个变量，利用浅拷贝...或者object.assign或者遍历这个对象，把这个对象的属性遍历依次赋给变量对应的这个属性
      // 这三种方法就可以解决这个问题，这里复杂数据类型我们就可以把复杂数据类型第一层的数据拿出来然后依次赋给attrInfo的具体属性值，对应这种第一层数据是
      // 数组的情况,我们可以采用遍历的方法把依次第二层数组的具体属性值赋给attrInfo.attrValueList,如果还有第三层一样的方法即可
      // 也可引入插件 import cloneDeep from 'lodash/cloneDeep'  然后this.attrInfo=cloneDeep(row)即可
      this.attrInfo.attrName = row.attrName;
      this.attrInfo.categoryId = row.categoryId;
      this.attrInfo.id = row.id;
      row.attrValueList.forEach((item) => {
        this.attrInfo.attrValueList.push({
          attrId: item.attrId,
          valueName: item.valueName,
          id: item.id,
          // 修改属性也要加上flag控制是编辑模式还是查看模式,
          flag: false,
        });
      });
    },
    // 失去焦点的事件,切换为查看模式,展示span
    toLook($event, row) {
      // 这里不需要用event获取到input的属性值,row里面的valueNameinput框里面的值,不能为空
      // row是你当前输入的这一个input框的数据,而this.attrInfo.attrValueList数组是之前input框的数据
      // console.log(row);
      if ($event.target.value.trim() === "") {
        this.$message("输入属性值不能为空");
        this.right = false;
        return;
      }
      // 新增的属性值不能和已有的属性值重复,让排除掉了row的attrInfo.attrValueList遍历，如果有和row的valueName值相同的attrInfo.attrValueList的item
      // 只要有一个存在就会数组防范some就会返回true，isRepat就会接收到
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        // 首先要将row从数组的判断里去除,row是一整个对象,里面有一个属性这里需要的
        if (row !== item) {
          // this.right = false;
          return row.valueName === item.valueName;
        }
      });
      // 如果出现重复,就不执行下面的代码
      if (isRepat) {
        this.right = false;
        this.$message("请不要输入上面已有的属性值");
        return;
      }

      // 如果属性值符合规则
      this.right = true;
      row.flag = false;
    },
    // 点击span回调变为编辑模式,并且自动获取焦点
    toEdit(row, $index) {
      row.flag = true;
      // 需要注意点击span的时候,切换input为编辑模式,对于浏览器而言,页面重新渲染是需要时间的,你点击span,切换到input
      // 从新开始渲染时需要时间的，因此我们不可能一点击span立马获取到input
      // 所以这里可以用到$nextTick,当节点渲染完毕会执行一次
      this.$nextTick(() => {
        // 自动聚焦
        // console.log($index);
        // console.log(this.$refs[$index]);
        this.$refs[$index].focus();
      });
    },

    // 点击气泡确认框确认按钮的回调
    // 最新版本中气泡确认按钮事件名是confirm 我们这个项目用的是老版本2.13.x的elementUI，这个事件名是onConfirm
    deleteAttrValue($index) {
      // 删除对应索引值的这个数组属性，这个操作是不需要发请求的，保存的时候再发请求
      this.attrInfo.attrValueList.splice($index, 1);
      this.right = true;
    },
    // 保存按钮，进行添加属性或者修改属性的操作，要发请求
    async addOrUpdateAttr() {
      // 整理参数 如果用户添加属性值为空，不应该提交给服务器
      // 提交给服务器的数据中不应该出现flag属性，应该去除掉
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值不是空的
          if (item.valueName !== "") {
            // 删除掉flag属性  delete运算符可以删除数组或者对象里面的属性，删除成功返回true 失败返回false  打印出来你delete某个元素，成功了打印的就是true
            delete item.flag;
            return true;
            // return delete item.flag;
          }
        }
      );
      this.isShowTable = true;
      // 发请求  这个请求成功没用数据，只是告诉你修改或者增加数据成功，然后从新渲染页面即可
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" });
        // 保存成功清空一下数据
        this.attrInfo.attrValueList = [];
        // 保存成功后从新获取平台数据渲染页面
        this.getAttrList();
      } catch (error) {
        this.message("保存失败");
      }
    },
    // 点击取消按钮，必须有这个回调，因为点击取消取消将修改里面传入的数据清空
    cancel() {
      this.attrInfo.attrValueList = [];
      this.isShowTable = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
