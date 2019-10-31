<template>
    <div class="view">
        <el-row class="margin_bottom">
            <el-button size="small" type="primary" @click="addBankinfo">新建</el-button>
        </el-row>
        <el-table :data="banklistObj" v-loading="loadingtable" tooltip-effect="dark" size="small">
            <el-table-column type="index" :index="indexMethod" size="small" label="编号" align="center" width="50"></el-table-column>
            <el-table-column property="bankName" size="small" label="银行名称" align="center"></el-table-column>
            <el-table-column property="bank" label="开户行" size="small" align="center">
            </el-table-column>
            <el-table-column property="cardholder" label="账户名" size="small" align="center"></el-table-column>
            <el-table-column property="alias" label="别名" size="small" align="center"></el-table-column>
            <el-table-column property="cardClass" label="卡类" size="small" align="center"></el-table-column>
            <el-table-column property="cardNO" label="账号" size="small" align="center"></el-table-column>
            <el-table-column property="currency" label="币种" size="small" align="center"></el-table-column>
            <el-table-column property="remarks" label="备注" size="small" align="center"></el-table-column>
            <el-table-column label="操作" size="small" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="getBankinfo_update(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteBankinfo(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination"
                @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="PageIndex"
            :page-sizes="[10]"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
         <el-row class="text-center">
                <el-button type="primary" size="small" @click="backmail">确认</el-button>
        </el-row>
        <el-dialog :title="title" :visible.sync="dialogTableVisible" append-to-body :before-close="callbackDialog" style="min-width:500px;">
            <el-form style="min-width:500px" :rules="rules" :model="bankform" ref="bankform">
                <el-row :gutter="24">
                   <el-col :span="10" style="width:300px;height:50px">
                       <el-form-item label="银行名称" prop="BankName" label-width="80px">
                             <el-select v-model="bankform.BankName" size="small" style="width:200px">
                                <el-option v-for="item in banklist" :key="item.key" :value="item.key" :label="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="80px"></el-form-item>
                   </el-col>
                   <el-col :span="10" style="width:300px;height:50px">
                       <el-form-item label="开户行" prop="Bank" label-width="80px">
                           <el-input v-model="bankform.Bank" size="small" style="width:200px" ></el-input>
                        </el-form-item>
                   </el-col>
                </el-row>
                <el-row :gutter="24">
                   <el-col :span="10" style="width:300px;height:50px">
                       <el-form-item label="账户名" prop="Cardholder" label-width="80px">
                            <el-input v-model="bankform.Cardholder" size="small" style="width:200px" ></el-input>
                        </el-form-item>
                   </el-col>
                   <el-col :span="10" style="width:300px;height:50px">
                        <el-form-item label="别名" label-width="80px">
                            <el-input v-model="bankform.Alias" size="small" style="width:200px" ></el-input>
                        </el-form-item>
                   </el-col>
                </el-row>
                <el-row :gutter="24">
                   <el-col :span="10" style="width:300px;height:50px">
                       <el-form-item label="卡类" prop="CardClass" label-width="80px">
                            <el-select v-model="bankform.CardClass" size="small"  style="width:200px">
                                <el-option v-for="item in cardlist" :key="item.key" :value="item.value" :label="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                   </el-col>
                   <el-col :span="10" style="width:300px;height:50px">
                       <el-form-item label="币种" prop="Currency" label-width="80px">
                            <el-select v-model="bankform.Currency" size="small" style="width:200px">
                                <el-option v-for="item in currencylist" :key="item.id" :value="item.currencyName" :label="item.currencyName"></el-option>
                            </el-select>
                        </el-form-item>
                   </el-col>
                </el-row>
               <el-form-item label="账号" prop="CardNO" label-width="80px">
                    <el-input v-model="bankform.CardNO" size="small" style="width:200px" ></el-input>
                </el-form-item>
                
                <el-form-item label="备注" label-width="80px">
                    <el-input v-model="bankform.Remarks" size="small" type="textarea"  ></el-input>
                </el-form-item>
                <el-form-item label-width="160px">
                    <el-button size="small" type="primary" @click="Bankinfo('bankform')">提交</el-button>
                    <el-button size="small" type="info" @click="callbackDialog">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>  
</template>

<script>
// import bankobj from '@/utils/bankreg.js'
export default {
     data(){
         let validatorCardNO = (rule,value,callback)=>{
             let reg =new RegExp( '^[1-9]{1}([0-9]{15,19})$');
             let hanzireg = new RegExp('^[A-Za-z]*$');
             if(!value){
                callback(new Error('请输入账号'));
             }else if(hanzireg.test(value)){
                 callback(new Error('请输入纯数字银行账号'));
             }else if(!reg.test(value)){
                callback(new Error('请输入纯数字银行账号'));
             }else{
                 callback();
             }
         }
         return{
            title:'创建新银行信息',
            dialogTableVisible:false,
            loadingtable:false,
            banklistObj:[{}],//列表
            //SettleClientId:1041,//从结算列表传过来
            PageSize:10,
            PageIndex:1,
            total:0,
            bankform:{
                Alias:'',//别名
                CardClass:'',//卡类
                Bank:'',//开户行
                BankName:'',//银行名称
                CardNO:'',//银行卡号
                Currency:'',//币种
                Cardholder:'',//持卡人姓名
                SettleClientId:'',//结算单位ID--先写死
                Remarks:'',//备注
                Id:0
            },
            currencylist:[{}],//币种
            cardlist:[{}],//财务卡类
            banklist:[{}],//财务银行
            rules:{
                BankName:[{required:true,message:'请选择银行名称',trigger:'change'}],
                Bank:[{required:true,message:'请输入开户行',trigger:'blur'}],
                Cardholder:[{required:true,message:'请输入账户名',trigger:'blur'}],
                CardClass:[{type:'string',required:true,message:'请选择卡类',trigger:'change'}],
                CardNO:[{required:true,validator:validatorCardNO,trigger:'blur'}],
                Currency:[{type:'string',required:true,message:'请选择币种',trigger:'change'}],
            }
         }
     },
     methods:{
         getDisSettleClientID(){
        //    console.log(this.$route.params.DisSettleClientId);
        //   if(this.$route.params.DisSettleClientId==undefined){
        //         this.bankform.SettleClientId = "";
        //   }else{
        //         this.bankform.SettleClientId = this.$route.params.DisSettleClientId;
        //   }
         if(this.$route.params.DisSettleClientId==undefined){
               //如果是直接刷新页面，那就拿历史数据
                let sessionStoranges = window.sessionStorage.getItem('SettleClientId');
                this.bankform.SettleClientId = sessionStoranges;
          }else{
               this.$store.commit("setgetClientID",this.$route.params.DisSettleClientId);
               this.bankform.SettleClientId = this.$route.params.DisSettleClientId;
          }
        },
         addBankinfo(){
            this.title = '创建新银行信息';
            this.dialogTableVisible = !this.dialogTableVisible;
           
         },
         Bankinfo(setBankinfo){
            var _this = this;
            _this.$refs[setBankinfo].validate((valid)=>{
                 if(valid){
                      _this.shopHttp.post("SettleClient/CreateSettleBankCard",_this.bankform).then(res=>{
                        //console.log(res);
                        if(res.data.isSuccess){
                            this.dialogTableVisible = false;
                           _this.getBankList();
                           _this.callbackDialog();
                           if(_this.title==='创建新银行信息'){
                                _this.$message("新建银行账号成功");
                           }else{
                               _this.$message("修改银行信息成功");
                           }
                           
                        }else{
                            if(_this.title==='创建新银行信息'){
                                _this.$message("新建银行账号失败");
                           }else{
                               _this.$message("修改银行信息失败");
                           }
                        }
                        }).catch(er=>{
                            console.log(er);
                              if(_this.title==='创建新银行信息'){
                                _this.$message("新建银行账号失败");
                           }else{
                               _this.$message("修改银行信息失败");
                           }
                        });
                 }else{
                     return false;
                 }
            });
           
         },
         deleteBankinfo(row){
            //删除银行账号信息
            var _this = this;
            _this.$confirm('请确认是否删除?',"提示",{confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(()=>{
                _this.shopHttp.post("/SettleClient/DeleteSettleBankCard",{
                    DeleteBankCardId:row.id,
                    SettleClientId:_this.bankform.SettleClientId
                }).then(res=>{
                    //console.log(res);
                    if(res.data.isSuccess){
                        _this.$message("删除成功");
                    _this.getBankList();
                    }else{
                        _this.$message("删除失败");
                    }
                }).catch(err=>{
                    console.log(err);
                    _this.$message("删除失败");
                })
            }).catch(()=>{
                 this.$message({ type: 'info',message: '已取消删除'});   
            });
           
         },
         getBankinfo_update(row){
             var _this = this;//获取结算银行信息，进行编辑
             _this.shopHttp.get("/SettleClient/GetSettleBankCard?BankCardId="+row.id).then(res=>{
                // console.log(res);
                if(res.data.isSuccess){
                    _this.bankform.Alias=res.data.objects[0].alias;//别名
                    _this.bankform.CardClass=res.data.objects[0].cardClass;//卡类
                    _this.bankform.Bank=res.data.objects[0].bank;//开户行
                    _this.bankform.BankName=res.data.objects[0].bankName;//银行名称
                    _this.bankform.CardNO=res.data.objects[0].cardNO;//银行卡号
                    _this.bankform.Currency=res.data.objects[0].currency;//币种
                    _this.bankform.Cardholder=res.data.objects[0].cardholder;//持卡人姓名
                    _this.bankform.Remarks=res.data.objects[0].remarks;//备注
                    _this.bankform.Id = row.id;
                    _this.dialogTableVisible = true;
                    _this.title = '编辑银行信息'
                }
            }).catch(err=>{
                console.log(err);
            })
         },
         getBankList(){
             //获取结算单位银行列表
             var _this = this;
             _this.loadingtable = true;
             _this.shopHttp.get('/SettleClient/GetSettleBankCardList?SettleClientId='+_this.bankform.SettleClientId+"&PageSize="+_this.PageSize+"&PageIndex="+_this.PageIndex).then(res=>{
                //console.log(res);
                if(res.data.isSuccess){
                    _this.total = res.data.total;
                    _this.banklistObj = res.data.objects;
                }else{
                    _this.$message("获取银行列表数据失败");
                }
                _this.loadingtable = false;
             }).catch(err=>{
                 console.log(err);
                 _this.loadingtable = false;
                  _this.$message("获取银行列表数据失败");
             })
         },
         getCurrencylist(){
             //获取币种
             var _this =this ;
             _this.shopHttp.get('/Finance/GetCurrency').then(res=>{
                 if(res.data.isSuccess){
                   _this.currencylist = res.data.objects;
                 }
             }).catch(err=>{
                 console.log(err);
             });
         },
          getCardlist(){
             //获取财务卡类
             var _this =this ;
             _this.shopHttp.get('/Finance/GetFinCardTypeList').then(res=>{
                 if(res.data.isSuccess){
                    _this.cardlist = res.data.objects;
                 }
             }).catch(err=>{
                 console.log(err);
             });
         },
          getBanklist(){
             //获取财务银行
             var _this =this ;
             _this.shopHttp.get('/Finance/GetFinBankList').then(res=>{
                 if(res.data.isSuccess){
                    _this.banklist = res.data.objects;
                 }
             }).catch(err=>{
                 console.log(err);
             });
         },
         callbackDialog(){
            this.bankform.Alias='';//别名
            this.bankform.CardClass='';//卡类
            this.bankform.Bank='';//开户行
            this.bankform.BankName='';//银行名称
            this.bankform.CardNO='';//银行卡号
            this.bankform.Currency='';//币种
            this.bankform.Cardholder='';//持卡人姓名
            this.bankform.Remarks=''//备注
             this.dialogTableVisible = false;
         },
         indexMethod(index){
             return index *1+1;
         },
         handleSizeChange(val){
            this.PageSize = val;
            this.getBankList();
         },
         handleCurrentChange(val){//分页
            this.PageIndex = val;
            this.getBankList();
         },
         backmail(){
               this.$router.go(-1);
           }
     },
     mounted(){
        this.getDisSettleClientID();
        this.getCurrencylist();
        this.getCardlist();
        this.getBanklist();
        this.getBankList();
     }
}
</script>

<style lang="scss" scoped>
</style>
