<template>
  <div class="view">
    <el-form size="small" :inline="true">
      <el-form-item label="领取日期">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="门店名称">
        <el-input v-model="shopName" placeholder class="input"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData(10,1)">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="margin_bottom">
      <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
    </div>
    <el-row class="margin_bottom">
      <span>总门店数：{{contractCountList.CompanyCount||0}}</span>
      <span class="margin_left">总领入：{{contractCountList.ContractCount||0}}</span>
      <span class="margin_left">已派发：{{contractCountList.UsedContractCount||0}}</span>
      <span class="margin_left">未派发：{{contractCountList.UnUsedContractCount||0}}</span>
    </el-row>
    <el-table :data="contractData" algin="center" style="width: 100%" show-summary v-loading="loading">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="CompanyInfoName" label="门店名称" width="180"></el-table-column>
      <el-table-column :prop="item" :label="item" v-for="item in contractTypeList" :key="item"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      loading:false,
      date: "",
      shopName: "",
      contractCountList:[],
      contractData: [],
      contractTypeList:['无合同类型'],
      currentPage: 1,
      pageSize:10,
      total: 10
    };
  },
  methods: {
     //导出
    exportExcel() {
      let sDate = "",
          eDate = "";
      if (this.date && this.date.length > 0) {
        sDate = dateFmt(new Date(this.date[0]), "yyyy-MM-dd");
        eDate = dateFmt(new Date(this.date[1]), "yyyy-MM-dd");
      }
      let url =process.env.WEB_API +`/Contract/ExportContractUsedReportList?ShopName=${this.shopName}&DateFrom=${sDate}&DateTo=${eDate}&PageSize=${this.pageSize}&PageIndex=${this.currentPage}&BranchId=`;
       this.groupHttp.get("/GroupLine/GetBranchId").then(function (res) {
          window.location.href = url + res.data;
      })
    },
    queryData(pageSize,pageIndex){
      this.loading = true;
      let sDate = "",
          eDate = "";
      if (this.date && this.date.length > 0) {
        sDate = dateFmt(new Date(this.date[0]), "yyyy-MM-dd");
        eDate = dateFmt(new Date(this.date[1]), "yyyy-MM-dd");
      }
      this.groupHttp.get('Contract/GetContractUsedReportList?ShopName='+this.shopName+'&TimeFrom='+sDate+'&TimeTo='+eDate+'&PageSize='+this.pageSize+'&PageIndex='+this.currentPage).then(res=>{
        if(res.data.isSuccess == true){
          this.loading = false;
          this.contractCountList = JSON.parse(res.data.contractCountList)
          this.contractData = JSON.parse(res.data.contractList);
          this.contractTypeList = JSON.parse(res.data.contractTypeList);
          this.total = res.data.total;
        }else{
          this.loading = false;
          this.$message.error(res.data.message)
        }
      }).catch(e=>{
        console.log(e)
      })
    },
    handleSizeChange(val) {
       this.pageSize = val;
      this.queryData(val, this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryData(this.pageSize, val);
    }
  },
   mounted() {
    this.queryData(this.pageSize, this.currentPage);
  }
};
</script>

<style>
</style>
