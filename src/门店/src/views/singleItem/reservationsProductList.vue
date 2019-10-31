<template>
  <div class="view">
    <el-form size="small" label-width="100px" :inline="true" :model="list">
      <el-form-item label="分类">
        <el-select v-model="list.type" placeholder="请选择" class="input">
          <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="list.productName" placeholder class="input"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model="list.supplierName" placeholder class="input"></el-input>
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
      <el-table-column size="small" prop="productName" label="产品名称"></el-table-column>
      <el-table-column size="small" prop="confimStr" label="确认规则"></el-table-column>
      <el-table-column size="small" prop="salePrice" label="同行价"></el-table-column>
      <el-table-column size="small" prop="supplierName" label="供应商"></el-table-column>
      <!-- <el-table-column  label="推广费" width="120">
        <template slot-scope="scope">
          <div>
            {{scope.row.promotionFee+scope.row.promotionStr}}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column size="small" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="reserve(scope.row)"
          >预订</el-button>
          <el-button
            type="text"
            size="mini"
            @click="detail(scope.row)"
          >查看</el-button>
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
      table_loading: false,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      list: {
        type: "",
        productName: "",
        supplierName: ""
      },
      typeOptions: [{id:'',name:'全部'}],
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
      this.shopHttp
        .post("SingleProduct/SingleProductList", {
          supplierName:this.list.supplierName,
          ProductName: this.list.productName,
          ProductTypeId: this.list.type,
          PageSize:this.pageSize,
          PageIndex: pageIndex
        })
        .then(res => {
            this.tableData = res.data.list;
            this.total = res.data.count;
            this.table_loading = false;
        })
        .catch(e => {
          console.log(e);
        });
    },
    reserve(row){
      this.$router.push({path:'/singleItem/reservationsProduct',query:{productId:row.productId}})
    },
    detail(row){
      let {href} = this.$router.resolve({path:'/singleItem/reservationDetails',query:{productId:row.productId}})
      window.open(href);
    },
    //获取分类信息
    getSingleType() {
      this.shopHttp.get("SingleProduct/GetCateList").then(res => {
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

<style>
</style>
