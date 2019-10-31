<template>
  <div class="view">
    <el-form
      :model="form"
      size="small"
      label-width="100px"
      :rules="rules"
      ref="form"
      v-loading="loading"
    >
      <el-form-item label="分类" prop="typeId">
        <el-select v-model="form.typeId" placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="form.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="确认规则" prop="confirmType">
        <el-radio-group v-model="form.confirmType">
          <el-radio v-for="item in keyValueList" :label="item.key" :key="item.key">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品推荐" prop="desc">
        <el-input type="textarea" v-model="form.desc" style="width:500px" :rows="3"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="同行价" prop="tradePrice">
            <el-input v-model="form.tradePrice"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="媒体价" prop="mediaPrice">
            <el-input v-model="form.mediaPrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上传图片" prop="ImageList">
        <span>（图片格式为jpg/png/bmp，最大为2M，至少上传1张，最多为10张。）</span>
        <div class="upload-list">
          <div class="thumb-img" v-for="item in form.ImageList" :key="item.image">
            <div class="img">
              <img :src="item.image.includes('http')?item.image:imgBaseUrl+item.image" alt>
            </div>
            <div>
              <div>
                <el-checkbox v-model="item.isMain">主图</el-checkbox>
                <el-button type="text" @click="handleRemove(item.uid)" class="lmargin_10">删除</el-button>
                <el-button type="text" @click="handlePictureCardPreview(item.image)">放大</el-button>
              </div>
            </div>
          </div>
          <el-upload
            action="/image/upload"
            list-type="picture-card"
            :http-request="imgUpload"
            :show-file-list="false"
            :file-list="form.ImageList"
            :limit="10"
            :multiple="true"
            accept="image/jpeg, image/png, image/bmp"
            :before-upload="beforeAvatarUpload"
            class="upload-btn"
            v-show="form.ImageList.length < 10"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="产品介绍" prop="editorText">
        <editor
          id="editor_id"
          height="300px"
          width="700px"
          :content="form.editorText"
          uploadJson="/Home/UploadImage"
          pluginsPath="/static/kindeditor/plugins/"
          :allowFileManager="false"
          :loadStyleMode="false"
          @on-content-change="onContentChange"
        ></editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitProduct('form')" :loading="s_loading">提交</el-button>
        <el-button type="primary" @click="upDataProduct('form')" :loading="u_loading">保存草稿</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let moneyvalidator = (rule, value, callback) => {
      let reg = /^\d+(?:\.\d{1,2})?$/;
      if (!value) {
        callback(new Error("金额不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("金额必须为正数，且仅保留两位小数"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      s_loading: false,
      u_loading: false,
      dialogImageUrl: "",
      dialogVisible: false,
      options: [],
      keyValueList: [],
      form: {
        typeId: "",
        typeName: "",
        name: "",
        desc: "",
        mediaPrice: "",
        tradePrice: "",
        confirmType: "",
        editorText: "",
        ImageList: []
      },
      rules: {
        name: [{ max: 50, message: '名称长度不能大于50个字符', trigger: 'blur' },{ required: true, message: "请输入产品名称", trigger: "blur" }],
        typeId: [{ required: true, message: "请选择类型", trigger: "change" }],
        confirmType: [
          { required: true, message: "请确认规则", trigger: "change" }
        ],
        mediaPrice: [
          { required: true, validator: moneyvalidator, trigger: "blur" }
        ],
        tradePrice: [
          { required: true, validator: moneyvalidator, trigger: "blur" }
        ],
        editorText: [
          { required: true, message: "请输入产品介绍", trigger: "blur" }
        ],
        desc: [{ required: true, message: "请输入产品推荐", trigger: "blur" }],
        ImageList: [
          {
            required: true,
            type: "array",
            message: "请上传图片",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    form: {
      handler: function(val) {
        let arr = [];
        val.ImageList.forEach((item, index) => {
          if (item.isMain == true) {
            arr.push(item);
            if (arr.length > 1) {
              this.$message({
                type: "warning",
                message: "您已选择主图"
              });
              val.ImageList[index].isMain = false;
            }
          }
        });
      },
      deep: true
    }
  },
  mounted() {
    this.getSingleType();
    this.getConfirmType();
    if (this.$route.query.productId) {
      this.getProduct();
    }
  },
  methods: {
    //获取产品信息
    getProduct() {
      this.loading = true;
      this.groupHttp
        .post("SingleProduct/GetProduct", { id: this.$route.query.productId })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.loading = false;
            this.form.typeId = res.data.productTypeId;
            this.form.name = res.data.productName;
            this.form.confirmType = res.data.confirmType.toString();
            this.form.desc = res.data.recommendDesc;
            this.form.tradePrice = res.data.unitPrice;
            this.form.mediaPrice = res.data.mediaUnitPrice;
            this.form.ImageList = res.data.productImageList;
            this.form.editorText = res.data.introduce;
          }else{
            this.loading = false;
            this.$message.error(res.data.message)
          }
        }).catch(e=>{
          console.log(e)
        });
    },
    //提交
    submitProduct(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          var mainImg = false;
          this.form.ImageList.forEach((item, index) => {
            if (item.isMain == true) {
              mainImg = true;
              return false;
            }
          });
          if (mainImg == false) {
            this.form.ImageList[0].isMain = true;
          }
          this.s_loading = true;
          this.groupHttp
            .post("SingleProduct/SubmitProduct", {
              id: this.$route.query.productId || "",
              ProductTypeId: this.form.typeId,
              ProductName: this.form.name,
              ConfirmType: this.form.confirmType,
              RecommendDesc: this.form.desc,
              UnitPrice: this.form.tradePrice,
              MediaUnitPrice: this.form.mediaPrice,
              ProductImageList: this.form.ImageList,
              Introduce: this.form.editorText
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.s_loading = false;
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.$router.go(-1);
              } else {
                this.s_loading = false;
                this.$message.error(res.data.message);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //保存草稿
    upDataProduct(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          var mainImg = false;
          this.form.ImageList.forEach((item, index) => {
            if (item.isMain == true) {
              mainImg = true;
              return false;
            }
          });
          if (mainImg == false) {
            this.form.ImageList[0].isMain = true;
          }
          this.u_loading = true;
          this.groupHttp
            .post("SingleProduct/UpdateProduct", {
              id: this.$route.query.productId || "",
              ProductTypeId: this.form.typeId,
              ProductName: this.form.name,
              ConfirmType: this.form.confirmType,
              RecommendDesc: this.form.desc,
              UnitPrice: this.form.tradePrice,
              MediaUnitPrice: this.form.mediaPrice,
              ProductImageList: this.form.ImageList,
              Introduce: this.form.editorText
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.u_loading = false;
                this.$message({
                  type: "success",
                  message: "保存草稿成功"
                });
                this.$router.go(-1);
              } else {
                this.u_loading = false;
                this.$message.error(res.data.message);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onContentChange(data) {
      this.form.editorText = data.value; // data.value;data.id;
    },
    // currentSel(val) {
    //   this.options.forEach(item => {
    //     if (item.id == val) {
    //       this.form.typeName = item.name;
    //     }
    //   });
    // },
    //获取分类信息
    getSingleType() {
      this.groupHttp.post("SingleProduct/GetAllProductTypeList").then(res => {
        if (res.data.isSuccess == true) {
          this.options = res.data.list;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //确认规则
    getConfirmType() {
      this.groupHttp
        .post("SingleProduct/GetProductConfirmType")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.keyValueList = res.data.keyValueList;
          }
        })
        .catch(e => {
          console.log(res);
        });
    },
    //上传图片
    imgUpload(val) {
      var f = new FormData();
      f.append("FileData", val.file);
      f.append("Category", "AirTicket");
      f.append("thumbnail", true);
      f.append("Folder", "Airline");
      this.fileUpload.post(val.action, f).then(res => {
        this.form.ImageList.push({
          image: res.data.url,
          uid: val.file.uid,
          isMain: false
        });
        if (res.data.state == false) {
          this.$message.error(res.data.message);
        }
      });
    },
    //图片限制
    beforeAvatarUpload(file) {
      const isImg =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error("上传头像图片只能是 JPG/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    },
    //图片删除
    handleRemove(uid) {
      this.form.ImageList.forEach((item, index) => {
        if (item.uid == uid) {
          this.form.ImageList.splice(index, 1);
        }
      });
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style>
</style>
