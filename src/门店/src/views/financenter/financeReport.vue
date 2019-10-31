<template>
  <div class="view">
    <el-form size="small" :inline="true" :model="form">
      <el-form-item label="业务类型">
        <el-select v-model="form.reportType" placeholder="请选择" class="input" clearable>
          <el-option
            v-for="item in typeList"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="form.TimeType" placeholder="请选择" class="input" clearable>
          <el-option
            v-show="!((form.reportType ==2 && item.key ==3) || (form.reportType ==3 && (item.key ==3 || item.key ==2)))"
            v-for="item in selectList"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="form.Date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <br>
      <el-form-item label="销售员">
        <el-input v-model="form.CreatorName"></el-input>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="form.SupplierName"></el-input>
      </el-form-item>
      <el-form-item label="线路类型"  v-show="form.reportType==1">
          <el-select v-model="form.lineTypeName" placeholder="请选择" class="input" clearable>
            <el-option
              v-for="item in lineTypeList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Name">
            </el-option>
          </el-select>
      </el-form-item>
      <br>
      <el-form-item label="线路名称">
        <el-input v-model="form.LineName"></el-input>
      </el-form-item>
      <el-form-item label="目的地"  v-show="form.reportType==1">
        <el-input v-model="form.TargetCityName"></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="form.OrderNo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData()">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="margin_bottom">
      <el-button size="small" @click="handleExport">导出</el-button>
    </div>
    <div class="flex">
      <span>总人数：{{personQuantity}}</span>
      <span>总应收款：{{receivableFee}}</span>
      <span>总已收款：{{receivedFee}}</span>
      <span>总未收款：{{unReceivedAmount}}</span>
      <!-- <span>总已付款：{{paidFee}}</span>
      <span>总未付款：{{unPaidFee}}</span>
      <span>总利润：{{profitAmount}}</span> -->
    </div>
    <el-table :data="tableData" show-summary size="small" v-loading="table_loading">
      <el-table-column align="center" type="index" label="序号"></el-table-column>
      <el-table-column size="small" align="center" prop="orderNo" label="订单编号"></el-table-column>
      <el-table-column size="small" align="center" prop="creatorName" label="销售员"></el-table-column>
      <el-table-column size="small" align="center" prop="personQuantity" label="人数"></el-table-column>
      <el-table-column size="small" align="center" prop="creationTime" label="预订日期"></el-table-column>
      <el-table-column size="small" align="center" prop="departureDate" label="出团日期" v-if="form.reportType!=3"></el-table-column>
      <el-table-column size="small" align="center" prop="returnDate" label="回团日期" v-if="form.reportType==1"></el-table-column>
      <el-table-column size="small" align="center" prop="lineName" label="线路名称"></el-table-column>
      <el-table-column size="small" align="center" prop="targetCityName" label="目的地" v-if="form.reportType==1"></el-table-column>
      <el-table-column size="small" align="center" prop="receivableFee" label="应收款"></el-table-column>
      <el-table-column size="small" align="center" prop="receivedFee" label="已收款"></el-table-column>
      <el-table-column size="small" align="center" prop="unReceivedAmount" label="未收款"></el-table-column>
      <!-- <el-table-column size="small" align="center" prop="payableFee" label="应付款"></el-table-column>
      <el-table-column size="small" align="center" prop="paidFee" label="已付款"></el-table-column>
      <el-table-column size="small" align="center" prop="unPaidFee" label="未付款"></el-table-column>
      <el-table-column size="small" align="center" prop="profitAmount" label="推广费"></el-table-column> -->
      <el-table-column size="small" align="center" prop="supplierName" label="供应商"></el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 40,50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      lineTypeList:[],
      table_loading: false,
      total: 0,
      paidFee: 0,
      payableFee: 0,
      personQuantity: 0,
      profitAmount: 0,
      reCount: 0,
      receivableFee: 0,
      receivedFee: 0,
      unPaidFee: 0,
      unReceivedAmount: 0,
      pageSize: 10,
      pageIndex: 1,
      selectList: [
        { key:"",name:'全部'},
        { key: 1, name: "预订日期" },
        { key: 2, name: "出团日期" },
        { key: 3, name: "回团日期" }
      ],
      typeList: [],
      form: {
        lineTypeName:'',
        reportType:"1",
        TimeType: "",
        Date: "",
        CreatorName: "",
        SupplierName: "",
        LineName: "",
        TargetCityName: "",
        OrderNo: ""
      },
      tableData: []
    };
  },
  mounted() {
    this.getFinanceReportType();
    this.queryData();
    this.getLineTypeList();
  },
  methods: {
     //获取线路类型
    getLineTypeList(){
      this.shopHttp.post('GroupLine/GetExternalGroupLineTypeList').then(res=>{
        if(res.data.isSuccess == true){
          this.lineTypeList = JSON.parse(res.data.data) 
        }else{
          this.$message.error('线路类型获取失败')
        }
      }).catch(e=>{
        console.log(e);
      })
    },
    handleExport() {
      let BeginDate = "",
        EndDate = "";
      if (this.form.Date && this.form.Date.length > 0) {
        BeginDate = this.form.Date[0];
        EndDate = this.form.Date[1];
      }
      let WEB_API = process.env.WEB_API;
      let url = WEB_API + `/GroupLineReport/ExportFinanceReport?FinanceReportType=${this.form.reportType}&TimeType=${
          this.form.TimeType
        }&LineTypeName=${this.form.lineTypeName}&TimeFrom=${BeginDate}&TimeTo=${EndDate}&CreatorName=${
          this.form.CreatorName
        }&SupplierName=${this.form.SupplierName}&LineName=${
          this.form.LineName
        }&TargetCityName=${this.form.TargetCityName}&OrderNo=${
          this.form.OrderNo
        }&PageSize=${this.pageSize}&PageIndex=${this.pageIndex}&ShopId=`;
        this.shopHttp.get("/Finance/GetShopId").then(function(res) {
          window.location.href = url + res.data;
      });
    },
    queryData(pageIndex=1) {
      let BeginDate = "",
        EndDate = "";
      if (this.form.Date && this.form.Date.length > 0) {
        BeginDate = this.form.Date[0];
        EndDate = this.form.Date[1];
      }
      this.table_loading = true;
      this.shopHttp
        .get(
          `GroupLineReport/GetFinanceReport?FinanceReportType=${this.form.reportType}&TimeType=${
            this.form.TimeType
          }&LineTypeName=${this.form.lineTypeName}&TimeFrom=${BeginDate}&TimeTo=${EndDate}&CreatorName=${
            this.form.CreatorName
          }&SupplierName=${this.form.SupplierName}&LineName=${
            this.form.LineName
          }&TargetCityName=${this.form.TargetCityName}&OrderNo=${
            this.form.OrderNo
          }&PageSize=${this.pageSize}&PageIndex=${pageIndex}`
        )
        .then(res => {
          this.total = res.data.data.reCount;
          this.tableData = res.data.data.dataList;
          this.paidFee = res.data.data.paidFee;
          this.payableFee = res.data.data.payableFee;
          this.personQuantity = res.data.data.personQuantity;
          this.profitAmount = res.data.data.profitAmount;
          this.reCount = res.data.data.reCount;
          this.receivableFee = res.data.data.receivableFee;
          this.receivedFee = res.data.data.receivedFee;
          this.unPaidFee = res.data.data.unPaidFee;
          this.unReceivedAmount = res.data.data.unReceivedAmount;
          res.data.data.dataList.forEach(obj => {
            let date1 = new Date(obj.creationTime);
            let date2 = new Date(obj.departureDate);
            let date3 = new Date(obj.returnDate);
            obj.creationTime = dateFmt(date1, "yyyy-MM-dd");
            obj.departureDate = dateFmt(date2, "yyyy-MM-dd");
            obj.returnDate = dateFmt(date3, "yyyy-MM-dd");
          });
          this.table_loading = false;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getFinanceReportType() {
      this.shopHttp
        .get("GroupLineReport/GetFinanceReportType")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.typeList = res.data.keyValueList;
            this.form.reportType = res.data.keyValueList[0].key
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.queryData(this.pageIndex);
    }
  }
};
</script>

<style scoped lang='scss'>
.flex {
  span {
    margin-right: 50px;
  }
  span:last-child {
    margin-right: 0;
  }
}
</style>
