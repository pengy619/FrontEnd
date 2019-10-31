<template>
  <div class="view">
    <el-form size="small" label-width="100px" :inline="true" :model="list">
      <el-form-item label="产品名称">
        <el-input v-model="list.productName" placeholder class="input"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="list.type" placeholder="请选择" class="input">
          <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryData()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="small"
      algin="center"
      :data="tableData"
      style="width: 100%"
      v-loading="table_loading"
    >
      <el-table-column align="center" type="index" label="序号"></el-table-column>
      <el-table-column size="small" prop="cateName" label="分类"></el-table-column>
      <el-table-column size="small" prop="productName" label="产品名称" width="160"></el-table-column>
      <el-table-column size="small" prop="confimStr" label="确认规则"></el-table-column>
      <el-table-column size="small" prop="salePrice" label="同行价"></el-table-column>
      <el-table-column size="small" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column size="small" label="推广费">
        <template slot-scope="scope">
          <div>
            {{scope.row.promotionFee+scope.row.promotionStr}}
          </div>
        </template>
      </el-table-column>
      <el-table-column size="small" label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="detailView(scope.row)"
          >详情</el-button>
          <el-button type="text" size="small" @click="LineOffSal(scope.row)">下架</el-button>
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
      productId:'',
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      table_loading: false,
      typeOptions: [{id:'',name:'全部'}],
      list: {
        productName: "",
        type: "",
      },
      tableData: []
    };
  },
  mounted() {
    this.getSingleType();
    this.queryData();
  },
  methods: {
    queryData(pageIndex=1) {
      this.table_loading = true;
      this.groupHttp
        .post("SingleProduct/AuditedList", {
          ProductName: this.list.productName,
          ProductCategoriesId: this.list.type,
          PageSize: this.pageSize,
          PageIndex: pageIndex
        })
        .then(res => {
          this.tableData = res.data.list;
          this.total = res.data.count;
          if (res.data.list) {
            res.data.list.forEach(obj => {
              let date1 = new Date(obj.createTime);
              obj.createTime = dateFmt(date1, "yyyy-MM-dd");
            });
          }           
          this.table_loading = false;
        })
        .catch(e => {
          console.log(e);
        });
    },
      //下架
    LineOffSal(row) {
      this.$confirm("此操作将下架此产品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.groupHttp.post('ResourcePlatform/LineOffSale',{
            productNumber: row.productNo
          }).then(res=>{
            if(res.data.isSuccess == true){
              this.$message({
                type:'success',
                message:'下架成功'
              })
              this.queryData(this.PageIndex);
            }else{
              this.$message({
                type:'error',
                message:res.data.info
              })
            }
          }).catch(e=>{
            console.log(e);
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下架"
          });
        });
    },
    //详情
    detailView(row) {
      let {href} = this.$router.resolve({
        path: "/singleItem/singleProductDetail",
        query: { productId: row.productId}
      });
      window.open(href)
    },
    //获取分类信息
    getSingleType() {
      this.groupHttp.get("SingleProduct/GetCateList").then(res => {
        this.typeOptions =this.typeOptions.concat(res.data.cateList);
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData(this.pageIndex);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.queryData(this.pageIndex);
    }
  }
};
</script>

<style scoped lang="scss">
.el-dialog{
  padding-bottom: 20px;
}
</style>
