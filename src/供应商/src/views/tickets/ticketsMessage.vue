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
        <el-form-item label="使用说明">
          <editor id="editor_id1" height="300px" width="700px" :content="UseInfo" uploadJson="/Home/UploadImage"
                  pluginsPath="/static/kindeditor/plugins/"
                  :allowFileManager="false"
                  :loadStyleMode="false"
                  @on-content-change="onContentChange1">
          </editor>
        </el-form-item>
         <el-form-item label="费用说明">
          <editor id="editor_id2" height="300px" width="700px" :content="FeeInfo" uploadJson="/Home/UploadImage"
                  pluginsPath="/static/kindeditor/plugins/"
                  :allowFileManager="false"
                  :loadStyleMode="false"
                  @on-content-change="onContentChange2">
          </editor>
        </el-form-item>
         <el-form-item label="详细描述">
          <editor id="editor_id3" height="300px" width="700px" :content="Describution" uploadJson="/Home/UploadImage"
                  pluginsPath="/static/kindeditor/plugins/"
                  :allowFileManager="false"
                  :loadStyleMode="false"
                  @on-content-change="onContentChange3">
          </editor>
        </el-form-item>
      <el-form-item label="产品图片">
        <span>（图片限2MB以下，建议尺寸为885*487，格式为：jpg/png，数量限制 10 张。）</span>
        <el-upload
          action="/image/upload"
          list-type="picture-card"
          :http-request="imgUpload"
          :limit="10"
          :on-preview="handlePictureCardPreview"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="内部参考资料">
        <el-input type="textarea" :rows="4" v-model="InternalInfo"></el-input>
      </el-form-item>
      <el-form-item label="同业分销补充说明">
        <el-input type="textarea" :rows="4" v-model="B2BInfo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave()" :loading="loading1">保存</el-button>
        <el-button type="primary" @click="onSave('price')" :loading="loading2">保存，并设置价格信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.el-textarea {
  width: 55%;
}
</style>
<script>
export default {
  data() {
    return {
      loading1: false,
      loading2: false,
      UseInfo: "",
      FeeInfo: "",
      Describution: "",
      dialogImageUrl: "",
      ImageList: [],
      dialogVisible: false,
      B2BInfo: "",
      InternalInfo: ""
    };
  },
  methods: {
    onContentChange1({ value, id }) {
      this.UseInfo = value;
    },
    onContentChange2({ value, id }) {
      this.FeeInfo = value;
    },
    onContentChange3({ value, id }) {
      this.Describution = value;
    },
    //上传图片
    imgUpload(val) {
      var f = new FormData();
      f.append("FileData", val.file);
      f.append("Category", "AirTicket");
      f.append("thumbnail", true);
      f.append("Folder", "Airline");
      this.fileUpload.post(val.action, f).then(res => {
        this.ImageList.push({
          name: res.data.formerName,
          url: res.data.url,
          uid: val.file.uid
        });
        if (res.data.state == false) {
          this.$message.error(res.data.message);
        }
      });
    },
    //      限制图片
    beforeAvatarUpload(file) {
      const isImg = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error("上传头像图片只能是 JPG/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    },
    handleRemove(file, fileList) {
      this.ImageList.forEach((item, index) => {
        if (item.uid == file.uid) {
          this.ImageList.splice(index, 1);
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onSave(tag) {
      if (tag) {
        this.loading2 = false;
      } else {
        this.loading1 = false;
      }
      this.ticketHttp
        .post("TicketProduct/SaveProductDetailSettings", {
          ProductId: this.$route.query.productId,
          UseInfo: this.UseInfo,
          FeeInfo: this.FeeInfo,
          Describution: this.Describution,
          Pictures: this.ImageList,
          B2BInfo: this.B2BInfo,
          InternalInfo: this.InternalInfo
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            if (tag) {
              this.loading2 = false;
              this.$router.push({
                path: "/Tickets/inventoryPrice",
                query: { productId: this.$route.query.productId }
              });
            } else {
              this.loading1 = false;
              this.$router.push({ path: "/tickets/singleTicketList" });
            }
          }else{
            this.$message.error(res.data.message);
            if (tag) {
            this.loading2 = false;
          } else {
            this.loading1 = false;
          }
          }
        })
        .catch(e => {
          if (tag) {
            this.loading2 = false;
          } else {
            this.loading1 = false;
          }
          console.log(e);
        });
    }
  }
};
</script>
