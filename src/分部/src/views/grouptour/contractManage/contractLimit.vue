<template>
  <div class="view">
    <el-form size="small" :inline="true" :model="form" label-width="100px">
      <el-form-item label="门店名称">
        <el-input v-model="form.DisCompanyName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click='getTableList()'>搜索</el-button>
      </el-form-item>
    </el-form>
      <el-row>
        <el-button size="small" type="primary" :disabled="flag" @click='Editors'>批量编辑</el-button>
      </el-row>
      <div style="margin-top: 10px;">
        <el-table v-loading="loading" :data="table" border style="width:100%" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" label="序号" width="60"></el-table-column>
          <el-table-column align="center" prop="disCompanyName" label="门店名称"></el-table-column>
          <el-table-column align="center" prop="contractQuota" label="合同限数" ></el-table-column>
          <el-table-column align="center" prop="contractQuota" label="是否启用电子合同" >
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleEnable(scope.row)" v-if="!scope.row.enable">启用</el-button>
              <span v-else>已启用</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="address" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="Editor(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
      <el-dialog append-to-body :visible.sync="dialogVisible"  width="400px">
          <el-form size="small" :inline="true" :model="contract" label-width="140px">
            <el-form-item label="合同限额">
              <el-input type="number" v-model="contract.ContractQuota"></el-input>
            </el-form-item>
            <el-form-item label="是否启用电子合同">
              <el-checkbox v-model="contract.Enable"></el-checkbox>
            </el-form-item>
            <el-form-item style="margin-left:80px">
                <el-button size="small" type="primary" @click="confirm">确定</el-button>
                <el-button size="small" type="info" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        loading: false,
        flag: true,
        dialogVisible: false,
        form:{
          pageSize: 10,
          pageIndex: 1,
          total: 0,
          DisCompanyName: '',
        },
        contract:{
          DisCompanyIds:[],
          ContractQuota: '',
          Enable:false
        },
        contractList:[],
        table:[{}]
      }
    },
    mounted () {
      this.getTableList();
    },
    methods:{
      //获取列表
      getTableList(pageIndex=1){
        this.loading = true;
        this.groupHttp.get('/Contract/ContractQuotaList?'+
        "PageSize="+this.form.pageSize+
        "&PageIndex="+pageIndex+
        "&total="+this.form.total+
        "&DisCompanyName="+this.form.DisCompanyName).then(res =>{
          this.table = res.data.objects;
          this.form.total = res.data.total; 
          this.loading = false;
        })
      },
      Editor(row){//编辑按钮
        this.dialogVisible = true;
        this.contract.Enable = row.enable;
        this.contract.ContractQuota = row.contractQuota;
        this.contract.DisCompanyIds = row.disCompanyId;
      },
      handleEnable(row){
        this.contract.DisCompanyIds = row.disCompanyId;
        this.contract.ContractQuota = row.contractQuota;
        this.contract.Enable=true;
        this.groupHttp.post('/Contract/UpdateContractQuota',this.contract)
        .then(res =>{
          if(res.data.isSuccess == true){
            this.dialogVisible = false;
            this.getTableList(this.form.pageIndex);
          }
        })
      },
      Editors(){
        this.dialogVisible = true;
      },
      confirm(){//确认按钮
        this.groupHttp.post('/Contract/UpdateContractQuota',this.contract)
        .then(res =>{
          if(res.data.isSuccess == true){
            this.dialogVisible = false;
            this.getTableList(this.form.pageIndex);
          }
        })
      },
      cancel(){
        this.dialogVisible = false;
      },
      handleSelectionChange(val){ //选择
        this.contractList = val;
        this.contract.DisCompanyIds = [];
        if(this.contractList.length == 0){
          this.flag = true;
        }else{
          this.flag = false;
          for(let i=0;i<this.contractList.length;i++){
            this.contract.DisCompanyIds.push(this.contractList[i].disCompanyId) 
          }
        }
      },
      handleSizeChange(val) {
          this.form.pageSize = val
          this.getTableList()
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.form.pageIndex = val;
        this.getTableList(this.form.pageIndex)
        // console.log(`当前页: ${val}`);
      },
    }
  }
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
.el-input{
        width:200px;
    }
.pagination{
  margin: 10px 0;
  text-align: right;
}
</style>

