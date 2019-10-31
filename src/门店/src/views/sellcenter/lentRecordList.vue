<template>
    <div class='view'>
         <el-form :inline="true" size="small" label-width="80px">
            <el-form-item label="状态" >
                <el-select v-model="ContractStatus" placeholder="请选择" clearable>
                    <el-option v-for="(item,index) in statusList" :key="index" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同类型" >
                <el-select v-model="ContractType" placeholder="请选择"  clearable>
                    <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同编号" >
                <el-input v-model="ContractNo" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="" >
                <el-button type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table size="small" ref="multipleTable" :data="contractList" max-height="800" tooltip-effect="dark" style="width: 100%">
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractNo" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="outCompanyInfoName" label="借出方" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="inCompanyInfoName" label="借入方" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="operatorDate" label="时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractLendDirection" label="事件" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width='150'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click='check(scope.row)'>查看</el-button>
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
        <el-dialog title="" :visible.sync="detailVisible" width="30%" center :show-close='false'>
            <el-row style='margin-top:-50px;'>
                <el-col>
                    <span>合同类型</span>{{row.contractTypeName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>合同编号</span>{{row.contractNo}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>借出方</span>{{row.outCompanyInfoName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>借入方</span>{{row.inCompanyInfoName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>联系人</span>{{row.inContanct}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>备注</span>{{row.desc}}
                </el-col>
            </el-row>
            <el-button @click="detailVisible = false" size='small' style='margin:10px 0 0 45%;'>取 消</el-button>
        </el-dialog> 
    </div>
</template>
<style scoped lang="scss">   
</style>
<script>
    import {dateFmt} from '@/utils/tools.js'
    export default{
        data(){
            return{
                typeList:[],
                ContractType:0,
                statusList:[],
                ContractStatus:0,
                ContractNo:'',
                contractList:[], 
                row:{},
                //查看
                detailForm:{detailReason:''},
                detailRule:{},
                detailVisible:false,
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
                this.shopHttp.get("Contract/GetContractLendLogList?ContractLendDirection="+
                this.ContractStatus+
                "&ContractTypeId="+
                this.ContractType+
                "&ContractNo="+
                this.ContractNo+
                "&PageSize="+
                (size?size:10)+
                "&PageIndex="+
                (index?index:1)
                )
                .then(res=>{
                    if(res.data.isSuccess==true)
                    {
                        this.contractList=res.data.objects;
                        this.pagination.total=res.data.total;
                    }else
                    {
                    this.$message({
                        type:"info",
                        message:"出错了"+res.data.message
                    });
                    }
                } 
                ).catch(e=>{
                    console.log(e);
                })
            },
            //查看
            check(row){
                this.detailVisible = true;
                this.row=row;
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
            this.shopHttp.get("Contract/GetContractTypeNames").then(res => {
                   // console.log(res);
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
            //获取状态
            this.shopHttp.get("Contract/GetEnumContractLendDirection").then(res => {
                   // console.log(res);
                    if (res.data.isSuccess == true) {
                        this.statusList = res.data.objects;
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
