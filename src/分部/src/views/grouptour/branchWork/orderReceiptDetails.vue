<template>
  <div id="box" class="view">
      <h4><span class="vercitals">| </span>收款信息</h4>
      <el-form >
          <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="结算单位" size="small" label-width="120px">
                    <span>{{details.disSettleClientName}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="收款方式" size="small"  label-width="120px">
                    <span>{{details.feeMethodName}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="收款流水号" size="small" label-width="120px">
                    <span>{{details.feeSerialNo}}</span>
                </el-form-item>
             </el-col>
             <!-- <el-col :span="7">
                 <el-form-item label="银行账号" size="small" label-width="120px">
                    <span>6558**********8899</span>
                </el-form-item>
             </el-col> -->
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="收款金额" size="small" label-width="120px">
                    <span>{{details.feeAmount}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="收款人" size="small" style="height:40px"  label-width="120px">
                    <span>{{details.handler}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="收款时间" size="small"  label-width="120px">
                    <span>{{details.feeDateFormat}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="币种" size="small" label-width="120px">
                    <span>{{details.currency}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="备注" size="small"  label-width="120px">
                    <span>{{details.remark}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="附件"  label-width="120px">
                    <el-button type="primary" icon="el-icon-picture-outline" size="small" @click="checkAttachment">点击查看附件</el-button>
                                <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                </el-form-item>
             </el-col>
         </el-row>
      </el-form>
      <h4 v-show = 'invoiceDetail_show'><span class="vercitals">| </span>发票信息</h4>
        <el-form v-show = 'invoiceDetail_show'>
         <el-row :gutter="20">
             <el-col :span="10">
                <el-form-item label="发票抬头" size="small" label-width="120px">
                    <span>{{invoiceList.invoiceTitle}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="10">
                <el-form-item label="开户行" size="small" label-width="120px">
                    <span>{{invoiceList.openingBank}}</span>
                </el-form-item>
             </el-col>
         </el-row>
          <el-row :gutter="20">
             <el-col :span="10">
                <el-form-item label="地址" size="small" label-width="120px">
                    <span>{{invoiceList.address}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="10">
                <el-form-item label="银行账号" size="small" label-width="120px">
                    <span>{{invoiceList.bankAccount}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="10">
                <el-form-item label="公司税号" size="small" label-width="120px">
                    <span>{{invoiceList.taxNumber}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="10">
                <el-form-item label="发票类型" size="small" label-width="120px">
                    <span>{{invoiceList.invoiceType}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="10">
                <el-form-item label="发票内容" size="small" label-width="120px">
                    <span>{{invoiceList.invoiceItem}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="10">
                <el-form-item label="开票单位" size="small" label-width="120px">
                    <span>{{invoiceList.invoiceCompany}}</span>
                </el-form-item>
             </el-col>
         </el-row>
           <el-form-item label="领取方式" size="small"  label-width="120px">
              <span>{{invoiceList.receiveType}}</span>
          </el-form-item>
           <el-form-item label="发票邮寄地址" size="small" label-width="120px">
              <span>{{invoiceList.toAddress}}</span>
          </el-form-item>
           <el-form-item label="备注" size="small"  label-width="120px">
              <span>{{invoiceList.applyRemark}}</span>
          </el-form-item>
      </el-form>
      <h4><span class="vercitals">| </span>财务确认信息</h4>
       <el-form >
          <el-form-item label="确认状态" size="small" label-width="120px">
              <span>{{details.statusName}}</span>
          </el-form-item>
          <el-form-item label="确认人" size="small" label-width="120px" v-show = 'details.statusName == "已确认"'>
              <span>{{details.confirmUser}}</span>
          </el-form-item>
           <el-form-item label="确认金额" size="small"  label-width="120px" v-show = 'details.statusName == "已确认"'>
              <span>{{details.feeAmount}}</span>
          </el-form-item>
           <el-form-item label="确认时间" size="small" label-width="120px" v-show = 'details.statusName == "已确认"'>
              <span>{{details.confirmTimeFormat}}</span>
          </el-form-item> 
      </el-form>
      <h4><span class="vercitals">| </span>订单信息</h4>
      <el-table size="small" :data="orderInformation"  ref="orderInformation" border max-height="800" style="width: 100%">
            <el-table-column size="small" label="序号" width="55" align="center" type="index">
            </el-table-column>
            <el-table-column size="small" prop="customerName" label="客户名称" align="center"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="businessTypeName" label="业务类型" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="orderAmount" label="订单金额" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="orderDateFormat" label="下单时间" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="groupLineNo" label="团号" align="center" show-overflow-tooltip>
            </el-table-column>
     </el-table>
    <br/>
    <el-row :gutter="20">
        <el-col :span="1" :offset="11">
                <el-button class="mbackbtn" type="info" size="small" @click="back">返回</el-button>
        </el-col>
    </el-row>
                   
  </div>
</template>

<script>
export default {
      data(){
          return{
            invoiceDetail_show: (this.$route.query.invoiceStatus == null || this.$route.query.invoiceStatus == 0 || this.$route.query.invoiceStatus == 6 )? false : true,
            dialogVisible:false,
            details:{},
            invoiceList:{
                
            },
            orderInformation:[{}],
            dialogImageUrl: ''
          }
      },
      mounted () {
        this.groupHttp.get("CustomerFee/GetCustomerFeeDetail?Id=" + this.$route.query.id).then(res =>{
                        this.details = res.data;
                        this.orderInformation = res.data.orderInfos;
                        this.dialogImageUrl = res.data.attachment;
                    }).catch(e => {
                    })
        if(this.invoiceDetail_show){
            this.groupHttp.get("Invoice/GetInvoiceDetail?CusFeeId=" + this.$route.query.id)
                .then(res =>{
                    if(res.data.isSuccess == true){
                        this.invoiceList = res.data.objects[0]
                    }else{
                        this.$message({
                            type:'info',
                            message:'获取发票信息出错了!' + res.data.message
                        })
                    }
                        
                }).catch( e => {
                    console.log(e)
                })
        }
      },
      methods: {
          back(){
              this.$router.go(-1)
          },
          checkAttachment(){
            this.dialogImageUrl = this.details.attachment;
            this.dialogVisible = true;
          }
      }
}
</script>

<style scoped lang="scss">
    @import "../../../style/common.scss";
   .box{
      background: white;
      padding: 20px;
    }
    .mysapn{
        font-weight: bold;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 5px !important;
    }
</style>
