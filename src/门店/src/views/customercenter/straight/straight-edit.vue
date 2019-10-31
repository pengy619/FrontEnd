<template>
  <div id="box" class="view" v-loading="viewLoading">
        <h4><span class="vercitals">| </span>修改客户信息</h4>
          <el-form size="small" :rules="rules" ref="straightInfo" :model="straightInfo" label-width="100px" id='informataion'>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                     <el-form-item label="客户名称" prop="name">
                        <el-input v-model="straightInfo.name" class="form-inline-input"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="联系人" prop="contanct">
                           <el-input v-model="straightInfo.contanct" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                    <el-form-item label="结算单位" prop="disSettleClientId">
                        <el-select v-model="straightInfo.disSettleClientId" placeholder="请选结算单位">
                              <el-option v-for="item in DisSettleClients" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="传真" prop="fax">
                              <el-input v-model.number="straightInfo.fax" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="手机号码" prop="mobilePhone">
                              <el-input v-model="straightInfo.mobilePhone" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="固定电话" prop="fixedTelephone">
                              <el-input v-model.number="straightInfo.fixedTelephone" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="height:50px">
                        <el-form-item label="邮箱" prop="mailbox">
                              <el-input v-model="straightInfo.mailbox" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24" type="flex" >
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="通信地址" prop="provinceID">
                              <el-select v-model="straightInfo.provinceID" placeholder="省"  @change="getCityID">
                                    <el-option v-for="item in ProvinceIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="cityID">
                              <el-select v-model="straightInfo.cityID" placeholder="市"  @change="getDistrictID">
                                    <el-option v-for="item in CityIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="districtID">
                              <el-select v-model="straightInfo.districtID" placeholder="县" >
                                    <el-option v-for="item in DistrictIDList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                      <el-col :span="9" style="height:50px">
                        <el-form-item label="详细地址" prop="address">
                              <el-input v-model="straightInfo.address" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" type="flex" >
                        <el-form-item label="备注">
                              <el-input
                                    type="textarea"
                                    :rows="5"
                                    placeholder="请输入内容"
                                    style="width:500px"
                                    v-model="straightInfo.remark">
                              </el-input>
                        </el-form-item>
                </el-row>
               <!--  <el-row :gutter="20" type="flex" >
                  <el-col :span="9" style="50px">
                        <el-form-item label="是否登录" prop="isLogin">
                              <el-checkbox v-model="straightInfo.isLogin"> 是</el-checkbox>
                        </el-form-item>
                  </el-col>
                </el-row> -->
                <!-- <el-row v-show="straightInfo.isLogin">
                        <el-form-item label="账号" prop="Account">
                              <el-input v-model="straightInfo.account" class="form-inline-input"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="Password">
                              <el-input v-model="straightInfo.password" class="form-inline-input"></el-input>
                        </el-form-item>
                </el-row> -->
              <el-form-item>
                    <el-button size="small" type="primary" @click="SubmitInfo">保存</el-button>
                    <el-button size="small" @click="cancel">取消</el-button>
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
                  }if (isNaN(Number(value))) {
                        callback(new Error('固定电话必须为数字'));
                  } else{
                        callback();
                  }
            }
            let FaxCheck=(rule,value,callback)=>{
                  if(!value){
                        return;
                  }if (isNaN(Number(value))) {
                        callback(new Error('传真号码必须为数字'));
                  } else{
                        callback();
                  }
            }
            return {
                  viewLoading:true,
                  straightInfo:{},
                  DisTypeID:[],
                  DisSettleClients:[],//结算单位
                  // dictdataNameList: [],  //获取结算方式
                  ProvinceIDList: [], //省份ID
                  CityIDList: [],  // 市ID
                  DistrictIDList: [], //区县ID 
                  rules:{  
                        disSettleClientId: [{type:'number', required: true,message:'请选择结算单位', trigger: 'change' }],
                        name: [{ required: true,message:'请输入客户名称', trigger: 'blur' }],
                        contanct:[{ required: true,message:'请输入联系人', trigger: 'blur' }],
                        mobilePhone: [{validator:TelPhoneCheck, required: true, trigger: 'blur' }],
                        // fixedTelephone: [{validator:FixedTelephone,trigger:'blur'}],
                        mailbox:  [{ required: true,  validator:EmailCheck, trigger: 'blur' }],
                        // fax: [{validator:FaxCheck,trigger:'blur'}],
                        address: [{ required: true, message:'请输入详细地址', trigger: 'blur' }],
                        provinceID: [{type:'number',message:'请选择省', required: true,trigger: 'change' }],
                        cityID:[{type:'number', required: true,message:'请选择市（区）',trigger: 'change' }],
                        districtID:[{type:'number',message:'请选择县', required: true,trigger: 'change' }],
                  },
                  first:true,
                  senced:true
            }
  },
            mounted (){
                  this.viewLoading=true;
                  this.shopHttp.get("SettleClient/GetCustomerInformation?CustomerInformationId="+this.$route.params.id).then(res =>{
                        if(res.data.isSuccess ==true){
                            var object = res.data.objects[0];
                            this.straightInfo=object;
                              this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
                                    this.ProvinceIDList = res.data;
                                    this.getCityID(this.straightInfo.provinceID)
                                    this.getDistrictID(this.straightInfo.cityID)
                                    
                                      this.viewLoading=false;
                                    if(res.status == 200){}
                                    }).catch((e) => {
                                    console.log(e);
                              })
                        }
                  }).catch(e => {
                              console.log(e)
                        })  
                  this.getDisTypeID();
                  this.getSettleClients()
                  
           },
           methods: {
                  //保存
                  SubmitInfo(){
                        this.$refs['straightInfo'].validate((valid) =>{
                        if (valid) {
                              //获取省、市、区（县）名
                        this.ProvinceIDList.forEach((item) => {
                              if(item.id == this.straightInfo.ProvinceID){
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
                                                message:"成功，编辑客户信息成功！"
                                          });
                                          this.$router.push('/customercenter/straight-custormer')
                                    }else{}
                                          }).catch(e => {
                                          console.log(e)
                                          })
                        }else{
                              console.log('error submit!!');
                              return false;
                              }
                        })
                  },
                  //获取客户类型
                  getDisTypeID(){
                        this.shopHttp.get("SettleClient/GetDisType").then(res =>{
                              console.log(res);
                              this.DisTypeID = res.data.objects ;
                              }).catch(e => {
                                    console.log(e);
                                    this.$message({
                                                type: 'info',
                                                message: "加载失败 ：" + res.data.message
                                          });
                                    })

                              },
                  cancel(){
                        this.$router.push('/customercenter/straight-custormer')
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
                  //获取结算方式
                  // getDictdataName(){
                  //       this.shopHttp.get("SettleClient/GetDictionaryList").then(res =>{
                  //             this.dictdataNameList = res.data.objects ;
                  //                   }).catch(e => {
                  //                         this.$message({
                  //                               type: 'info',
                  //                               message: "加载失败 ：" + res.data.message
                  //                         });
                  //                   })
                  // },
                  //获取市ID
                  getCityID(val){
                        this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then(res =>{
                              this.CityIDList = res.data ;
                              if(this.first){
                                    this.first=false;
                              }else{
                                    this.straightInfo.cityID = '';
                                    this.straightInfo.districtID = '';
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
                                    this.straightInfo.districtID = '';
                              }
                        }).catch(e =>{
                              console.log(e);
                        })
                  },
      }
}
</script>

<style lang="scss" scoped>
    .form-inline-input {
        width: 200px;
        }
</style>
