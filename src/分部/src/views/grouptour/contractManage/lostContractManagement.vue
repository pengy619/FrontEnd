<template>
    <div class='view'>
        <el-row>
            <el-col>
                <span>合同类型</span>
                <el-select v-model="ContractType" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col>
                <span>合同编号</span>
                <el-input v-model="ContractNo" placeholder="" class="input" size='small'></el-input>
            </el-col>
            <el-col>
                <span>操作人</span>
                <el-input v-model="handler" placeholder="" class="input" size='small'></el-input>
            </el-col>
            <el-col>
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="lostList" max-height="800" tooltip-effect="dark" style="width: 100%">
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="receivableFee" label="合同类型" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="unReceivedFee" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="customerName" label="操作人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="businessTypeName" label="操作时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='150'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click='checkVisible = true'>查 看</el-button>
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
        <el-dialog title="" :visible.sync="checkVisible" width="30%" center :show-close='false'>
            <el-row style='margin-top:-50px;'>
                <el-col>
                    <span>作废时间</span>{{checkData.time}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>作废人</span>{{checkData.person}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>作废原因</span>{{checkData.reason}}
                </el-col>
            </el-row>
            <el-button @click="checkVisible = false" size='small' style='margin:10px 0 0 45%;'>取 消</el-button>
        </el-dialog>
    </div>
</template>
<style scoped lang="scss">    
    .el-input{
        width:200px;
    }
    .el-row .el-col{
        width:300px;
        margin:15px 10px 10px 5px;
    }
    .el-row .el-col .el-select{
        width:200px;
    }
    .el-row .el-col span{
        display:inline-block;
        width:70px;
        text-align:right;
        margin-right:10px;
    }
    .search{
        margin-left:20px;
    }
</style>
<script>
    export default{
        data(){
            return{
                typeList:[],
                ContractType:0,
                ContractNo:'',
                handler:'',
                lostList:[{},{},{}],
                //查看
                checkVisible:false,
                checkData:{

                },
                pagination:{
                    sizes:[5,10,20,50],
                    size:10,
                    currentPage: 1,
                    total:0
                },
            }
        },
        methods:{
            queryData(){

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
            //获取合同类型
            this.groupHttp.get("Contract/GetContractTypeNames").then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.typeList = res.data.objects;
                    }else{
                        this.$message({
                            type: "info",
                            message: "出错了" + res.data.message
                            });
                        }
                }).catch(e => {
                    console.log(e)
                });  
        }
    }
</script>
