<template>
  <div class="view" id="box">
          <h4><span class="vercitals">| </span>基本信息</h4>
          <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small" class="demo-form-inline">
                <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                        <el-form-item label="结算单位" prop="Name">
                              <el-autocomplete 
                              v-model="form.Name" 
                              :fetch-suggestions="querySearchAsync"
                              class="form-inline-input">
                              </el-autocomplete>
                        </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                        <el-form-item label="联系人" prop="Contanct">
                              <el-input v-model="form.Contanct" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex">
                  <el-col :span="8" style="height:50px">
                        <el-form-item label="手机号码" prop="MobilePhone">
                              <el-autocomplete 
                              v-model="form.MobilePhone" 
                              :fetch-suggestions="querySearchAsync"
                              class="form-inline-input">
                              </el-autocomplete>
                        </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                        <el-form-item label="固定电话" prop="FixedTelephone">
                              <el-input v-model="form.FixedTelephone" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="24" style="height:50px">
                        <el-form-item label="客户类型" prop="DisTypeID">
                              <el-select v-model="form.DisTypeID" placeholder="请选客户类型" class="form-inline-input">
                                    <el-option v-for="item in DisTypeID" :key="item.key" :label="item.value" :value="item.key"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex">
                  <el-col :span="8" style="height:50px">
                        <el-form-item label="邮箱" prop="Mailbox">
                              <el-input v-model="form.Mailbox" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                        <el-form-item label="传真" prop="Fax">
                              <el-input v-model="form.Fax" class="form-inline-input"></el-input>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="24" type="flex" >
                  <el-col style="width:240px;">
                        <el-form-item label="通信地址" prop="ProvinceID">
                              <el-select v-model="form.ProvinceID" placeholder="  请选择省" @change="provinceChange">
                                    <el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id" id="c"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="CityID">
                              <el-select v-model="form.CityID" placeholder=" 请选择市" @change="cityChange">
                                    <el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id" id="b"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col style="width:240px;height:50px">
                        <el-form-item label="" prop="DistrictID">
                              <el-select v-model="form.DistrictID" placeholder=" 请选择区（县）">
                                    <el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id" id="a"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-form-item label="" prop="Address">
                    <el-input v-model="form.Address" placeholder=" 请填写具体地址" class="form-inline-input"></el-input>
              </el-form-item>
              <h4><span class="vercitals">| </span>结算周期</h4>
              <el-row>
                  <el-col :span="8">
                        <el-form-item label="结算方式" prop="DictdataValue">
                              <el-select v-model="form.DictdataValue" placeholder="结算方式" style="width:200px">
                                    <el-option v-for="item in DictdataName" :key="item.key" :label="item.value" :value="item.key"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-form-item label="结算周期" prop="QTwrite" >
                        <el-radio-group v-model="form.QTwrite" >
                              <el-radio label="1D">及时</el-radio>
                              <el-radio label="1W">周结</el-radio>
                              <el-radio label="1M">月结</el-radio>
                              <el-radio label="QT">其他</el-radio>
                        </el-radio-group>              
                  </el-form-item>
              </el-row> 
            
              <el-row v-if="form.QTwrite=='QT'">
                  <el-form-item label="" prop="SettlementPeriod">
                        <el-input v-model="form.SettlementPeriod" class="form-inline-input"></el-input>
                         <el-select v-model="form.SetDescs" class="form-inline-input">
                              <el-option label="天"  value="D"></el-option>
                              <el-option label="月" value="M"></el-option>
                              <el-option label="年" value="Y"></el-option>
                        </el-select>
                  </el-form-item> 
              </el-row>
              <h4><span class="vercitals">| </span>合同管理</h4>
              <el-form-item label="是否签订合同" prop="IsContract" label-width="120px">
                  <el-checkbox v-model="form.IsContract">是</el-checkbox>            
              </el-form-item>
              <el-row v-if="form.IsContract">
                  <el-form-item  label="上传合同附件" prop="ContractAttachmemt" size="small" class="form-inline-input" style='width:100%'>
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
                        </el-upload>
                 </el-form-item>
                 <el-form-item label="开始时间" prop="ContractStartDate" label-width="120px">
                        <el-date-picker :editable="false" v-model="form.ContractStartDate" type="date" placeholder="选择日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="结束时间" prop="ContractEndDate" label-width="120px">
                        <el-date-picker :editable="false"  v-model="form.ContractEndDate" type="date" placeholder="选择日期"></el-date-picker>
                  </el-form-item>
              </el-row>
              <h4><span class="vercitals">| </span>备注</h4>
              <el-form-item label="备注">
                    <el-input v-model="form.Remark" type="textarea" :rows="5" placeholder="请输入内容" style="width:40%" >
                    </el-input>
              </el-form-item>
              <el-form-item label=" " prop="IsLogin">
                    <el-checkbox v-model="form.IsLogin" >是否登录到平台</el-checkbox>
              </el-form-item>
              <el-row v-if="form.IsLogin">
                  <el-form-item label="登录账号" prop="Account">
                        <el-autocomplete 
                              v-model="form.Account" 
                              placeholder=" 请填写账号"
                              :fetch-suggestions="querySearchAsync"
                              class="form-inline-input">
                        </el-autocomplete>
                  </el-form-item>
                  <el-form-item label="登录密码" prop="Password">
                        <el-input type="password" v-model="form.Password" placeholder=" 请填写密码" class="form-inline-input"></el-input>
                  </el-form-item>
              </el-row>
              <el-form-item>
                    <el-button size="small" type="primary" @click="onSubmit('form')" :loading="flage">保存</el-button>
                    <el-button size="small" type="info" @click="cancel" >取消</el-button>
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
      //    let FixedTelephone=(rule,value,callback)=>{
      //             if (!Number.isInteger(value)&&value) {
      //             callback(new Error('固定电话必须为数字'));
      //             }else{
      //           callback();
      //         }
      //       }
      //       let FaxCheck=(rule,value,callback)=>{
      //              if (!Number.isInteger(value)&&value) {
      //             callback(new Error('传真号码必须为数字'));
      //             } else{
      //           callback();
      //         }
      //       }
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

         let Attachment = (rule, value, callback) => {
            if(!value){
                console.log(this.fileList)
                callback(new Error('你还没有上传过附件'))
            }else{
                callback()
            }
        }
         return {
               flage: false,
               PageSize:'',
               PageIndex: '',
               timeout: null,
               restaurants: [],
               NameStatus: '',
               MobilePhoneStatus: '',
               AccountStatus: '',
               form:{
                  Name: '',   //结算单位 
                  DisTypeID: '',   //客户类型
                  Contanct: '',  // 联系人姓名
                  MobilePhone: '',   //手机号
                  FixedTelephone: '',  // 固定电话
                  Mailbox: '',  //联系人邮箱
                  Address: '',    //详细地址
                  Fax: '',   //传真
                  Remark: '',
                  ProvinceID: ''  ,
                  ProvinceName: '',
                  CityID: '',
                  CityName: '',
                  DistrictID: '',
                  DistrictName: '',
                  SettlementPeriod: '',
                  SetDescs: 'D',
                  QTwrite: "QT",
                  QTtime: '',
                  ContractStartDate: '',
                  ContractEndDate: '',
                  IsLogin: false,
                  IsContract: false,
                  ContractAttachmemt: '',
                  DictdataValue: ''
                  },
           fileList: [], //文件列表
           ProvinceList: [],  //省
           CityList: [],  //城市
           DistrictList: [],   //县
           DisTypeID: [], //客户类型
           DictdataName:[],//结算方式
           rules: {
                  Name: [{ required: true, message: '请输入结算单位', trigger: 'blur' }],
                  DisTypeID:[{type:'number', required: true, message: '请选择客户类型', trigger: 'change' }],
                  Contanct: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
                  MobilePhone: [{ required: true, validator:TelPhoneCheck, trigger: 'blur' }],
                  Mailbox: [{ required: true, validator:EmailCheck, trigger: 'blur' }],
                  Address: [{ required: true, message: '请输入地址', trigger: 'blur' } ],
                  DictdataValue:[{ required: true, message: '请选择结算方式', trigger: 'change'}],
                  ProvinceID:[{type:'number', required: true, message: '请选择省', trigger: 'change'}],
                  CityID:[{type:'number', required: true, message: '请选择市', trigger: 'change'}],
                  DistrictID:[{type:'number', required: true, message: '请选择区（县）', trigger: 'change'}],
                  ContractStartDate:[{type:'date',required: true, message: '请选择开始日期', trigger: 'change'}],
                  ContractEndDate:[{type:'date',required: true, message: '请选择结束日期', trigger: 'change'}],
                  Password:[{ validator:PasswordCheck,required: true,trigger: 'blur'}],
                  Account:[{ validator:AccountCheck,required: true,trigger: 'blur'}],
                  DictdataValue: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
                  // Fax: [{validator:FaxCheck,trigger:'blur'}],
                  // FixedTelephone:[{validator:FixedTelephone,trigger:'blur'}],
                  ContractAttachmemt:[{required:true,validator:Attachment,trigger:'blur'}] ,
                  SetDescs:[{required:true,message:'请填写结算周期',trigger:'change'}],
                  SettlementPeriod:[{required:true,message:'请填写结算周期',trigger:'blur'}]

            }
       }
      },
      mounted () {
          this.disTypeIDs(); 
          this.DictdataNames();
          this.getCountryID();
      },
      methods: {
            getCountryID(){
                  this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
                      console.log(res);
                    this.ProvinceList = res.data;
                   }).catch((e) => {
                    console.log(e);
                })
            },
            provinceChange(val){
              this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then( (res) =>{
                    this.CityList = res.data;
                    this.form.CityID = '';
                    this.form.DistrictID = '';
              }).catch( (e) => {
                          //console.log(e);
                    })
            },
            cityChange(val){
              this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then( (res) =>{
                    this.DistrictList = res.data;
                    this.form.DistrictID = '';
              }).catch( (e) => {
                          //console.log(e);
                    })
             },
        //结算单位名查重
      querySearchAsync(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
             this.shopHttp.get("SettleClient/GetSettleClientName?Name="+this.form.Name).then(res =>{
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
            this.shopHttp.get("SettleClient/CheckSettleClientPhone?MobilePhone="+this.form.MobilePhone).then(res =>{
                  this.MobilePhoneStatus = res.data.status ;
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
            this.shopHttp.get("SettleClient/CheckCustomerAccount?DisTypeId="+this.form.DisTypeID+
                  "&Account="+this.form.Account).then(res =>{
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
                  })              
           },
      createStateFilter(queryString) {
            return (state) => {
            return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
            },
        //新增结算单位
         onSubmit(form){
            this.$refs[form].validate((valid) =>{
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
                        if(this.AccountStatus == true){
                              this.$message({
                                          type:'error',
                                          message:'账号已存在！'
                                    })
                              return;
                        }
                         //获取省、市、区（县）名
                        this.ProvinceList.forEach((item) => {
                        if(item.id == this.form.ProvinceID){
                              this.form.ProvinceName = item.name;
                              }
                        })
                        this.CityList.forEach((item) => {
                              if(item.id == this.form.CityID){
                                    this.form.CityName = item.name;
                              }
                        })
                        this.DistrictList.forEach((item) => {
                              if(item.id == this.form.DistrictID){
                                    this.form.DistrictName = item.name;
                              }
                        })
                        var nowValue = this.form.SettlementPeriod;
                        if(this.form.QTwrite == 'QT'){
                              this.form.SettlementPeriod =  nowValue + this.form.SetDescs;
                             this.form.SetDescs = nowValue + this.form.SetDescs;
                        }
                        else{
                              this.form.SettlementPeriod  = this.form.QTwrite;
                              this.form.SetDescs = this.form.QTwrite;
                        }
                        if(this.form.SettlementPeriod == '')
                        {
                              this.$message({
                                          type:'error',
                                          message:'警告，请设置结算周期！'
                                    })
                             this.flage = false;
                              return false;
                        }
                        this.form.QTwrite = null;
                        this.shopHttp.post("SettleClient/CreateDisSettleClient",this.form).then(res =>{
                              if(res.data.isSuccess == true){
                                    this.flage = false;
                                    this.$message({
                                          type:'success',
                                          message:'成功，新增结算单位成功！'
                                    })
                                    this.$router.push('./jiesuandanwei')
                              }else{
                              }
                              }).catch(e => {
                                    this.flage = false;
                                    console.log(e)
                              })  
                  }else{
                     return false;
                  }
            })
         },
         cancel(){
               this.$router.push('/customercenter/jiesuandanwei')
         },
        //客户类型 
        disTypeIDs(){
            this.shopHttp.get("SettleClient/GetDisType").then(res =>{
                        //console.log(res);
                  this.DisTypeID = res.data.objects ;
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
                  //this.ProvinceID = res.data.
                        }).catch(e => {
                              this.$message({
                                    type: 'info',
                                    message: "加载失败 ：" + res.data.message
                              });
                        })
                   },
      //上传合同附件
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
                console.log("上传图片----------------------------");
                console.log("文件上传成功"+res.data.Url);
                _this.form.ContractAttachmemt = res.data.Url;
                _this.$refs.form.validateField('ContractAttachmemt');
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
      //限制上传数
      handleExceed(files, fileList){
            this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length}个文件`);
      },
      handleRemove(file, fileList) {
            this.form.ContractAttachmemt =''
            this.fileList = fileList;
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
