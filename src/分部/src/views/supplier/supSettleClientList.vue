<template>
    <div class='view'>
        <el-row>
             <el-col>
                <span>结算单位</span>
                <el-input v-model="Name" placeholder="" size='small'></el-input>
            </el-col>
            <el-col>
                <span>类型</span>
                <el-select v-model="SupplierType" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in SupplierTypeList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-col>
            <el-col>
                <span>联系人</span>
                <el-input v-model="Contanct" placeholder="" size='small'></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <span>结算方式</span>
                <el-select v-model="DictdataValue" placeholder="请选择" class="input" size="small">
                    <el-option v-for="(item,index) in DictdataValueList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select> 
            </el-col> 
            <el-col>
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="contractList" max-height="800" tooltip-effect="dark" style="width: 100%">
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="Name" label="结算单位名称" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="SetDescs" label="结算周期" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="SupplierTypeString" label="类型" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="Contanct" label="联系人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="MobilePhone" label="联系方式" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="Fax" label="传真" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="StatusString" label="状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="SourceString" label="来源" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="MailingAddress" label="通讯地址" align="center" show-overflow-tooltip></el-table-column> 
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='200'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini" :disabled='!(scope.row.canView)' @click='checkContract(scope.row)' class='table-button'>查看</el-button> 
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
    .table-button{
        padding:7px 5px!important;
    }
    .cancle-btn{
        margin:50px 0 0 45%;
    }
</style>
<script>
    import {dateFmt} from '@/utils/tools.js'
    export default{
        data(){
            return{       
                contractList:[],
                DictdataValueList:[],
                DictdataValue:0,
                SupplierTypeList:[],
                SupplierType:0,
                Contanct:'',
                Name:'',
                pagination:{
                    sizes:[5,10,20,50],
                    size:10,
                    currentPage: 1,
                    total:0
                },
            }
        },
        methods:{
            queryData(size,index){
                this.groupHttp.get("Supplier/SupSettleClientList?Name="+this.Name+"&SupplierType="+this.SupplierType+"&Contanct="+this.Contanct+"&DictdataValue="
                    + this.DictdataValue+"&PageSize="+(size ? size : 10)+"&PageIndex=" + (index ? index : 1)).then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.contractList = res.data.objects;
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
            //获取供应商结算方式
            this.groupHttp.get("Supplier/GetDictionaryList").then(res => {
                    if (res.data.isSuccess == true) {
                        this.DictdataValueList = res.data.objects;
                    }else{
                        this.$message({
                            type: "info",
                            message: "出错了" + res.data.message
                            });
                        }
                }).catch(e => {
                    console.log(e)
                });  
            //获取供应商类型
            this.groupHttp.get("Supplier/SupplierTypeList").then(res => {
                    if (res.data.isSuccess == true) {
                        this.SupplierTypeList = res.data.objects; 
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