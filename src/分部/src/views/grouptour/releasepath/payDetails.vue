<template>
  <div class="view">
      <el-form >
          <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="银行名称" size="small" label-width="120px">
                        <span>{{form.bankName}}</span>
                    </el-form-item>
                </el-col>
          </el-row>
                <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="开户行" size="small" label-width="120px">
                        <span>{{form.openingBank}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="开户人" size="small"  label-width="120px">
                        <span>{{form.accountHolder}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="银行账号" size="small" style="height:40px"  label-width="120px">
                        <span>{{form.bankAccount}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="币种" size="small" label-width="120px">
                        <span>{{form.currency}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="备注" size="small" label-width="120px">
                        <span>{{form.comment}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
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
                    <el-table-column align="center" prop="orderDate" label="下单日期">
                        <template slot-scope="scope">
                            {{scope.row.orderDate?scope.row.orderDate.split('T')[0]:''}}
                        </template>
                    </el-table-column>
                </el-table>
        </el-row> 
        <el-row style="margin-top:20px;">
            <el-button size="size" type="primary" @click="back">返回</el-button>
        </el-row>
       </el-form>         
  </div>
</template>

<style>

</style>


<script>
 import {dateFmt} from '@/utils/tools.js'
    export default {
        data () {
            return {
                form:{},
                table: [],
            }
        },
        mounted () {
            this.getList();
        },
        methods: {
            back(){
                this.$router.push('/grouptour/payList')
            },
            getList(){
                this.groupHttp.post('/GroupLinePayForAnotherBranch/PayForAnotherDetial',{"PayNo":this.$route.query.PayNo,Status:3})
                .then(res =>{
                    this.form = res.data.objects[0];
                    this.table.push(res.data.objects[0]);
                })
            }
        }
    }
</script>