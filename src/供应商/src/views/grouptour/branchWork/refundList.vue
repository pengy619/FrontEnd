<template>
    <div class="view">
        <el-form :inline="true" :model="form" size="small" >
            <el-form-item label="状态">
                <el-select v-model="form.feeStatus" placeholder="请选择状态" clearable>
                    <el-option v-for="item in StatusList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>   
            </el-form-item>
            <el-form-item label="客户结算单位">
                <el-input v-model="form.disSettleClientName"></el-input>
            </el-form-item>
            <el-form-item label="退款编号">
                <el-input v-model="form.feeNo"></el-input>
            </el-form-item>
            <el-form-item label="确认时间">
                <el-date-picker type="date" v-model="form.supplierConfirmTime" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="来源">
                <el-select v-model="form.feeChannel" placeholder="请选择" clearable>
                    <el-option
                        v-for="item in feeChannelList"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-search" @click="getTable">查找</el-button>
            </el-form-item>
        </el-form>
        <el-row style="margin-top:10px;">
              <el-table :data="form.table" border style="width: 100%">
                <el-table-column align="center" prop="disSettleClientName" label="结算单位">
                </el-table-column>
                <el-table-column align="center" prop="linkMan" label="联系人">
                </el-table-column>
                <el-table-column align="center" prop="feeNo" label="退款编号">
                </el-table-column>
                <el-table-column align="center" prop="currency" label="币种">
                </el-table-column>
                <el-table-column align="center" prop="feeDateFormat" label="申请时间">
                </el-table-column>
                <el-table-column align="center" prop="feeMethodName" label="退款方式">
                </el-table-column>
                <el-table-column align="center" prop="supplieRefundAmount" label="确认金额">
                </el-table-column>
                <el-table-column align="center" prop="supplierConfirmor" label="供应商确认人">
                </el-table-column>
                <el-table-column align="center" prop="supplierConfirmTimeFormat" label="供应商确认时间">
                </el-table-column>
                <el-table-column align="center" prop="feeChannelName" label="来源">
                </el-table-column>
                <el-table-column align="center" prop="feeStatusName" label="状态">
                </el-table-column>
                <el-table-column align="center" prop="name" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="Examine(scope.row)" v-if="scope.row.supplierStatus ==0">审核</el-button>
                        <el-button size="mini" type="text" @click="Examine(scope.row)" v-else>查看</el-button>
                    </template>
                </el-table-column>
               </el-table>
        </el-row>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="form.pageIndex"
                :page-sizes="[5,10,20,50]"
                :page-size="form.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="form.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { dateFmt } from "../../../utils/tools.js";
    export default {
        data () {
            return {
                form:{
                    pageSize: 10,
                    pageIndex: 1,
                    total: 0,
                    feeStatus: '',
                    disSettleClientName: '',
                    feeNo: '',
                    supplierConfirmTime: '',
                    feeChannel: '',
                    table:[{}],
                },
                feeChannelList:[],
                StatusList: [{key: "", value: "全部"}]
            }
        },
        mounted () {
            this.getStatus();
            this.getFeeChannel()
            this.getTable();
        },
        methods: {
            getStatus(){//状态
                this.groupHttp.get('/Refund/GetCustomerFeeStatus')
                .then(res =>{
                    this.StatusList = this.StatusList.concat(res.data.objects);
                })
            },
            getFeeChannel(){//来源
                this.groupHttp.get('/GetEnumOrderSource')
                .then(res =>{
                    this.feeChannelList = res.data.objects;
                })
            },
            getTable(){
                this.groupHttp.get('/Refund/GetCusRefundPageList?'+
                "&pageSize="+this.form.pageSize+
                "&pageIndex="+this.form.pageIndex+
                "&FeeStatus="+this.form.feeStatus+
                "&disSettleClientName="+this.form.disSettleClientName+
                "&feeNo="+this.form.feeNo+
                "&supplierConfirmTime="+(this.form.supplierConfirmTime||'')+
                "&feeChannel="+this.form.feeChannel).then(res =>{
                    this.form.table = res.data.objects;
                    this.form.total = res.data.total;
                })
            },
            Examine(row){
                this.$router.push({path:'/grouptour/refundDetails/',query:{'Id':row.id}})
            },
            handleSizeChange(val) {
                this.form.pageSize = val
                this.getTable();
                // console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.form.pageIndex = val;
                this.getTable();
                // console.log(`当前页: ${val}`);
            },
        }
    }
</script>
<style>
.pagination{
    margin: 10px 0;
    text-align: right;
}
</style>
