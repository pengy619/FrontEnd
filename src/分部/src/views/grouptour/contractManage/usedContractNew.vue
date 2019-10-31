<template>
    <div class='view'>
        <el-row>
            <el-col>
                <span>合同类型</span>
                <el-select v-model="ContractType" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col>
                <span>合同编号</span>
                <el-input v-model="ContractNo" placeholder="" class="input" size='small'></el-input>
            </el-col>
            <el-col>
                <span>派发对象</span>
                <el-select
                v-model="CompanyInfoID"
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <span>使用人</span>
                <el-input v-model="UserName" placeholder="" class="input" size='small'></el-input>
            </el-col>
            <el-col>
                <span>订单号</span>
                <el-input v-model="OrderNo" placeholder="" class="input" size='small'></el-input>
            </el-col>
            <el-col>
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
            </el-col>
        </el-row>
        <el-table size="small" ref="multipleTable" :data="usedList" max-height="800" tooltip-effect="dark" style="width: 100%">
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="contractNo" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="companyInfoName" label="派发对象" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="orderNo" label="订单号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userName" label="使用人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="userDateFormat" label="使用时间" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                fixed="right"
                :data = 'pagination'
                @size-change="sizeChange"
                @current-change="currentPageChange"
                :current-page="pagination.currentPage"
                :page-sizes="pagination.sizes"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>
<style scoped lang="scss">
.el-input {
  width: 200px;
}
.el-row .el-col {
  width: 300px;
  margin: 15px 10px 10px 5px;
}
.el-row .el-col .el-select {
  width: 200px;
}
.el-row .el-col span {
  display: inline-block;
  width: 70px;
  text-align: right;
  margin-right: 10px;
}
.search {
  margin-left: 20px;
}
</style>
<script>
export default {
  data() {
    return {
      typeList: [],
      ContractType: 0,
      ContractNo: "",
      CompanyList: [],
      CompanyInfoID:'',
      UserName: "",
      OrderNo: "",
      usedList: [{}, {}, {}],
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      },
      options4: [],
      loading: false
    };
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.CompanyList.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    },
    queryData(size, index) {
      this.groupHttp
        .get(
          "Contract/GetContractPayOutList?ContractType=" +
            this.ContractType +
            "&ContractNo=" +
            this.ContractNo +
            "&CompanyInfoID=" +
            this.CompanyInfoID +
            "&UserName=" +
            this.UserName +
            "&OrderNo=" +
            this.OrderNo +
            "&PageSize=" +
            (size ? size : 10) +
            "&PageIndex=" +
            (index ? index : 1)
        )
        .then(res => {
          console.log(res);
          if (res.data.isSuccess == true) {
            this.usedList = res.data.objects;
            this.pagination.total = res.data.total;
          } else {
            this.$message({
              type: "info",
              message: "出错了" + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //查看
    check(row) {
      if (row.orderType == 6) {
        this.$router.push({
          path: "/grouptour/orderCheck",
          query: { orderNo: row.orderNo, orderType: row.orderType }
        });
      } else if (row.orderType == 8) {
        this.$router.push({
          path: "/grouptour/offlineOrderDetail",
          query: { orderNo: row.orderNo, orderType: row.orderType }
        });
      }
    },
    sizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryData(this.pagination.size, this.pagination.currentPage);
    }
  },
  mounted() {
    this.queryData();
    //获取合同类型
    this.groupHttp
      .get("Contract/GetContractTypeNames")
      .then(res => {
        if (res.data.isSuccess == true) {
          this.typeList = res.data.objects;
        } else {
          this.$message({
            type: "info",
            message: "出错了" + res.data.message
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
    //获取派发对象
    this.groupHttp
      .get("Contract/GetContractSenders?keyword=")
      .then(res => {
        if (res.data.isSuccess == true) {
          this.CompanyList = res.data.objects.map(item => {
            return { value: item.key, label: item.value };
          });
        } else {
          this.$message({
            type: "info",
            message: "出错了" + res.data.message
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>
