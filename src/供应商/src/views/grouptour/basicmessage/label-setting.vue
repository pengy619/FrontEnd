<template>
  <div class="view">
    <div class="tab-div">
      <el-table
        :data="GroupLineLabel"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column prop="paramName" label="标签名称"></el-table-column>
        <el-table-column prop="sortId" label="排序"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          fixed="right"
          :data="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="pagination.sizes"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      GroupLineLabel: [],
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
    };
  },
  methods: {
    //查询
    queryData(pageSize, index) {
      this.groupHttp
        .post("GroupLine/GetGroupLineParamList", {
          paramType: 5,
          pageSize: pageSize || 10,
          pageIndex: index || 1
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.GroupLineLabel = res.data.objects;
            this.pagination.total = res.data.total;
          } else {
            this.$message({
              type: "info",
              message: "操作失败: " + res.data.message
            });
            setTimeout(() => {
            }, 500);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //分页
    handleSizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    handleSelectionChange(val) {
      this.checkedItems = val;
      if (this.checkedItems.length > 0) {
        this.deleteBtn = false;
      } else {
        this.deleteBtn = true;
      }
    }
  },
  mounted() {
    this.queryData();
  }
};
</script>

<style>
</style>
