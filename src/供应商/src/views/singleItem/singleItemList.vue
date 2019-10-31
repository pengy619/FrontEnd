<template>
  <div class="view">
    <el-form size="small" label-width="100px" :inline="true" :model="list">
      <el-form-item label="状态">
        <el-select v-model="list.status" placeholder="请选择" class="input">
          <el-option
            v-for="item in statusOptions"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="list.productName" placeholder class="input"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="list.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="list.type" placeholder="请选择" class="input">
          <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="margin_bottom">
      <el-button
        size="small"
        type="primary"
        @click="$router.push({path:'/singleItem/addSingleItem'})"
      >新增</el-button>
    </div>
    <el-table
      size="small"
      algin="center"
      :data="tableData"
      style="width: 100%"
      v-loading="table_loading"
    >
      <el-table-column align="center" type="index" label="序号"></el-table-column>
      <el-table-column size="small" prop="productTypeName" label="分类"></el-table-column>
      <el-table-column size="small" prop="productName" label="产品名称"></el-table-column>
      <el-table-column size="small" prop="confirmTypeName" label="确认规则"></el-table-column>
      <el-table-column size="small" prop="unitPrice" label="同行价"></el-table-column>
      <el-table-column size="small" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="statusName" label="状态" width="120"></el-table-column>
      <el-table-column size="small" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="delData(scope.row)"
            v-if="scope.row.canDelete"
          >删除</el-button>
          <el-button
            type="text"
            size="mini"
            @click="editData(scope.row)"
            v-if="scope.row.canSubmit"
          >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            @click="putaway(scope.row)"
            v-if="scope.row.canOnSales"
          >上架</el-button>
          <el-button
            type="text"
            size="mini"
            @click="soldOut (scope.row)"
            v-if="scope.row.canOffSales"
          >下架</el-button>
          <el-button
            type="text"
            size="mini"
            @click="auditData(scope.row)"
            v-if="scope.row.canSubmit"
          >提交审核</el-button>
          <el-button type="text" size="mini" @click="detail(scope.row)">查 看</el-button>
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
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      table_loading: false,
      statusOptions: [{key:'',name:'全部'}],
      typeOptions: [{id:'',name:'全部'}],
      list: {
        status: "",
        productName: "",
        type: "",
        date: ""
      },
      tableData: []
    };
  },
  mounted() {
    this.getSingleType();
    this.queryData();
    this.getProductStatusType();
  },
  methods: {
    queryData() {
      let BeginDate = "",
        EndDate = "";
      if (this.list.date && this.list.date.length > 0) {
        BeginDate = this.list.date[0];
        EndDate = this.list.date[1];
      }
      this.table_loading = true;
      this.groupHttp
        .post("SingleProduct/GetProductList", {
          Status: this.list.status,
          ProductName: this.list.productName,
          DateFrom: BeginDate,
          DateTo: EndDate,
          ProductTypeId: this.list.type,
          PageSize: this.pageSize,
          PageIndex: this.pageIndex
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.table_loading = false;
            res.data.objects.forEach(obj => {
              let date1 = new Date(obj.createTime);
              obj.createTime = dateFmt(date1, "yyyy-MM-dd");
            });
            this.tableData = res.data.objects;
            this.total = res.data.total;
          } else {
            this.table_loading = false;
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //上架
    putaway(row) {
      this.groupHttp
        .post("SingleProduct/ProductOnSales", { id: row.productId })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              type:'success',
              message:'已上架'
            })
            this.queryData()
          }else{
            this.$message.error(res.data.message)
          }
        });
    },
    soldOut(row) {
      this.groupHttp
        .post("SingleProduct/ProductOffSales", { id: row.productId })
        .then(res => {
           if (res.data.isSuccess == true) {
            this.$message({
              type:'success',
              message:'已下架'
            })
            this.queryData()
          }else{
            this.$message.error(res.data.message)
          }
        });
    },
    //提交审核
    auditData(row) {
      this.groupHttp
        .post("SingleProduct/SubmitProductForList", { id: row.productId })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              type:'success',
              message:'提交成功'
            })
            this.queryData()
          }else{
            this.$message.error(res.data.message)
          }
        });
    },
    //编辑
    editData(row) {
      this.$router.push({
        path: "/singleItem/addSingleItem",
        query: { productId: row.productId }
      });
    },
    detail(row){
      this.$router.push({
        path: "/singleItem/singleItemDetail",
        query: { productId: row.productId }
      });
    },
    //删除
    delData(row) {
      this.$confirm("确认是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupHttp
            .post("SingleProduct/DeleteProduct", {
              id: row.productId
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.queryData();
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
    //获取产品状态
    getProductStatusType() {
      this.groupHttp.post("SingleProduct/GetProductStatusType").then(res => {
        if (res.data.isSuccess == true) {
          this.statusOptions = this.statusOptions.concat(res.data.keyValueList);
        }
      });
    },
    //获取分类信息
    getSingleType() {
      this.groupHttp.post("SingleProduct/GetAllProductTypeList").then(res => {
        if (res.data.isSuccess == true) {
          this.typeOptions = this.typeOptions.concat(res.data.list);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.queryData();
    }
  }
};
</script>

<style>
</style>
