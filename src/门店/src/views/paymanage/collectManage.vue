<template>
  <div class="view" id="box">
    <el-form size="small" :inline="true" :model="form" class="demo-form-inline" label-width="80px">
      <el-form-item label="代收类型">
        <el-input size="small" v-model="form.DeductedType"></el-input>
      </el-form-item>
      <el-form-item label="代收日期">
        <el-date-picker
          :editable="false"
          size="small"
          v-model="Dates"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="warning" icon="el-icon-search" @click="queryData()">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="tableLoading" size="small" algin="center" :data="tableList">
      <el-table-column size="small" align="center" prop="amount" label="代收金额"></el-table-column>
      <el-table-column size="small" align="center" prop="deductedType" label="代收类型"></el-table-column>
      <el-table-column size="small" align="center" prop="createUserName" label="操作人"></el-table-column>
      <el-table-column size="small" align="center" prop="creationTimeStr" label="代收日期"></el-table-column>
      <el-table-column size="small" align="center" prop="remarks" label="备注"></el-table-column>
      <el-table-column size="small" align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isCancel == true" style="color:#1d7ded">已撤销</span>
          <span v-else style="color:red">已扣款</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        fixed="right"
        :data="pagination"
        @size-change="sizeChange"
        @current-change="currentPageChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      form: {
        DeductedType: "",
        StartDate: "",
        EndDate: ""
      },
      Dates: [],
      //分页
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      tableList: [],
      tableLoading: true
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    //查询数据
    queryData(size, index) {
      this.tableLoading = true;
      let StartDate = "",
        EndDate = "";
      if (this.Dates != null) {
        if (this.Dates.length > 0) {
          StartDate = this.Dates[0];
          EndDate = this.Dates[1];
        }
      }
      this.shopHttp
        .get(
          "CustomerFee/GetCollectRecord?PageSize=" +
            (size || 10) +
            "&PageIndex=" +
            (index || 1) +
            "&DeductedType=" +
            this.form.DeductedType +
            "&StartDate=" +
            StartDate +
            "&EndDate=" +
            EndDate
        )
        .then(res => {
          if (res.data.isSuccess == true) {
            this.tableList = res.data.objects;
            this.tableLoading = false;
            this.pagination.total = res.data.total;
          } else {
            this.$message({
              type: "info",
              message: "出错了!" + res.data.message
            });
            setTimeout(() => {
              this.tableLoading = false;
            }, 500);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //分页
    sizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    }
  }
};
</script>

<style scoped lang='scss'>
</style>