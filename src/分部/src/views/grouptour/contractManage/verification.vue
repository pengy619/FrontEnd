<template>
<div class="view">
    <el-form size="small" :inline="true" :model="form" label-width="80px">
      <el-form-item label="合同类型">
        <el-select v-model="form.ContractType" placeholder="请选择" size='small'>
            <el-option v-for="item in ContractTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.ContractStatus" placeholder="请选择" size='small'>
            <el-option v-for="(item,index) in StatusList" :key="index" :label="item.value" :value="item.key"></el-option>
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
      <el-form-item label="归还人">
        <el-input v-model="form.ReturnByName"></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="form.OrderNo"></el-input>
      </el-form-item>
      <el-form-item label="合同编号">
        <el-input v-model="form.ContractNo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click='getTableList()'>搜索</el-button>
      </el-form-item>
    </el-form>
      <el-row>
        <el-button size="small" type="primary" :disabled="flag" @click="Verification">合同核销</el-button>
      </el-row>
      <div style="margin-top: 10px;">
        <el-table v-loading="loading" :data="table" border style="width:100%" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" label="序号" width="60"></el-table-column>
          <el-table-column align="center" prop="contractTypeName" label="合同类型"></el-table-column>
          <el-table-column align="center" prop="contractNo" label="合同编号" ></el-table-column>
          <el-table-column align="center" prop="companyInfoName" label="派发对象"></el-table-column>
          <el-table-column align="center" prop="userByName" label="使用对象" ></el-table-column>
          <el-table-column align="center" prop="orderNo" label="订单号"></el-table-column>
          <el-table-column align="center" prop="userDate" label="使用时间" >
              <template slot-scope="scope">
                {{scope.row.userDate?scope.row.userDate.split('T')[0]:''}}
               </template>
          </el-table-column>
          <el-table-column align="center" prop="returnByName" label="归还人" ></el-table-column>
          <el-table-column align="center" prop="statusString" label="合同状态"></el-table-column>
          <el-table-column align="center" prop="address" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleViewDetail(scope.row)">查看</el-button>
              <el-button type="text" size="mini" @click="Cancel(scope.row)" :disabled="!scope.row.canCancelVerify">取消核销</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
       <el-dialog title="" :visible.sync="checkVisible" width="600px" center :show-close='false'>
			<el-form size="small"  label-width="120px">
				<el-form-item :label="dialogInfo.labelTime">
					{{dialogInfo.time}}
				</el-form-item>
				<el-form-item :label="dialogInfo.labelName">
						{{dialogInfo.name}}
				</el-form-item>
				<el-form-item :label="dialogInfo.labelReason">
					{{dialogInfo.reason}}
				</el-form-item>
				<el-form-item>
					<el-button @click="checkVisible = false" size='small' class='cancle-btn'>取 消</el-button>
				</el-form-item>
			</el-form>
        </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      flag: true,
      form: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        ContractStatus: "",
        ContractType: "",
        ReturnByName: "",
        OrderNo: "",
        ContractNo: "",
        CompanyInfoID: ""
      },
      dialogInfo: {
        labelTime: "",
        time: "",
        labelName: "",
        name: "",
        labelReason: "",
        reason: ""
      },
      checkVisible: false,
      table: [{}],
      ContractTypes: [],
      StatusList: [],
      CompanyInfoID: [],
      ContractId: [],
      ContractList: {
        ContractIds: []
      },
      options4: [],
      loading1: false
    };
  },
  mounted() {
    this.getTableList();
    this.getContractTypes();
    this.getStatusList();
    this.getCompanyInfoID();
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          this.options4 = this.CompanyList.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    },
    //获取列表
    getTableList(pageIndex=1) {
      this.loading = true;
      this.groupHttp
        .get(
          "/Contract/VerifyContractList?" +
            "PageSize=" +
            this.form.pageSize +
            "&PageIndex=" +
            pageIndex +
            "&total=" +
            this.form.total +
            "&Status=" +
            this.form.ContractStatus +
            "&ContractTypeId=" +
            this.form.ContractType +
            "&ReturnByName=" +
            this.form.ReturnByName +
            "&OrderNo=" +
            this.form.OrderNo +
            "&CompanyInfoID=" +
            this.form.CompanyInfoID +
            "&ContractNo=" +
            this.form.ContractNo
        )
        .then(res => {
          this.table = res.data.objects;
          this.form.total = res.data.total;
          this.loading = false;
        });
    },
    getContractTypes() {
      //合同类型
      this.groupHttp.get("/Contract/GetContractTypeNames").then(res => {
        this.ContractTypes = res.data.objects;
      });
    },
    getStatusList() {
      //状态
      this.groupHttp.get("/Contract/GetContractStatus").then(res => {
        this.StatusList = res.data.objects;
      });
    },
    getCompanyInfoID() {
      //派发对象
      this.groupHttp.get("/Contract/GetContractSenders?keyword= ").then(res => {
        this.CompanyList = res.data.objects.map(item => {
          return { value: item.key, label: item.value };
        });
      });
    },
    Verification() {
      //合同核销
      this.$confirm("确定合同核销?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.groupHttp
          .post("/Contract/VerifyContract", this.ContractList)
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: "success",
                message: "合同核销成功！"
              });
              this.getTableList(this.form.pageIndex);
            } else {
              this.$message({
                type: "info",
                message: "合同核销失败！"
              });
            }
          });
      });
    },
    Cancel(row) {
      //取消合同核销
      this.$confirm("确定取消合同核销?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.groupHttp
          .post("/Contract/CancelVerifyContract", {
            ContractId: row.contractId
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: "success",
                message: "取消合同核销成功！"
              });
              this.getTableList(this.form.pageIndex);
            } else {
              this.$message({
                type: "info",
                message: "取消合同核销失败！"
              });
            }
          });
      });
    },
    handleViewDetail(row) {
      if (row.orderNo) {
        this.$router.push({
          path: "/grouptour/orderCheck",
          query: { orderNo: row.orderNo, orderType: row.orderType }
        });
      } else if (row.invalidByName) {
        this.dialogInfo.labelTime = "作废时间";
        this.dialogInfo.labelName = "作废人";
        this.dialogInfo.labelReason = "作废原因";
        this.dialogInfo.time = row.invalidDateString;
        this.dialogInfo.name = row.invalidByName;
        this.dialogInfo.reason = row.invalidDesc;
        this.checkVisible = true;
      } else if (row.loseByName) {
        this.dialogInfo.labelTime = "丢失时间";
        this.dialogInfo.labelName = "丢失人";
        this.dialogInfo.labelReason = "丢失原因";
        this.dialogInfo.time = row.loseByDateString;
        this.dialogInfo.name = row.loseByName;
        this.dialogInfo.reason = row.loseDesc;
        this.checkVisible = true;
      }
    },
    handleSelectionChange(val) {
      //选择
      this.ContractId = val;
      this.ContractList.ContractIds = [];
      if (this.ContractId.length == 0) {
        this.flag = true;
      } else {
        this.flag = false;
        for (let i = 0; i < this.ContractId.length; i++) {
          this.ContractList.ContractIds.push(this.ContractId[i].contractId);
          if (!this.ContractId[i].canVerify) {
            this.flag = true;
            return;
          }
        }
      }
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getTableList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      this.getTableList(this.form.pageIndex);
      // console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
.el-input {
  width: 200px;
}
.pagination {
  margin: 10px 0;
  text-align: right;
}
</style>
