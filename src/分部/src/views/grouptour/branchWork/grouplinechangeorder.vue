<template>
  <div class="view">
    <el-form :inline="true" size="small" label-width="100px">
      <el-form-item label="审核状态">
        <el-select v-model="auditStatus" placeholder="请选择" size="small">
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
      <el-table-column prop="shopName" label="所属门店"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row,false)" type="text" size="small" style="margin-left:10px;">查看</el-button>
          <el-button @click="handleClick(scope.row,true)" type="text" size="small" v-if="scope.row.canModify">编辑</el-button>
          <el-button type="text" size="small" @click="deleteChangeOrder(scope.row)" v-if="scope.row.canDelete">删除</el-button>
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
    //导出
    exportExcel() {
      let sDate = "",
          eDate = "";
      if (this.changeDate && this.changeDate.length > 0) {
        sDate = dateFmt(new Date(this.changeDate[0]), "yyyy-MM-dd");
        eDate = dateFmt(new Date(this.changeDate[1]), "yyyy-MM-dd");
      }
      let url =process.env.WEB_API +`/GroupLineChangOrder/ExportList?Status=${this.auditStatus}&ChangeOrderNo=${this.changeOrderNo}&OrderNo=${this.orderNo}&DateFrom=${sDate}&DateTo=${eDate}&PageSize=${this.pageSize}&PageIndex=${this.currentPage}&BranchId=`;
       this.groupHttp.get("/GroupLine/GetBranchId").then(function (res) {
          window.location.href = url + res.data;
      })
    },
    queryData(pageSize, pageIndex) {
      this.loading = true;
      let BeginDate = "",
        EndDate = "";
      if (this.changeDate && this.changeDate.length > 0) {
        BeginDate = dateFmt(new Date(this.changeDate[0]), "yyyy-MM-dd");
        EndDate = dateFmt(new Date(this.changeDate[1]), "yyyy-MM-dd");
      }
      this.groupHttp
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
    //删除变更单
    deleteChangeOrder(row) {
      this.$confirm("此操作将删除该变更单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupHttp
            .post("GroupLineChangOrder/DeleteChangeOrder", {
              OrderId: row.orderId,
              ChangeOrderId: row.id
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.queryData(this.pageSize, this.currentPage);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {
          return false;
        });
    },
    //获取审核状态
    getStatus() {
      this.groupHttp
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
    handleClick(row,boole) {
         this.$router.push({
          path: "/grouptour/orderCheck",
          query: { orderId: row.orderId, ChangeOrderId: row.id, save:boole}
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
    this.getStatus();
  }
};
</script>

<style>
</style>
