<template>
  <div class="view">
      <h4><span class="vercitals">| </span>退款信息</h4>
      <el-form >
          <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="客户结算单位" size="small" label-width="120px">
                        <span>{{List.disSettleClientName}}</span>
                    </el-form-item>
                </el-col>
          </el-row>
                <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="联系人" size="small" label-width="120px">
                        <span>{{List.handler}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="币种" size="small"  label-width="120px">
                        <span>{{List.currency}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="申请时间" size="small" style="height:40px"  label-width="120px">
                        <span>{{List.feeDateFormat}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="supplierStatus == 0 ">
                <el-col :span="7">
                    <el-form-item label="财务确认金额" size="small" label-width="120px">
                        <el-input size="small" v-model="form.RefundAmount"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-else>
                <el-col :span="7">
                    <el-form-item label="财务确认金额" size="small" label-width="120px">
                        <span>{{List.feeAmount}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="确认人" size="small" label-width="120px">
                        <span>{{List.confirmUser}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="确认时间" size="small"  label-width="120px">
                        <span>{{List.confirmTimeFormat}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="来源" size="small"  label-width="120px">
                        <span>{{List.feeChannelName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="备注" size="small"  label-width="120px">
                        <span>{{List.Remark}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        
        <h4><span class="vercitals">| </span>订单详情</h4>
        <el-row style="margin-top:10px;">
              <el-table :data="table" border style="width: 100%">
                    <el-table-column align="center" prop="customerName" label="客户名称">
                    </el-table-column>
                    <el-table-column align="center" prop="businessTypeName" label="业务类型">
                    </el-table-column>
                    <el-table-column align="center" prop="orderAmount" label="订单金额">
                    </el-table-column>
                    <el-table-column align="center" prop="orderDateFormat" label="下单时间">
                    </el-table-column>
                    <el-table-column align="center" prop="orderNo" label="订单号">
                    </el-table-column>
                    <el-table-column align="center" prop="groupLineNo" label="团号">
                    </el-table-column>
                    <el-table-column align="center" prop="channelName" label="销售渠道">
                    </el-table-column>
                </el-table>
        </el-row>
        <el-row  style="margin-top:10px;">
            <el-form-item>
                <el-button size="small" type="info" v-if="supplierStatus == 0" @click="Examine(3)">审核未通过</el-button>
                <el-button size="small" type="primary" v-if="supplierStatus == 0" @click="Examine(4)">审核</el-button>
                <el-button size="small" type="info" @click="cancel" >取消</el-button>
            </el-form-item> 
        </el-row> 
       </el-form>         
  </div>
</template>
<script> 
import { dateFmt } from "../../../utils/tools.js";
    export default {
        data () {
            return {
                form:{
                    RefundAmount: '',               
                    Status: '',
                    OperatorName: '',
                    CusFeeId: '',
                    },
                List:{},
                supplierStatus: '',
                table:[{}]
            }
        },
        methods: {
            getList(){//获取详情
                this.groupHttp.get('/Refund/GetCustomerFeeDetail?Id='+ this.$route.query.Id)
                .then(res =>{
                    this.List = res.data;
                    this.form.RefundAmount = res.data.feeAmount;
                    this.form.CusFeeId = res.data.id;
                    this.form.Status = res.data.status;
                    this.form.OperatorName= res.data.disSettleClientName
                    this.table =res.data.orderInfos;
                    this.supplierStatus =  res.data.supplierStatus;
                    //console.log(res.data.supplierStatus)
                    res.data.orderInfos.forEach(obj=> {
                        let data = new Date(obj.orderDateFormat);
                        obj.orderDateFormat = dateFmt(data,"yyyy-MM-dd");
                    });
                })
            },
            Examine(num){//提交审核
                this.form.Status=num;
                this.groupHttp.post('/Refund/ConfirmRefund',this.form)
                .then(res =>{
                    if(res.data.isSuccess == true){
                        let message='';
                        if(num==4){
                            message='提交审核成功！'
                        }else if(num==3){
                            message='审核不通过提交成功！'
                        }
                        this.$message({
                            type: 'success',
                            message: message
                        });
                        this.$router.push('/grouptour/refundList')
                    }else {
                        this.$message({
                            type: 'info',
                            message: '提交审核失败！'
                        });
                    }
                })
            },
            cancel(){//取消
                this.$router.push('/grouptour/refundList')
            }
        },
        mounted () {
           this.getList(); 
        }
    }
</script>
