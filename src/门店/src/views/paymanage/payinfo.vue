<template>
  <div class="view">
        <el-form  :inline="true" size="small" label-width="100px">
            <el-form-item label="收款状态"  label-width="80px">
                <el-select size="small" v-model="payinfoPages.feeStatus" clearable>
                    <el-option v-for="(item,index) in payinfoStatusObj" :key="index" :value="item.key" :label="item.value"></el-option>
                </el-select>
            </el-form-item>
                <el-form-item label="结算单位" label-width="80px">
                <el-input v-model="payinfoPages.disSettleClientName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="收款流水号" label-width="90px">
                <el-input v-model="payinfoPages.feeSerialNo" size="small"></el-input>
            </el-form-item>
            <el-form-item label="收款单号" label-width="80px">
                <el-input v-model="payinfoPages.feeNo" size="small"></el-input>
            </el-form-item>
            <el-form-item label="收款方式" label-width="80px">
                <el-select v-model="payinfoPages.feeMethod" size="small" clearable>
                    <el-option v-for="(item,index) in payinfoMethodObj" :key="index" :value="item.key" :label="item.value"></el-option>
                </el-select>
            </el-form-item>
                <el-form-item>
                <el-button type="warning" icon="el-icon-search" size="small" @click="getSearchpayinfolist()">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row  class="margin_bottom">
                <el-button type="primary" size="small" @click="setConfirmFee" v-if="shopType==1">店长确认</el-button>
                <el-button  size='small' @click="exportExcel">导出Excel</el-button>
                <!-- <el-button size="small" type="primary" @click="setCanelFee">取消收款</el-button> -->
                <!-- <el-button type="primary" size="small" @click="updataPayinfo">修改收款</el-button> -->
        </el-row>
        <div>
                <el-table
                    :data="payinfodatatable" size="small" v-loading="loading2"
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
                    <el-table-column prop="invoiceStatusName" label="发票" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="feeStatusName" label="状态" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="disSettleClientName" label="结算单位"  size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="feeAmount"  label="收款金额" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <!-- <el-table-column prop="serviceFee" label="手续费" size="small" align="center" show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column prop="feeMethodName"  label="收款方式" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <!-- <el-table-column prop="feebank" label="收款银行"  size="small"align="center" show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column prop="feeSerialNo" label="收款流水号" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="feeDateFormat" label="收款时间" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="handler" label="收款人" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                     <!-- <el-table-column prop="feeChannelName" label="收款渠道" size="small" align="center" show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column prop="feeNo" label="收款单号" size="small" align="center" show-overflow-tooltip>
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
const {export_json_to_excel} = require('@/vendor/Export2Excel')
//import {export_json_to_excel} from '@/vendor/Export2Excel';
export default {
  data(){
     return{
          loading2:false,
          dialogVisible:false,
          dialogImageUrl:"",
          payinfoStatusObj:[],//收款状态
          payinfoMethodObj:[],//收款方式
          payinfodatatable: [{
                    invoiceStatusName: '',//发票 是否开发票
                    feeStatusName:'',//状态
                    disSettleClientName:'',//结算单位
                    feeAmount:'',//收款金额
                    handingcharge:'',//手续费
                    feeMethodName:'',//收款方式
                    feeSerialNo:'',//收款流水号
                    feeDateFormat:'',//收款时间
                    handler:"",//收款人
                    //feeChannelName:'',//收款渠道
                    feeNo:''//收款单号
                    }],
                    payinfoPages:{
                        PageSize:10,
                        PageIndex:1,
                        total:0,
                        feeStatus:'',//状态
                        disSettleClientName:"",//结算单位
                        feeSerialNo:'',//收款流水号
                        feeNo:"",//收款单号
                        feeMethod:""//收款方式
                    },
                    setPayinfoObj:{
                        BranchId:0,
                        OperatorName:"",
                        CusFeeIds:[]//店长确认-取消收款
                    },
                    temporaryObj: [],
         shopType: 1,//门店类型默认1,1为自营门店
     }
  },
  mounted:function(){
    this.getSearchpayinfolist();
    this.getpayinfoStatus();
    this.getpayinfoMethod();
    this.getShopType();
  },
  methods:{
     payinfodetail(rowval){
       this.$router.push({path:'/financenter/demandetail',name:'demandetail',params:{name:'PAYinfo8YTnr$',payinfoID:rowval.id}});
     },
      getPayinfolist(url){
          var _this = this;
          _this.loading2 = true;//CustomerFee/GetCusReceivePageList   /GroupLine/GetGroupLineSettlementList
          _this.shopHttp.get("/CustomerFee/GetCusReceivePageList?"+url).then(function(res){
              //console.log(res.data);
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
      getpayinfoStatus(){//获取收款状态
         var _this = this;
         _this.payinfoStatusObj.length = 0;
         _this.shopHttp.get("/CustomerFee/GetCustomerFeeStatus").then(res=>{
             if(res.data.isSuccess){
                 if(res.data.objects.length>0){
                        for(let i=0;i<res.data.objects.length;i++){
                            if(res.data.objects[i].key == 1 || res.data.objects[i].key == 2){
                                 _this.payinfoStatusObj.push(res.data.objects[i]);
                            }
                        }
                 }
             }
         }).catch(err=>{
             console.log(err);
         })
      },
      getpayinfoMethod(){//获取收款方式
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
            _this.$message({type:'info',message:"请选择至少一条收款记录"});
        }else{
            for(let i=0;i<this.temporaryObj.length;i++){
                if(this.temporaryObj[i]==='已确认'){
                    this.$message("包含已确认订单，不可重复确认");
                    return;
                }
            }
            _this.$confirm('', '提示', {confirmButtonText: '店长确认',cancelButtonText: '取消',type: 'info',center: true}).then(() => {
             _this.shopHttp.post("/CustomerFee/ConfirmCustomerFee",_this.setPayinfoObj).then(function(res){
                   // console.log(res);
                    if(res.data.isSuccess){
                       _this.getSearchpayinfolist(this.payinfoPages.PageIndex);
                       _this.$message({type: 'success',message: '确认成功!'});
                       _this.setPayinfoObj.CusFeeIds.length =0;
                    }else{
                         _this.$message({type: 'info',message: '只有待确认订单才能确认收款!'});
                    }
                   
                    }).catch(function(err){
                        console.log(err);
                         _this.$message({type: 'info',message: '确认失败!'});
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
          //取消收款
          var _this = this;
           if(_this.setPayinfoObj.CusFeeIds.length<=0){
            _this.$message("请选择至少一条收款记录");
          }else{
            for(let i=0;i<this.temporaryObj.length;i++){
                if(this.temporaryObj[i]==='已确认'){
                    this.$message("包含已确认订单，请重新选择");
                    return;
                }
            }
            this.$confirm('', '提示', {confirmButtonText: '确认',cancelButtonText: '取消',type: 'warning',center: true}).then(() => {
                        _this.shopHttp.post("/CustomerFee/CancelCustomerFee",_this.setPayinfoObj).then(function(res){
                        //console.log(res);
                            if(res.data.isSuccess){
                                _this.$message({type: 'success',message: '取消收款成功!'});
                                _this.getSearchpayinfolist(this.payinfoPages.PageIndex);
                                _this.setPayinfoObj.CusFeeIds.length =0;//操作成功之后要把所有的历史数据清空
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
                this.$message("请选择至少一条收款记录");
            }else{
            this.$router.push({path:"/paymanage/payinfoupdata"});
            }
      },
      handleSizeChange(val) {
        this.payinfoPages.PageSize = val;
        this.getSearchpayinfolist(this.payinfoPages.PageIndex);
      },
      handleCurrentChange(val) {
        this.payinfoPages.PageIndex = val;
        this.getSearchpayinfolist(this.payinfoPages.PageIndex);
       }, 
      getrow(val){//负责将所有的选中的数据放到数组中
          this.setPayinfoObj.CusFeeIds.length=0;
          this.temporaryObj.length = 0;
          for(let i=0;i<val.length;i++){
              this.setPayinfoObj.CusFeeIds[i] = val[i].id;
              this.temporaryObj[i] = val[i].feeStatusName;
          }
      },
      checkfujian(row){
          this.dialogImageUrl = row.attachment;
          this.dialogVisible = true;
      },
      exportExcel(){
          var _this = this;
          this.loading2=true;
           _this.shopHttp.get("/CustomerFee/GetCusReceivePageList?Export=true").then(function(res){
               // console.log(res.data);
                if(res.data.isSuccess){
                     require.ensure([],()=>{
                          const tHeader = ['发票','状态','结算单位','收款金额','收款方式','收款流水号','收款时间','收款人','收款单号'];
                          const filterVal = ['invoiceStatusName','feeStatusName','disSettleClientName','feeAmount','feeMethodName','feeSerialNo','feeDateFormat','handler','feeNo'];
                          const list = res.data.objects;
                          const data = _this.formatJson(filterVal,list);
                          export_json_to_excel(tHeader,data,'财务中心-收款管理Excel');
                           _this.loading2 = false;
                      })
                }else{
                    _this.$message({type:'info',message:'导出失败'});
                     _this.loading2 = false;
                }
              
            }).catch(function(err){
                console.log(err);
                _this.loading2 = false;
            });
       
      },
      formatJson(filterVal,jsonData){
           return jsonData.map(v=>filterVal.map(j=>v[j]));
      },

      getShopType() {//获取当前门店类型
        this.shopType = localStorage.getItem('companyType');
      },
  }
}
</script>

<style lang="scss" scoped>
</style>
