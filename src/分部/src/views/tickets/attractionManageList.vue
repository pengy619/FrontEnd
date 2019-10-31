<template>
    <div class='view'>
        <el-row>
             <el-col class='w-270'>
                <span>审核状态</span>
                <el-select v-model="auditStatus" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in auditStatusList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-col>
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
        <el-row class='btn-row'>
            <el-col>
                <!-- <el-button type="primary" @click="createTicket" size='small'>创建门票</el-button>
                <el-button type="primary" @click="createAttraction" size='small'>创建景点</el-button> -->
                <el-button type="primary" @click="initAudit('批量')" :disabled="btn_batchAudit" size='small'>批量审核</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="scenicList" max-height="800" tooltip-effect="dark" style="width: 100%" v-loading = 'tableLoading'
        @selection-change="tableSelectionChange">
            <el-table-column size="small" type="selection" fixed  align="center"></el-table-column>
            <el-table-column size="small" prop="scenicNo" label="景点编号" align="center"  show-overflow-tooltip min-width=''></el-table-column>
            <el-table-column size="small" prop="scenicName" label="景点名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="scenicTypeName" label="景点类型" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contact" label="联系人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="tel" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="levelName" label="景点等级" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="address" label="景点地址" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="statusName" label="状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="createUserName" label="创建人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='200'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini"  @click='check(scope.row)' class='table-button'>查看</el-button>
                    <el-button type="text" size="mini"  @click='initAudit(scope.row)' :disabled="scope.row.statusName !== '提交'" class='table-button'>审核</el-button>
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
            var checkstatus = (rule, value, callback) => {
                if(!this.auditForm.status){
                    callback(new Error('你还没有做出审核!'))
                }else{
                    callback()
                }
            } 
            return{
                tableLoading:false,
                submitLoading: false,
                auditStatus:0,
                attractionName: '',
                attractionNo: '',
                auditStatusList:[
                    {
                        key: 0,
                        value: '全部'
                    }
                ],
                auditVisible: false,
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
                scenicList: [{}],
                scenicIdArr: [],
                btn_batchAudit: true,
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
                this.groupHttp.get("TicketScenic/GetScenicPageList?ScenicName="+this.attractionName+
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
            tableSelectionChange(val){
                this.multipleSelection = val;
                this.btn_batchAudit =false;
                if(this.multipleSelection == 0){
                    this.btn_batchAudit = true;
                }else{
                    this.multipleSelection.forEach( (sel) => {
                        if (sel.status !== 2) {
                            this.btn_batchAudit = true;
                        }
                    })
                }
            },
            //查看
            check(row){
                this.$router.push({
                    path: '/tickets/attractionDetail',
                    query: {ticketScenicId: row.scenicId}
                })
            },
            //初始化审核
            initAudit (row) {
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
                this.scenicIdArr = [];
                if (row === '批量') {
                    this.multipleSelection.forEach( (sel) => {
                        this.scenicIdArr.push(sel.scenicId)
                    })
                }else{
                    this.scenicIdArr.push(row.scenicId)
                }
                this.auditForm = {
                    status: '',
                    desc: ''
                }
            },
            //提交审核
            handlerAudit () {
                console.log(this.auditForm.status);
                this.$refs.auditForm.validate( (valid) => {
                    if(valid){
                        this.submitLoading = true;
                        this.groupHttp.post("TicketScenic/CheckScenic", {
                            ScenicIds: this.scenicIdArr,
                            status: this.auditForm.status,
                            checkInfo: this.auditForm.desc
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
            //创建景点
            createAttraction(){
              this.$router.push('/tickets/createAttraction')
            },
            //编辑
            edit(row){

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
