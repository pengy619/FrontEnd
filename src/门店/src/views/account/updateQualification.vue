<template>
  <div class="view">
    <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <h4><span class="vercitals">| </span>资质信息</h4>
      <el-row>
        <el-col :span="12" style="height:270px">
          <el-form-item label=" " prop="businessPicture" label-width="20px">
            <el-upload class="upload-demo"
                       action=""
                       :multiple="true"
                       :show-file-list="false"
                       :auto-upload="false"
                       :on-change="getBaseForBusiness"
                       :before-upload="beforeAvatarUpload">
              <el-button size="small" type="primary">上传营业执照</el-button>
            </el-upload>
            <div style="margin-left:110px">
              <img :src="ruleForm.businessPicture" class="size" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="height:200px">
          <el-form-item label=" " prop="travelQualification" label-width="20px">
            <el-upload class="upload-demo"
                       action=""
                       :multiple="true"
                       :show-file-list="false"
                       :auto-upload="false"
                       :on-change="getBasesForTravel"
                       :before-upload="beforeAvatarUpload">
              <el-button size="small" type="primary">上传旅游险资质</el-button>
            </el-upload>
            <div style="margin-left:110px">
              <img :src="ruleForm.travelQualification" class="size" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" style="height:60px">
          <el-form-item label="有效期至" prop="businessExpireDate">
            <el-date-picker placeholder="选择日期" v-model="ruleForm.businessExpireDate"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" style="height:60px">
          <el-form-item label="有效期至" prop="qualificationExpireDate">
            <el-date-picker placeholder="选择日期" v-model="ruleForm.qualificationExpireDate"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" style="height:100px">
          <el-form-item label="备注" prop="descs">
            <el-input type="textarea"
                      :rows="3"
                      placeholder="请输入备注内容"
                      v-model="ruleForm.descs">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button size="small" type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
        <el-button size="small" type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        submitLoading: false,//提交表单loading
        ruleForm: {
          id: '',
          businessExpireDate: '',
          qualificationExpireDate: '',
          businessPicture: '',
          travelQualification: '',
          descs: ''
        },
        rules: {
          businessPicture: [{ required: true, message: '上传营业执照', trigger: 'blur' }],
          travelQualification: [{ required: true, message: '上传旅游险资质', trigger: 'blur' }],
          businessExpireDate: [{ type: 'date', required: true, message: '请选择有效期', trigger: 'change' }],
          qualificationExpireDate: [{ required: true, type: 'date', message: "请选择有效期", trigger: 'change', }]
        }
      }
    },
    mounted() {
      this.ruleForm.id = this.$route.query.disCompanyInfoId;
      this.getOldRegisterInfo();
    },
    methods: {
      getOldRegisterInfo() {
        this.shopHttp.get("/ShopAccount/GetRegisterInfo?DistributorId=" + this.ruleForm.id)
          .then(res => {
            this.ruleForm.businessExpireDate = new Date(res.data.businessExpireDate);
            this.ruleForm.qualificationExpireDate = new Date(res.data.qualificationExpireDate);
            this.ruleForm.businessPicture = res.data.businessPicture;
            this.ruleForm.travelQualification = res.data.travelQualification;
            this.ruleForm.id = res.data.id;
          });
      },
      beforeAvatarUpload(file) { //图片上传大小限制
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      getBaseForBusiness(file, fileList) {
        let r = new FileReader();  //获取营业执照base64
        r.onload = () => {
          this.ruleForm.businessPicture = r.result;
        }
        r.readAsDataURL(file.raw);
      },
      getBasesForTravel(file, fileList) {
        let r = new FileReader();  //获取旅游险base64
        r.onload = () => {
          this.ruleForm.travelQualification = r.result;
        }
        r.readAsDataURL(file.raw);
      },
      //提交
      onSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            this.shopHttp.post("/ShopAccount/UpdateQualification", this.ruleForm)
              .then((res) => {
                this.submitLoading = false;
                if (res.data.isSuccess == true) {
                  this.$message.success("已提交，请等待审核");
                  this.$router.push({ path: '/login' })
                }
                else { //返回错误消息处理
                  if (res.data.message.indexOf(",") >= 0) {
                    let error = res.data.message.split(",");
                    let firstError = error.length > 0 ? error[0] : "注册失败!";
                    this.$message.error(firstError);
                  }
                  else
                    this.$message.error(res.data.message);
                }
              })
          } else {
            this.$message.error('请仔细检查确保输入的信息正确');
          }
        });

      },
      //取消
      cancel() {

        this.$router.push({ path: '/login' })
      },
    }
  }
</script>
<style scoped>
  .form-inline-input {
    width: 200px;
  }

  .view {
    padding: 10px 10% 0px 20%;
  }

  .size {
    width: 200px;
    height: 200px;
  }
</style>

