<template>
  <div id="box" class="view">
      <h4><span class="vercitals">| </span>退款信息</h4>
      <el-form >
          <el-row :gutter="20">
             <el-col :span="7">
                 <el-form-item label="客户结算单位" size="small" label-width="120px">
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
                    <span>{{details.FeeSerialNo}}</span>
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
                    <el-button type="primary" icon="el-icon-picture-outline" size="small" @click="attachment">点    击查看附件</el-button>
                                <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                </el-form-item>
             </el-col>
         </el-row>
      </el-form>
      <h4><span class="vercitals">| </span>确认财务信息</h4>
       <el-form >
          <el-form-item label="确认人" size="small" label-width="120px">
              <span>{{details.confirmUser}}</span>
          </el-form-item>
           <el-form-item label="确认金额" size="small"  label-width="120px">
              <span>{{details.creditAmount}}</span>
          </el-form-item>
           <el-form-item label="确认时间" size="small" label-width="120px">
              <span>{{details.confirmTimeFormat}}</span>
          </el-form-item>
           <el-form-item label="确认银行/现金" size="small" label-width="120px">
              <span>{{details.confirmMethod}}</span>
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
              dialogImageUrl:'',
              dialogVisible:false,
              details:{},
              orderInformation:[{}]
          }
      },
      mounted () {
        
        this.groupHttp.get("CustomerFee/GetCustomerFeeDetail?Id="+this.$route.query.id).then(res =>{
            console.log(res.data.orderInfos)
            this.details = res.data;
            this.orderInformation = res.data.orderInfos
        }).catch(e => {
            this.order.loading=false
        })
      },
      methods: {
          back(){
              this.$router.push('/orderCenter/refundManage')
          },
          attachment(){
            this.dialogImageUrl = this.details.attachment;
            this.dialogVisible = true;
          }
      }
}
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
   
    .mysapn{
        font-weight: bold;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 5px !important;
    }
</style>
