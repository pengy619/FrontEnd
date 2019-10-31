<template>
    <div class='view'>
        <el-form size="small" :inline="true" :model="form" label-width="80px">
            <!--<el-form-item label="合同编号">
                <el-input v-model="form.OutContractNo" placeholder=""  size='small'></el-input>
            </el-form-item>
            <el-form-item label="合同名称">
                <el-input v-model="form.OutContractName" placeholder=""  size='small'></el-input>
            </el-form-item>
            <el-form-item label="订单编号">
                <el-input v-model="form.OrderNo" placeholder=""  size='small'></el-input>
            </el-form-item>-->
            <el-form-item label="门店名称">
                <el-input v-model="form.ShopName" placeholder=""  size='small'></el-input>
            </el-form-item>
            <el-form-item label="合同日期">
                <el-date-picker
                            :editable = 'false'
                            size='small'
                            v-model="dates"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item >
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='getTable()'>搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table size="small" ref="multipleTable" :data="tableList" max-height="800" tooltip-effect="dark" style="width: 100%" v-loading = 'tableLoading'>
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="shopName" label="门店名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractCount" label="使用合同数量" align="center"></el-table-column>
            <!--<el-table-column size="small" label="操作" align="center" >
                <template slot-scope="scope">
                   <el-button type="text" size="mini"  @click='handleViewContract(scope.row)' :disabled="!scope.row.outContractNo" class='table-button'>详情</el-button>
                    <el-button type="text" size="mini"  @click='handleDownload(scope.row)' :disabled="!scope.row.outContractNo" class='table-button'>下载</el-button>
                </template>
            </el-table-column>-->
        </el-table>
        <div class="pagination">
        <el-pagination 
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="form.pageIndex"
              :page-sizes="[5,10,20,50]"
              :page-size="form.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="form.total">
          </el-pagination> 
      </div>
    </div>
</template>

<script>
    import {dateFmt} from '@/utils/tools.js'
    export default {
        data(){
            return{
                form:{
                    pageSize: 10,
                    pageIndex: 1,
                    total: 0,
                    OutContractNo: '',
                    OutContractName: '',
                    OrderNo: '',
                    ShopName: '',
                },
                dates:[],
                tableLoading: true,
                tableList:[],
            }
        },
        methods:{
            getTable(pageIndex=1){
                let BeginDate = '',EndDate = '';
                if(this.dates && this.dates.length > 0){
                    BeginDate = dateFmt(new Date(this.dates[0]),'yyyy-MM-dd');
                    EndDate = dateFmt(new Date(this.dates[1]),'yyyy-MM-dd');
                }
                this.tableLoading = true;
                this.groupHttp.get("Contract/GetElectronicContractAnalysis?"+
                "&PageSize="+this.form.pageSize+
                "&PageIndex="+pageIndex+
                "&total="+this.form.total+
                "&OutContractNo="+this.form.OutContractNo+
                "&OutContractName="+this.form.OutContractName+
                "&ShopName=" + this.form.ShopName+
                "&OrderNo="+this.form.OrderNo+
                "&StartCreateTime="+BeginDate+
                "&EndCreateTime="+EndDate
  ).then(res => {
  if (res.data.isSuccess) {
  this.tableList = res.data.objects;
  this.form.total = res.data.total;
  this.tableLoading = false;
  }else{
  this.$message({
  type: "info",
  message: "出错了" + res.data.message
  });
  }
  this.tableLoading = false;
  }).catch(e => {
  this.tableLoading = false;
  });
  },
  //详情
  handleViewContract(row){
  this.$router.push({path:'/ContractManage/electronicContractDetail',query:{contractNo:row.outContractNo}})
  },
  handleSizeChange(val) {
  this.form.pageSize = val
  this.getTable()
  // console.log(`每页 ${val} 条`);
  },
  handleCurrentChange(val) {
  this.form.pageIndex = val;
  this.getTable(this.form.pageIndex)
  // console.log(`当前页: ${val}`);
  },
  },
  mounted(){
  this.getTable();
  }
  }
</script>
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
    .pagination{
        margin: 10px 0;
        text-align: right;
    }
    .search{
        margin-left:20px;
    }
</style>
