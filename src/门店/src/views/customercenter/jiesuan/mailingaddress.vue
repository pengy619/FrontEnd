<template>
    <div class="view">
        <el-row class="margin_bottom">
                    <el-button size="small" type="primary" @click="changeDialog">新建</el-button>
        </el-row>
        <el-table :data="mailtabledata" v-loading="loadings" tooltip-effect="dark" size="small">
            <el-table-column type="index" :index="indexMethod" align="center" size="small" label="序号" width="50"></el-table-column>
            <el-table-column property="consignee" size="small" align="center" label="收件人"></el-table-column>
            <el-table-column property="ifDefault" label="默认" align="center" size="small">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.ifDefault" @change="setIsDefaultAddress(scope.row)">&nbsp;</el-checkbox>
                  </template>
            </el-table-column>
            <el-table-column property="address" label="收件地址" align="center" size="small" ></el-table-column>
            <el-table-column property="email" label="邮箱" size="small" align="center" ></el-table-column>
            <el-table-column property="phone" label="收件人电话" size="small" align="center"></el-table-column>
            <el-table-column property="remark" label="备注" size="small" align="center"></el-table-column>
            <el-table-column label="操作" size="small" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="updateAddress(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteAddress(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="text-center margin_top">
                <el-button type="primary" size="small" @click="backmail">确认</el-button>
        </el-row>
        <el-dialog :title="title" v-loading="loadingdialog" :visible.sync="dialogTableVisible" append-to-body :before-close="callbackDialog" style="min-width:500px">
            <el-form  ref="form" :rules="rules" style="min-width:500px" :model="form">
                <el-form-item label="收件人" prop="Consignee" label-width="80px">
                    <el-input class="inputs" v-model="form.Consignee" size="small"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="Email" label-width="80px">
                    <el-input class="inputs" size="small"  v-model="form.Email" ></el-input>
                </el-form-item>
                <el-row :gutter="24">
                    <el-col  style="width:240px;height:55px">
                            <el-form-item label="收件地址" prop="ProvinceName" label-width="80px">
                                <el-select v-model="form.ProvinceName" size="small" class="inputs" id="province" placeholder="  请选择省"  @change="provinceChange">
                                    <el-option v-for="item in ProvinceList" :key="item.id" :label="item.name" :value="item.id+'-'+item.name"></el-option>
                                </el-select>
                            </el-form-item>
                    </el-col>
                        <el-col style="width:240px;height:55px">
                            <el-form-item label="" prop="CityName" label-width="80px">
                                <el-select v-model="form.CityName" size="small" class="inputs" placeholder=" 请选择市" id="city" @change="cityChange">
                                    <el-option v-for="item in CityList" :key="item.id" :label="item.name" :value="item.id+'-'+item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col  style="width:240px;height:55px">
                            <el-form-item label="" prop="DistrictName" label-width="80px">
                                <el-select v-model="form.DistrictName" size="small" class="inputs" placeholder=" 请选择区（县）">
                                    <el-option v-for="item in DistrictList" :key="item.id" :label="item.name" :value="item.id+'-'+item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                </el-row>
                <el-form-item label="" prop="Address" label-width="80px">
                    <el-input size="small" v-model="form.Address" style="max-width:440px" placeholder="详细地址"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="Phone" label-width="80px">
                    <el-input class="inputs"  v-model="form.Phone"  size="small"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="80px">
                    <el-input  type="textarea" v-model="form.Remark"  size="small"></el-input>
                </el-form-item>
                <!-- <el-form-item label-width="80px">
                    <el-checkbox v-model="form.IfDefault" class="inputs">是否设置为默认收货地址</el-checkbox>
                </el-form-item> -->
                <el-form-item label-width="160px">
                    <el-button size="small" type="primary" @click="addNewAddress('form')">提交</el-button>
                    <el-button size="small" type="info" @click="callbackDialog">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
     data(){
         let validatorMail=(rule,value,callback)=>{
             var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
             if(!value){
                callback(new Error('请输入邮箱'));
             }else if(!reg.test(value)){
                callback(new Error('请输入正确的邮箱'));
             }else{
                callback();
             }
         }
         let validatorPhone=(rule,value,callback)=>{
              if(!value){
                callback(new Error('您还没有手机号码'))
              }else if(!(/^1[0-9][0-9]\d{8}$/.test(value))){
                callback(new Error('您的手机号码有误'))
              }else{
                callback();
              }
         }
         let validatorProvinceID = (rule,value,callback)=>{
             if(this.form.ProvinceID===""){
                callback(new Error('请选择省份'));
             }else{
                 callback();
             }
         }
         let validatorCityID = (rule,value,callback)=>{
             if(this.form.CityID===""){
                callback(new Error('请选择城市'));
             }else{
                 callback();
             }
         }
         let validatorDistrictID = (rule,value,callback)=>{
             if(this.form.DistrictName===""){
                callback(new Error('请选择区/县'));
             }else{
                 callback();
             }
         }
         return{
            title:'创建新地址',
            loadings:false,
            loadingdialog:false,
            dialogTableVisible:false,
            mailtabledata:[{
                consignee:'',
                ifDefault:false,
                address:'',
                email:'',
                phone:'',
                remark:''
            }],//列表
            checked:true,//是否默认选中
            ProvinceList: [],  //省
            ProvinceName: '',
            CityList: [],  //城市
            CityName: '',
            DistrictList: [],   //县
            DistrictName: '',
            form:{
                DisSettleClientId:'',//收件人ID写死先
                Consignee:'',//收件人
                ProvinceID: ''  ,
                ProvinceName: '',//省
                CityID: '',
                CityName: '',//市
                DistrictID: '',
                DistrictName: '',//区
                Address:'',//地址
                IfDefault:false,//是否设置默认
                Email:'',//邮箱
                Remark:'',
                Phone:'',
                Id:0
          },
          rules:{
              Consignee:[{required:true,message:'请输入收件人名称',trigger:'blur'}],
              Email:[{required:true,validator:validatorMail,trigger:'blur'}],
              Address:[{required:true,message:'请输入详细地址',trigger:'blur'}],
              Phone:[{required:true,validator:validatorPhone,trigger:'blur'}],
              ProvinceName:[{type:'string',required:true,validator:validatorProvinceID,trigger:'change'}],
              CityName:[{type:'string',required:true,validator:validatorCityID,trigger:'change'}],
              DistrictName:[{type:'string',required:true,validator:validatorDistrictID,trigger:'change'}]
          },
          
         }
     },methods:{
         getDisSettleClientID(){
          if(this.$route.params.DisSettleClientId==undefined){
               //如果是直接刷新页面，那就拿历史数据
                let sessionStoranges = window.sessionStorage.getItem('SettleClientId');
                this.form.DisSettleClientId = sessionStoranges;
          }else{
               this.$store.commit("setgetClientID",this.$route.params.DisSettleClientId);
               this.form.DisSettleClientId = this.$route.params.DisSettleClientId;
          }
        },
            changeDialog(){
                this.title ="创建新地址";
                this.dialogTableVisible = !this.dialogTableVisible;
            },
            CountryChange(){//获取省份
                this.addressHttp.post('/AreaAddress/GetProvince?CountryId=1').then((res)=>{
                        this.ProvinceList = res.data;
                    }).catch((e) => {
                        console.log(e);
                    });
            },
            provinceChange(val){//省份 获取城市
                //console.log("选择省份的时候请求城市:"+val);
                let _this = this;
                _this.form.ProvinceID = val.substring(0,val.lastIndexOf('-'));//赋值省份
                _this.form.ProvinceName = val.substring(val.indexOf("-")+1,val.length);
                //console.log(_this.form.ProvinceID);
                //console.log(_this.form.ProvinceName);
                _this.form.CityName = '';
                _this.form.DistrictName = '';
                _this.addressHttp.post('/AreaAddress/GetCity?ProvinceId=' +  _this.form.ProvinceID).then( (res) =>{
                        _this.CityList = res.data;
                        if(res.status == 200){
                            _this.form.CityID = '';
                        }
                }).catch( (e) => {
                    console.log(e);
                })
            },
            cityChange(val){//城市 获取区县
                let _this = this;
                _this.form.CityID = val.substring(0,val.lastIndexOf('-'));//赋值城市
                _this.form.CityName = val.substring(val.indexOf("-")+1,val.length);
                 //console.log(_this.form.CityID);
                //console.log(_this.form.CityName);
                _this.form.DistrictName = '';
                _this.addressHttp.post('/AreaAddress/GetDistrict?CityId=' + _this.form.CityID).then( (res) =>{
                        _this.DistrictList = res.data;
                }).catch( (e) => {
                    console.log(e);
                })
            },
            indexMethod(index){
                return index *1+1;
            },
            getMailaddressList(){
                var _this = this;//这里的DisSettleClientId暂时写死
                _this.loadings=true;
                _this.shopHttp.get('/SettleClient/GetSettleClientPostalList?DisSettleClientId='+_this.form.DisSettleClientId+'&PageSize='+10+"&PageIndex="+1).then(res=>{
                    //console.log(res);
                    if(res.data.isSuccess){
                       _this.mailtabledata = res.data.objects;
                    }else{
                        _this.$message({type:'info',message:'邮寄地址列表获取失败'});
                    }
                    _this.loadings=false;
                }).catch(err=>{
                    console.log(err);
                    _this.loadings=false;
                    _this.$message({type:'info',message:'邮寄地址列表获取失败'});
                })
            },
            setIsDefaultAddress(row){
               //设置默认地址选项
               var _this = this;
                this.$confirm('请确认是否将此地址设置为默认地址?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        _this.shopHttp.get('/SettleClient/SettingSettleClientPostal?InvoiceId='+row.id+"&SettleClientId="+_this.form.DisSettleClientId).then(res=>{
                            //console.log(res);
                            if(res.data.isSuccess){
                                _this.$message("设置成功");
                                _this.getMailaddressList();
                            }else{
                                _this.$message("设置失败");
                            }
                            }).catch(err=>{
                                console.log(err);
                                    _this.$message("设置失败");
                            })
                    }).catch(() => {
                        row.ifDefault = false;
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });          
                    });
              
            },
            addNewAddress(updataform){
                //添加新地址

                 this.$refs[updataform].validate((valid) => {
                    if (valid) {
                        var _this = this;
                        let distrname = _this.form.DistrictName;
                       // console.log(distrname.indexOf('-'));
                        if(distrname.indexOf('-')>0){
                           _this.form.DistrictID = distrname.substring(0,distrname.lastIndexOf('-'));//赋值区县
                           _this.form.DistrictName = distrname.substring(distrname.indexOf("-")+1,distrname.length);
                        }
                        _this.shopHttp.post("/SettleClient/SettlePostalInsertOrEdit",_this.form).then(res=>{
                            //console.log(res);
                            if(res.data.isSuccess){
                                _this.dialogTableVisible=false;
                                _this.getMailaddressList();
                                _this.callbackDialog();
                                if(_this.title=="创建新地址"){
                                    _this.$message("新增结算单位邮寄地址成功");
                                }else{
                                    _this.$message("编辑结算单位邮寄地址成功");
                                }
                               
                            }else{
                                if(_this.title=="创建新地址"){
                                    _this.$message("新增结算单位邮寄地址失败");
                                }else{
                                    _this.$message("编辑结算单位邮寄地址失败");
                                }
                            }
                        }).catch(err=>{
                            console.log(err);
                            if(_this.title=="创建新地址"){
                                    _this.$message("新增结算单位邮寄地址失败");
                                }else{
                                    _this.$message("编辑结算单位邮寄地址失败");
                                }
                        })
                    } else {
                        return false;
                    }
                });
            },
            updateAddress(row){
                this.title ="编辑邮寄地址";
                if(!this.dialogTableVisible){
                    this.dialogTableVisible=true;
                }
                var _this = this;
                _this.loadingdialog = true;
                _this.shopHttp.get("/SettleClient/GetSettleClientPostal?PostalId="+row.id).then(res=>{
                   // console.log(res);
                    if(res.data.isSuccess){
                        //this.form.DisSettleClientId='1036',//
                        _this.form.Consignee=res.data.objects[0].consignee;//收件人
                        _this.form.ProvinceID = res.data.objects[0].provinceID;
                        _this.form.ProvinceName=res.data.objects[0].provinceName;//省
                        _this.form.CityID = res.data.objects[0].cityID;
                        _this.form.CityName=res.data.objects[0].cityName;
                        _this.form.DistrictID = res.data.objects[0].districtID;
                        _this.form.DistrictName=res.data.objects[0].districtName;
                        _this.form.Address=res.data.objects[0].address
                        _this.form.IfDefault=res.data.objects[0].ifDefault;//是否设置默认
                        _this.form.Email=res.data.objects[0].email;
                        _this.form.Remark=res.data.objects[0].remark;
                        _this.form.Phone=res.data.objects[0].phone;
                        _this.form.Id = row.id;
                    }
                    _this.loadingdialog = false;
                }).catch(err=>{
                    console.log(err);
                    _this.loadingdialog = false;
                })

                
            },
            callbackDialog(){
                //console.log('打印看看');
                this.form.Consignee="";//收件人
                this.form.ProvinceID = "";
                this.form.ProvinceName="";//省
                this.form.CityID = "";
                this.form.CityName="";
                this.form.DistrictID = "";
                this.form.DistrictName="";
                this.form.Address="";
                this.form.IfDefault=false;//是否设置默认
                this.form.Email="";
                this.form.Remark="";
                this.form.Phone="";
                this.dialogTableVisible = false;
            },
            deleteAddress(row){
              //删除邮寄地址
            var _this = this;
             _this.$confirm('请确认是否删除?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
                   _this.shopHttp.get('/SettleClient/DeleteSettleClientPostal?PostalIds='+row.id).then(res=>{
                        //console.log(res);
                        if(res.data.isSuccess){
                        _this.$message("删除成功");
                        _this.getMailaddressList();
                        }else{
                            _this.$message("删除失败");
                        }
                    }).catch(err=>{
                        console.log(err);
                        _this.$message("删除失败");
                    })
            }).catch(() => {
                this.$message({ type: 'info',message: '已取消删除'});          
            });


           
            },
           backmail(){
               this.$router.go(-1);
           }
     },
     mounted:function(){
        this.getDisSettleClientID();
        this.CountryChange();
       this.getMailaddressList();
     }

}
</script>

<style lang="scss" scoped>
</style>
