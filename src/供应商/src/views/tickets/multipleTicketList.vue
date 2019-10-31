<template>
    <div class='view'>
        <el-row>
             <!-- <el-col class='w-270'>
                <span>销售状态</span>
                <el-select v-model="saleStatus" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in saleStatusList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-col>
            <el-col>
                <span>关键字</span>
                <el-input v-model="keyWord" placeholder="产品名称、编号，景区名称" size='small'></el-input>
            </el-col>
            <el-col>
                <span>供应商</span>
                <el-input v-model="supplier" placeholder="" size='small'></el-input>
            </el-col> -->
            <el-col>
                <span>编号</span>
                <el-input v-model="ProductNo" placeholder="" size='small'></el-input>
            </el-col>
            <el-col>
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-col>
        </el-row>
        <el-row class='btn-row'>
            <el-col>
                <el-button type="primary" @click="createSingleTicket" size='small'>新增套票产品</el-button>
                <el-button type="primary" @click="onSales" :disabled="btn_up" size='small'>批量上架</el-button>
                <el-button type="primary" @click="DownSales" :disabled="btn_down" size='small'>批量下架</el-button>
                <!-- <el-button type="primary" @click="deleteTicket" :disabled="btn_delete" size='small' icon="el-icon-delete">删除</el-button>
                <el-button type="primary" @click="copyTicket" :disabled="btn_copy" size='small'>复制</el-button>
                <el-button type="primary" @click="setPrice" :disabled="btn_price" size='small'>设置价格</el-button> -->
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="multipleTicketList" max-height="800" tooltip-effect="dark" style="width: 100%" v-loading = 'tableLoading'
        @selection-change="tableSelectionChange">
            <el-table-column size="small" type="selection" fixed  align="center"></el-table-column>
            <el-table-column size="small" prop="productNo" label="编号" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="productName" label="产品名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="classifyName" label="票种" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="supplierName" label="供应商" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="statusName" label="状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="creationTimeFormat" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='200'>
                <template slot-scope="scope">
                    <el-button type="text" size="small"  @click='check(scope.row)' class='table-button'>查看</el-button>
                    <el-button type="text" size="small"  @click='edit(scope.row)' class='table-button'>修改</el-button>
                    <el-button type="text" @click="onSales(scope.row)" :disabled="btn_up" size='small'>上架</el-button>
                    <el-button type="text" @click="DownSales(scope.row)" :disabled="btn_down" size='small'>下架</el-button>
                    <el-button type="text" @click="deleteTicket(scope.row)" :disabled="btn_delete" size='small'>删除</el-button>
                    <el-button type="text" @click="copyTicket(scope.row)" :disabled="btn_copy" size='small'>复制</el-button>
                    <el-button type="text" @click="setPrice(scope.row)" :disabled="btn_price" size='small'>价格及库存</el-button>
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
    export default{
        data(){
            return{
                tableLoading:false,
                saleStatus:0,
                keyWord:'',
                supplier:'',
                ProductNo: '',
                saleStatusList:[
                    
                ],
                multipleTicketList:[],
                btn_up:true,
                btn_down:true,
                btn_delete:true,
                btn_copy:true,
                btn_price:true,
                multipleSelection:[],
                pagination:{
                    sizes:[5,10,20,50],
                    size:10,
                    currentPage: 1,
                    total:0
                }
            }
        },
        methods:{
            queryData(size,index){
                this.tableLoading = true;
                this.ticketHttp.get("TicketProduct/GetProductPageList?ProductType=2&ProductNo="+this.ProductNo
                + "&Status=&ProductName=&PageSize="+(size ? size : 10)+"&PageIndex=" + (index ? index : 1)).then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.multipleTicketList = res.data.objects;
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
                this.tableLoading = false;
            },
            tableSelectionChange(val){
                this.multipleSelection = val;
            },
            //创建单票
            createSingleTicket(){
                this.$router.push({path:'/Tickets/ticketsInfo'})
            },
            //查看
            check (row) {
                this.$router.push({
                    path: '/tickets/singleDetail',
                    query: {productId: row.productId}
                })
            },
            //上架
            onSales(){},
            //下架
            DownSales(){},
            //删除
            deleteTicket(){},
            //复制
            copyTicket(){},
            //设置价格
            setPrice(){},
            //编辑
            edit(row){
              this.$router.push({path:'/Tickets/editDanPiao'})
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
