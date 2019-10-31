<template>
  <div class='view'>
    <el-row> 
            <el-col>
                <span>合同类型</span>
                <el-select v-model="contractType" placeholder="请选择" class="input" size='small'>
                    <el-option v-for="(item,index) in contractTypeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
        <el-col>
             <span>派发对象</span>
            <el-select
                v-model="CompanyInfoID"
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
        </el-col>
      <el-col>
        <span>合同编号</span>
        <el-input v-model="ContractNo" placeholder="" size='small'></el-input>
      </el-col>
      <el-col>
        <span>丟失人</span>
        <el-input v-model="LoseByName" placeholder="" size='small'></el-input>
      </el-col>
      <el-col style='width:100px;'>
        <el-button class='search' size="small" type="warning" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索
        </el-button>
      </el-col>
    </el-row>
    <el-table size="small" ref="multipleTable" :data="table" max-height="800" tooltip-effect="dark" style="width: 100%">
      <el-table-column size="small" type="index" fixed label="序号" align="center"></el-table-column>
      <el-table-column size="small" prop="contractTypeName" label="合同类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="contractNo" label="合同编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="companyInfoName" label="派发对象" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="loseByName" label="丟失人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" prop="loseByDateFormat" label="丢失时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column size="small" align="center" label="操作" fixed="right" width="100">
          <template slot-scope="scope">
              <el-button type="text" size="mini" @click="check(scope.row)">查看</el-button>
          </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        fixed="right"
        :data='pagination'
        @size-change="sizeChange"
        @current-change="currentPageChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
        <el-dialog title="" :visible.sync="checkLostVisible" width="600px" center :show-close='false'>
            <el-row style='margin-top:-50px;'>
                <el-col>
                    <span>丢失时间</span>{{checkLost.loseByDateFormat}}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span>丢失人</span>{{checkLost.loseByName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col style='position:relative'>
                    <span style='position:absolute;'>丢失原因</span><span style='position:absolute;left:80px;width:450px;text-align:left;'>{{checkLost.loseDesc}}</span>
                </el-col>
            </el-row>
            <el-button @click="checkLostVisible = false" size='small' class='cancle-btn'>取 消</el-button>
        </el-dialog>
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
.cancle-btn {
  margin: 50px 0 0 45%;
}
</style>
<script>
export default {
  data() {
    return {
      contractType: 0,
      ContractNo: "",
      LoseByName: "",
      contractTypeList: [],
      CompanyList: [],
      CompanyInfoID:'',
      table: [],
      row: {},
      //查看丢失
      checkLostVisible: false,
      checkLost: {},
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
  mounted() {
    this.queryData();
    this.groupHttp
      .get("Contract/GetContractTypeNames")
      .then(res => {
        console.log(res);
        if (res.data.isSuccess == true) {
          this.contractTypeList = res.data.objects;
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
    queryData(size,index) {
      this.groupHttp
        .get(
          "Contract/LoseContractList?ContractType=" +
            this.contractType +
            "&CompanyInfoID=" +
            this.CompanyInfoID +
            "&LoseByName=" +
            this.LoseByName +
            "&ContractNo=" +
            this.ContractNo +
            "&PageSize=" +
            (size ? size : 10) +
            "&PageIndex=" +
            (index ? index : 1)
        )
        .then(res => {
          if (res.data.isSuccess == true) {
            this.table = res.data.objects;
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
      this.checkLostVisible = true;
      this.checkLost = {
        loseByDateFormat: row.loseByDateFormat,
        loseByName: row.loseByName,
        loseDesc: row.loseDesc
      };
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
  }
};
</script>

