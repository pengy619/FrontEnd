<template>
  <div class="view">
    <el-form :inline="true" :model="form" size="small">
      <el-form-item label="状态">
        <el-select v-model="form.Status" placeholder="请选择状态" clearable> 
          <el-option
            v-for="item in StatusList"
            :key="item.value"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代付编号">
        <el-input v-model="form.payNo"></el-input>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input v-model="form.orderNo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getTable()">查找</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-top:10px;">
      <el-table :data="form.table" border style="width: 100%" size="small">
        <el-table-column align="center" prop="supplierName" label="结算单位"></el-table-column>
        <el-table-column align="center" prop="payNo" label="代付编号" width="120"></el-table-column>
        <el-table-column align="center" prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column align="center" prop="amount" label="订单金额"></el-table-column>
        <el-table-column align="center" prop="paymentAmount" label="代付金额"></el-table-column>
        <el-table-column align="center" prop="strSettlementMethod" label="代付方式"></el-table-column>
        <!-- <el-table-column align="center" prop="voucher" label="付款凭证">
          <template slot-scope="scope">
            <el-button sinze="mini" type="text" @click='handlePictureCardPreview(scope.row.substituteInvoice)' :disabled='scope.row.substituteInvoice != null ? false:true '>点击查看</el-button>
          </template>
        </el-table-column> -->
        <el-table-column align="center" prop="strStatus" label="状态"></el-table-column>
        <el-table-column align="center" prop="name" label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="Examine(scope.row)">查看</el-button>
           <el-button size="mini" type="text" @click='examinePaymentVoucher(scope.row)' :disabled='scope.row.paymentVoucher != null && scope.row.paymentVoucher != "" ? false:true '>查看水单</el-button>
            <el-button
              size="mini"
              type="text"
              @click="cancel(scope.row)"
              :disabled="scope.row.status == 0 ? false:true"
            >取消代付</el-button>
            <!-- <el-button
              size="mini"
              type="text"
              @click="payAgain(scope.row)"
              :disabled="scope.row.status == 2 ? false:true"
            >重新发起代付</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.pageIndex"
        :page-sizes="[5,10,20,50]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="form.total"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <el-dialog
      title="查看水单"
      :visible.sync="isExaminePaymentVoucher"
      width="710px"
      class="paymentVoucher"
    >
      <div class="img_div">
        <div v-for="(item,index) in paymentVoucherList" :key="index">
          <a :href="item" target="_blank">
            <img v-if="!item.nopic" :src="item" class="avatar">
          </a>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isExaminePaymentVoucher = false">返 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.paymentVoucher .img_div {
  height: 205px;
  overflow: auto;
}
.paymentVoucher .img_div div {
  float: left;
  margin: 10px 17px 0 0px;
}
.paymentVoucher .img_div img {
  width: 200px;
  height: 180px;
  border: 1px solid #e5e5e5;
}
</style>
<script>
export default {
  data() {
    return {
      form: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        Status: "",
        payNo: "",
        orderNo: "",
        table: [{}]
      },
      dialogVisible:false,
      dialogImageUrl:'',
      StatusList: [],
      isExaminePaymentVoucher: false,
      paymentVoucherList: []
    };
  },
  mounted() {
    this.getTable();
    this.getStatus();
  },
  methods: {
      //查看付款凭证
       handlePictureCardPreview(url)
        {
          this.dialogImageUrl = url;
          this.dialogVisible = true;
        }
      ,
    examinePaymentVoucher(row) {
      this.isExaminePaymentVoucher = true;
      this.paymentVoucherList = JSON.parse(row.paymentVoucher);
      alert(paymentVoucherList);
    },
    getTable(pageIndex=1) {
      this.shopHttp
        .get(
          "/GroupLinePayForAnotherShop/GetPayForAnotherList?" +
            "&pageSize=" +
            this.form.pageSize +
            "&pageIndex=" +
            pageIndex +
            "&total=" +
            this.form.total +
            "&Status=" +
            this.form.Status +
            "&payNo=" +
            this.form.payNo +
            "&orderNo=" +
            this.form.orderNo
        )
        .then(res => {
          this.form.table = res.data.objects;
          this.form.total = res.data.total;
        });
    },
    getStatus() {
      this.shopHttp
        .post("/GroupLinePayForAnotherShop/GetPayForAnotherStatus", {
          keys: [1, 2, 3]
        })
        .then(res => {
          this.StatusList = res.data.keyValueList;
        });
    },
    payAgain(row) {
      //重新发起代付
      this.$confirm("确定重新发起代付?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.shopHttp
          .post("/GroupLinePayForAnotherShop/OperationPayForAnother", {
            Status: 0,
            PayNo: row.payNo
          })
          .then(res => {
            this.getTable(this.form.pageIndex);
            this.$message({
              type: "success",
              message: "发起代付成功！"
            });
          });
      });
    },
    Examine(row) {
      //查看
      this.$router.push({
        path: "/orderCenter/payDetail",
        query: { PayNo: row.payNo }
      });
    },
    cancel(row) {
      //取消代付
      this.$confirm("确定取消代付?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.shopHttp
          .post("/GroupLinePayForAnotherShop/OperationPayForAnother", {
            Status: 3,
            PayNo: row.payNo
          })
          .then(res => {
            this.getTable(this.form.pageIndex);
            this.$message({
              type: "success",
              message: "取消代付成功！"
            });
          });
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
  }
};
</script>
