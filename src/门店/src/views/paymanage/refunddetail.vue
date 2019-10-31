<template>
  <div class="view">
      <h4>退款信息</h4>
      <el-form>
          <div v-if="(bankName !=null&&bankName!='')||(accountNo != null && accountNo !='')">
          <el-row :gutter="20">
            <el-col :span="7">
                 <el-form-item label="客户结算单位" size="small" label-width="120px">
                    <span class="jlspan">{{disSettleClientName}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="退款方式" size="small" label-width="120px">
                    <span class="jlspan">{{feeMethodName}}</span>
                </el-form-item>
            </el-col>
         </el-row>
          <el-row :gutter="20">
            <el-col :span="7">     
                 <el-form-item label="币种" size="small" label-width="120px">
                    <span class="jlspan">{{currency}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="退款金额" size="small" label-width="120px">
                    <span class="jlspan">{{feeAmount}}</span>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" >
             <el-col :span="7">
                <el-form-item label="银行名称" size="small" label-width="120px">
                    <span class="jlspan">{{bankName !=null&&bankName!=''?bankName:'无'}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="银行账号" size="small" label-width="120px">
                    <span class="jlspan">{{accountNo != null && accountNo !='' ?accountNo:"无"}}</span>
                </el-form-item>
            </el-col>
             </el-row>
           <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="退款人" size="small" label-width="120px">
                    <span class="jlspan">{{handler}}</span>
                </el-form-item>
                 </el-col>
            <el-col :span="7">
                <el-form-item label="退款日期" size="small" label-width="120px">
                    <span class="jlspan">{{feeDateFormat}}</span>
                </el-form-item>
                 </el-col>
         </el-row>
         <el-row :gutter="20">
            <el-col :span="7">
                <el-form-item label="退款流水号" size="small" label-width="120px">
                    <span class="jlspan">{{feeSerialNo}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="附件" size="small" label-width="120px">
                    <el-button class="jlspan" size="small" icon="el-icon-picture" type="primary" @click="chechfj">点击查看附件</el-button>
                    <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-col>
         </el-row>
         <el-row :gutter="20">
              
                  <el-col :span="7">
                 <el-form-item label="备注" size="small" label-width="120px">
                     <span class="jlspan">{{remark}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         </div>
         <div v-else>
         <el-row :gutter="20">
            <el-col :span="7">
                 <el-form-item label="客户结算单位" size="small" label-width="120px">
                    <span class="jlspan">{{disSettleClientName}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="退款方式" size="small" label-width="120px">
                    <span class="jlspan">{{feeMethodName}}</span>
                </el-form-item>
            </el-col>
         </el-row>
          <el-row :gutter="20">
            <el-col :span="7">     
                 <el-form-item label="币种" size="small" label-width="120px">
                    <span class="jlspan">{{currency}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="退款金额" size="small" label-width="120px">
                    <span class="jlspan">{{feeAmount}}</span>
                </el-form-item>
            </el-col>
          </el-row>
           <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="退款人" size="small" label-width="120px">
                    <span class="jlspan">{{handler}}</span>
                </el-form-item>
                 </el-col>
            <el-col :span="7">
                <el-form-item label="退款日期" size="small" label-width="120px">
                    <span class="jlspan">{{feeDateFormat}}</span>
                </el-form-item>
                 </el-col>
         </el-row>
         <el-row :gutter="20">
            <el-col :span="7">
                <el-form-item label="退款流水号" size="small" label-width="120px">
                    <span class="jlspan">{{feeSerialNo}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="附件" size="small" label-width="120px">
                    <el-button class="jlspan" size="small" icon="el-icon-picture" type="primary" @click="chechfj">点击查看附件</el-button>
                    <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-col>
         </el-row>
         <el-row :gutter="20">
              
                  <el-col :span="7">
                 <el-form-item label="备注" size="small" label-width="120px">
                     <span class="jlspan">{{remark}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         </div>
      </el-form>
      <h4>财务确认信息</h4>
       <el-form >
          <el-form-item label="确认人" size="small" label-width="120px">
              <span class="jlspan">{{confirmUser}}</span>
          </el-form-item>
           <el-form-item label="确认金额" size="small"  label-width="120px">
              <span class="jlspan">{{feeAmount}}</span>
          </el-form-item>
           <el-form-item label="确认日期" size="small" label-width="120px">
              <span class="jlspan">{{confirmTimeFormat}}</span>
          </el-form-item>

      </el-form>
      <h4>订单信息</h4>
      <el-table  ref="multipleTable" :data="demandtabledata" border max-height="800"  size="small" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="序号" width="55" size="small" align="center">
        </el-table-column>
        <el-table-column prop="customerName"  size="small" label="客户名称" align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="businessTypeName" label="业务类型" size="small" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额"  size="small" align="center" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="orderDateFormat" label="下单日期" size="small" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号"  size="small" align="center" show-overflow-tooltip>
        </el-table-column>
            <el-table-column prop="groupLineNo" label="团号"  size="small" align="center" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column prop="channelName" label="销售渠道" size="small" align="center" show-overflow-tooltip>
        </el-table-column>测试说删掉 -->
    </el-table>
    <el-row class="text-center margin_top">
                <el-button class="mbackbtn"  icon="el-icon-arrow-left" size="small" @click="backpayinfoupdata">返回</el-button>
    </el-row>
                   
  </div>
</template>

<script>
export default {
      data(){
          return{
            dialogVisible:false,
            dialogImageUrl:"",
            demandtabledata:[],
            Id:"",
            //退款信息
            attachment:"",//查看附件
            feeStatusName:'',//状态
            disSettleClientName:'',//结算单位
            feeAmount:'',//退款金额
            //handingcharge:'',//手续费
            feeMethodName:'',//退款方式
            feeSerialNo:'',//退款流水号
            currency:'',//币种
            feeDateFormat:'',//退款时间
            handler:"",//退款人
            remark:"",//备注
            confirmTimeFormat:"",//确认时间
            confirmUser:"",//确认人
            debitAmount:"",//确认金额  
            bankName:'',//银行名称
            accountNo:'',//银行账号
           invoiceObj:{
                invoiceTitle:'',//发票抬头
                address:'',//发票地址
                openingBank:"",//开户行
                bankAccount:'',//银行账号
                taxNumber:'',//公司税号
                invoiceType:'',//发票类型
                invoiceItem:'',//发票内容
                invoiceCompany:'',//开票单位
                receiveTypeName:'',//领取方式
                toAddress:'',//发票邮寄地址
                applyRemark:''//备注
            }
          }
      },
      methods:{
          backpayinfoupdata(){
               //为了精确定位,实在忘记的页面，，就返回上一页
               if("refund8YTnr$" === this.$route.params.name){
                this.$router.push({path:'/paymanage/refundmanage'});
               }else if('adddeman8YTnr$' === this.$route.params.name){
                   this.$router.push({path:'/financenter/adddemand'});
               }else{
                   this.$router.go(-1);
               }
            
          },
          getKeyID(){
              //获取到整个页面的主键ID
              this.Id = this.$route.params.payinfoID;
               //this.Id = 17;
               //console.log(this.$route.params.payinfoID);
          },
          getpayinfoDetail(){
              //CustomerFee/GetCustomerFeeDetail
              var _this = this;
              _this.shopHttp.get("/CustomerFee/GetCustomerFeeDetail?Id="+_this.Id).then(res=>{
                //  console.log(res);
                _this.attachment=res.data.attachment;
                _this.feeStatusName=res.data.feeStatusName;
                _this.disSettleClientName=res.data.disSettleClientName;
                _this.feeAmount=res.data.feeAmount;
                _this.feeMethodName=res.data.feeMethodName;
                _this.feeDateFormat=res.data.feeDateFormat;
                _this.handler=res.data.handler;
                _this.confirmMethod=res.data.confirmMethod;
                _this.remark=res.data.remark;
                _this.demandtabledata = res.data.orderInfos;
                _this.currency = res.data.currency;
                _this.feeSerialNo=res.data.feeSerialNo;
                _this.bankName = res.data.bankName;
                _this.accountNo = res.data.accountNo;
                _this.confirmTimeFormat = res.data.confirmTimeFormat;
                _this.confirmUser = res.data.confirmUser;
              }).catch(err=>{
                  console.log(err);
              })
          },
          chechfj(){
            this.dialogImageUrl = this.attachment;
            this.dialogVisible = true;
          },
          fixDatefunc(val){
                  if(val.orderDate != null && val.orderDate != ''){
                    let datestr = val.orderDate;
                    let datestr_ = datestr.replace("T"," ");
                    if(val.orderDate.indexOf('T') > 0){
                        let datestr__ = datestr_.substring(0,datestr_.lastIndexOf("."));
                        return datestr__;
                    }else{
                        return datestr_;
                    }
                    
                 }else{
                    return val.orderDate;
                 }
              
          },
          fixDatefunc_label(val){
                if(val != null && val != ''){
                    let dateval_ = val.replace("T"," ");
                    if(dateval_.indexOf('.') > 0){
                        let dateval__ = dateval_.substring(0,dateval_.lastIndexOf("."));
                        return dateval__;
                    }else{
                        return dateval_;
                    }
                }else{
                    return val;
                }
          }
      },mounted:function(){
         this.getKeyID();
         this.getpayinfoDetail();
      }
}
</script>

<style scoped lang="scss">
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 5px !important;
    }
    .jlspan{
        margin-left: 10px;
    }
</style>
