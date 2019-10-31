<template>
  <div class="view">
      <h4>收款信息</h4>
      <el-form>
          <div v-if="(bankName !=null&&bankName!='')||(accountNo != null && accountNo !='')">
          <el-row :gutter="20">
            <el-col :span="7">
                 <el-form-item label="客户结算单位" size="small" label-width="120px">
                    <span class="jlspan">{{disSettleClientName}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="收款方式" size="small" label-width="120px">
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
                <el-form-item label="收款金额" size="small" label-width="120px">
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
                 <el-form-item label="收款人" size="small" label-width="120px">
                    <span class="jlspan">{{handler}}</span>
                </el-form-item>
                 </el-col>
            <el-col :span="7">
                <el-form-item label="收款日期" size="small" label-width="120px">
                    <span class="jlspan">{{feeDateFormat}}</span>
                </el-form-item>
                 </el-col>
         </el-row>
         <el-row :gutter="20">
            <el-col :span="7">
                <el-form-item label="收款流水号" size="small" label-width="120px">
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
                <el-form-item label="收款方式" size="small" label-width="120px">
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
                <el-form-item label="收款金额" size="small" label-width="120px">
                    <span class="jlspan">{{feeAmount}}</span>
                </el-form-item>
            </el-col>
          </el-row>
           <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="收款人" size="small" label-width="120px">
                    <span class="jlspan">{{handler}}</span>
                </el-form-item>
                 </el-col>
            <el-col :span="7">
                <el-form-item label="收款日期" size="small" label-width="120px">
                    <span class="jlspan">{{feeDateFormat}}</span>
                </el-form-item>
                 </el-col>
         </el-row>
         <el-row :gutter="20">
            <el-col :span="7">
                <el-form-item label="收款流水号" size="small" label-width="120px">
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
       <h4>发票信息</h4>
        <el-form >
         <el-row :gutter="20">
             <el-col :span="7">
                <el-form-item label="发票抬头" size="small" label-width="120px">
                    <span class="jlspan">{{invoiceTitle}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                <el-form-item label="开户行" size="small" label-width="120px">
                    <span class="jlspan">{{openingBank}}</span>
                </el-form-item>
             </el-col>
         </el-row>
          <el-row :gutter="20">
             <el-col :span="7">
                <el-form-item label="地址" size="small" label-width="120px">
                    <span class="jlspan">{{address}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                <el-form-item label="银行账号" size="small" label-width="120px">
                    <span class="jlspan">{{bankAccount}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                <el-form-item label="公司税号" size="small" label-width="120px">
                    <span class="jlspan">{{taxNumber}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                <el-form-item label="发票类型" size="small" label-width="120px">
                    <span class="jlspan">{{invoiceType}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                <el-form-item label="发票内容" size="small" label-width="120px">
                    <span class="jlspan">{{invoiceItem}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                <el-form-item label="开票单位" size="small" label-width="120px">
                    <span class="jlspan">{{invoiceCompany}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                <el-form-item label="领取方式" size="small"  label-width="120px">
              <span class="jlspan">{{receiveTypeName}}</span>
          </el-form-item>
             </el-col>
             <el-col :span="7">
                <el-form-item label="发票邮寄地址" v-if=" toAddress!=null &&  toAddress!=''" size="small" label-width="120px">
                    <span class="jlspan">{{toAddress}}</span>
                </el-form-item>
                <el-form-item label="备注" v-else size="small"  label-width="120px">
                    <span class="jlspan">{{applyRemark}}</span>
                </el-form-item>
             </el-col>
         </el-row>
           <el-form-item label="备注" size="small" v-if=" toAddress!=null &&  toAddress!=''" label-width="120px">
              <span class="jlspan">{{ applyRemark}}</span>
          </el-form-item>
      </el-form>
      <h4>财务确认信息</h4>
       <el-form v-if="status == 2">
           <el-form-item label="确认状态" size="small" label-width="120px">
              <span class="jlspan">{{statusName}}</span>
          </el-form-item>
          <el-form-item label="确认人" size="small" label-width="120px">
              <span class="jlspan">{{confirmUser}}</span>
          </el-form-item>
           <el-form-item label="确认金额" size="small"  label-width="120px">
              <span class="jlspan">{{feeAmount}}</span>
          </el-form-item>
           <el-form-item label="确认日期" size="small" label-width="120px">
              <span class="jlspan">{{confirmTimeFormat}}</span>
          </el-form-item>
           <!-- <el-form-item label="确认银行/现金" size="small" label-width="120px">
              <span class="jlspan">{{confirmMethod}}</span>
          </el-form-item>  -->
      </el-form>
      <el-form v-else>
          <el-form-item label="确认状态" size="small" label-width="120px">
              <span class="jlspan">未确认</span>
          </el-form-item>
      </el-form>
      <h4>订单信息</h4>
      <el-table  ref="multipleTable" :data="demandtabledata" border max-height="800"  size="small" tooltip-effect="dark" style="width: 100%">
                        <el-table-column label="序号" type="index" :index="indexmeh" width="55" size="small" align="center">
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
                    <br/>
                    <el-row class="text-center">
                             <el-button class="mbackbtn" type="" icon="el-icon-arrow-left" size="small" @click="backpayinfoupdata">返回</el-button>
                    </el-row>
                   
  </div>
</template>

<script>
export default {
      data(){
          return{
            dialogVisible:false,
            dialogImageUrl:"",
            demandtabledata:[{
                customerName: "sample string 1",
                businessTypeName: "酒店订单",
                orderAmount: 2.0,
                orderDate: "2017-12-12T16:04:04.0542427+08:00",
                orderDateFormat: "2017-12-12",
                orderNo: "sample string 4",
                groupLineNo: "sample string 5",
                channelName: "sample string 6",
            }],
            Id:"",
            //收款信息
            attachment:"",//查看附件
            feeStatusName:'',//状态
            disSettleClientName:'',//结算单位
            feeAmount:'',//收款金额
            //handingcharge:'',//手续费
            feeMethodName:'',//收款方式
            feeSerialNo:'',//收款流水号
            currency:'',//币种
            feeDateFormat:'',//收款时间
            handler:"",//收款人
            confirmMethod:"",//确认银行/现金
            remark:"",//备注
            confirmTimeFormat:"",//确认时间
            confirmUser:"",//确认人
            debitAmount:"",//确认金额  
            bankName:'',//银行名称
            accountNo:'',//银行账号
            status:'',//确认状态
            statusName:'',
           
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
      },
      methods:{
          backpayinfoupdata(){
               //为了精确定位,实在忘记的页面，，就返回上一页
               if("PAYinfo8YTnr$" === this.$route.params.name){
                this.$router.push({path:'/paymanage/payinfo'});
               }else if("payinfoupdata8YTnr$" === this.$route.params.name){
                this.$router.push({path:'/paymanage/payinfoupdata'});
               }else if("addDemand8YTnr$" === this.$route.params.name){
                this.$router.push({path:'/financenter/adddemand'});
               }else{
                 this.$router.go(-1);
               }
            
          },
          getKeyID(){
              //获取到整个页面的主键ID
              this.Id = this.$route.params.payinfoID;
               //this.Id = 17;
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
                _this.confirmTimeFormat=res.data.confirmTimeFormat;//确认时间
                _this.confirmUser = res.data.confirmUser;//确认人
                _this.status = res.data.status;
                _this.statusName = res.data.statusName;
              }).catch(err=>{
                  console.log(err);
              })
          },
          getInvoiceDetail(){
              ///Invoice/GetInvoiceDetail 
              var _this = this;
              _this.shopHttp.get("/Invoice/GetInvoiceDetail?CusFeeId="+_this.Id).then(res=>{
                 // console.log(res);
                  if(res.data.isSuccess){
                   // _this.invoiceObj = res.data.objects[0];
                    _this.invoiceTitle=res.data.objects[0].invoiceTitle;//发票抬头
                    _this.address=res.data.objects[0].address;//发票地址
                    _this.openingBank=res.data.objects[0].openingBank;//开户行
                    _this.bankAccount=res.data.objects[0].bankAccount;//银行账号
                    _this.taxNumber=res.data.objects[0].taxNumber;//公司税号
                    _this.invoiceType=res.data.objects[0].invoiceType;//发票类型
                    _this.invoiceItem=res.data.objects[0].invoiceItem;//发票内容
                    _this.invoiceCompany=res.data.objects[0].invoiceCompany;//开票单位
                    _this.receiveTypeName=res.data.objects[0].receiveTypeName;//领取方式
                    _this.toAddress=res.data.objects[0].toAddress;//发票邮寄地址
                    _this.applyRemark=res.data.objects[0].applyRemark;//备注
                   }//else{
                //       console.log(res.data.message);
                //   }
              }).catch(err=>{
                  console.log(err);
              })
          },
          chechfj(){
            this.dialogImageUrl = this.attachment;
            this.dialogVisible = true;
          },
          indexmeh(index){
               return index * 1+1;
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
      },mounted:function(){
         this.getKeyID();
         this.getpayinfoDetail();
         this.getInvoiceDetail();
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
