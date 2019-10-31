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
                <span>派发对象</span>
                <el-select v-model="CompanyInfoID" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in CompanyList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <span>归还人</span>
                <el-input v-model="ReturnByName" placeholder="" class="input" size='small'></el-input>
            </el-col>
            <el-col>
                <span>订单号</span>
                <el-input v-model="OrderNo" placeholder="" class="input" size='small'></el-input>
            </el-col>
            <el-col>
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-button size="small" type="primary" @click='returnVisible = true'>合同归还</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="returnList" max-height="800" tooltip-effect="dark" style="width: 100%">
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractNo" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="companyInfoName" label="派发对象" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="allowCompanyInfoName" label="使用对象" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="returnByName" label="归还人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userDateFormat" label="使用时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='150'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click='check(scope.row)'>查 看</el-button>
                    <el-button type="text" size="mini" @click='cancleReturn(scope.row)'>取消归还</el-button>
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
        <el-dialog title="" :visible.sync="returnVisible" width="420px" :show-close='false' center>
            <el-form :model="ReturnContractForm" :rules="returnRule" ref="ReturnContractForm" label-width='100px' class='m-t-30'>
               <el-form-item label='合同编号' prop='code'>
                   <el-input v-model="ReturnContractForm.code" size='small' auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item label='归还人' prop='person'>
                   <el-input v-model="ReturnContractForm.person" size='small' auto-complete="off"></el-input>
               </el-form-item>
            </el-form>
            <el-row>
                <el-col>
                    <el-button @click="returnVisible = false" size='small' class='m-l-110'>取 消</el-button>
                    <el-button type="primary" @click="ReturnContract('ReturnContractForm')" size='small'>确 定</el-button>
                </el-col>
            </el-row>
            
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
    .m-t-30{
        margin-top:-30px;
    }
    .m-l-110{
        margin-left:110px;
    }
    .view .el-button--mini{
        padding:7px 5px!important;
    }
</style>
<script>
    export default{
        data(){
            return{
                typeList:[],
                ContractType:0,
                ContractNo:'',
                CompanyList:[],
                CompanyInfoID:-1,
                ReturnByName:'',
                OrderNo:'',
                returnList:[],
                //归还合同
                returnVisible:false,
                ReturnContractForm:
                {
                    code:"",
                    person:""
                }, 
                pagination:{
                    sizes:[5,10,20,50],
                    size:10,
                    currentPage: 1,
                    total:0
                },
                returnRule:{
                    code:[
                        {max:30,message:'合同编号不能太长'}
                    ],
                    person:[
                        {max:30,message:'归还人不能太长'}
                    ], 
                }
            }
        },
        methods:{
            queryData(size,index){
                this.groupHttp.get('Contract/GetContractReturnList?ContractType='+this.ContractType+'&ContractNo='
                    +this.ContractNo+'&CompanyInfoID='+this.CompanyInfoID+'&ReturnByName='+this.ReturnByName
                    +'&OrderNo='+this.OrderNo+'&PageSize='+(size ? size : 10)+'&PageIndex='+(index ? index : 1)
                ).then( res => {
                    console.log(res)
                       if(res.data.isSuccess == true){
                           this.returnList = res.data.objects;
                           this.pagination.total = res.data.total;
                       }else{
                            this.$message({
                                type:'info',
                                message:'出错了!' + res.data.message
                            })  
                       }
                    }
                ).catch( e => {
                    console.log(e)
                });
            },
            //查看
            check(row){
                this.$router.push({
                    path:'/grouptour/orderCheck',
                    query:{orderNo:row.orderNo,orderType:row.orderType}
                })
            },
            //取消归还
            cancleReturn(row){
                this.$confirm("是否执行删除操作?", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.groupHttp.post('Contract/CancelReturnContract',{
                        ContractNo:row.contractNo
                    }).then(res => {
                        console.log(res);
                        if(res.data.isSuccess == true){
                            this.$message({
                                    type:'success',
                                    message:'取消归还成功'
                                })
                                this.queryData();
                        }else{
                                this.$message({
                                    type:'info',
                                    message:'出错了!' + res.data.message
                                })  
                        }
                    }).catch(e => {
                        console.log(e);
                    })
                }).catch(e => {
                    console.log(e);
                })
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
            ReturnContract(formName)
            {
                this.$refs[formName].validate(valid=>
                {
                    if(valid)
                    {
                        this.groupHttp.post("Contract/ReturnContract",{ContractNo:this.ReturnContractForm.code,ReturnByName:this.ReturnContractForm.person})
                        .then(res=>
                        {
                            if(res.data.isSuccess==true)
                            {
                                this.queryData(this.pagination.size,this.pagination.currentPage);
                                this.$message({
                                    type:"success",
                                    message:"您已成功归还"
                                })
                                this.ReturnContractForm=
                                {
                                    code:"",
                                    person:""
                                }
                                this.returnVisible=false;
                            }else
                            {
                                this.$message({
                                    type:"info",
                                    message:"操作失败"+res.data.message
                                })
                            }
                        }).catch(e=>
                        {
                            console.log(e);
                        });
                    }else
                    {
                        console.log("error submit!!");
                        return false;
                    }
                });
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
            //获取派发对象  
            this.groupHttp.get("Contract/GetContractSenders?keyword=").then(res => {
                    if (res.data.isSuccess == true) {
                        this.CompanyList = res.data.objects;
                        this.CompanyList.unshift({
                            value:'全部',
                            key:-1
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
