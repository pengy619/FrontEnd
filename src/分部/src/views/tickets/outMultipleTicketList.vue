<template>
    <div class='view'>
        <el-row>
             <el-col>
                <span>审核状态</span>
                <el-select v-model="auditStatus" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in auditStatusList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-col>
            <el-col>
                <span>销售状态</span>
                <el-select v-model="saleStatus" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in saleStatusList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <span>关键字</span>
                <el-input v-model="keyWord" placeholder="产品名称、编号，景区名称" size='small'></el-input>
            </el-col>
            <el-col>
                <span>供应商</span>
                <el-input v-model="supplier" placeholder="" size='small'></el-input>
            </el-col>
            <el-col>
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-col>
        </el-row>
        <el-row class='btn-row'>
            <el-col>
                <el-button type="primary" @click="batchAudit" :disabled="btn_audit" size='small'>批量审核</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="singleTicketList" max-height="800" tooltip-effect="dark" style="width: 100%" v-loading = 'tableLoading'
            @selection-change="tableSelectionChange">
            <el-table-column size="small" type="selection" fixed  align="center"></el-table-column>
            <el-table-column size="small" prop="contractTypeName" label="编号" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractNo" label="景点" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractNo" label="产品名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="orderNo" label="支付方式" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userName" label="销售情况" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>1单</span><span>2张</span>
                </template>
            </el-table-column>
            <el-table-column size="small" prop="userDateFormat" label="审核状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userDateFormat" label="销售状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userStatusText" label="供应商" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='200'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini"  @click='check(scope.row)' class='table-button'>查看</el-button>
                    <el-button type="text" size="mini"  @click='audit(scope.row)' class='table-button'>审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                fixed="right"
                :data = 'pagination'
                @size-change="sizeChange"
                @current-change="currentPageChange"
                :current-page="pagination.currentPage"
                :page-sizes="pagination.sizes"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>
<style scoped lang="scss">
    .el-input{
        width:200px;
    }
    .el-row .el-col{
        width:320px;
        margin:15px 0 10px 5px;
    }
    .el-row .el-col .el-select{
        width:200px;
    }
    .el-row .el-col span{
        display:inline-block;
        width:60px;
        text-align:right;
        margin-right:5px;
    }
    .search{
        margin-left:20px;
    }
    .table-button{
        padding:7px 5px!important;
    }
    .el-row.btn-row .el-col{
        width:100%;
    }
    .el-row.btn-row .el-button{
        margin:0px 5px 5px 15px;
    }
</style>
<script>
    export default{
        data(){
            return{
                tableLoading:false,
                auditStatusList:[
                    {value:'不限',key:0},{value:'等待审核',key:1},{value:'审核通过',key:2},{value:'审核拒绝',key:3}
                ],
                auditStatus:'',
                saleStatus:0,
                saleStatusList:[
                    {value:'不限',key:0},{value:'已上架',key:1},{value:'未上架',key:2}
                ],
                keyWord:'',
                supplier:'',
                singleTicketList:[{},{}],
                btn_audit:true,
                pagination:{
                    sizes:[5,10,20,50],
                    size:10,
                    currentPage: 1,
                    total:0
                },
                multipleSelection:[]
            }
        },
        methods:{
            queryData(size,index){
                this.tableLoading = true;
                setTimeout(() => {
                    this.tableLoading = false;
                },2000)
                // this.groupHttp.get("Contract/GetContractSaleList?ContractStatus="+this.ContractStatus+"&ContractType="+this.ContractType+"&ContractNo="+this.ContractNo+"&UserName="
                //     + this.UserName+"&OrderNo="+this.OrderNo+"&PageSize="+(size ? size : 10)+"&PageIndex=" + (index ? index : 1)).then(res => {
                //     console.log(res);
                //     if (res.data.isSuccess == true) {
                //         this.contractList = res.data.objects;
                //         this.pagination.total =  res.data.total;
                //     }else{
                //         this.$message({
                //             type: "info",
                //             message: "出错了" + res.data.message
                //             });
                //         }
                // }).catch(e => {
                //     console.log(e)
                // });
            },
            tableSelectionChange(val){
                this.multipleSelection = val;
            },
            //批量审核
            batchAudit(){},
            //审核
            audit(row){},
            //查看
            check(row){
              this.$router.push({path:'/tickets/multipleDetail'})
            },
            sizeChange(val) {
                this.pagination.size = val;
                this.pagination.currentPage = 1;
                this.queryData(this.pagination.size,this.pagination.currentPage);
            },
            currentPageChange(val) {
                this.pagination.currentPage = val;
                this.queryData(this.pagination.size,this.pagination.currentPage);
            }
        },
        mounted(){
            this.queryData();
        }
    }
</script>
