<template>
<div id="box" class="view">
        <h4><span class="vercitals">| </span>新增旅客资料</h4>
          <el-form size="small" :rules="rules" ref="information" :model="information" label-width="100px" id='informataion'>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                     <el-form-item label="旅客姓名" prop="Name">
                        <el-input v-model="information.Name" class="form-inline-input"></el-input>              
                     </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                    <el-form-item label="性别" prop="Sex">
                              <el-radio-group v-model="information.Sex" class="form-inline-input" >
                                    <el-radio label="1">男</el-radio>
                                    <el-radio label="2">女</el-radio>
                              </el-radio-group>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="英文姓名" prop="EnglishName">
                              <el-input v-model="information.EnglishName" class="form-inline-input"></el-input>              
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="婚姻状况" prop="MaritalStatus">
                              <el-radio-group v-model="information.MaritalStatus" >
                              <el-radio label="1">是</el-radio>
                              <el-radio label="2">否</el-radio>
                              </el-radio-group>              
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="人群范围" prop="AgeGroup">
                              <el-select v-model="information.AgeGroup" class="form-inline-input">
                                    <el-option v-for="item in AgeGroups" :key="item.key" :label="item.value" :value="item.key"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="手机号码"  prop="Mobile">
                              <el-input v-model="information.Mobile" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="出生日期" prop="Birthdate">
                              <el-date-picker :editable="false" v-model="information.Birthdate" type="date" placeholder="选择日期" size="small" class="form-inline-input" id="a"></el-date-picker>
                        </el-form-item>
                  </el-col>
                </el-row>
                  <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="身份证号" prop="CredentialNo">
                              <el-input :maxlength="18" v-model="information.CredentialNo" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="证件有效期" prop="ExpireDate">
                              <el-date-picker v-model="information.ExpireDate" type="date" placeholder="选择日期" size="small" class="form-inline-input" id="b"></el-date-picker>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="护照号" prop="PassPortNo">
                              <el-input v-model="information.PassPortNo" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="证件有效期" prop="PassPortExpireDate">
                              <el-date-picker :editable="false" v-model="information.PassPortExpireDate" type="date" placeholder="选择日期" size="small" class="form-inline-input" id="c"></el-date-picker>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="港澳台通行证" prop="HMCredentialNo">
                              <el-input v-model="information.HMCredentialNo" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="证件有效期" prop="HMCredentialExpireDate">
                              <el-date-picker :editable="false" v-model="information.HMCredentialExpireDate" type="date" placeholder="选择日期" size="small" class="form-inline-input" id="d"></el-date-picker>
                        </el-form-item>
                  </el-col>
              </el-row>
                <el-row :gutter="24" type="flex" >
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="出生地址" prop="ProvinceID">
                              <el-select v-model="information.ProvinceID" placeholder="省"  @change="getCityID">
                                    <el-option v-for="item in ProvinceIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="CityID">
                              <el-select v-model="information.CityID" placeholder="市"  @change="getDistrictID">
                                    <el-option v-for="item in CityIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="DistrictID">
                              <el-select v-model="information.DistrictID" placeholder="县" >
                                    <el-option v-for="item in DistrictIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                      <el-col :span="9" style="height:50px">
                        <el-form-item label="详细地址" prop="BirthPlace">
                              <el-input v-model="information.BirthPlace" class="form-inline-input"></el-input>
                        </el-form-item>
                      </el-col>
                </el-row>
                <el-row :gutter="20" type="flex">
                      <el-col :span="9" style="height:50px">
                        <el-form-item label="通讯地址" prop="Address">
                              <el-input v-model="information.Address" class="form-inline-input"></el-input>
                        </el-form-item>
                      </el-col>
                </el-row>
                <!-- <el-row :gutter="20" type="flex" >
                  <el-form-item label="备注">
                        <el-input
                              type="textarea"
                              :rows="5"
                              placeholder="请输入内容"
                              style="width:500px"
                              v-model="information.Remark">
                        </el-input>
                  </el-form-item>
                </el-row> -->
                <el-row>
                  <el-form-item style="width:90%">
                        <el-button size="small" type="primary" @click="submitForm" :loading="flage">保存</el-button>
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
          flage: false,
          information:{
            Name: '',  //b
            EnglishName: '', //b
            Sex: '1',  //性别必须穿
            MaritalStatus: '2',  //是否结婚 必须
            Birthdate: '', //b
            CredentialNo: '',  //b
            ExpireDate: '',  //b
            Mobile: '',  //b
            BirthPlace: '',
            Address: '',
            PassPortNo:'',
            PassPortExpireDate:'',
            HMCredentialNo: '',
            HMCredentialExpireDate: '',
            ProvinceID: '',
            ProvinceName: '',
            CityID: '',
            CityName: '',  
            DistrictID: '',
            DistrictName: '',
          },
          Idtypes:[],
          AgeGroups:[],  //1
          ProvinceIDList: [], //省份ID
          CityIDList: [],  // 市ID
          DistrictIDList: [], //区县ID 
          rules:{
            Name: [{ required: true, message: '请输入旅客姓名', trigger: 'blur' }],
            EnglishName:[{ required: true, message: '请输入英文名', trigger: 'blur' }],
            CredentialNo:[{required: true,validator:CredentialNo,trigger:'blur'}],
            Mobile:[{ required: true, validator:TelPhoneCheck, trigger: 'blur' }],
            BirthPlace: [{ required: true, message: '请输入出生详细地址', trigger: 'blur' }],
            Address: [{required: true, message: '请输入通讯地址', trigger: 'blur' }],
            AgeGroup:[{ type:'number',required: true, message: '请选择人群范围', trigger: 'change' }],
            ProvinceID:[{type:'number', required: true, message: '请选择省', trigger: 'change'}] ,
            CityID:[{type:'number', required: true, message: '请选择市', trigger: 'change'}] ,
            DistrictID:[{type:'number', required: true, message: '请选择区（县）', trigger: 'change'}] ,
            Birthdate: [{type:'date', required: true, message: '请选择出生日期', trigger: 'change'}],
            ExpireDate:[{type:'date',  required: true, message: '请选择证件有效期', trigger: 'change'}],
          }
      }
  },
  mounted:function(){
       this.getCredType();
       this.getAgeGroup(); 
       this.getCountryID();
  },
  methods: {
      submitForm(){
            this.$refs['information'].validate((valid) =>{
                  if (valid) {
                        //获取省、市、区（县）名
                  this.ProvinceIDList.forEach((item) => {
                        if(item.id == this.information.ProvinceID){
                        this.information.ProvinceName = item.name;
                        }
                  })
                  this.CityIDList.forEach((item) => {
                        if(item.id == this.information.CityID){
                        this.information.CityName = item.name;
                        }
                  })
                  this.DistrictIDList.forEach((item) => {
                        if(item.id == this.information.DistrictID){
                        this.information.DistrictName = item.name;
                        }
                  })
                  this.shopHttp.post("CustomerBasicData/AddOrEditPassenger",this.information).then(res =>{
                        if(res.data.isSuccess == true){
                              this.$router.push('./traveller-passage');
                              this.$message({
                                    type: 'success',
                                    message: "成功，新建游客信息成功"
                              });
                              thi.flage = true;
                        }else{}
                        }).catch(e => {
                              this.flage = false;
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
                          console.log(res);
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
                          //console.log(res);
                       this.AgeGroups = res.data ;
                           }).catch(e => {
                              console.log(e);
                               this.$message({
                                          type: 'info',
                                          message: "加载失败 ：" + res.data.message
                                    });
                              })
            },
            //获取省份
            getCountryID(val){
                  this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
                    this.ProvinceIDList = res.data;
                    if(res.data.isSuccess == true){
                          //this.CityID = ''
                    }
                   }).catch((e) => {
                    console.log(e);
                })
             },
            //获取市ID
            getCityID(val){

                  this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then(res =>{
                              this.CityIDList = res.data ;
                              this.information.CityID = '';
                              this.information.DistrictID ='';
                  }).catch(e =>{
                        console.log(e);
                  })
            },
            //获取区县id
            getDistrictID(val){
                  this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then(res =>{
                              this.DistrictIDList = res.data ;
                              this.information.DistrictID = '';
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
        width: 200px;
        }
      element{
            width: 334px;
      }
</style>
