<template>
<div id="box" class="view">
        <h4><span class="vercitals">| </span>修改旅客信息</h4>
          <el-form size="small" :rules="rules" ref="information" :model="information" label-width="100px" id='informataion'>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                     <el-form-item label="姓名" prop="name">
                        <el-input v-model="information.name" class="form-inline-input"></el-input>              
                     </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                    <el-form-item label="性别" prop="sex">
                              <el-radio-group v-model="information.sex" class="form-inline-input" >
                                    <el-radio :label="1">男</el-radio>
                                    <el-radio :label="2">女</el-radio>
                              </el-radio-group>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="英文姓名" prop="englishName">
                              <el-input v-model="information.englishName" class="form-inline-input"></el-input>              
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="婚姻状况" prop="maritalStatus">
                              <el-radio-group v-model="information.maritalStatus" >
                              <el-radio :label="1">是</el-radio>
                              <el-radio :label="2">否</el-radio>
                              </el-radio-group>              
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="人群" prop="ageGroup">
                              <el-select v-model="information.ageGroup" class="form-inline-input">
                                    <el-option v-for="item in AgeGroups" :key="item.key" :label="item.value" :value="item.key"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="电话号码"  prop="mobile">
                              <el-input v-model="information.mobile" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="出生日期" prop="birthdate">
                              <el-date-picker 
                               :editable="false"
                              v-model="information.birthdate" 
                              type="date" placeholder="选择日期" 
                              size="small" 
                              class="form-inline-input"
                              id="d"></el-date-picker>
                        </el-form-item>
                  </el-col>
                </el-row>
                  <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="身份证号" prop="credentialNo">
                              <el-input :maxlength="18" v-model="information.credentialNo" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="证件有效期" prop="expireDate">
                              <el-date-picker 
                              :editable="false" 
                              v-model="information.expireDate" 
                              type="date" 
                              placeholder="选择日期" 
                              size="small" 
                              class="form-inline-input"
                              id=""></el-date-picker>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="护照号" prop="passPortNo">
                              <el-input v-model="information.passPortNo" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item :editable="false" label="证件有效期" prop="passPortExpireDate">
                              <el-date-picker 
                              v-model="information.passPortExpireDate" 
                              type="date" 
                              placeholder="选择日期" 
                              size="small" 
                              class="form-inline-input"
                              id="b"></el-date-picker>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="港澳台通行证" prop="HMCredentialNo">
                              <el-input v-model="information.hmCredentialNo" class="form-inline-input" id="a"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item :editable="false" label="证件有效期" prop="HMCredentialExpireDate">
                              <el-date-picker 
                              v-model="information.hmCredentialExpireDate" 
                              type="date" 
                              placeholder="选择日期" 
                              size="small" 
                              class="form-inline-input"
                              id="c"></el-date-picker>
                        </el-form-item>
                  </el-col>
              </el-row>
                <el-row :gutter="24" type="flex" >
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="出生地址" prop="provinceID">
                              <el-select v-model="information.provinceID" placeholder="省"  @change="getCityID">
                                    <el-option v-for="item in ProvinceIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="cityID">
                              <el-select v-model="information.cityID" placeholder="市"  @change="getDistrictID">
                                    <el-option v-for="item in CityIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="districtID">
                              <el-select v-model.number="information.districtID" placeholder="县" >
                                    <el-option v-for="item in DistrictIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                      <el-col :span="9" style="height:50px">
                        <el-form-item label="详细地址" prop="birthPlace">
                              <el-input v-model="information.birthPlace" class="form-inline-input"></el-input>
                        </el-form-item>
                      </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                      <el-col :span="9" style="height:50px">
                        <el-form-item label="通讯地址" prop="address">
                              <el-input v-model="information.address" class="form-inline-input"></el-input>
                        </el-form-item>
                      </el-col>
                </el-row>
                <el-row>
                  <el-form-item style="width:90%">
                        <el-button size="small" type="primary" @click="submitForm('information')">保存</el-button>
                        <el-button size="small" @click="cancel">取消</el-button>
                  </el-form-item>
                </el-row>
          </el-form> 
  </div>
</template>
<script>
export default {
  data () {
        let TelPhoneCheck=(rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入手机号码'))
              }else if(!(/^1[0-9][0-9]\d{8}$/.test(value))){
                callback(new Error('您的手机号码有误'))
              }else{
                callback();
              }
         }
         let CredentialNo=(rule,value,callback)=>{
            if(!value){
                callback(new Error('请输入身份证号'))
              }else  if (!(/(^\d{15$}$)|(^\d{18}$|(^\d{17}(\d|X|x)))/.test(value))) {
                  callback(new Error('请输入正确的身份证号码'));
              }else{
                    callback();
              }
            }
      return {
          information:{},
          Idtypes:[],
          AgeGroups:[],
          ProvinceIDList:[],
          CityIDList: [],
          DistrictIDList: [],
          rules:{
            name: [{ required: true, message: '请输入旅客姓名', trigger: 'blur' }],
            englishName:[{ required: true, message: '请输入英文名', trigger: 'blur' }],
            credentialNo:[{required: true,validator:CredentialNo, trigger: 'blur' }],
            mobile:[{ required: true,validator:TelPhoneCheck, trigger: 'blur' }],
            birthPlace: [{ required: true, message: '请输入出生地详细地址', trigger: 'blur' }],
            address: [{ required: true, message: '请输入通讯地址', trigger: 'blur' }],
            sex:[{type:'number',required: true, message: '请选择性别', trigger: 'change' }],
            ageGroup:[{ type:'number', required: true, message: '请选择人群范围', trigger: 'change' }],
            provinceID:[{type:'number',message:'请选择省',  required: true,trigger: 'change'}],
            cityID:[{type:'number',message:'请选择市', required: true, trigger: 'change'}],
            districtID:[{type:'number',message:'请选择县',  required: true, trigger: 'change'}],
            birthdate:[{type:'date', required: true, message: '请选择出生日期', trigger: 'change'}],
            expireDate:[{type:'date',required: true, message: '请选择证件有效期', trigger: 'change'}] 
          },
          first:true,
          senced:true
      }
  },
  mounted () {
        this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
                  this.ProvinceIDList = res.data;
                    if(res.status == 200){}
                  }).catch((e) => {
                  console.log(e);
            })
        this.shopHttp.post("CustomerBasicData/GetPassenger",{PassengerId:this.$route.params.id}).then(res =>{
               this.information = res.data;
               this.getCityID(this.information.provinceID)
               this.getDistrictID(this.information.cityID)
               this.information.sex = res.data.sex;
               }).catch(e => {
                              console.log(e);
                              })
         this.getCredType();
         this.getAgeGroup();
      },
      methods: {
            submitForm(formName){
                this.$refs[formName].validate((valid) =>{
                if (valid) {
                      //获取省、市、区（县）名
                  this.ProvinceIDList.forEach((item) => {
                        if(item.id == this.information.provinceID){
                        this.information.provinceName = item.name;
                        }
                  })
                  this.CityIDList.forEach((item) => {
                        if(item.id == this.information.cityID){
                        this.information.cityName = item.name;
                        }
                  })
                  this.DistrictIDList.forEach((item) => {
                        if(item.id == this.information.districtID){
                        this.information.districtName = item.name;
                        }
                  })
                        this.shopHttp.post("CustomerBasicData/AddOrEditPassenger",this.information).then(res =>{
                  if(res.data.isSuccess == true){
                        this.$router.push('/customercenter/traveller-passage');
                        this.$message({
                              type:'success',
                              message:'成功，编辑旅客信息成功！'
                        })
                  }else{
                        this.$message({
                              type: 'info',
                              message: "加载失败 ：" + res.data.message
                        });
                  }
                  }).catch(e => {
                  console.log(e)
                  }) 
                }else{
                      console.log('error submit!!');
                      return false;
                }
            })
          
            },
            //获取证件类型
            getCredType(){
                    this.shopHttp.post("CustomerBasicData/GetCredentialType").then(res =>{
                       this.Idtypes = res.data ;
                           }).catch(e => {
                              console.log(e);
                               this.$message({
                                          type: 'info',
                                          message: "加载失败 ：" + res.data.message
                                    });
                              })
            },
            // 获取人群
            getAgeGroup(){
                  this.shopHttp.post("CustomerBasicData/GetEnumCrowd").then(res =>{
                       this.AgeGroups = res.data ;
                           }).catch(e => {
                              console.log(e);
                               this.$message({
                                          type: 'info',
                                          message: "加载失败 ：" + res.data.message
                                    });
                              })
            },
            //获取市ID
            getCityID(val){
                  this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then(res =>{
                        this.CityIDList = res.data ;
                        if(this.first){
                                    this.first=false;
                              }else{
                                    this.information.cityID = '';
                                    this.information.districtID = '';
                              }
                  }).catch(e =>{
                        console.log(e);
                  })
            },
            //获取区县id
            getDistrictID(val){
                  this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then(res =>{
                        this.DistrictIDList = res.data ;
                        if(this.senced){
                                    this.senced=false;
                              }else{
                                    this.information.districtID = '';
                              }
                  }).catch(e =>{
                        console.log(e);
                  })
            },
            cancel(){
                  this.$router.push('/customercenter/traveller-passage');
            }
      }
}
</script>

<style lang="scss" scoped>
@import "../../../style/common.scss";
    .form-inline-input {
        width:200px;
        }
    
</style>
