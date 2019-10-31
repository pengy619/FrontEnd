<template>
    <div id="box" class="view">
        <span class="mysapn"><span class="verticals">| </span>发票信息</span>
        <hr/>
        <el-row :gutter="24">
            <el-col :span="24" style="width:200px;height:50px">
                <div style="position: absolute;right:8px;top:5px;">
                    <el-button size="small" type="primary" @click="setIncoice">新建</el-button>
                    <!-- <el-button size="small" type="info">导出Excel</el-button> -->
                </div>
            </el-col>
        </el-row>
        <el-table algin="center" :data="InvoiceInfo.table" style="width: 100%">
            <el-table-column align="center" prop="select" label="序号" type="index" width="50"></el-table-column>
            <el-table-column align="center" prop="companyName" label="单位" > </el-table-column>
            <el-table-column align="center" prop="IfDefault" label="默认" width="50">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.ifDefault" @change="setIsDefaultAddress(scope.row)">&nbsp;</el-checkbox>
                  </template>
            </el-table-column>
            <el-table-column align="center" prop="companyTax" label="公司税号" > </el-table-column>
            <el-table-column align="center" prop="companyAddress" label="公司地址" ></el-table-column>
            <el-table-column align="center" prop="accountNo" label="银行账号" > </el-table-column>
            <el-table-column align="center" prop="openingBank" label="开户行" ></el-table-column>
            <el-table-column align="center" prop="phone" label="公司电话" > </el-table-column>
            <el-table-column align="center"  label="操作" fixed="right" width="120px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="details(scope.row)">编辑</el-button>
                    <el-button type="text" size="mini" @click="cancel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog append-to-body :title="title" :visible.sync="dialogVisible22" @close="cancelList('InvoiceInfoList')" width="800px">
            <el-form ref="InvoiceInfoList"  :rules="rules" size="small" :model="InvoiceInfoList" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="10" style="height:50px"> 
                        <el-form-item label="公司名称" prop="CompanyName">
                            <el-input v-model="InvoiceInfoList.CompanyName"  class="form-inline-input"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" style="height:50px">
                        <el-form-item label="公司税号" prop="CompanyTax">
                            <el-input :maxlength="20" v-model="InvoiceInfoList.CompanyTax" class="form-inline-input"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" style="height:50px"> 
                        <el-form-item label="开户行" prop="OpeningBank">
                            <el-input v-model="InvoiceInfoList.OpeningBank" class="form-inline-input"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" style="height:50px">
                        <el-form-item label="银行账号" prop="AccountNo">
                            <el-input :maxlength="20"  v-model="InvoiceInfoList.AccountNo" class="form-inline-input"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" style="height:50px"> 
                        <el-form-item label="公司电话" prop="Phone">
                            <el-input :maxlength="20"  v-model="InvoiceInfoList.Phone" class="form-inline-input"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col style="width:240px;height:50px"> 
                        <el-form-item label="公司地址" prop="ProvinceID">
                            <el-select v-model="InvoiceInfoList.ProvinceID" size="small" placeholder=" 请选择省" @change="provinceChange" id="ad-input">
                                <el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="width:240px;height:50px">
                        <el-form-item label-width="10px" prop="CityID">
                              <el-select v-model="InvoiceInfoList.CityID" placeholder="市"  @change="cityChange">
                                    <el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="width:240px;height:50px">
                        <el-form-item label-width="10px" prop="DistrictID">
                            <el-select v-model="InvoiceInfoList.DistrictID" placeholder=" 请选择区（县）" id="ad-inputDistrictID">
                                <el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" style="height:50px"> 
                        <el-form-item label="详细地址" prop="Address">
                            <el-input v-model="InvoiceInfoList.Address" placeholder=" 请填写详情地址" class="form-inline-input"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-form-item label-width="80px">
                    <el-checkbox v-model="form.IfDefault" class="inputs">是否设置为默认</el-checkbox>
                </el-form-item> -->
                <el-form-item label-width="160px">
                    <el-button size="small" type="primary" @click="submitInvoice('InvoiceInfoList')">提交</el-button>
                    <el-button size="small" type="info" @click="cancelList('InvoiceInfoList')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        let number=(rule,value,callback)=>{
            if(!value){
                callback(new Error('请输入银行账号'))
              }else  if (isNaN(parseInt(value))) {
                  callback(new Error('银行账号必须为数字'));
                  }else{
                      callback()
                  }
            }
            let phoneCheck=(rule,value,callback)=>{
            if(!value){
                callback(new Error('请输入公司电话'))
              }else  if (isNaN(parseInt(value))) {
                  callback(new Error('公司电话必须为数字'));
                  }else{
                      callback()
                  }
            }
            let CompanyTax=(rule,value,callback)=>{
            if(!value){
                callback(new Error('请输入公司税号'))
              }else  if (isNaN(parseInt(value))) {
                  callback(new Error('公司税号必须为数字'));
               }else{
                   callback();
               }
            }
        return{
            dialogVisible22: false,
            loadingdialog: false,
            title: '',
            first: false,
            InvoiceInfoList:{
                DisSettleClientId: '',   //这个值暂时写死     
                CompanyName: '',
                CompanyTax: '',
                AccountNo: '',
                OpeningBank: '',
                Phone: '',
                ProvinceID: '',
                ProvinceName: '',
                CityID: '',
                CityName: '',
                DistrictID: '',
                DistrictName: '',
                CompanyAddress: '',
                IfDefault: false,
                Address: '',
            },
            InvoiceInfoTemp:{},
            InvoiceInfo:{
                table: [{}],
            },
            ProvinceList: [],
            CityList: [],
            DistrictList: [],
            rules:{
                CompanyName:[{required: true, message: '请填写公司名称', trigger: 'blur'}],
                CompanyTax:[{required: true, validator:CompanyTax, trigger: 'blur'}],
                CompanyAddress:[{required: true, message: '请选择地址地址', trigger: 'change'}],
                AccountNo: [{required: true, validator:number, trigger: 'blur'}],
                OpeningBank:[{required: true, message: '请填写开户行', trigger: 'blur'}],
                Phone: [{required: true, validator:phoneCheck, trigger: 'blur',}],
                Address:[{required: true, message: '请填写详细地址', trigger: 'blur'}],
                ProvinceID: [{type: 'number',required:true, message: '请选择省',trigger:'change'}],
                CityID:[{type: 'number',required:true, message: '请选择市',trigger:'change'}],
                DistrictID:[{type: 'number',required:true, message: '请选择市（区）',trigger:'change'}],
            },
        }
    },
    mounted (){
        this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
                    this.ProvinceList = res.data;
                   }).catch((e) => {
                    console.log(e);
                  })
        this.getInvoiceInfo();
        this.InvoiceInfoTemp = JSON.parse(JSON.stringify(this.InvoiceInfoList))
    },
    methods:{
        //新增发票信息
        setIncoice(){
            this.title ="创建发票";
            this.dialogVisible22 = true ;
        },
        //取消按钮
        cancelList(formName){
            this.$refs[formName].resetFields();
            this.dialogVisible22 = false ;
        },
        // 发票信息列表
        getInvoiceInfo(){
            this.InvoiceInfoList.DisSettleClientId = this.$route.params.id
            this.shopHttp.get("SettleClient/GetSettleClientInvoiceList?DisSettleClientId="+
            this.$route.params.id+
            "&PageSize="+10+"&PageIndex="+1).then(res =>{
            this.InvoiceInfo.table = res.data.objects;
            })
        },
        // 创建发票信息
        submitInvoice(InvoiceName){
            this.$refs[InvoiceName].validate((valid) =>{
                     if(valid){

                     }else{
                           return false;
                     }
               })
            this.ProvinceList.forEach((item) => {
                if(item.id == this.InvoiceInfoList.ProvinceID){
                    this.InvoiceInfoList.ProvinceName = item.name;
                }
            })
            this.CityList.forEach((item) => {
                if(item.id == this.InvoiceInfoList.CityID){
                    this.InvoiceInfoList.CityName = item.name;
                }
            })
            this.DistrictList.forEach((item) => {
                if(item.id == this.InvoiceInfoList.DistrictID){
                    this.InvoiceInfoList.DistrictName = item.name;
                }
            })
            this.shopHttp.post('SettleClient/SettleClientInsertOrEdit',this.InvoiceInfoList).then(res =>{
                if(res.data.isSuccess == true){
                    this.dialogVisible22 = false;
                    this.getInvoiceInfo();
                }else{
                    //console.log(e);
                }
            })
        },
        setIsDefaultAddress(row){
               //设置默认发票信息选项
                this.$confirm('请确认是否将此发票信息设置为默认信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.shopHttp.post('SettleClient/SettingSettleClientInvoice?InvoiceId='+row.id+
                        "&SettleClientId="+this.$route.params.id).then(res=>{
                            //console.log(res);
                                if(res.data.isSuccess){
                                    this.$message("设置成功");
                                    this.getInvoiceInfo();
                                }else{
                                    this.$message("设置失败");
                                }
                            }).catch(err=>{
                                console.log(err);
                                    this.$message("设置失败");
                            })
                    }).catch(() => {
                        row.ifDefault = false;
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });          
                    });
              
            },
        //发票信息修改
        details(row){
            this.first = true;
            this.senced = true;
            this.tlttle = "编辑发票信息"
            this.dialogVisible22 = true ;
            this.shopHttp.get("SettleClient/GetSettleClientInvoiceInfo?InvoiceId="+row.id).then((res)=>{
                    if(res.data.isSuccess == true){
                        this.provinceChange(res.data.objects[0].provinceID)
                        this.cityChange(res.data.objects[0].cityID)
                        this.InvoiceInfoList.CompanyName=res.data.objects[0].companyName;//收件人
                        this.InvoiceInfoList.ProvinceID = res.data.objects[0].provinceID;
                        this.InvoiceInfoList.ProvinceName=res.data.objects[0].provinceName;//省
                        this.InvoiceInfoList.CityID = res.data.objects[0].cityID;
                        this.InvoiceInfoList.CityName=res.data.objects[0].cityName;
                        this.InvoiceInfoList.DistrictID = res.data.objects[0].districtID;
                        this.InvoiceInfoList.DistrictName=res.data.objects[0].districtName;
                        this.InvoiceInfoList.Address=res.data.objects[0].address
                        this.InvoiceInfoList.IfDefault=res.data.objects[0].ifDefault;//是否设置默认
                        this.InvoiceInfoList.AccountNo=res.data.objects[0].accountNo;
                        this.InvoiceInfoList.OpeningBank=res.data.objects[0].openingBank;
                        this.InvoiceInfoList.Phone=res.data.objects[0].phone;
                        this.InvoiceInfoList.CompanyTax=res.data.objects[0].companyTax;
                        this.InvoiceInfoList.DisSettleClientId=res.data.objects[0].DisSettleClientId; 
                        this.InvoiceInfoList.id = res.data.objects[0].id
                    }
                   }).catch((e) => {
                    console.log(e);
                  })
        },
        // 删除发票信息
        cancel(row){
             this.$confirm('确定删除该条数据?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning'
                 }).then(() => {
                     this.shopHttp.get("SettleClient/DeleteSettleClientInvoice?InvoiceIds="+row.id).then((res)=>{
                         if(res.data.isSuccess == true){
                             this.getInvoiceInfo();
                             this.$message({
                                 type:'success',
                                 message:'成功，删除发票信息成功！'
                             })
                         }
                        }).catch((e) => {
                        console.log(e);
                     })
                }).catch(() => {
                    this.$message({
                                 type:'info',
                                 message:'取消成功！'
                             })
            });
        },
        provinceChange(val){
            this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' + val).then( (res) =>{
                    this.CityList = res.data;
                    if(this.first){
                        this.first = false ;
                    }else {
                        this.InvoiceInfoList.CityID = "";
                        this.InvoiceInfoList.DistrictID = "";
                    }
              }).catch( (e) => {
                  console.log(e);
              })
        },
        cityChange(val){
              this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + val).then( (res) =>{
                    this.DistrictList = res.data;
                    if(this.senced){
                        this.senced = false ;
                    }else {
                        this.InvoiceInfoList.DistrictID = "";
                    }
              }).catch( (e) => {
                  console.log(e);
              })
        },
    }
}
</script>

<style lang="scss" scoped>
     .form-inline-input{
         width: 200px;
     }
     #ad-input{
         width: 200px;
     }
</style>