<template>
  <div class="view">
        <el-form  :inline="true" size="small" label-width="90px">
            <el-form-item label="退款状态"  >
                <el-select size="small" v-model="payinfoPages.feeStatus" class="inputs" clearable>
                    <el-option v-for="(item,index) in payinfoStatusObj" :key="index" :value="item.key" :label="item.value"></el-option>
                </el-select>
            </el-form-item>
                <el-form-item label="结算单位" >
                <el-input class="inputs" v-model="payinfoPages.disSettleClientName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="退款单号" >
                <el-input class="inputs" v-model="payinfoPages.feeNo" size="small"></el-input>
            </el-form-item>
            <el-form-item label="退款方式" >
                <el-select class="inputs" v-model="payinfoPages.feeMethod" size="small" clearable> 
                    <el-option v-for="(item,index) in payinfoMethodObj" :key="index" :value="item.key" :label="item.value"></el-option>
                </el-select>
            </el-form-item>
                <el-form-item>
                <el-button type="warning" icon="el-icon-search" size="small" @click="getSearchpayinfolist()">搜索</el-button>
            </el-form-item>
        </el-form>
        <div>
                <el-table
                    ref="multipleTable" :data="payinfodatatable"  max-height="600" size="small" v-loading="loading2"
                    tooltip-effect="dark" style="width: 100%" @select="getrow">
                     <el-table-column type="selection" fixed="left" size="small" width="55" align="center">
                        </el-table-column>
                    <el-table-column prop="attachment" label="附件" size="small" align="center" show-overflow-tooltip>
                         <template slot-scope="scope">
                                <el-button type="text" size="small" @click="checkfujian(scope.row)">查看附件</el-button>
                                <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </template>
                    </el-table-column>
                    <!-- <el-table-column prop="invoiceStatusName" label="发票" size="small" align="center" show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column prop="feeStatusName" label="状态" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="disSettleClientName" label="结算单位"  size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="feeAmount"  label="退款金额" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <!-- <el-table-column prop="serviceFee" label="手续费" size="small" align="center" show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column prop="feeMethodName"  label="退款方式" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <!-- <el-table-column prop="feebank" label="退款银行"  size="small"align="center" show-overflow-tooltip>
                    </el-table-column> -->
                    <!--<el-table-column prop="feeSerialNo" label="退款流水号" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>-->
                    <el-table-column prop="feeDateFormat" label="退款时间" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="handler" label="退款人" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                     <!-- <el-table-column prop="feeChannelName" label="退款渠道" size="small" align="center" show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column prop="feeNo" label="退款单号" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column fixed="right" size="small" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="payinfodetail(scope.row)">详细</el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
                <el-pagination class="pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="payinfoPages.PageIndex"
                    :page-sizes="[5,10,20,50]"
                    :page-size="payinfoPages.PageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="payinfoPages.total">
                </el-pagination>
  </div>
</template>

<script>
export default {
  data(){
     return{
          loading2:false,
          dialogVisible:false,
          dialogImageUrl:"",
          payinfoStatusObj:[],//退款状态
          payinfoMethodObj:[],//退款方式
          payinfodatatable: [{
                    invoiceStatusName: '',//发票 是否开发票
                    feeStatusName:'',//状态
                    disSettleClientName:'',//结算单位
                    feeAmount:'',//退款金额
                    handingcharge:'',//手续费
                    feeMethodName:'',//退款方式
                    feeSerialNo:'',//退款流水号
                    feeDateFormat:'',//退款时间
                    handler:"",//退款人
                    //feeChannelName:'',//退款渠道
                    feeNo:''//退款单号
                    }],
                    payinfoPages:{
                        PageSize:10,
                        PageIndex:1,
                        total:0,
                        feeStatus:'',//状态
                        disSettleClientName:"",//结算单位
                        feeSerialNo:'',//退款流水号
                        feeNo:"",//退款单号
                        feeMethod:""//退款方式
                    },
                    setPayinfoObj:{
                        BranchId:0,
                        OperatorName:"",
                        CusFeeIds:[]//店长确认-取消退款
                    },
                    temporaryObj:[],
     }
  },
  mounted:function(){
    this.getSearchpayinfolist();
    this.getpayinfoStatus();
    this.getpayinfoMethod();
  },
  methods:{
// CustomerFee/CancelCustomerFee  退支记录取消接口
// CustomerFee/ConfirmCustomerFee   退支记录审核接口
//CusFeeIds  参数名 数组类型
     payinfodetail(rowval){
       this.$router.push({path:'/financenter/refunddetail',name:'refunddetail',params:{name:'refund8YTnr$',payinfoID:rowval.id}});
     },
      getPayinfolist(url){
          var _this = this;
          _this.loading2 = true;//CustomerFee/GetCusReceivePageList   /GroupLine/GetGroupLineSettlementList
          _this.shopHttp.get("/CustomerFee/GetCusRefundPageList?"+url).then(function(res){
             // console.log(res);
              _this.loading2 = false;
              if(res.data.isSuccess){
                _this.payinfoPages.total = res.data.total;
                _this.payinfodatatable = res.data.objects;
              }
          }).catch(function(err){
              console.log(err);
              _this.loading2 = false;
          });
      },
      getSearchpayinfolist(pageIndex=1){
           let url = "PageSize="+this.payinfoPages.PageSize+"&PageIndex="+pageIndex
           +"&feeStatus="+this.payinfoPages.feeStatus+"&disSettleClientName="+this.payinfoPages.disSettleClientName
           +"&feeSerialNo="+this.payinfoPages.feeSerialNo+"&feeNo="+this.payinfoPages.feeNo+"&feeMethod="+this.payinfoPages.feeMethod;
           this.getPayinfolist(url);
      },
      getpayinfoStatus(){//获取退款状态
         var _this = this;
         _this.shopHttp.get("/CustomerFee/GetCustomerFeeStatus").then(res=>{
            // console.log(res);
             if(res.data.isSuccess){
               _this.payinfoStatusObj = res.data.objects;
             }
         }).catch(err=>{
             console.log(err);
         })
      },
      getpayinfoMethod(){//获取退款方式
          var _this = this;
          _this.shopHttp.get("/Finance/GetPayMethod").then(res=>{
              //console.log(res);
              if(res.data.isSuccess){
                  _this.payinfoMethodObj = res.data.objects;
              }
          }).catch(err=>{
              console.log(err);
          })
      },
      setConfirmFee(){
          //店长确认接口
        var _this = this;
        if(_this.setPayinfoObj.CusFeeIds.length<=0){
            _this.$message("请选择至少一条退款记录");
        }else{
             for(let i=0;i<this.temporaryObj.length;i++){
                if(this.temporaryObj[i]==='已确认'){
                    this.$message("包含已确认订单，不可重复确认");
                    return;
                }
            }
            _this.$confirm('', '提示', {confirmButtonText: '退款确认',cancelButtonText: '取消',type: 'info',center: true}).then(() => {
             _this.shopHttp.post("/CustomerFee/ConfirmCustomerFee",_this.setPayinfoObj).then(function(res){
                   // console.log(res);
                    if(res.data.isSuccess){
                        _this.getSearchpayinfolist(this.payinfoPages.PageIndex);
                       _this.$message({type: 'success',message: '确认成功!'});
                       _this.setPayinfoObj.CusFeeIds.length = 0;
                    }else{
                        _this.$message({type: 'success',message: '只有待审核、待确认订单才能确认!'});
                    }
                   
                    }).catch(function(err){
                        console.log(err);
                        _this.$message({type: 'success',message: '确认失败!'});
                    })
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        }
         
      },
      setCanelFee(){
          //取消退款
          var _this = this;
           if(_this.setPayinfoObj.CusFeeIds.length<=0){
            _this.$message("请选择至少一条退款记录");
          }else{
               for(let i=0;i<this.temporaryObj.length;i++){
                if(this.temporaryObj[i]==='已确认'){
                    this.$message("包含已确认订单，请重新选择");
                    return;
                }
            }
            this.$confirm('', '提示', {confirmButtonText: '确认',cancelButtonText: '取消',type: 'warning',center: true}).then(() => {
                        _this.shopHttp.post("/CustomerFee/CancelCustomerFee",_this.setPayinfoObj).then(function(res){
                       // console.log(res);
                            if(res.data.isSuccess){
                                _this.$message({type: 'success',message: '取消收款成功!'});
                                _this.setPayinfoObj.CusFeeIds.length = 0;
                                _this.getSearchpayinfolist(this.payinfoPages.PageIndex);
                            }else{
                                _this.$message({type: 'info',message: res.data.message});
                            }
                        }).catch(function(err){
                            console.log(err);
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        }
         
      },
      updataPayinfo(){
           if(this.setPayinfoObj.CusFeeIds.length<=0){
                this.$message("请选择至少一条退款记录");
            }else{
            this.$router.push({path:"/paymanage/payinfoupdata"});
            }
      },
       handleSizeChange(val) {
       // console.log(`每页 ${val} 条`);
        this.payinfoPages.PageSize = val;
        this.getSearchpayinfolist(this.payinfoPages.PageIndex);
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.payinfoPages.PageIndex = val;
        this.getSearchpayinfolist(this.payinfoPages.PageIndex);
      },
    getrow(val){//负责将所有的选中的数据放到数组中
       // console.log("加："+val);
        this.setPayinfoObj.CusFeeIds.length=0;
        this.temporaryObj.length = 0;
        for(let i=0;i<val.length;i++){
            this.setPayinfoObj.CusFeeIds[i] = val[i].id;
            this.temporaryObj[i] = val[i].feeStatusName;
        }
       // console.log(this.setPayinfoObj.CusFeeIds);
        //console.log(this.temporaryObj);
    },
    checkfujian(row){
        this.dialogImageUrl = row.attachment;
        this.dialogVisible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
