<template>
    <div class='view'>
        <el-form size="small" :inline="true" :model="form" label-width="80px">
            <el-form-item label="合同类型">
                <el-select v-model="form.ContractType" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="派发对象">
                    <el-select
                    v-model="form.CompanyInfoID"
                    filterable
                    remote
                    reserve-keyword
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
            </el-form-item>
            <el-form-item label="领取人">
                <el-input v-model="form.LendName" placeholder="" class="input" size='small'></el-input>
            </el-form-item>
            <el-form-item label="领取时间">
                <el-date-picker v-model="form.LendDate" type="date" placeholder="选择日期" size='small'></el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='getTable()'>搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table size="small" ref="multipleTable" :data="recordList" max-height="800" tooltip-effect="dark" style="width: 100%" v-loading = 'tableLoading'>
            <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
            <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="nums" label="合同派发数量" align="center"  show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="companyInfoName" label="派发对象" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="sendName" label="派发人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="lendName" label="领取人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column size="small" prop="lendDate" label="领取时间" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.lendDate?scope.row.lendDate.split('T')[0]:''}}
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
        <el-pagination 
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="form.pageIndex"
              :page-sizes="[5,10,20,50]"
              :page-size="form.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="form.total">
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
.pagination {
  margin: 10px 0;
  text-align: right;
}
.search {
  margin-left: 20px;
}
</style>
<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      form: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        ContractType: "",
        CompanyInfoID: "",
        LendName: "",
        LendDate: ""
      },
      tableLoading: true,
      typeList: [],
      CompanyList: [],
      recordList: [],
      date: "",
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
    getTable(pageIndex=1) {
      let lendDate = "";
      if (this.form.LendDate) {
        lendDate = dateFmt(new Date(this.form.LendDate), "yy-MM-dd");
      }
      this.tableLoading = true;
      this.groupHttp
        .get(
          "Contract/GetContractSendList?" +
            "&PageSize=" +
            this.form.pageSize +
            "&PageIndex=" +
            pageIndex +
            "&total=" +
            this.form.total +
            "&ContractTypeId=" +
            this.form.ContractType +
            "&CompanyInfoId=" +
            this.form.CompanyInfoID +
            "&LendName=" +
            this.form.LendName +
            "&LendDate=" +
            lendDate
        )
        .then(res => {
          if (res.data.isSuccess) {
            this.recordList = res.data.objects;
            this.form.total = res.data.total;
            this.tableLoading = false;
          } else {
            this.$message({
              type: "info",
              message: "出错了" + res.data.message
            });
          }
          this.tableLoading = false;
        })
        .catch(e => {
          this.tableLoading = false;
        });
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getTable(this.form.pageIndex);
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      this.getTable(this.form.pageIndex);
      // console.log(`当前页: ${val}`);
    }
  },
  mounted() {
    this.getTable();
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
