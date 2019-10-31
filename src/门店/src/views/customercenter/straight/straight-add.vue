<template>
  <div class="view" id="box">
          <h4><span class="vercitals">| </span>新增客户资料</h4>
          <el-form size="small" :rules="rules" ref="straightInfo" :model="straightInfo" label-width="100px" id='informataion'>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                     <el-form-item label="客户名称" prop="Name">
                        <el-input v-model="straightInfo.Name" class="form-inline-input"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="联系人" prop="Contanct">
                           <el-input v-model="straightInfo.Contanct" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                      <el-col :span="9" style="height:50px">
                    <el-form-item label="结算单位" prop="DisSettleClientId">
                        <el-select v-model="straightInfo.DisSettleClientId" placeholder="请选结算单位">
                              <el-option v-for="item in DisSettleClients" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="传真" prop="Fax">
                              <el-input v-model="straightInfo.Fax" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <!-- <el-col :span="9" style="height:50px">
                        <el-form-item label="客户类型" prop="DisTypeID">
                            <el-select v-model="straightInfo.DisTypeID" placeholder="请选客户类型" class="form-inline-input">
                               <el-option v-for="item in DisTypeID" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                  </el-col> -->
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="手机号码" prop="MobilePhone">
                              <el-input v-model="straightInfo.MobilePhone" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="固定电话" prop="FixedTelephone">
                              <el-input v-model="straightInfo.FixedTelephone" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="邮箱" prop="Mailbox">
                              <el-input v-model="straightInfo.Mailbox" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24" type="flex" >
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="通信地址" prop="ProvinceID">
                              <el-select v-model="straightInfo.ProvinceID" placeholder="省"  @change="getCityID">
                                    <el-option v-for="item in ProvinceIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="CityID">
                              <el-select v-model="straightInfo.CityID" placeholder="市"  @change="getDistrictID">
                                    <el-option v-for="item in CityIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="DistrictID">
                              <el-select v-model="straightInfo.DistrictID" placeholder="县" >
                                    <el-option v-for="item in DistrictIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                      <el-col :span="9" style="height:50px">
                        <el-form-item label="详细地址" prop="Address">
                              <el-input v-model="straightInfo.Address" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                      <el-col :span="9">
                        <el-form-item label="备注">
                              <el-input
                                    type="textarea"
                                    :rows="5"
                                    placeholder="请输入内容"
                                    style="width:500px"
                                    v-model="straightInfo.remark">
                              </el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="是否登录" prop="IsLogin">
                              <el-checkbox v-model="straightInfo.IsLogin"> 是</el-checkbox>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="straightInfo.IsLogin">
                        <el-form-item label="登录账号" prop="Account">
                              <el-autocomplete 
                                    v-model="straightInfo.Account" 
                                    placeholder=" 请填写账号"
                                    :fetch-suggestions="querySearchAsync"
                                    class="form-inline-input">
                              </el-autocomplete>
                  </el-form-item>
                        <el-form-item label="密码" prop="Password">
                              <el-input type="password" v-model="straightInfo.Password" placeholder=" 请填写密码" class="form-inline-input"></el-input>
                        </el-form-item>
                </el-row>
              <el-form-item>
                    <el-button size="small" type="primary" @click="SubmitInfo('straightInfo')" :loading="flage">保存</el-button>
                    <el-button size="small" type="info" @click="cancel">取消</el-button>
              </el-form-item>
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
            let EmailCheck=(rule,value,callback)=>{
                  var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                  if(!value){
                  callback(new Error('请输入邮箱'));
                  }else if(!reg.test(value)){
                  callback(new Error('请输入正确的邮箱'));
                  }else{
                  callback();
                  }
            }
            let FixedTelephone=(rule,value,callback)=>{
                  if(!value){
                        return;
                  }if (!(/^\d{0,12}$/.test(value))) {
                        callback(new Error('固定电话必须为数字'));
                  } else{
                        callback();
                  }
            }
            let FaxCheck=(rule,value,callback)=>{
                  if(!value){
                        return;
                  }else if(!(/^\d{1,8}$/.test(value))){
                callback(new Error('请输入正确传真号码'))
              }else{
                        callback();
                  }
            }
            let AccountCheck=(rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入员工账号'))
                     }else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value))){
                callback(new Error('中英文字母或数字组合，不区分大小写，长度：6-20个字符'))
              }else{
                callback();
              }
         }
         let PasswordCheck=(rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入登录密码'))
              }else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value))){
                callback(new Error('6-16位，不能包含空格；且必需包含字母以及数字至少各有一位'))
              }else{
                callback();
              }
         }
            return {
                  flage:false,
                  AccountStatus: '',
                  straightInfo:{
                        DisSettleClientId: '',  //选择结算单位
                        Name: '',  //结算单位
                        DisTypeID: '1',   //客户类型
                        Contanct: '',  //联系人姓名
                        MobilePhone: ''  ,  //手机号
                        FixedTelephone: '',  //固定电话
                        Mailbox: '',  //邮箱
                        Fax: '',  //传真
                        Address: '',   //详细地址
                        ProvinceID: '',
                        ProvinceName: '',
                        CityID: '',
                        CityName: '',  
                        DistrictID: '',
                        DistrictName:  '',
                        Remark: '',
                        IsLogin: false,
                        Account: '',
                        Password: '',
                        DictdataName: ''
                  },
                  DisTypeID:[],
                  // DictdataName: [],//结算方式
                  DisSettleClients:[],//结算单位
                  ProvinceIDList: [], //省份ID
                  CityIDList: [],  // 市ID
                  DistrictIDList: [], //区县ID 
                  restaurants:[],
                  rules:{  
                        DisSettleClientId: [{type:'number',required: true, message: '请选择结算单位', trigger: 'change' }],
                        Name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
                        DisTypeID:[{type:'number',required: true, message: '请选择客户类型', trigger: 'change' }],
                        Contanct:[{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
                        MobilePhone: [{ required: true, validator:TelPhoneCheck, trigger: 'blur' }],
                        // FixedTelephone: [{validator:FixedTelephone}],
                        Mailbox:  [{ required: true,  validator:EmailCheck, trigger: 'blur' }],
                        // Fax: [{validator:FaxCheck}],
                        Address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
                        ProvinceID: [{type:'number',required: true, message: '请选择省', trigger: 'change' }],
                        CityID:[{type:'number',required: true, message: '请选择市', trigger: 'change'}],
                        DistrictID:[{type:'number',required: true, message: '请选择县（区）', trigger: 'change'}],
                        DictdataName:[{required: true, message: '请选择结算方式', trigger: 'change'}],
                        Account:[{ validator:AccountCheck,required: true,trigger: 'blur'}],
                        Password:[{required: true, validator:PasswordCheck, trigger: 'blur' }],
                  }
            }
      },
      mounted () {
            this.getDisTypeID();
            this.getSettleClients();
            this.getCountryID();
      },
      methods: {
            querySearchAsync(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
             this.shopHttp.get("SettleClient/CheckCustomerAccount?DisTypeId=1"+
                  "&Account="+this.straightInfo.Account).then(res =>{
                        this.AccountStatus = res.data.status;
                        if(res.data.status == true){
                              this.$message({
                                    message:"该账号已存在",
                                    type:'error'
                              })
                        }
                              }).catch(e => {
                                    console.log(e);
                                    this.$message({
                                                type: 'error',
                                                message: "加载失败 ：" + res.data.message
                                          });
                                    });            
           },
            createStateFilter(queryString) {
                        return (state) => {
                        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                        };
                  },
            SubmitInfo(formName){
                  this.$refs[formName].validate((valid) =>{
                        if (valid) {
                              if(this.AccountStatus == true){
                                    this.$message({
                                          message: "该账号已存在",
                                          type: 'error'
                                    })
                                    return;
                              }
                              //获取省、市、区（县）名
                        this.ProvinceIDList.forEach((item) => {
                              if(item.id == this.straightInfo.ProvinceID){
                                    console.log(item.name)
                              this.straightInfo.ProvinceName = item.name;
                              }
                        })
                        this.CityIDList.forEach((item) => {
                              if(item.id == this.straightInfo.CityID){
                              this.straightInfo.CityName = item.name;
                              }
                        })
                        this.DistrictIDList.forEach((item) => {
                              if(item.id == this.straightInfo.DistrictID){
                              this.straightInfo.DistrictName = item.name;
                              }
                        })
                        this.shopHttp.post("SettleClient/CreateCustomerInformation",this.straightInfo).then(res =>{
                        if(res.data.isSuccess == true){
                              this.$message({
                                    type:"success",
                                    message:"新增成功！",
                                   
                                    });
                                     this.flage = true;
                              this.$router.push('/customercenter/straight-custormer');
                        }else{
                              // this.$message({
                              //       type: 'info',
                              //       message: "加载失败 ：" + res.data.message
                              // });
                        }
                        }).catch(e => {
                        console.log(e)
                        }) 
                        }else{
                              console.log('error submit!!');
                              this.flage = false
                              return false;
                              }
                  })
                       
            },
            //获取客户类型
            getDisTypeID(){
                  this.shopHttp.get("SettleClient/GetDisType").then(res =>{
                        this.DisTypeID = res.data.objects ;
                              }).catch(e => {
                              console.log(e);
                                    this.$message({
                                          type: 'info',
                                          message: "加载失败 ：" + res.data.message
                                    });
                              })
            },
            //获取结算单位
            getSettleClients(){
                  this.shopHttp.get("SettleClient/GetdisSettleClient?ShopId=0").then(res =>{
                        console.log(res);
                        this.DisSettleClients = res.data.objects ;
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
                    if(res.status == 200){}
                   }).catch((e) => {
                    console.log(e);
                })
             },
            //获取市ID
            getCityID(val){
                  this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then(res =>{
                        this.CityIDList = res.data ;
                        this.straightInfo.CityID = '';
                        this.straightInfo.DistrictID = '';
                  }).catch(e =>{
                        console.log(e);
                  })
            },
            //获取区县id
            getDistrictID(val){
                  this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then(res =>{
                        this.DistrictIDList = res.data ;
                        this.DistrictID = '';
                  }).catch(e =>{
                        console.log(e);
                  })
            },
      cancel(){
            this.$router.push('/customercenter/straight-custormer')
      },
  }

}
</script>

<style lang="scss" scoped>
      @import "../../../style/common.scss";
    .form-inline-input {
        width: 200px;
        }
</style>
