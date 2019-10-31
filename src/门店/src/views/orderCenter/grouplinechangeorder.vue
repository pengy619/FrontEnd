<template>
  <div class="view">
    <el-form :inline="true" size="small" label-width="100px">
      <el-form-item label="审核状态">
        <el-select v-model="auditStatus" placeholder="请选择" size="small" clearable>
          <el-option
            v-for="item in auditStatusList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="变更编号">
        <el-input v-model="changeOrderNo"></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="orderNo"></el-input>
      </el-form-item>
      <el-form-item label="变更日期">
        <el-date-picker
          :editable="false"
          v-model="changeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData(10,1)">搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom:10px">
      <el-button size="small" type="primary" @click="exportExcel">订单导出</el-button>
    </div>
    <el-table :data="changeTableData" border style="width: 100%" v-loading="loading" size="small">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
     <el-table-column prop="statusName" label="状态"></el-table-column>
      <el-table-column prop="changeOrderNo" label="变更编号"></el-table-column>
      <el-table-column prop="orderNo" label="原订单号"></el-table-column>
      <el-table-column label="变更人数" prop="quantity"></el-table-column>
        <!-- <template slot-scope="scope">
          <span>成人{{scope.row.man}}，老人{{scope.row.oldMan}}，小孩{{scope.row.children}}</span>
        </template> -->
      <el-table-column prop="changedAmount" label="变更订单总金额"></el-table-column>
      <el-table-column prop="createTime" label="申请时间"></el-table-column>
      <el-table-column prop="shopName" label="所属门店" width="160"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="isApproved(scope.row)" v-if="scope.row.shopCanApproval">审核</el-button>
        </template>
      </el-table-column>
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
      userId:localStorage.getItem("userId"),
      loading: false,
      auditStatusList: [],
      auditStatus: "",
      changeOrderNo: "",
      orderNo: "",
      changeDate: "",
      changeTableData: [],
      currentPage: 1,
      total: 10,
      pageSize: 10
    };
  },
  methods: {
    queryData(pageSize, pageIndex) {
      this.loading = true;
      let BeginDate = "",
        EndDate = "";
      if (this.changeDate && this.changeDate.length > 0) {
        BeginDate = dateFmt(new Date(this.changeDate[0]), "yyyy-MM-dd");
        EndDate = dateFmt(new Date(this.changeDate[1]), "yyyy-MM-dd");
      }
      this.shopHttp
        .post("GroupLineChangOrder/GetList", {
          Status: this.auditStatus,
          ChangeOrderNo: this.changeOrderNo,
          OrderNo: this.orderNo,
          DateFrom: BeginDate,
          DateTo: EndDate,
          PageSize: pageSize,
          PageIndex: pageIndex
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            res.data.objects.forEach(obj => {
              obj.createTime = dateFmt(new Date(obj.createTime), "yyyy-MM-dd");
            });
            this.changeTableData = res.data.objects;
            this.total = res.data.total;
            this.loading = false;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //导出
    exportExcel() {
      let sDate = "",
          eDate = "";
      if (this.changeDate && this.changeDate.length > 0) {
        sDate = dateFmt(new Date(this.changeDate[0]), "yyyy-MM-dd");
        eDate = dateFmt(new Date(this.changeDate[1]), "yyyy-MM-dd");
      }
      let url =process.env.WEB_API +`/GroupLineChangOrder/ExportList?Status=${this.auditStatus}&UserId=${this.userId}&ChangeOrderNo=${this.changeOrderNo}&OrderNo=${this.orderNo}&DateFrom=${sDate}&DateTo=${eDate}&PageSize=${this.pageSize}&PageIndex=${this.currentPage}&ShopId=`;
      this.shopHttp.get("/Finance/GetShopId").then(function (res) {
          window.location.href = url + res.data;
      })
    },
    //审核操作
    isApproved(row) {
      this.$confirm("变更单是否确认通过审核?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "通过",
        cancelButtonText: "拒绝",
        type: "warning"
      })
        .then(() => {
          this.Approved(row,true)
        })
        .catch((action) => {
          if(action == 'cancel'){
            this.Approved(row,false)
          }else{
            return false
          }
        });
    },
    Approved(row, boolean){
      this.shopHttp
            .post("GroupLineChangOrder/Approval", {
              ChangeOrderId: row.id,
              Approved: boolean
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                if (boolean) {
                  this.$message({
                    type: "success",
                    message: "该变更单通过审核成功"
                  });
                  this.queryData(this.pageSize, this.currentPage);
                } else {
                  this.$message({
                    type: "warning",
                    message: "该变更单拒绝审核"
                  });
                  this.queryData(this.pageSize, this.currentPage);
                }
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(e => {
              console.log(e);
            });
    },
    //获取审核状态
    getStatus() {
      this.shopHttp
        .get("GroupLineChangOrder/GetStatus")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.auditStatusList = res.data.objects;
          } else {
            this.$message({
              type: "info",
              message: "操作失败:" + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleClick(row) {
      this.$router.push({
        path: "/orderCenter/orderCheck",
        query: { orderId: row.orderId, ChangeOrderId: row.id }
      });
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
    this.getStatus();
  }
};
</script>

<style>
</style>
