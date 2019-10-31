<template>
    <div class='view'>
        <el-row>
             <el-col>
                <span>使用状态</span>
                <el-select v-model="ContractStatus" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in statusList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-col>
            <el-col>
                <span>合同类型</span>
                <el-select v-model="ContractType" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col>
                <span>合同编号</span>
                <el-input v-model="ContractNo" placeholder="" size='small'></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <span>使用人</span>
                <el-input v-model="UserName" placeholder="" size='small'></el-input>
            </el-col>
            <el-col>
                <span>订单号</span>
                <el-input v-model="OrderNo" placeholder="" size='small'></el-input>
            </el-col>
            <el-col>
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-button size="small" type="primary" :disabled="flag"  @click='Return'>合同归还</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="contractList" max-height="800" tooltip-effect="dark" 
        style="width: 100%" v-loading = 'tableLoading' @selection-change="handleSelectionChange">
            <el-table-column size="small" align="center" type="selection"></el-table-column>
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractNo" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userName" label="使用人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userDateFormat" label="使用时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userStatusText" label="使用状态" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='200'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini" :disabled='!(scope.row.canView)' @click='checkContract(scope.row)' class='table-button'>查看</el-button>
                    <el-button type="text" size="mini" :disabled='!(scope.row.canInvalid)' @click='invalidHandler(scope.row)' class='table-button'>作废</el-button>
                    <el-button type="text" size="mini" :disabled='!(scope.row.canLose)' @click='lostHandler(scope.row)' class='table-button'>丢失</el-button>
                    <el-button type="text" size="mini" :disabled='!(scope.row.canCancelReturn)' @click='Cancel(scope.row)' class='table-button'>取消归还</el-button>
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
        <el-dialog title="" :visible.sync="lostVisible" width="30%" :show-close='false'>
            <el-form :model="lostForm" :rules="lostRule" ref="lostForm" style='margin-top:-50px;'>
               <el-form-item label='丢失原因'>
                   <el-input type="textarea" :rows="4" v-model="lostForm.lostReason"></el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="lostVisible = false" size='small'>取 消</el-button>
                <el-button type="primary" size='small' @click='lostContract'>确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" :visible.sync="invalidVisible" width="30%" :show-close='false'>
            <el-form :model="invalidForm" :rules="invalidRule" ref="invalidForm" style='margin-top:-50px;'>
               <el-form-item label='作废原因'>
                   <el-input type="textarea" :rows="4" v-model="invalidForm.invalidReason"></el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="invalidVisible = false" size='small'>取 消</el-button>
                <el-button type="primary" size='small' @click='invalidContract'>确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" :visible.sync="checkLostVisible" width="600px" center :show-close='false'>
            <el-row style='margin-top:-50px;'>
                <el-col>
                    <span>丢失时间</span>{{checkLost.loseByDateFormat}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>丢失人</span>{{checkLost.loseByName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col style='position:relative'>
                    <span style='position:absolute;'>丢失原因</span><span style='position:absolute;left:85px;width:450px;text-align:left;'>{{checkLost.loseDesc}}</span>
                </el-col>
            </el-row>
            <el-button @click="checkLostVisible = false" size='small' class='cancle-btn'>取 消</el-button>
        </el-dialog>
        <el-dialog title="" :visible.sync="checkInvalidVisible" width="600px" center :show-close='false'>
            <el-row style='margin-top:-50px;'>
                <el-col>
                    <span>作废时间</span>{{checkInvalid.invalidDateFormat}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>作废人</span>{{checkInvalid.invalidByName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span style='position:absolute;'>作废原因</span><span style='position:absolute;left:85px;width:450px;text-align:left;'>{{checkInvalid.invalidDesc}}</span>
                </el-col>
            </el-row>
            <el-button @click="checkInvalidVisible = false" size='small' class='cancle-btn'>取 消</el-button>
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
    .table-button{
        padding:7px 5px!important;
    }
    .cancle-btn{
        margin:50px 0 0 45%;
    }
</style>
<script>
    import {dateFmt} from '@/utils/tools.js'
    export default {
        data(){
            return{
                flag: true,
                tableLoading:false,
                typeList:[],
                ContractType:0,
                statusList:[],
                ContractStatus:0,
                ContractNo:'',
                UserName:'',
                OrderNo:'',
                contractList:[{}],
                //丢失原因
                lostForm:{lostReason:''},
                lostRule:{},
                lostVisible:false,
                //作废原因
                invalidForm:{invalidReason:''},
                invalidRule:{},
                invalidVisible:false,
                //查看丢失
                checkLostVisible:false,
                checkLost:{},
                //查看作废
                checkInvalidVisible:false,
                checkInvalid:{},
                pagination:{
                    sizes:[5,10,20,50],
                    size:10,
                    currentPage: 1,
                    total:0
                },
                contract:[],
                ContractIds:[]
                
            }
        },
        methods:{
            queryData(size,index){
                this.groupHttp.get("Contract/GetContractSaleList?ContractStatus="+this.ContractStatus+"&ContractType="+this.ContractType+"&ContractNo="+this.ContractNo+"&UserName="
                    + this.UserName+"&OrderNo="+this.OrderNo+"&PageSize="+(size ? size : 10)+"&PageIndex=" + (index ? index : 1)).then(res => {
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
            //查看
            checkContract(row){
                console.log(row);
                switch(row.userStatusText){
                    case '未派发':
                        break;
                    case '已派发':
                        break;
                    case '已丢失':
                        this.checkLostVisible = true;
                        this.checkLost = {
                            loseByDateFormat:row.loseByDateFormat,
                            loseByName:row.loseByName,
                            loseDesc:row.loseDesc
                        }
                        break;
                    case '已作废':
                        this.checkInvalidVisible = true;
                        this.checkInvalid = {
                            invalidDateFormat:row.invalidDateFormat,
                            invalidByName:row.invalidByName,
                            invalidDesc:row.invalidDesc
                        }
                        break;
                    case '已使用':
                        this.$router.push({
                            path:'/grouptour/orderCheck',
                            query:{orderNo:row.orderNo,orderType:row.orderType}
                        })
                        break;
                    case '已归还':
                        if(row.invalidByName){
                             this.checkInvalid = {
                                invalidDateFormat:row.invalidDateFormat,
                                invalidByName:row.invalidByName,
                                invalidDesc:row.invalidDesc
                            }
                            this.checkInvalidVisible = true;
                        }else if(row.loseByName){
                            this.checkLost = {
                                loseByDateFormat:row.loseByDateFormat,
                                loseByName:row.loseByName,
                                loseDesc:row.loseDesc
                            }
                            this.checkLostVisible = true;
                        }
                        break;
                }
            },
            //初始化作废
            invalidHandler(row){
                this.invalidVisible = true;
                this.invalidForm = {invalidReason:''};
                this.currentRow = row;
            },
            //初始化丢失
            lostHandler(row){
                this.lostVisible = true;
                this.lostForm={lostReason:''};
                this.currentRow = row;
            },
            //丢失
            lostContract(){
                if(!this.lostForm.lostReason){
                    this.$message({
                        type:'info',
                        message:'您还没有填写丢失原因'
                    })
                    return;
                }
                this.groupHttp.post("Contract/LoseContract",{
                    LoseDesc:this.lostForm.lostReason,
                    Id:this.currentRow.id
                }).then(res => {
                    if (res.data.isSuccess == true) {
                        this.$message({
                            type: "success",
                            message: "操作丢失成功" 
                        })
                        this.queryData();
                        this.lostVisible = false;
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
            //作废
            invalidContract(){
                if(!this.invalidForm.invalidReason){
                    this.$message({
                        type:'info',
                        message:'您还没有填写作废原因'
                    })
                    return;
                }
                this.groupHttp.post("Contract/InvalidContract",{
                    InvalidDesc:this.invalidForm.invalidReason,
                    Id:this.currentRow.id
                }).then(res => {
                    if (res.data.isSuccess == true) {
                        this.$message({
                            type: "success",
                            message: "操作作废成功" 
                        })
                        this.queryData();
                        this.invalidVisible = false;
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
            },
            Return(){//合同归还
                this.groupHttp.post('/Contract/ReturnContract',{ContractIds:this.ContractIds})
                .then(res =>{
                    if(res.data.isSuccess ==true){
                        this.queryData();
                        this.$message({
                            type: 'success',
                            message:'合同归还成功！'
                        })
                    }else{
                        this.$message({
                            type: 'info',
                            message:'合同归还失败！'
                        })
                    }
                })
            },
            handleSelectionChange(val){ //多选
                this.contract = val;
                this.ContractIds = [];
                for(let i=0;i<this.contract.length;i++){
                    this.ContractIds.push(this.contract[i].id);
                    console.log(this.contract[i].canReturn)
                    if(this.contract[i].canReturn == false){
                        this.flag = true;
                        return;
                    }else{
                        this.flag = false;
                    } 
                }
            },
            Cancel(row){
                this.$confirm('确定取消合同归还?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.groupHttp.post('/Contract/CancelReturnContract',{ContractId:row.id})
                        .then(res =>{
                            if(res.data.isSuccess ==true){
                                this.queryData();
                                this.$message({
                                    type: 'success',
                                    message:'取消归还成功！'
                                })
                            }else{
                                this.$message({
                                    type: 'info',
                                    message:'取消归还失败！'
                                })
                            }
                        })
                    })
            }
        },
        mounted(){
            this.queryData();
            //获取合同类型
            this.groupHttp.get("Contract/GetContractTypeNames").then(res => {
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
            //获取使用状态
            this.groupHttp.get("Contract/GetContractStatus").then(res => {
                    if (res.data.isSuccess == true) {
                        this.statusList = res.data.objects;
                        this.statusList.forEach( (v,i) => {
                            if(v.value == '未派发'){
                                this.statusList.splice(i,1)
                            }
                        })
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
