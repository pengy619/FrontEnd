<template>
  <div class="view">
    <el-form :inline="true" size="small" label-width="80px">
      <el-form-item label="分类">
        <el-input v-model="type"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getSingleTypeList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('/singleItem/addSetting')"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="table" size="small" v-loading="tableLoading">
      <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="分类标题"></el-table-column>
      <el-table-column label="是否启用">
        <template slot-scope="scope">
          <span>{{scope.row.isEnabled?'启用':'未启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delData(scope.row,scope.$index,table.length)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
      options: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      type: "",
      table: []
    };
  },
  mounted() {
    // this.getSingleType();
    this.getSingleTypeList();
  },
  methods: {
    // //获取分类信息
    // getSingleType() {
    //   this.groupHttp.post("SingleProduct/GetAllProductTypeList").then(res => {
    //     if (res.data.isSuccess == true) {
    //       this.options = res.data.list;
    //     } else {
    //       this.$message.error(res.data.message);
    //     }
    //   });
    // },
    //获取分类列表
    getSingleTypeList() {
      this.tableLoading = true;
      this.groupHttp
        .post("SingleProduct/GetProductTypeList", {
          Name: this.type,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.table = res.data.objects;
            this.total = res.data.total;
            this.tableLoading = false;
          } else {
            this.tableLoading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //删除
    delData(row,index,length) {
      this.$confirm("确定是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupHttp
            .post("SingleProduct/Delete", {
              id: row.id
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
              });
              if(this.pageIndex == Math.ceil(this.total/this.pageSize) && length ==1){
                if(this.pageIndex > 1){
                  this.pageIndex --
                }
              }
              this.getSingleTypeList();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {
          return;
        });
    },
    //编辑
    editData(row) {
      this.$router.push({
        path: "/singleItem/addSetting",
        query: { id: row.id }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getSingleTypeList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getSingleTypeList();
    }
  }
};
</script>

<style>
</style>
