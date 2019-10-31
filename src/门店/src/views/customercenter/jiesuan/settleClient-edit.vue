<template>
        <div class="view" id="box">
            <h4><span class="vercitals">| </span>基本信息</h4>
            <el-form size="small" :rules="rules" ref="form" :model="form" label-width="120px" class="demo-form-inline">
                  <el-row :gutter="20" type="flex" >
                        <el-col :span="8" style="height:50px">
                              <el-form-item label="结算单位" prop="name">
                                    <el-autocomplete 
                                    v-model="form.name" 
                                    :fetch-suggestions="querySearchAsync"
                                    class="form-inline-input">
                                    </el-autocomplete>
                              </el-form-item>
                        </el-col>
                        <el-col :span="8" style="height:50px">
                              <el-form-item label="联系人" prop="contanct">
                                    <el-input v-model="form.contanct" class="form-inline-input"></el-input>
                              </el-form-item>
                        </el-col>
                  </el-row>
                  <el-row :gutter="20" type="flex" >
                        <el-col :span="8" style="height:50px">
                              <el-form-item label="手机号码" prop="mobilePhone">
                                    <el-autocomplete 
                                    v-model="form.mobilePhone" 
                                    :fetch-suggestions="querySearchAsync"
                                    class="form-inline-input">
                                    </el-autocomplete>
                              </el-form-item>
                        </el-col>
                        <el-col :span="8" style="height:50px">
                              <el-form-item label="固定电话" prop="fixedTelephone">
                                    <el-input v-model.number="form.fixedTelephone" class="form-inline-input"></el-input>
                              </el-form-item>
                        </el-col>
                  </el-row>
                  <el-row :gutter="20" type="flex" >
                        <el-col :span="8" style="height:50px">
                              <el-form-item label="客户类型" prop="disTypeID">
                                    <!-- <span>{{form.disTypeID}}</span> -->
                                    <el-select :disabled="true" v-model="form.disTypeID" placeholder="请选客户类型" class="form-inline-input">
                                          <el-option v-for="item in disTypeID" :key="item.key" :label="item.value" :value="item.key"></el-option>
                                    </el-select>
                              </el-form-item>
                        </el-col>
                  </el-row>
                  <el-row :gutter="20" type="flex" >
                        <el-col :span="8" style="height:50px">
                              <el-form-item label="邮箱" prop="mailbox">
                                    <el-input v-model="form.mailbox" class="form-inline-input"></el-input>
                              </el-form-item>
                        </el-col>
                        <el-col :span="8" style="height:50px">
                              <el-form-item label="传真" prop="fax">
                                    <el-input v-model.number="form.fax" class="form-inline-input"></el-input>
                              </el-form-item>
                        </el-col>
                  </el-row>
                  <el-row :gutter="24" type="flex" >
                        <el-col style="width:240px;">
                              <el-form-item label="通信地址" prop="provinceID">
                                    <el-select v-model="form.provinceID" placeholder="  请选择省" @change="provinceChange">
                                          <el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id" id="a"></el-option>
                                    </el-select>
                              </el-form-item>
                        </el-col>
                        <el-col style="width:240px;">
                              <el-form-item label="" prop="cityID" >
                                    <el-select v-model="form.cityID" placeholder=" 请选择市" @change="cityChange">
                                          <el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id" id="b"></el-option>
                                    </el-select>
                              </el-form-item>
                        </el-col>
                        <el-col style="width:240px;">
                              <el-form-item label="" prop="districtID" >
                                    <el-select v-model="form.districtID" placeholder=" 请选择区（县）">
                                          <el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id" id="c"></el-option>
                                    </el-select>
                              </el-form-item>
                        </el-col>
                  </el-row>
                  <el-form-item label="" prop="address">
                        <el-input v-model="form.address" placeholder=" 请填写具体地址" class="form-inline-input"></el-input>
                  </el-form-item>
                  <h4><span class="vercitals">| </span>结算周期</h4>
                  <el-row :gutter="20" type="flex" >
                        <el-col :span="8" style="height:50px">
                              <el-form-item label="结算方式" prop="dictdataValue">
                                    <el-select v-model="form.dictdataValue" placeholder="结算方式" style="width:200px">
                                          <el-option v-for="item in DictdataName" :key="item.key" :label="item.value" :value="item.key"></el-option>
                                    </el-select>
                              </el-form-item>
                        </el-col>
                  </el-row>
                  <el-row>
                        <el-form-item label="结算周期" prop="maritalStatus" >
                              <el-radio-group v-model="form.qTwrite" >
                                    <el-radio label="1D">及时</el-radio>
                                    <el-radio label="1W">周结</el-radio>
                                    <el-radio label="1M">月结</el-radio>
                                    <el-radio label="QT">其他</el-radio>
                              </el-radio-group>              
                        </el-form-item>
                  </el-row> 
            
              <el-row v-if="form.qTwrite =='QT'">
                  <el-form-item prop="settlementPeriod">
                        <el-input v-model="form.settlementPeriod" class="form-inline-input"></el-input>
                         <el-select v-model="form.setDescs" class="form-inline-input">
                              <el-option label="天"  value="D"></el-option>
                              <el-option label="月" value="M"></el-option>
                              <el-option label="年" value="Y"></el-option>
                        </el-select>
                  </el-form-item> 
              </el-row>
              <h4><span class="vercitals">| </span>合同管理</h4>
              <el-form-item label="是否签订合同" prop="isContract" label-width="120px">
                        <el-checkbox v-model="form.isContract">是</el-checkbox>            
              </el-form-item>
              <el-row v-if="form.isContract">
                    <el-form-item  label="上传合同附件" prop="contractAttachmemt" size="small" class="form-inline-input" style='width:100%'>
                          <el-upload
                              accept = 'image/*'
                              class="upload-demo"
                              action="http://120.76.20.11:8004/attachment/upload"
                              :http-request="attchementUPload"
                              :multiple="true"
                              :show-file-list="true"
                              :limit="1"
                              :file-list="fileList" 
                              :on-exceed="handleExceed"
                              :on-remove="handleRemove"
                              :before-upload="beforeAvatarUpload" >
                              <el-button size="small" type="primary" >点击上传附件</el-button>
                              <div slot="tip" class="el-upload__tip">上传文件大小不可超过2MB</div>
                              <div  slot="tip" class="el-upload__tip">{{form.contractAttachmemt}}</div>
                        </el-upload>
                 </el-form-item>
                 <el-form-item label="开始时间" prop="contractStartDate" label-width="120px">
                        <el-date-picker :editable="false" v-model="form.contractStartDate" type="date" value-format="yyyy-MM-dd"  placeholder="选择日期" id="f"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="结束时间" prop="contractEndDate" label-width="120px">
                        <el-date-picker :editable="false" v-model="form.contractEndDate" type="date" value-format="yyyy-MM-dd"  placeholder="选择日期" id="g"></el-date-picker>
                  </el-form-item>
              </el-row>
              <h4><span class="vercitals">| </span>备注</h4>
              <el-form-item label="备注：">
                    <el-input  type="textarea" :rows="5" placeholder="请输入内容" style="width:40%" v-model="form.remark">
                    </el-input>
              </el-form-item>
              <el-form-item>
                    <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
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
                        callback(new Error('固定电话必须为数字'));
                  } else{
                        callback();
                  }
            }
            let Attachment = (rule, value, callback) => {
            if(!value){
                console.log(this.fileList)
                callback(new Error('你还没有上传过附件'))
            }else{
                callback()
            }
        }
      return {
          isLogin:false,
          form:{},
           ProvinceList: [],  //省
           CityList: [],  //城市
           DistrictList: [],   //县
           DisTypeID: [], //客户类型
           DictdataName:[],//结算方式
           disTypeID:[],
           dictdataName:[],
           fileList:[],
           restaurants: [],
           NameStatus: true,
           MobilePhoneStatus: true,
          rules: {
            name: [{required: true, message: '请输入结算单位', trigger: 'blur' }],
            disTypeID:[{type:'number',required: true, message: '请输选择客户类型', trigger: 'blur' }],
            contanct: [{required: true, message: '请输入联系人姓名', trigger: 'blur' }],
            mobilePhone: [{required: true, trigger: 'blur',validator: TelPhoneCheck}],
            // fixedTelephone: [{validator:FixedTelephone,trigger:'blur'}],
            mailbox: [{required: true,validator:EmailCheck, trigger: 'blur' }],
            address: [{required: true, message: '请输入地址', trigger: 'blur' }],
            // fax: [{validator:FaxCheck,trigger:'blur'}],
            // maritalStatus:[{required: true, message: '请选择结算周期', trigger: 'change'}],
            contractAttachmemt:[{required:true,validator:Attachment,trigger:'blur'}],
            contractStartDate:[{type:'string',required: true, message: '请选择开始日期', trigger: 'change'}],
            contractEndDate:[{type:'string', required: true, message: '请选择结束日期', trigger: 'change'}],
            provinceID:[{type:'number', required: true, message: '请选择省', trigger: 'change'}],
            cityID:[{type:'number', required: true, message: '请选择市', trigger: 'change'}],
            districtID:[{type:'number', required: true, message: '请选择区（县）', trigger: 'change'}],
            dictdataValue:[{required: true, message: '请选择结算方式', trigger: 'change'}],
            settlementPeriod:[{required:true,message:'请填写结算周期',trigger:'blur'}]
            },
            first:true,
            senced:true,
            originalName:'',
            originalPhone:''
       }
       
    }, 
    mounted () {
          this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
             this.ProvinceList = res.data;
            }).catch((e) => {
            console.log(e);
            })
        this.shopHttp.get("SettleClient/GetUpdateDisSettleClientDto?"+"DisSettleClientId="+this.$route.params.id).then(res=>{
            this.form = res.data.objects[0];
            this.originalName=this.form.name;
            this.originalPhone=this.form.mobilePhone;
            if(this.form.settlementPeriod != '1D' && this.form.settlementPeriod != '1W' && this.form.settlementPeriod != '1M')
            {
                  this.form.qTwrite = 'QT'; 
            }
            else
            {
                  this.form.qTwrite = this.form.settlementPeriod;
            }
            this.form.setDescs = this.form.settlementPeriod.substring(this.form.settlementPeriod.length-1)
            this.form.settlementPeriod = this.form.settlementPeriod.substring(0,this.form.settlementPeriod.length-1)
            if(this.form.setDescs  == 'W')
            {
                  this.form.setDescs  = 'D';
                  this.form.settlementPeriod  = '7';
            }
            this.provinceChange(this.form.provinceID)
            this.cityChange(this.form.cityID)
            }).catch(e=>{
                  console.log(e)
            })
         
         this.disTypeIDs();//获取客户类型
         this.DictdataNames()//获取结算方式
    },
    methods: {
        provinceChange(val){
              this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then( (res) =>{
                    this.CityList = res.data;
                    if(this.first){
                        this.first=false;
                    }else{
                        this.form.cityID = '';
                        this.form.districtID = '';
                    }
              }).catch( (e) => {
                          //console.log(e);
                    })
        },
        cityChange(val){
              this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then( (res) =>{
                    this.DistrictList = res.data;
                  if(this.senced){
                        this.senced=false;
                    }else{
                        this.form.districtID = '';
                    }
              }).catch( (e) => {
                          //console.log(e);
                    })
        },
        //保存编辑结算单位
           onSubmit(){
                 this.$refs["form"].validate((valid) =>{
                       if (valid) {
                              if(this.NameStatus == false){
                              this.$message({
                                          type:'error',
                                          message:'结算单位名称已存在！'
                                    })
                              return;
                        }
                        if(this.MobilePhoneStatus == false){
                              this.$message({
                                          type:'error',
                                          message:'手机号码已存在！'
                                    })
                              return;
                        }
                        this.ProvinceList.forEach((item) => {
                              if(item.id == this.form.provinceID){
                                    this.form.provinceName = item.name;
                              }
                        })
                        this.CityList.forEach((item) => {
                              if(item.id == this.form.cityID){
                                    this.form.cityName = item.name;
                              }
                        })
                        this.DistrictList.forEach((item) => {
                              if(item.id == this.form.districtID){
                                    this.form.districtName = item.name;
                              }
                        })

                        if(this.form.qTwrite == 'QT'){
                              var nowValue = this.form.settlementPeriod;

                              if(nowValue == '')
                              {
                                    this.$message({
                                                type:'error',
                                                message:'警告，请设置结算周期！'
                                          })
                              this.flage = false;
                                    return false;
                              }

                              this.form.settlementPeriod  =  nowValue + this.form.setDescs;
                              this.form.setDescs = nowValue + this.form.setDescs;
                        }
                        else{
                              this.form.settlementPeriod  = this.form.qTwrite;
                              this.form.setDescs = this.form.qTwrite;
                        }
                        if(this.form.settlementPeriod == '')
                        {
                              this.$message({
                                          type:'error',
                                          message:'警告，请设置结算周期！'
                                    })
                             this.flage = false;
                              return false;
                        }
                  this.form.qTwrite = null;
                 this.shopHttp.post("SettleClient/CreateDisSettleClient",this.form).then(res =>{
                        if(res.data.isSuccess == true){
                              this.$router.push('/customercenter/jiesuandanwei');
                              this.$message({
                                    type:'success',
                                    message:'成功，编辑结算单位成功'
                              })
                        }else{
                              this.$message({
                                    type: 'info',
                                    message: "错误 ：" + res.data.message
                              });
                        }
                     }).catch(e => {
                        console.log(e)
                  }) 
                       }else{
                     return false;
                  }
                 })
           } ,
            cancel(){
               this.$router.push('/customercenter/jiesuandanwei')
         },
        //客户类型 
        disTypeIDs(){
                  this.shopHttp.get("SettleClient/GetDisType").then(res =>{
                       this.disTypeID = res.data.objects;
                           }).catch(e => {
                              console.log(e);
                               this.$message({
                                          type: 'info',
                                          message: "加载失败 ：" + res.data.message
                                    });
                              })
                 },
                 //结算方式
        DictdataNames(){
              this.shopHttp.get("SettleClient/GetDictionaryList").then(res =>{
                       this.DictdataName = res.data.objects ;
                           }).catch(e => {
                              console.log(e);
                               this.$message({
                                          type: 'info',
                                          message: "加载失败 ：" + res.data.message
                                    });
                              })
        },
          //结算单位名查重
      querySearchAsync(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

            if(this.originalName!=this.form.name){
                  this.shopHttp.get("SettleClient/GetSettleClientName?Name="+this.form.name).then(res =>{
                        this.NameStatus = res.data.status;
                        if(res.data.status == false){
                        this.$message({
                                    message:"该结算单位已存在",
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
            }else{
                  this.NameStatus = true;
            }
             if(this.originalPhone!=this.form.mobilePhone){
                  this.shopHttp.get("SettleClient/CheckSettleClientPhone?MobilePhone="+this.form.mobilePhone).then(res =>{
                        this.MobilePhoneStatus = res.data.status;
                        if(res.data.status == false){
                              this.$message({
                                    message:"该电话号码已存在",
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
             } else{
                  this.MobilePhoneStatus = true;
            }       
           },
           createStateFilter(queryString) {
                  return (state) => {
                  return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                  };
            },
      attchementUPload(val){
            var _this = this;
            var f = new FormData();
            f.append('FileData',val.file);
            f.append('Category',"AirTicket");
            f.append('thumbnail',true);
            f.append('Folder','Airline');
            this.fileUpload.post(val.action,f).then(function(res){
                  _this.fileList.push({
                        name: res.data.FileName,
                        url: res.data.Url,
                    })
                 // console.log("上传图片----------------------------");
                 // console.log("文件上传成功"+res.data.Url);
                  _this.form.contractAttachmemt = res.data.Url;
                  _this.$refs.form.validateField('contractAttachmemt');
            }).catch(function(err){
                  console.log(err);
            })
        },
      beforeAvatarUpload(file) {
            const isIMG = file.type.indexOf('image/');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            return false;
            }
            if (isIMG==-1) {
            this.$message.error('只能上传图片!');
            return false;
            }
      },
      handSuccess(){},
      //限制上传数
      handleExceed(files, fileList){
            this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length}个文件`);
      },
     handleRemove(file, fileList) {
            this.form.contractAttachmemt =''
            this.fileList = fileList;
      },

        },
}
</script>

<style lang="scss" scoped>
    @import "../../../style/common.scss";
    .form-inline-input {
        width: 200px;
        }
</style>
