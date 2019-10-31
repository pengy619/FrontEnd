<template>
    <div class='view'>
        <el-row>
            <el-col>
                <span>景点名称</span>
                <el-input v-model="attractionName" placeholder="" size='small'></el-input>
            </el-col>
            <el-col>
                <span>景点编号</span>
                <el-input v-model="attractionNo" placeholder="" size='small'></el-input>
            </el-col>
            <el-col>
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="scenicList" max-height="800" tooltip-effect="dark" style="width: 100%" v-loading = 'tableLoading'>
            <el-table-column size="small" prop="scenicNo" label="景点编号" align="center"  show-overflow-tooltip min-width=''></el-table-column>
            <el-table-column size="small" prop="scenicName" label="景点名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="scenicTypeName" label="景点类型" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contact" label="联系人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="tel" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="levelName" label="景点等级" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="address" label="景点地址" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="statusName" label="审核状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='200'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini"  @click='employ(scope.row)' class='table-button'>选用</el-button>
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
        width:180px!important;
    }
    .el-row .el-col{
        width:250px;
        margin:15px 0 10px 5px;
    }
    .el-row .el-col.w-270{
        width:270px;
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
        margin-left:10px;
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
    import {dateFmt} from '@/utils/tools.js'
    export default{
        data(){
            return{
                tableLoading:false,
                auditStatus:0,
                attractionName: '',
                attractionNo: '',
                auditStatusList:[
                    {value:'不限',key:0},{value:'等待审核',key:1},{value:'审核通过',key:2},{value:'审核拒绝',key:3}
                ],
                scenicList:[],
                btn_batchAudit:false,
                // btn_price:true,
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
                this.ticketHttp.get("TicketScenic/GetScenicPageList?ScenicName="+this.attractionName+
                "&ContractType="+this.attractionNo+
                "&PageSize="+(size ? size : 10)+"&PageIndex=" + (index ? index : 1)).then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.scenicList = res.data.objects;
                        this.pagination.total =  res.data.total;
                    }else{
                        this.$message({
                            type: "info",
                            message: "出错了" + res.data.message
                            });
                        }
                }).catch(e => {
                    console.log(e)
                });
            },
            tableSelectionChange(val){
                this.multipleSelection = val;
            },
            //选用
            employ(row){
                console.log(row)
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
