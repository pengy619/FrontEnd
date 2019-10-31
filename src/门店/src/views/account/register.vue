<template>  
  <div class="view">     
    <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <h4><span class="vercitals">| </span>登录账号</h4>
      <el-form-item label="登录账号" prop="Account">
        <el-input v-model="ruleForm.Account" class="form-inline-input"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="Password">
        <el-input type="password" v-model="ruleForm.Password" class="form-inline-input"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="ConfirmPassword">
        <el-input type="password" v-model="ruleForm.ConfirmPassword" class="form-inline-input"></el-input>
      </el-form-item>
      <h4><span class="vercitals">| </span>门店信息</h4>
      <el-row>
        <el-col :span="14" >
          <el-form-item label="所属分部" prop="BoCompanyInfoId">
            <el-select v-model="ruleForm.BoCompanyInfoId" placeholder="请选择" @change="boChange">
              <el-option v-for="item in BoCompanyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="门店分类" prop="EnumCompanyType">
            <el-select v-model="ruleForm.EnumCompanyType" placeholder="请选择">
              <el-option label="直营门店" value="1"></el-option>
              <el-option label="加盟门店" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14" >
          <el-form-item label="门店名称" prop="Name">
            <el-input v-model="ruleForm.Name" class="form-inline-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="负责人" prop="Contanct">
            <el-input v-model="ruleForm.Contanct" class="form-inline-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14" >
          <el-form-item label="联系电话" prop="MobilePhone">
            <el-input v-model="ruleForm.MobilePhone" class="form-inline-input"></el-input>
            <el-button type="primary" class="margin" v-show="timerSecond<=0" :loading="codeLoading" @click="getCode">获取验证码</el-button>
            <el-button size="small" type="info" v-show="timerSecond>0" class="count">重新发送（{{timerSecond}}） </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="验证码" prop="Code">
            <el-input v-model="ruleForm.Code" class="form-inline-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row> 
        <el-col :span="14" >
          <el-form-item label="传真" prop="Fax">
            <el-input v-model="ruleForm.Fax" class="form-inline-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="信用等级" prop="CreditId">
            <el-select v-model="ruleForm.CreditId" class="form-inline-input">
              <el-option v-for="item in LevelList" :key="item.id" :label="item.level" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex">
        <el-col style="width:240px;">
          <el-form-item label="通信地址" prop="ProvinceID">
            <el-select v-model="ruleForm.ProvinceID" placeholder="  请选择省" @change="provinceChange">
              <el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id" id="c"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width:240px;height:50px">
          <el-form-item label="" prop="CityID">
            <el-select v-model="ruleForm.CityID" placeholder=" 请选择市" @change="cityChange">
              <el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id" id="b"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width:240px;height:50px">
          <el-form-item label="" prop="DistrictID">
            <el-select v-model="ruleForm.DistrictID" placeholder=" 请选择区（县）">
              <el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id" id="a"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="详细地址" prop="Address">
            <el-input v-model="ruleForm.Address" placeholder=" 请填写详细地址" class="form-inline-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <h4><span class="vercitals">| </span>资质信息</h4>
      <el-row :gutter="20" style="text-align:center">
        <el-col :span="6">
          <el-upload class="avatar-uploader"
                     action="/image/upload"
                     :show-file-list="false"
                     data="BusinessPicture"
                     :on-success="handleAvatarSuccess"
                     :on-remove="handleRemove"
                     :before-upload="beforeAvatarUpload"
                     accept="image/jpeg,image/png,image/bmp"
                     :http-request="imgUpload">
            <img v-if="ruleForm.BusinessPicture" :src="ruleForm.BusinessPicture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <el-upload class="avatar-uploader"
                     action="/image/upload"
                     :show-file-list="false"
                     data="LicensingPicture"
                     :on-success="handleAvatarSuccess"
                     :on-remove="handleRemove"
                     :before-upload="beforeAvatarUpload"
                     accept="image/jpeg,image/png,image/bmp"
                     :http-request="imgUpload">
            <img v-if="ruleForm.LicensingPicture" :src="ruleForm.LicensingPicture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <el-upload class="avatar-uploader"
                     action="/image/upload"
                     :show-file-list="false"
                     data="IdCardFront"
                     :on-success="handleAvatarSuccess"
                     :on-remove="handleRemove"
                     :before-upload="beforeAvatarUpload"
                     accept="image/jpeg,image/png,image/bmp"
                     :http-request="imgUpload">
            <img v-if="ruleForm.IdCardFront" :src="ruleForm.IdCardFront" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <el-upload class="avatar-uploader"
                     action="/image/upload"
                     :show-file-list="false"
                     data="IdCardBack"
                     :on-success="handleAvatarSuccess"
                     :on-remove="handleRemove"
                     :before-upload="beforeAvatarUpload"
                     accept="image/jpeg,image/png,image/bmp"
                     :http-request="imgUpload">
            <img v-if="ruleForm.IdCardBack" :src="ruleForm.IdCardBack" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-row :gutter="20" style="text-align:center;margin-bottom:50px;">
          <el-col :span="6">公司营业执照</el-col>
          <el-col :span="6">备案登记证</el-col>
          <el-col :span="6">身份证正面照</el-col>
          <el-col :span="6">身份证反面照</el-col>
        </el-row>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="旅游资质有效期至" prop="TravelQualifications" label-width="150px">
            <el-date-picker placeholder="选择日期" v-model="ruleForm.TravelQualifications"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同有效期至" prop="ContractExpiryDate" label-width="150px">
            <el-date-picker placeholder="选择日期" v-model="ruleForm.ContractExpiryDate"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注" prop="Descs" label-width="150px">
            <el-input type="textarea"
                      :rows="3"
                      placeholder="请输入备注内容"
                      v-model="ruleForm.Descs">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="text-center margin_top">
        <el-button size="small" type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
        <el-button size="small" type="info" @click="cancel">取消</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import * as http from "@/utils/http.js"
  export default {
    data() {
      let AccountCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入登录账号'))
        } else if (!(/^[a-zA-Z0-9]{6,16}$/.test(value))) {
          callback(new Error('英文字母或数字组合，不区分大小写，长度：6-16个字符'))
        } else {
          callback();
        }
      }
      let PasswordCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入登录密码'))
        } else if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value))) {
          callback(new Error('6-16位，不能包含空格；且必需包含字母以及数字至少各有一位'))
        } else {
          callback();
        }
      }
      let ConfirmPassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.Password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      let PhoneFormatter = (rule, value, callback) => {
        if (!value)
          callback(new Error('请输入手机号'));
        else if (!(/^1[2-9]\d{9}$/.test(value)))
          callback(new Error('手机号码格式错误!'));
        else
          callback();
      }
      return {
        codeLoading: false, //发送验证码loading
        submitLoading: false,//提交表单loading
        uploadFileUrl: http.fileUploadUrl,  //图片上传url  
        ruleForm: {
          Account: '',
          Password: '',
          ConfirmPassword: '',
          BoCompanyInfoId: '',
          EnumCompanyType: '',
          Name: '',
          Contanct: '',
          MobilePhone: '',
          Code: '',
          Fax: '',
          CreditId: '',
          ContryID: 1,
          ProvinceID: '',
          ProvinceName: '',
          CityID: '',
          CityName: '',
          DistrictID: '',
          DistrictName: '',
          Address: '',
          TravelQualifications: '',
          ContractExpiryDate: '',
          Descs: '',
          LicensingPicture: '',
          BusinessPicture: '',
          IdCardFront: '',
          IdCardBack: ''
        },
        rules: {
          Account: [{ required: true, validator: AccountCheck, trigger: 'blur' }],
          Password: [{ required: true, validator: PasswordCheck, trigger: 'blur' }],
          ConfirmPassword: [{ required: true, validator: ConfirmPassword, trigger: 'blur' }],
          BoCompanyInfoId: [{ type: 'number', required: true, message: '请选择所属分部', trigger: 'change' }],
          EnumCompanyType: [{ required: true, message: '请选择门店分类', trigger: 'change' }],
          Name: [{ required: true, message: '请填写门店名称', trigger: 'blur' }],
          Contanct: [{ required: true, message: '请填写负责人', trigger: 'blur' }],
          MobilePhone: [{ required: true, validator: PhoneFormatter, trigger: 'blur' }],
          Code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
          CreditId: [{ type: 'number', required: true, message: '请选择信用等级', trigger: 'change' }],
          ProvinceID: [{ type: 'number', required: true, message: '请选择省', trigger: 'change' }],
          CityID: [{ type: 'number', required: true, message: '请选择市', trigger: 'change' }],
          DistrictID: [{ type: 'number', required: true, message: '请选择区（县）', trigger: 'change' }],
          Address: [{ required: true, message: "请填写详细地址", trigger: 'blur' }],
          TravelQualifications: [{ required: true, type: 'date', message: "请选择旅游资质有效期", trigger: 'change' }],
          ContractExpiryDate: [{ required: true, type: 'date', message: "请选择合同有效期", trigger: 'change' }]
        },
        LevelList: [],
        ProvinceList: [],
        CityList: [],
        DistrictList: [],
        BoCompanyList: [],
        timer: null,
        timerSecond: 0
      }
    },
    mounted() {
      this.getCountryID();
      this.getBoCompanyList();
    },
    methods: {
      getBoCompanyList() { //获取分部集合
        this.shopHttp.get("/ShopAccount/BoCompanyList")
          .then(res => {
            this.BoCompanyList = res.data;
          })
      },
      getCode() { //获取验证码
        var storageSeconds = localStorage.getItem('registerSeconds'); //先取存储里上次发送过没
        var surplusSeconds = (new Date()).getTime() - storageSeconds;//有的话取间隔秒数
        if (surplusSeconds < 120000) {
          this.timerSecond = 120 - Math.round(surplusSeconds / 1000);
          this.timer = setInterval(() => {
            if (this.timerSecond > 0) {
              this.timerSecond--;
              if (this.timerSecond <= 0) {
                clearInterval(this.timer);
                this.timer = null;
              }
            }
          }, 1000)
          return false;
        }
        this.$refs.ruleForm.validateField('MobilePhone', (errorMsg) => {
          if (errorMsg == '') {
            this.codeLoading = true;
            this.shopHttp.post("/ShopAccount/GetVerifyCode", { 'PhoneNumber': this.ruleForm.MobilePhone })
              .then((res) => {
                this.codeLoading = false;
                if (res.data.isSuccess == true) {  //发送成功，执行倒数计时器
                  if (!this.timer) {
                    localStorage.setItem('registerSeconds', (new Date()).getTime())
                    this.timerSecond = 120;//倒计时120秒
                    this.timer = setInterval(() => {
                      if (this.timerSecond > 0) {
                        this.timerSecond--;
                        if (this.timerSecond <= 0) {
                          clearInterval(this.timer);
                          this.timer = null;
                        }
                      }
                    }, 1000)
                  }
                }
                else
                  this.$message.error(res.data.message)
              })
          }
          else {
            this.$message.error(errorMsg);
          }
        });
      },
      //获取省
      getCountryID() {
        this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1')
          .then((res) => {
            this.ProvinceList = res.data;
          })
      },
      //获取市
      provinceChange(val) {
        this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val)
          .then((res) => {
            this.CityList = res.data;
            this.ruleForm.CityID = '';
            this.ruleForm.DistrictID = '';
          })
      },
      //获取县（区）
      cityChange(val) {
        this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val)
          .then((res) => {
            this.DistrictList = res.data;
            this.ruleForm.DistrictID = '';
          })
      },
      boChange(val) { //分部改变获取相应的信用等级
        this.shopHttp.get("/ShopAccount/CreditTypeList?BoCompanyId=" + this.ruleForm.BoCompanyInfoId)
          .then((res) => {
            this.LevelList = res.data;
            this.ruleForm.CreditId = '';
          });
      },
      //提交
      onSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            //获取省市区name
            var currentP=this.ProvinceList.find(item=>{
              return item.id==this.ruleForm.ProvinceID
            })
            this.ruleForm.ProvinceName=currentP.name

            var currentC=this.CityList.find(item=>{
              return item.id==this.ruleForm.CityID
            })
            this.ruleForm.CityName=currentC.name

            var currentD=this.DistrictList.find(item=>{
              return item.id==this.ruleForm.DistrictID
            })
            this.ruleForm.DistrictName=currentD.name

            this.shopHttp.post("/ShopAccount/Register", this.ruleForm)
              .then((res) => {
                this.submitLoading = false;
                if (res.data.isSuccess == true) {
                  this.$message.success("注册成功");
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
          }
        });

      },
      //图片操作
      handleAvatarSuccess(res, file) { //上传成功显示图片
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) { //上传文件判断    
        const isLt2M = file.size / 1024 / 1024 < 2;      
        if (!isLt2M)
          this.$message.error('上传头像图片大小不能超过 2MB!');
        return  isLt2M;
      },
      handleRemove(file, fileList) { //移除图片
        console.log(file, fileList);
      },
      imgUpload(val) {      
        var f = new FormData();
        f.append('FileData', val.file);
        f.append('Category', 'Shop');      
        f.append('Folder', 'CreateShop');
        f.append('Thumbnail', false);
        this.fileUpload.post(val.action, f)
          .then((res) => {
            this.ruleForm[val.data] = res.data.url;
            if (res.data.state == false) {
              this.$message.error(res.data.message);
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
<style lang="scss" scoped>
  @import "../../style/common.scss";
  .form-inline-input,.el-input,.el-select {
    width: 200px!important;
  }
  .avatar-uploader-icon{
    line-height: 178px!important;
  }
  .view {
    padding: 10px 10% 0px 20%;
  }
  .el-form{
    display: inline-block;
    text-align: initial
  }
  .size {
    width: 200px;
    height: 200px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
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

