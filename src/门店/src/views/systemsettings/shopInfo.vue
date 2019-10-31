<template>
  <div class="view">
    <el-form size="small" :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      	<h4><span class="vercitals">| </span>门店信息</h4>
    
		<el-row>
			<el-form-item label="负责人" prop="contanct">
				<el-input v-model="ruleForm.contanct"></el-input>
			</el-form-item>
			<el-form-item label="传真" prop="fax">
				<el-input v-model="ruleForm.fax"></el-input>
			</el-form-item>
		</el-row>
		<el-row>
			<el-form-item label="联系电话" prop="mobilePhone">
				<el-input v-model="ruleForm.mobilePhone" class="input_comm"></el-input>
				<el-button type="primary" class="margin" v-show="timerSecond<=0" :loading="codeLoading" @click="getCode">获取验证码</el-button>
				<el-button size="small" type="info" v-show="timerSecond>0" class="count">重新发送（{{timerSecond}}）</el-button>
			</el-form-item>
			<el-form-item label="验证码" prop="code">
				<el-input v-model="ruleForm.code"></el-input>
			</el-form-item>
		</el-row>
		<el-row>
			<el-form-item label="通信地址" prop="provinceID">
				<el-select v-model="ruleForm.provinceID" placeholder="  请选择省" @change="provinceChange('','')">
					<el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id" id="c"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="cityID">
				<el-select v-model="ruleForm.cityID" placeholder=" 请选择市" @change="cityChange('')">
					<el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id" id="b"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="districtID">
				<el-select v-model="ruleForm.districtID" placeholder=" 请选择区（县）">
					<el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id" id="a"></el-option>
				</el-select>
			</el-form-item>
		</el-row>
		<el-row>
			<el-form-item label="详细地址" prop="address">
				<el-input v-model="ruleForm.address" placeholder=" 请填写详细地址"></el-input>
			</el-form-item>
		</el-row>
      <h4><span class="vercitals">| </span>资质信息</h4>
      <el-row :gutter="20" style="text-align:center">
        <el-col :span="6">
          <el-upload class="avatar-uploader"
                     action="/image/upload"
                     :show-file-list="false"
                     data="businessPicture"
                     :on-success="handleAvatarSuccess"
                     :on-remove="handleRemove"
                     :before-upload="beforeAvatarUpload"
                     accept="image/jpeg,image/png,image/bmp"
                     :http-request="imgUpload">
            <img v-if="ruleForm.businessPicture" :src="ruleForm.businessPicture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <el-upload class="avatar-uploader"
                     action="/image/upload"
                     :show-file-list="false"
                     data="licensingPicture"
                     :on-success="handleAvatarSuccess"
                     :on-remove="handleRemove"
                     :before-upload="beforeAvatarUpload"
                     accept="image/jpeg,image/png,image/bmp"
                     :http-request="imgUpload">
            <img v-if="ruleForm.licensingPicture" :src="ruleForm.licensingPicture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <el-upload class="avatar-uploader"
                     action="/image/upload"
                     :show-file-list="false"
                     data="idCardFront"
                     :on-success="handleAvatarSuccess"
                     :on-remove="handleRemove"
                     :before-upload="beforeAvatarUpload"
                     accept="image/jpeg,image/png,image/bmp"
                     :http-request="imgUpload">
            <img v-if="ruleForm.idCardFront" :src="ruleForm.idCardFront" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <el-upload class="avatar-uploader"
                     action="/image/upload"
                     :show-file-list="false"
                     data="idCardBack"
                     :on-success="handleAvatarSuccess"
                     :on-remove="handleRemove"
                     :before-upload="beforeAvatarUpload"
                     accept="image/jpeg,image/png,image/bmp"
                     :http-request="imgUpload">
            <img v-if="ruleForm.idCardBack" :src="ruleForm.idCardBack" class="avatar">
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
          <el-form-item label="旅游资质有效期至" prop="travelQualifications" label-width="150px">
            <el-date-picker placeholder="选择日期" v-model="ruleForm.travelQualifications"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同有效期至" prop="contractExpiryDate" label-width="150px">
            <el-date-picker placeholder="选择日期" v-model="ruleForm.contractExpiryDate"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="24" style="height:100px">
          <el-form-item label="备注" prop="descs">
            <el-input type="textarea"
                      :rows="3"
                      placeholder="请输入备注内容"
                      v-model="ruleForm.descs">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item style="margin-left:50px;">
        <el-button size="small" type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
   
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as http from "@/utils/http.js"

  export default {
    data() {
      let PhoneFormatter = (rule, value, callback) => {
        if (!value)
          callback(new Error('请输入手机号'));
        else if (!(/^1[3|4|7|5|8]\d{9}$/.test(value)))
          callback(new Error('手机号码格式错误!'));
        else
          callback();
      }
      return {
        codeLoading: false, //发送验证码loading
        submitLoading: false,//提交表单loading
        uploadFileUrl: http.fileUploadUrl,  //图片上传url
        ruleForm: {
          id: '',
          name: '',
          boCompanyInfoId: '',
          enumCompanyType: '',
          creditId: '',
          contanct: '',
          mobilePhone: '',
          code: '',
          fax: '',
          contryID: 1,
          provinceID: '',
          provinceName: '',
          cityID: '',
          cityName: '',
          districtID: '',
          districtName: '',
          address: '',
          travelQualifications: '',
          contractExpiryDate: '',
          descs: '',
          licensingPicture: '',
          businessPicture: '',
          idCardFront: '',
          idCardBack: ''
        },
        rules: {           
          contanct: [{ required: true, message: '请填写负责人', trigger: 'blur' }],
          mobilePhone: [{ required: true, validator: PhoneFormatter, trigger: 'blur' }],
          code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],    
          provinceID: [{ type: 'number', required: true, message: '请选择省', trigger: 'change' }],
          cityID: [{ type: 'number', required: true, message: '请选择市', trigger: 'change' }],
          districtID: [{ type: 'number', required: true, message: '请选择区（县）', trigger: 'change' }],
          businessPicture: [{ required: true, message: '上传营业执照', trigger: 'blur' }],
          travelQualification: [{ required: true, message: '上传旅游险资质', trigger: 'blur' }],
          address: [{ required: true, message: "请填写详细地址", trigger: 'blur' }],
          travelQualifications: [{ required: true, type: 'date', message: "请选择旅游资质有效期", trigger: 'change' }],
          contractExpiryDate: [{ required: true, type: 'date', message: "请选择合同有效期", trigger: 'change' }]
        },  
        ProvinceList: [],
        CityList: [],
        DistrictList: [],     
        timer: null,
        timerSecond: 0
      }
    },
    mounted() {
      this.getCountryID();
      this.getOldRegisterInfo();
    },
    methods: {     
      getOldRegisterInfo() {
        this.shopHttp.get("/Member/GetShopInfo" )
          .then(res => {
            this.ruleForm = res.data;
            this.ruleForm.contractExpiryDate = new Date(res.data.contractExpiryDate);
            this.ruleForm.travelQualifications = new Date(res.data.travelQualifications);

            this.provinceChange(this.ruleForm.cityID, this.ruleForm.districtID); //初始化城市id
            this.cityChange(this.ruleForm.districtID);//初始化区域id
          });
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
        this.$refs.ruleForm.validateField('mobilePhone', (errorMsg) => {
          if (errorMsg == '') {
            this.codeLoading = true;
            this.shopHttp.post("/ShopAccount/GetVerifyCode", { 'PhoneNumber': this.ruleForm.mobilePhone })
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
      provinceChange(val, districtId) {

        this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + this.ruleForm.provinceID)
          .then((res) => {
            this.CityList = res.data;
            this.ruleForm.cityID = val;
            this.ruleForm.districtID = districtId;
          })
      },
      //获取县（区）
      cityChange(val) {
        this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + this.ruleForm.cityID)
          .then((res) => {
            this.DistrictList = res.data;
            this.ruleForm.districtID = val;
          })
      },     
      //图片操作
      handleAvatarSuccess(res, file) { //上传成功显示图片
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) { //上传文件判断
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M)
          this.$message.error('上传头像图片大小不能超过 2MB!');
        return isLt2M;
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
      //提交
      onSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            this.shopHttp.post("/Member/EditShopInfo", this.ruleForm)
              .then((res) => {
                this.submitLoading = false;
                if (res.data.isSuccess == true) {
                  this.$message.success("已提交，请等待审核");
                 
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

      }
     
    }
  }
</script>
<style scoped>
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar-uploader-icon:hover{
	  border-color: #409EFF; 
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border: 1px dashed #d9d9d9;
  }
</style>

