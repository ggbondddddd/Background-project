<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 0px 0px 15px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 data:表格组件将来需要展示的数据，数组类型  border是给表格添加边框
             label：显示的标题 width：对应列的宽度  align:标题对齐方式 :data是ui特有的存储你想要展示数据的方式
             注意1:elementUI当中的table组件,展示的数据是以列的形式展示-->
    <el-table style="width: 100%" border :data="list">
      <!-- type='index'也是ui特有的展示序号的 prop:对应列内容的字段名,这个tmName是list数组里面每个对象的这个属性 -->
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <!-- elementUI，这里这个tmName就是上面list里面的属性，list就是接口请求来的品牌名称还要品牌LOGO数据存储的对象  -->
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <!-- 这里运用到了作用域插槽,应该是把el-table当成了父组件,传入数据data,然后elementUI自动遍历了,然后在自己内部的创建的
                tempalte的slot-scope接收传入被处理过的数据,然后模板自动遍历 -->
        <!-- 这里的row，和$index都是自己取的名字 但是不知道为啥不能更改 接收处理过后的值 row是list里面的每一个对象，由于图片这里
        用prop只能传入文本 ，所有此处利用作用域插槽实现图片的显示(我尝试过直接写img，src里面写地址，但是貌似这样不行)-->

        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-deit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器  基础需要的信息  当前在第几页  数据总条数 每一页展示的条数 连续页码数
             current-page:代表当前第几页，total：代表分页器一共展示多少条数据，page-size：代表每一页展示多少条数据
             page-sizes：可以设置每页展示多少条数据，给你选择切换，layout：实现分页器的布局，可以改变上面说的属性的前后位置
            pager-count:代表总共显示按钮的数量 如果为9 连续页码为7
           @current-change="" 是elementUI配置好的方法，点击可以获取当前页的页码-->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="6"
      :total="this.total"
      :page-size="3"
      :page-sizes="[3, 5, 10]"
      :pager-count="9"
      @current-change="handlerCurrentChange"
      @size-change="handlerSizeChange"
      layout="prev,pager,next,jumper,->,sizes,total"
    ></el-pagination>

    <!-- 对话框  :visible.sync控制对话框显示与隐藏 title:你点击的是修改就显示修改品牌，点击的是添加就显示添加品牌 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单  这里的:model代表把表单收集的数据放在那里 在data里面声明即可,将来表单验证也需要用到这个属性-->
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <!-- 这里就是需要真正收集数据的input框的其中一个 -->
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 这里用的elementUI小插件upload 记得要引入样式
              这里收集数据不能用v-model,因为不是表单元素
              :on-success:可以检测到图片上传成功,当图片上传成功,会执行一次
              :before-upload:可以在上传图片之前执行一次
              action:设置图片上传的地址,这里因为存在跨域必须加上brand-api 添加以后图片就能上传成功  -->
          <el-upload
            class="avatar-uploader"
            action="/brand-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 这里就是图片的显示的地方，存在就会显示出来  -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  // 我真的是个傻逼,又被简单的错误搞了半天把data写成了date 浪费了两个小时
  data() {
    // 自定义校验规则，写在data的return之前
    const validateTmName = (rule, value, callback) => {
      //  自己定义的校验规则
      if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 代表分页器第几页
      page: 1,
      // 当前页数展示多少条数据
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      //   对话框显示与隐藏控制属性
      dialogFormVisible: false,
      //   收集品牌信息,对象上面的属性不能瞎写,需要看接口文档,必须键值一致,如果key不对后台就拿不到value
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // elementUI提供的表单验证规则
      rules: {
        // 品牌名称的验证规则
        // required：代表这个字段必须进行校验，需要校验的地方前面会出现个红色小星星  message：输入框下方红色提示信息
        // trigger：什么时候触发，常用的是blur和change
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { validator: validateTmName, trigger: "change" },
        ],
        // 品牌logo的验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      // 解构参数
      const { page, limit } = this;
      // 获取品牌列表的接口 有参数 page,limit
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 点击分页器不同页的时候获取到这个页数，是elementUI给的事件 这个参数名字可以自定义
    handlerCurrentChange(pager) {
      // 修改参数
      this.page = pager;
      this.getPageList();
    },
    // 切换每一页展示多少条数据，也是elementUI给的事件，参数名可以自取
    handlerSizeChange(limit) {
      // 整理参数
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      //   清除一下数据，如果不清除你下次点击添加按钮的时候你上次输入的文本和图片还在那里，因为这个图片和文本时通过data里面的数据传入
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // 显示对话框
      this.dialogFormVisible = true;
      // row就是当前用户选中的这个品牌信息包含id logoUrl tmName 这里就是将已有的品牌信息给tm'Form展示
      //   这里有一个问题 当你让tmForm等于row就相当于让tmForm和你点击的那个表单数据进行了双向绑定，你修改row内容的时候tmForm会跟着直接改变数据
      //哪怕你点击了取消，数据一样改变了 赋值时引用地址的拷贝也就是浅拷贝会出现这种情况 this.tmForm = row;所以不能这样写
      // 解决这个问题的方法，浅拷贝
      this.tmForm = { ...row };
    },
    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      //  res:图片上传成功后返回给前端的数据,里面包含图片现在的地址
      //    file：也是上传成功之后服务器返回给前端的数据，比res更详细，res被包含在了这里面，还有图片名等其他信息
      //   收集品牌图片数据,将来通过接口带给服务器
      // console.log(res.data);
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前的回调 这里从elementUI复制过来后没用任何改动过
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加品牌或修改品牌按钮
    addOrUpdateTradeMark() {
      // 当全部的验证字段通过，才能书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部字段校验都符合条件，也就是校验成功，success返回的值就是true，就派发接口以及其他操作
        if (success) {
          // 弹出框隐藏
          this.dialogFormVisible = false;
          //   发请求 添加品牌或修改品牌
          let result = await this.$API.trademark.reqAddorupdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            // 利用elementUI的弹出信息 提示添加品牌成功，修改品牌成功
            this.$message({
              // 这个type是修改弹出成功的样式 变成绿色的框 也就是修改css
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 添加或者修改品牌成功后再次获取新的品牌列表进行展示
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除按钮 删除品牌的操作 这里的row也是作用域插槽你你点击的该dom节点的数据
    deleteTradeMark(row) {
      // 点击删除按钮出现弹框，确认是否真的删除    这里用的elementUI封装的弹框
      this.$confirm(`你确定删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击确定按钮触发
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          // 如果删除成功
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次从新获得删除了那个品牌之后的品牌数据  后台自带的品牌无法删除 只能删除我们自己添加的
            // 注意的一个细节 如果你当前页的品牌数据被删除完了也就是list.length=0了应该拿到上一页的数据展示，不然你现在这一页就没用数据展示了
            // 我这里就奇怪代码和老师一样就是没反应
            this.list.length > 1
              ? (this.page = this.page)
              : (this.page = this.page - 1);
            this.getPageList();
          }
        })
        .catch(() => {
          // 当用户点击取消按钮的时候触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
