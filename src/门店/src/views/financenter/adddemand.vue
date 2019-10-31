
<template>
    <div class="view">
        <el-form  :inline="true" size="small" label-width="100px">
            
            <el-form-item label="缴款状态" >
                <el-select v-model="PayStatus" size="small" class="inputs">
                    <el-option value="" label="全部"></el-option>
                    <el-option value="0" label="未缴款"></el-option>
                    <el-option value="1" label="缴款中"></el-option>
                    <el-option value="3" label="已确认"></el-option>
                    <el-option value="2" label="已缴款"></el-option>
                    
                </el-select>
            </el-form-item>
                <el-form-item label="收款编号" >
                <el-input class="inputs" size="small" v-model="FeeNo"></el-input>
            </el-form-item>
            <el-form-item label="联系人" label-width="90px">
                <el-input class="inputs" size="small" v-model="LinkMan"></el-input>
            </el-form-item>
            <el-form-item label="结算单位" >
                <el-input class="inputs" size="small" v-model="DisSettleClientName"></el-input>
            </el-form-item>
            <el-form-item label="收款人" >
                <el-input class="inputs" size="small" v-model="Handler"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" icon="el-icon-search" size="small" @click='queryData()'>查询</el-button>
            </el-form-item>
        </el-form>
         <el-row class="margin_bottom">
                  <el-button type="primary" @click="setDemanddialogvisit"  size="small">建立缴款单</el-button>
                  <el-button @click="handleExport"  size="small">导出Excel</el-button>
         </el-row>
               <el-table :data="demandtabledata"  size="small" v-loading="loading2"
                          @select="getrowdata" tooltip-effect="dark" style="width: 100%">
                        <el-table-column label="序号" type="selection" size="small" fixed="left" width="55" align="center"  >
                        </el-table-column>
                        <el-table-column prop="disSettleClientName" label="结算单位" size="small" align="center" >
                        </el-table-column>
                        <el-table-column prop="linkMan"  size="small" align="center" label="联系人" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="feeNo" size="small" label="收款编号" align="center" width="200" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="feeAmount" :formatter="fixmoney" size="small" label="收款金额" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="feeMethodName" size="small" label="收款方式" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="feeDateFormat" size="small" label="收款时间" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="handler"  size="small" label="收款人" align="center" show-overflow-tooltip>
                        </el-table-column>
                         <el-table-column prop="confirmUser"  size="small" label="收款确认人" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="payStatusName" label="缴款状态" size="small" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="feeSerialNo" fixed="right" size="small" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="checkAccessory(scope.row)">详细</el-button>
                                <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cusid" label="id" size="small" align="center" v-if="flag">
                        </el-table-column>
                        <el-table-column prop="feeType" label="id" size="small" align="center" v-if="flag">
                        </el-table-column>
                    </el-table>
            <div class="pagination">
            <el-pagination
                fixed="right"
                :data = 'pagination'
                @size-change="sizeChange"
                @current-change="currentPageChange"
                :current-page="pagination.currentPage"
                :page-sizes="pagination.sizes"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
         <el-dialog title="缴款账单" :visible.sync="dialogFormVisible"  :modal-append-to-body="false">
            <el-form :model="adddemandform.Object" :rules="rules" ref="adddemandform.Object">
                <el-form-item label="缴款日期"  prop="PayDate" label-width="120px">
                    <!-- <el-input v-model="adddemandform.Object.PayDate" auto-complete="off"></el-input> -->
                    <el-date-picker
                        size="small" style="min-width:400px"
                        v-model="adddemandform.Object.PayDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="缴款方式"  prop="PayMethod"  label-width="120px">
                    <el-select v-model="adddemandform.Object.PayMethod" style="min-width:400px" size="small" @change="getPaymethodcall" placeholder="请选择收款方式">
                        <el-option v-for="item in PaymethodObj" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行名称" v-if="isShowBank" prop="BankAccountId"  size="small" label-width="120px">
                    <el-select  placeholder="请选择银行名称" v-model="adddemandform.Object.BankAccountId" style="min-width:400px">
                        <el-option v-for="item in BankAccountObj" :key="item.id" :value="item.id" :label="item.bankName+'-'+item.openingBank+'-'+item.accountNo"></el-option>
                        </el-select>
                </el-form-item>
                    <!-- <el-form-item label="缴款金额"  size="small"  prop="payAmount" label-width="120px">
                    <el-input v-model="adddemandform.Object.payAmount" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="缴款人"  size="small"  prop="Payer" label-width="120px">
                    <el-input v-model="adddemandform.Object.Payer" style="min-width:400px" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="备注"  size="small" label-width="120px">
                    <el-input type="textarea" v-model="adddemandform.Object.Remark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer mydialogfooter">
                <el-button @click="dialogFormVisible=false"  size="small">取 消</el-button>
                <el-button type="primary" @click="setDemandcheck"  size="small">确 定</el-button>
            </div>
            </el-dialog>
    </div>
</template>

<script>
export default {// 缴款申请
    
      data(){
          let moneyvalidator = (rule,value,callback) =>{
          let reg =/^\d+(?:\.\d{1,2})?$/;
          if(!value){
              callback(new Error("金额不能为空"));
          }else if(!reg.test(value)){
              callback(new Error("金额必须为正数，且仅保留两位小数"));
          }else{
              callback();
          }
      }
          return{
              //分页
                pagination:{
                    sizes:[5,10,20,50],
                    size:10,
                    currentPage: 1,
                    total:0
                },
                DisSettleClientName:'',//结算单位
                FeeNo:'',//收款编号
                PayStatus:'',//缴款状态
                FeeStatus:'',//确认状态
                Handler:'',//收款人
                LinkMan:'',//联系人
                loading2:false,
                currentPage4:1,//当前页
                demandtabledata: [{
                    storePayNo: '1',//缴款编号
                    invoiceStatusName: '',//发票 是否开发票
                    feeStatusName:'',//状态
                     disSettleClientName:'',
                     feeAmount:'',
                    //feeMethod:'',//手续费
                    feeMethodName:'',//收款方式
                    feeSerialNo:'',//收款流水号
                    feeDateFormat:'',//收款时间
                    feeChannelName:'',//收款渠道
                    feeNo:'',//收款单号
                    cusid:'',
                    feeType:''
                    }],
                    PaymethodObj:[],
                    BankAccountObj:[],//银行账号
                    dialogFormVisible: false,
                    adddemandform: {
                           Object:{
                            PayDate: '',//缴款日期
                            PayMethod: '',//收款方式
                            BankAccountId:'',//银行账号--后续要改成下拉菜单
                            //payAmount:'',//缴款金额
                            Payer: '',//缴款人、
                            Remark: ''//备注
                            },
                            CusFeeIds:[]//这个用来存储被选中的数据
                    },
                    temporaryObj:[],//用来存储临时数据，判断是否添加缴款单的
                     feelist:{
                        PageIndex:0,
                        PageSize:10,
                        starttime:'',
                        demandsearchnum:''
                     },
                    isShowBank:false,//用于设置银行账号是否需要显示
                    flag:false,//这个用于设置隐藏列
                    dialogVisible:false,
                    dialogImageUrl:'',
                    demandurl:'/CustomerFee/GetCustomerFeePageList?',
                    rules:{
                        PayDate:[{required:true,message:'请选择缴款日期',trigger:'change'}],
                        PayMethod:[{required:true,message:"请选择转账方式",type:'number', trigger:'blur' }],
                        Payer:[{required:true,message:'请输入缴款人',trigger:'blur'}],
                        //payAmount:[{required:true,validator:moneyvalidator,type:'number'}],
                        BankAccountId:[{required:true,message:'请选择银行账号',type:'number',trigger:'blur'}]
                    }
          }
      },mounted:function(){
           this.getPaymethods();
        //   this.getDemandlist();
           this.getBanklist();
           this.queryData()
      },
      methods:{
          //导出
          handleExport(){
            let WEB_API=process.env.WEB_API;
            let url=WEB_API+"/StorePay/GetWaitCustomerFeeToExcel?PageSize="+this.pagination.size+"&PageIndex="+this.pagination.currentPage+"&FeeStatus="+
              this.FeeStatus + "&PayStatus=" + this.PayStatus + "&FeeNo=" + this.FeeNo + "&DisSettleClientName=" + this.DisSettleClientName + "&LinkMan=" + this.LinkMan
              + "&Handler=" + this.Handler + "&DisCompanyId=";
             //window.location.href=url
             //console.log(url)
             this.shopHttp.get("/Finance/GetShopId").then(function(res){
                 console.log(url+res.data)
                 window.location.href=url+res.data;
             })
          },
          //分页
            sizeChange(val) {
                this.pagination.size = val;
                this.pagination.currentPage = 1;
                this.queryData(this.pagination.size,this.pagination.currentPage);
            },
            currentPageChange(val) {
                this.pagination.currentPage = val;
                this.queryData(this.pagination.size,this.pagination.currentPage);
            },
          queryData(size,index){
              this.shopHttp.get(
                  "StorePay/GetWaitCustomerFeePageList?FeeStatus="
                  +this.FeeStatus+"&PayStatus="+this.PayStatus+"&FeeNo="+this.FeeNo+"&DisSettleClientName="+this.DisSettleClientName+"&LinkMan="+this.LinkMan+"&Handler="+this.Handler+
                  "&PageSize="+(size || 10)+"&PageIndex="+(index || 1))
              .then((res) =>{
                   //console.log(res);
                   if(res.data.isSuccess == true){
                       this.demandtabledata = res.data.objects;
                       this.pagination.total = res.data.total;
                   }
              }).catch(function(err){
                   console.log(err);  
              });
          },
          getBanklist(){
              var _this = this;
              _this.shopHttp.get("/Finance/GetBankAccountList").then(function(res){
                   //console.log(res.data.objects);
                   if(res.data.isSuccess){
                       _this.BankAccountObj = res.data.objects;
                   }
              }).catch(function(err){
                   console.log(err);  
              });
          },
          getPaymethods(){
              var _this = this;
              _this.shopHttp.get("/Finance/GetPayMethod").then(function(res){
                   if(res.data.isSuccess){
                   // console.log(res.data.objects);
                     _this.PaymethodObj = res.data.objects;
                   }else{
                      _this.$message("请求收款方式失败");
                   }
                //    _this.PaymethodObj = [{key:1,value:"转账"},{key:2,value:'微信'}]
              }).catch(function(err){
                    console.log(err);
                     _this.$message("请求收款方式失败");
              });
          },
          allGetlist(url){
               var _this=this;
               _this.loading2 = true;
                _this.shopHttp.get(url).then(function(res){
                 // console.log(res.data);
                  if(res.data.isSuccess){
                    _this.demandtabledata = res.data.objects;
                  }
                  _this.loading2=false;
              }).catch(function(err){
                  console.log(err);
                  _this.loading2 = false;
                  _this.$message("请求失败");
              })
          },
        getDemandlist(){//默认请求
            var url = this.demandurl+"PageIndex="+this.feelist.PageIndex+"&PageSize="+this.feelist.PageSize;
            this.allGetlist(url);  
        },
        getDemandlisthavedate(){//通过时间请求
           var url = this.demandurl+"PageIndex="+this.feelist.PageIndex+"&PageSize="+this.feelist.PageSize+"&FeeDateBegin="+this.feelist.starttime[0]+"&FeeDateEnd="+this.feelist.starttime[1];
           //console.log(url);
           this.allGetlist(url);
        },
        getDemandlisthavestoreno(){//通过编号请求
           var url = this.demandurl+"PageIndex="+this.feelist.PageIndex+"&PageSize="+this.feelist.PageSize+"&StorePayNo="+this.feelist.demandsearchnum;
           this.allGetlist(url);
        },
        setDemandcheck(){//创建缴款单
                this.dialogFormVisible=true;
                var _this = this;
                _this.shopHttp.post("/StorePay/CreateStorePay",this.adddemandform).then(function(res){
                     //console.log(res);
                     if(res.data.isSuccess){
                       _this.$router.push({path:'/financenter/finacecheck'});
                     }else{
                        _this.$message({type:'info',message:res.data.message});
                     }
                }).catch(function(err){
                      console.log(err);
                      _this.$message({type:'error',message:'请求失败'});
                });
        },
        setDemanddialogvisit(){
            if(this.adddemandform.CusFeeIds.length>0){
                let temlength = this.temporaryObj.length;
                 for(let i=0;i<temlength;i++){
                     if(this.temporaryObj[i] === '缴款中' || this.temporaryObj[i]==='已缴款'){
                        this.$message("存在‘缴款中’或‘已缴款’订单，不能建立缴款单");
                       return;
                     }
                 }
                this.dialogFormVisible = true;
            }else{
                this.$message("请先选择你需要处理的代办缴款单");
            }
        },
        fixmoney(val){
           if(val.feeType === 2){
              return "-"+val.feeAmount;
           }else{
               return val.feeAmount;
           }
        },
        getrowdata(val){//负责将所有的选中的数据放到数组中 接口StorePay/CreateStorePay
           // if(val.length>0){
            this.adddemandform.CusFeeIds.length=0;
            this.temporaryObj.length = 0;
           for(let i=0;i<val.length;i++){
               this.adddemandform.CusFeeIds[i] = val[i].id;
               this.temporaryObj[i] = val[i].payStatusName;
           }
          // console.log(this.adddemandform.CusFeeIds);
          // console.log(this.temporaryObj);
         // }
        },
         checkAccessory(row){
             if(row.feeType === 2){
               this.$router.push({path:'/financenter/refunddetail',name:'refunddetail',params:{name:'adddeman8YTnr$',payinfoID:row.id}});
             }else{
                 this.$router.push({path:'/financenter/demandetail',name:'demandetail',params:{name:'addDemand8YTnr$',payinfoID:row.id}});
             }
         },
         getPaymethodcall(val){
            // console.log(val);
             if(val == 2){
                this.isShowBank = true;
             }else{
                 this.isShowBank = false;
             }
         }
      }
}
</script>

<style lang='scss' scoped>
    .mysearchbtn{
        margin-left: 25px;
    }
     .el-form-item {
        margin-bottom: 18px;
    }
</style>
