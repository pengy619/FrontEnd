<template>
  <div class="view">
      <el-form >
            <el-form-item label="银行名称" size="small" label-width="120px">
                <span>{{form.bankName}}</span>
            </el-form-item>
            <el-form-item label="开户行" size="small" label-width="120px">
                <span>{{form.openingBank}}</span>
            </el-form-item>
            <el-form-item label="开户人" size="small"  label-width="120px">
                <span>{{form.accountHolder}}</span>
            </el-form-item>
            <el-form-item label="银行账号" size="small" style="height:40px"  label-width="120px">
                <span>{{form.bankAccount}}</span>
            </el-form-item>
            <el-form-item label="币种" size="small" label-width="120px">
                <span>{{form.currency}}</span>
            </el-form-item>
            <el-form-item label="发票图片" size="small" label-width="120px">
                <img :src="form.substituteInvoice" alt="" v-if="form.substituteInvoice" style="width:150px;height:150px;">
            </el-form-item>
            <el-form-item label="备注" size="small" label-width="120px">
                <span>{{form.comment}}</span>
            </el-form-item>
         </el-form>
        <h4><span class="vercitals">| </span>代付明细</h4>
        <el-row style="margin-top:10px;">
              <el-table :data="table" border style="width: 100%">
                    <el-table-column align="center" prop="strEnumOrderStatus" label="订单状态">
                    </el-table-column>
                    <el-table-column align="center" prop="strPayStatus" label="结算状态">
                    </el-table-column> 
                    <el-table-column align="center" prop="strTeamStatus" label="出团状态">
                    </el-table-column>
                    <el-table-column align="center" prop="orderNo" label="订单号">
                    </el-table-column>
                    <el-table-column align="center" prop="customerName" label="结算单位">
                    </el-table-column>
                    <el-table-column align="center" prop="totalNumber" label="人数">
                    </el-table-column>
                    <el-table-column align="center" prop="receivableFee" label="应收">
                    </el-table-column>
                    <el-table-column align="center" prop="receivedFee" label="已收">
                    </el-table-column>
                    <!--<el-table-column align="center" prop="alreadyPaymentAmount" label="已代付">
                    </el-table-column>-->   
                    <el-table-column align="center" prop="paymentAmount" label="代付金额">
                    </el-table-column>                 
                    <el-table-column align="center" prop="orderDate" label="下单日期">
                        <template slot-scope="scope">
                            {{scope.row.orderDate?scope.row.orderDate.split('T')[0]:''}}
                        </template>
                    </el-table-column>
                </el-table>
        </el-row> 
        <el-row class="margin_top text-center">
            <el-button size="small" type="primary" @click="back">返回</el-button>
        </el-row>
               
  </div>
</template>

<style>

</style>


<script>
import {dateFmt} from '@/utils/tools.js';
    export default {
        data () {
            return {
                form:{},
                table: [],
            }
        },
        mounted () {
            this.getLIst();
        },
        methods: {
            back(){
                this.$router.go(-1)
            },
            getLIst(){
                this.shopHttp.post('/GroupLinePayForAnotherShop/PayForAnotherDetial',{"PayNo":this.$route.query.PayNo,Status:3})
            .then(res =>{
                this.form = res.data.objects[0];
                this.table.push(res.data.objects[0]);
                })
            }
        }
    }
</script>
