<template>
  <div class='view'>
    <el-row> 
            <el-col>
                <span>合同类型</span>
                <el-select v-model="contractType" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in contractTypeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
        <el-col>
             <span>派发对象</span>
             <el-select v-model="CompanyInfoID" placeholder="请选择" class="input" size='small'>
                 <el-option v-for="(item,index) in CompanyList" :key="index" :label="item.value" :value="item.key">
              </el-option>
             </el-select>
        </el-col>
      <el-col>
        <span>合同编号</span>
        <el-input v-model="ContractNo" placeholder="" size='small'></el-input>
      </el-col>
      <el-col>
        <span>操作人</span>
        <el-input v-model="Operator" placeholder="" size='small'></el-input>
      </el-col>
      <el-col style='width:100px;'>
        <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索
        </el-button>
      </el-col>
    </el-row>
    <el-table size="small" ref="multipleTable" :data="table" max-height="800" tooltip-effect="dark" style="width: 100%">
      <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
      <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="contractNo" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="sendName" label="派发对象" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="invalidByName" label="作废人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="invalidDateFormat" label="作废失时间" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        fixed="right"
        :data='pagination'
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
</style>
<script>
  export default{
    data(){
      return { 
        contractType:0,
        ContractNo:"",
        Operator:"",
        contractTypeList:[],
        CompanyList:[],
        CompanyInfoID:-1,
        table: [],    
        pagination: {
          sizes: [5, 10, 20, 50],
          size: 10,
          currentPage: 1,
          total: 0
            },
          }
        }, 
        mounted(){  
            this.queryData();
            this.groupHttp.get("Contract/GetContractTypeNames").then(res => {
                    console.log(res);
                    if (res.data.isSuccess == true) {
                        this.contractTypeList = res.data.objects;
                        this.pagination.total = res.data.total;
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
        },
        methods:{
            queryData(size,index){  
                this.groupHttp.get("Contract/InvalidLoseContract?ContractType="+this.contractType+"&CompanyInfoID="+this.CompanyInfoID+"&Operator="+this.Operator+"&ContractNo="+this.ContractNo+"&PageSize="+(size ? size : 10)+"&PageIndex=" + (index ? index : 1)).then(res => {
                    if (res.data.isSuccess == true) {
                        this.table = res.data.objects;
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
    }
</script>