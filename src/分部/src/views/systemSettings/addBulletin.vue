<template>
  <div class="view">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      size="small"
    >
      <el-form-item label="展示范围" prop="exhibits">
        <el-checkbox-group v-model="ruleForm.exhibits">
          <el-checkbox v-for="item in exhibitsList" :label="item.key" :key="item.key">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="板块类型" prop="type">
        <el-select v-model="ruleForm.type">
          <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="name">
        <el-input v-model="ruleForm.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="标题内容" prop="editorText">
        <editor
          id="editor_id"
          height="200px"
          width="700px"
          :content="ruleForm.editorText"
          uploadJson="/Home/UploadImage"
          pluginsPath="/static/kindeditor/plugins/"
          :allowFileManager="false"
          :loadStyleMode="false"
          @on-content-change="onContentChange"
        ></editor>
      </el-form-item>
      <el-form-item label="上传附件">
        <el-upload
          class="upload-demo"
          action="/attachment/upload"
          :before-upload="beforeAvatarUpload"
          :http-request="FileUpload"
          multiple
          :file-list="ruleForm.fileList"
          :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">上传jpg/png，word，pdf，excel，txt格式文件，文件大小不能超过10MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">提交发布</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      exhibitsList: [],
      options: [],
      ruleForm: {
        name: "",
        type: "",
        exhibits: [],
        editorText: "",
        fileList: []
      },
      rules: {
        exhibits: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个展示范围",
            trigger: "change"
          }
        ],
        type: [
          { required: true, message: "请输入板块类型", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入标题", trigger: "blur" }],
        editorText: [{ required: true, message: "请输入内容" }]
      }
    };
  },
  mounted() {
    this.getNoticeType();
    this.getNoticeRange();
    if (this.$route.query.noticeId) {
      this.getNoticeDetail();
    }
  },
  methods: {
    //获取公告类型
    getNoticeType() {
      this.groupHttp
        .post("/Notice/GetNoticeType")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.options = res.data.keyValueList;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //获取信息
    getNoticeDetail() {
      this.groupHttp
        .get(
          `/Notice/GetNoticeManagerDetail?noticeId=${
            this.$route.query.noticeId
          }`
        )
        .then(res => {
          this.ruleForm.editorText = res.data.descs;
          this.ruleForm.name = res.data.titles;
          this.ruleForm.type = res.data.kinds.toString();
          this.ruleForm.exhibits = res.data.receiveDes.split(",");
          this.ruleForm.fileList = res.data.files;
        });
    },
    //获取公告范围
    getNoticeRange() {
      this.groupHttp
        .post("Notice/GetNoticeRange")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.exhibitsList = res.data.keyValueList;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    beforeAvatarUpload(file) {
      const isFile =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "text/plain" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/pdf" ||
        file.type === "application/msword";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isFile) {
        this.$message.error("上传文件只能是 JPG/PNG/TEXT/DOC/XLS/PDF 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isFile && isLt10M;
    },
    //文件上传
    FileUpload(val) {
      var f = new FormData();
      f.append("FileData", val.file);
      f.append("Category", "AirTicket");
      f.append("thumbnail", true);
      f.append("Folder", "Airline");
      this.fileUpload
        .post(val.action, f)
        .then(res => {
          if (res.data.Status == true) {
            this.ruleForm.fileList.push({
              name: res.data.FileName,
              urls: res.data.Url
            });
            this.$message({
              message: res.data.Message,
              type: "success"
            });
          } else {
            this.$message.error(res.data.Message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    onContentChange(data) {
      this.ruleForm.editorText = data.value; // data.value;data.id;
    },
    //删除附件
    handleRemove(file, fileList) {
      this.ruleForm.fileList.forEach((item, index) => {
        if (item.uid == file.uid) {
          this.ruleForm.fileList.splice(index, 1);
        }
      });
    },
    //保存公告
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.groupHttp
            .post("/Notice/SaveNotice", {
              titles: this.ruleForm.name,
              Descs: this.ruleForm.editorText,
              Kinds: this.ruleForm.type,
              Files: this.ruleForm.fileList,
              ReciveTypeList: this.ruleForm.exhibits,
              Id: this.$route.query.noticeId || ""
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "提交成功"
                });
                this.$router.push({ path: "/systemSettings/bulletinList" });
              } else {
                this.loading = false;
                this.$message.error(res.data.message);
              }
            })
            .catch(e => {
              console.log(e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //返回
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style>
</style>
