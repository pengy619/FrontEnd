<template>
  <div class="view">
    <el-header>
      <el-steps :active="6" align-center>
        <el-step title="门票基本信息" description=""></el-step>
        <el-step title="销售设置" description=""></el-step>
        <el-step title="预订环节设置" description=""></el-step>
        <el-step title="验证环节设置" description=""></el-step>
        <el-step title="退款设置" description=""></el-step>
        <el-step title="详细资料"></el-step>
        <el-step title="库存价格设置"></el-step>
      </el-steps>
    </el-header>
    <el-form label-width="15%" class="demo-ruleForm"  style='margin-top:40px;' size="small">
        <el-form-item label="使用说明" prop="bookingDesc">
          <editor id="editor_id" height="300px" width="700px" :content="editorText" uploadJson="asp.net/upload_json.ashx"
                  pluginsPath="/static/kindeditor/plugins/"
                  :allowFileManager="false"
                  :loadStyleMode="false"
                  @on-content-change="onContentChange">
          </editor>
        </el-form-item>
      <el-form-item label="产品图片">
        <span>（图片限2MB以下，建议尺寸为885*487，格式为：jpg/png，数量限制 10 张。）</span>
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="内部参考资料">
        <el-input type="textarea" :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="同业分销补充说明">
        <el-input type="textarea" :rows="4"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button type="primary">保存，并设置价格信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .el-textarea{
    width: 55%;
  }
</style>
<script>
  export default {
    data () {
      return {
        editorText: '',
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    methods: {
      onContentChange (data) {
        this.editorText = data.value // data.value;data.id;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      onSubmit(){
        this.$router.push({path:'/Tickets/inventoryPrice'})
      }
    }
  }
</script>
