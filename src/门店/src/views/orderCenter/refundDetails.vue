<template>
  <div id="box" class="view">
      <h4><span class="vercitals">| </span>退款信息</h4>
      <el-form >
          <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="结算单位" size="small" label-width="120px">
                    <span>{{details.disSettleClientName}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="收款流水号" size="small" label-width="120px">
                    <span>{{details.feeSerialNo}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="退款方式" size="small"  label-width="120px">
                    <span>{{details.feeMethodName}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="退款人" size="small" style="height:40px"  label-width="120px">
                    <span>{{details.handler}}</span>
                </el-form-item>
                 <!-- <el-form-item label="银行账号" size="small" label-width="120px">
                    <span>6558**********8899</span>
                </el-form-item> -->
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="退款金额" size="small" label-width="120px">
                    <span>{{details.feeAmount}}</span>
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
                 <el-form-item label="退款日期" size="small"  label-width="120px">
                    <span>{{details.feeDateFormat}}</span>
                </el-form-item>
             </el-col>
             <el-col :span="7">
                 <el-form-item label="备注" size="small"  label-width="120px">
                    <span>{{details.remark}}</span>
                </el-form-item>
             </el-col>
         </el-row>
         <el-row :gutter="20">
             <el-col :span="7">
                 
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
      <h4><span class="vercitals">| </span>确认财务信息</h4>
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
            <el-table-column size="small" prop="orderDateFormat" label="下单日期" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip>
            </el-table-column>
                <el-table-column size="small" prop="groupLineNo" label="团号" align="center" show-overflow-tooltip>
            </el-table-column>
     </el-table>
        <el-row class="margin_top text-center">
                <el-button class="mbackbtn" type="" size="small" @click="back">返回</el-button>
    </el-row>
                    
  </div>
</template>

<script>
export default {
      data(){
          return{

              dialogVisible:false,
              details:{},
              dialogImageUrl: '',
              orderInformation:[{}]
          }
      },
      mounted () {
        this.shopHttp.get("CustomerFee/GetCustomerFeeDetail?"+"Id="+this.$route.params.id).then(res =>{
            //console.log(res.data.orderInfos)
            this.details = res.data;
            console.log(res.data.attachment)
            this.details.attachment = res.data.attachment;
            this.orderInformation = res.data.orderInfos;
            this.dialogImageUrl = res.data.attachment;
        }).catch(e => {
            this.order.loading=false
        })
      },
      methods: {
          back(){
              this.$router.push('/orderCenter/refundManage')
          },
          checkAttachment(){
            this.dialogVisible = true;
          }
      }
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";
   
    .mysapn{
        font-weight: bold;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 5px !important;
    }
</style>
