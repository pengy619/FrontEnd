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
                <span>审核状态</span>
                <el-select v-model="Status" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in auditStatusList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-col>
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
                <!-- <el-button type="primary" @click="createSingleTicket" size='small'>新增单票产品</el-button>
                <el-button type="primary" @click="onSales" :disabled="btn_up" size='small'>批量上架</el-button>
                <el-button type="primary" @click="DownSales" :disabled="btn_down" size='small'>批量下架</el-button> -->
                <!-- <el-button type="primary" @click="deleteTicket" :disabled="btn_delete" size='small' icon="el-icon-delete">删除</el-button>
                <el-button type="primary" @click="copyTicket" :disabled="btn_copy" size='small'>复制</el-button>
                <el-button type="primary" @click="setPrice" :disabled="btn_price" size='small'>设置价格</el-button> -->
                <el-button type="primary" @click='initAudit("批量审核")' :disabled="btn_batchAudit" size='small'>批量审核</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="singleTicketList" max-height="800" tooltip-effect="dark" style="width: 100%" v-loading = 'tableLoading'
        @selection-change="tableSelectionChange">
            <el-table-column size="small" type="selection" fixed  align="center"></el-table-column>
            <el-table-column size="small" prop="productNo" label="编号" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="productName" label="产品名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="classifyName" label="票种" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="supplierName" label="供应商" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="statusName" label="状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="creationTimeFormat" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='270'>
                <template slot-scope="scope">
                    <el-button type="text" size='small' @click='initAudit' class='table-button' :disabled='scope.row.status === 3 || scope.row.status === 4'>审核</el-button>
                    <el-button type="text" size='small' class='table-button'>查看价格</el-button>
                    <!-- <el-button type="text" @click="deleteTicket(scope.row)" :disabled="btn_delete" size='small'>删除</el-button>
                    <el-button type="text" @click="copyTicket(scope.row)" :disabled="btn_copy" size='small'>复制</el-button>
                    <el-button type="text" @click="setPrice(scope.row)" :disabled="btn_price" size='small'>价格及库存</el-button> -->
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
        <el-dialog title="处理审核" :visible.sync="auditVisible" width="600px" >
            <el-form :model="auditForm" ref="auditForm" :rules="auditRule" style='margin-top:-20px;' label-width='90px'>
                <el-form-item label='审核结果' prop='status'>
                    <el-radio-group v-model="auditForm.status">
                        <el-radio :label="4">审核通过</el-radio>
                        <el-radio :label="3">审核拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label='说明' prop='desc'>
                    <el-input type="textarea" :rows="4" v-model="auditForm.desc" style='width:400px'></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditVisible = false" size='small'>取 消</el-button>
                <el-button type="primary" size='small' @click='handlerAudit' :loading="submitLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style scoped lang="scss">
    .el-input{
        width:180px!important;
    }
    .el-row .el-col{
        width:350px;
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
            var checkstatus = (rule, value, callback) => {
                if(!this.auditForm.status){
                    callback(new Error('你还没有做出审核!'))
                }else{
                    callback()
                }
            } 
            return{
                tableLoading: false,
                btn_batchAudit: true,
                saleStatus: 0,
                keyWord: '',
                supplier: '',
                ProductNo: '',
                saleStatusList: [
                    
                ],
                Status: '',
                auditStatusList:[
                    {
                        key: '',
                        value: '全部'
                    }
                ],
                //审核对话框
                auditVisible: false,
                submitLoading: false,
                auditForm: {
                    status: '',
                    desc: ''
                },
                auditRule: {
                    status: [
                        {required:true,validator:checkstatus,trigger: "change"}
                    ],
                    desc: [
                        {required:true,message:'说明不能为空!',trigger: "blur"}
                    ]
                },
                singleTicketList:[],
                btn_up: true,
                btn_down: true,
                btn_delete: true,
                btn_copy: true,
                btn_price: true,
                multipleSelection: [],
                pagination: {
                    sizes: [5,10,20,50],
                    size: 10,
                    currentPage: 1,
                    total: 0
                }
            }
        },
        methods:{
            queryData(size,index){
                this.tableLoading = true;
                this.groupHttp.get("TicketProduct/GetProductPageList?ProductType=1&ProductNo="+this.ProductNo
                +"&Status="+this.Status+"&PageSize="+(size ? size : 10)+"&PageIndex=" + (index ? index : 1)).then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.singleTicketList = res.data.objects;
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
            //查询审核状态
            getScenicStatus () {
                this.groupHttp.get("TicketScenic/GetScenicStatus").then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.auditStatusList = this.auditStatusList.concat(res.data.objects);
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
            //初始化审核
            initAudit (row) {
                console.log(this.multipleSelection);
                if( this.$refs.auditForm ){
                    this.$refs['auditForm'].clearValidate();
                    setTimeout(() => {
                        var els = document.getElementsByClassName('el-form-item__error');
                        if(els){
                            for(var i = 0;i < els.length; i++){
                                els[i].innerHTML = "";
                            }
                        }
                    },100)
                }
                this.auditVisible = true;
                this.ProductIds = [];
                if (row === '批量审核') {
                    this.multipleSelection.forEach( (sel) => {
                        this.ProductIds.push(sel.productId)
                    })
                }else{
                    this.ProductIds.push(row.productId)
                }
                this.auditForm = {
                    status: '',
                    desc: ''
                }
            },
            //提交审核
            handlerAudit () {
                console.log(this.ProductIds);
                this.$refs.auditForm.validate( (valid) => {
                    if(valid){
                        this.submitLoading = true;
                        this.groupHttp.post("TicketProduct/CheckProduct", {
                            ProductIds: this.ProductIds,
                            Status: this.auditForm.status,
                            CheckInfo: this.auditForm.desc
                        }).then(res => {
                            if (res.data.isSuccess == true) {
                                this.$message({
                                    type: "success",
                                    message: "提交审核成功!"
                                });
                                this.queryData(this.pagination.size,this.pagination.currentPage);
                                setTimeout( () => {
                                    this.auditVisible =  false;
                                },1000)
                            }else{
                                this.$message({
                                    type: "info",
                                    message: "出错了" + res.data.message
                                });
                            }
                        }).catch(e => {
                            console.log(e)
                        });
                        this.submitLoading = false;
                    }
                })
            },
            tableSelectionChange(val){
                this.multipleSelection = val;
                this.btn_batchAudit =false;
                if(this.multipleSelection == 0){
                    this.btn_batchAudit = true;
                }else{
                    this.multipleSelection.forEach( (sel) => {
                        if (sel.status === 3 || sel.status === 4 ) {
                            this.btn_batchAudit = true;
                        }
                    })
                }
            },
            //创建单票
            createSingleTicket(){
                this.$router.push({path:'/Tickets/ticketsInfo'})
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
            this.getScenicStatus();
        }
    }
</script>
