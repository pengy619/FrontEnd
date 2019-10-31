<template>
  <div class="view">
    <el-form :inline="true" :model="order" label-width="100px" size="small">
      <el-form-item label="支付状态">
        <el-select v-model="order.payStatus" placeholder="请选择" clearable>
          <el-option
            v-for="item in payStatusOptions"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="order.orderStatus" placeholder="请选择" clearable>
          <el-option
            v-for="item in orderStatusOptions"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单日期">
        <el-date-picker
          size="small"
          v-model="order.dates"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="order.productName" placeholder></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="order.orderNo" placeholder></el-input>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="order.supplierName" placeholder></el-input>
      </el-form-item>
      <el-form-item label="内部编码">
        <el-input v-model="order.innerCode" placeholder></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="warning" icon="el-icon-search" @click="queryData()">搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom:10px">
      <el-button size="small" type="primary" :disabled="flag" @click="Bills">申请对帐</el-button>
    </div>
    <el-table
      size="small"
      algin="center"
      :data="table"
      style="width: 100%"
      v-loading="table_loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column size="small" prop="payStatusName" label="支付状态"></el-table-column>
      <el-table-column align="center" prop="orderNo" label="订单号"></el-table-column>
      <el-table-column align="center" prop="innerCode" label="内部编码"></el-table-column>
      <el-table-column align="center" prop="orderStatusName" label="订单状态"></el-table-column>
      <el-table-column align="center" prop="productName" label="产品名称"></el-table-column>
      <el-table-column align="center" prop="supplierName" label="供应商"></el-table-column>
      <el-table-column align="center" prop="quantity" label="人数"></el-table-column>
      <el-table-column align="center" prop="receivableFee" label="应付"></el-table-column>
      <el-table-column align="center" prop="receivedFee" label="已付"></el-table-column>
      <el-table-column align="center" prop="orderDate" label="下单日期"></el-table-column>
      <el-table-column align="center" prop="orderSourceName" label="下单来源"></el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="check(scope.row)">查看</el-button>
          <el-button
            type="text"
            size="mini"
            @click="confirmed(scope.row)"
            v-if="scope.row.showConfirm"
          >确认</el-button>
          <el-button
            type="text"
            size="mini"
            @click="rejective(scope.row)"
            v-if="scope.row.showConfirm"
          >拒绝</el-button>
          <el-button
            type="text"
            size="mini"
            v-if="scope.row.showEditPriceBtn"
            @click="editPrice(scope.row)"
          >修改价格</el-button>
          <el-button
            type="text"
            size="mini"
            v-if="scope.row.showCancel"
            @click="cancelAudit(scope.row)"
          >取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="拒绝理由"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form :model="form" size="small" :rules="rules" ref="form">
        <el-form-item prop="content">
          <el-input v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="small" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 40,50]"
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
      loading: false,
      dialogFormVisible: false,
      table_loading: false,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      orderStatusOptions: [{ name: "全部", key: "" }], //订单状态
      payStatusOptions: [{ name: "全部", key: "" }], //支付状态
      order: {
        productName: "",
        payStatus: "",
        orderStatus: "",
        dates: "",
        orderNo: "",
        supplierName: "",
        innerCode: ""
      },
      orderId: "",
      form: {
        content: ""
      },
      flag: true,
      BillsList: [],
      table: [],
      rules: {
        content: [
          { required: true, message: "请输入拒绝理由", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getOrderStatus();
    this.getOrderPaymentStatus();
    this.queryData();
  },
  methods: {
    queryData() {
      let BeginDate = "",
        EndDate = "";
      if (this.order.dates && this.order.dates.length > 0) {
        BeginDate = this.order.dates[0];
        EndDate = this.order.dates[1];
      }
      this.table_loading = true;
      this.groupHttp
        .post("SingleProductOrder/GetSingleProductOrderList", {
          PayStatus: this.order.payStatus,
          EnumOrderStatus: this.order.orderStatus,
          BeginDate: BeginDate,
          EndDate: EndDate,
          ProductName: this.order.productName,
          OrderNo: this.order.orderNo,
          SupplierName: this.order.supplierName,
          InnerCode: this.order.innerCode,
          OrderSourceType: this.order.orderSourceType,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.table_loading = false;
            res.data.objects.forEach(item => {
              item.orderDate = dateFmt(new Date(item.orderDate), "yyyy-MM-dd");
            });
            this.table = res.data.objects;
            this.total = res.data.total;
          } else {
            this.table_loading = false;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    getOrderStatus() {
      this.groupHttp
        .post("GroupLine/GetOrderStatuslList", {})
        .then(res => {
          if (res.data.isSuccess == true) {
            this.orderStatusOptions = this.orderStatusOptions.concat(
              res.data.keyValueList
            );
          } else {
            this.$message({
              type: "info",
              message: "出错了!" + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    getOrderPaymentStatus() {
      this.groupHttp
        .post("GroupLine/GetOrderPaymentStatusList", {})
        .then(res => {
          if (res.data.isSuccess == true) {
            this.payStatusOptions = this.payStatusOptions.concat(
              res.data.keyValueList
            );
          } else {
            this.$message({
              type: "info",
              message: "出错了!" + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleSelectionChange(val) {
      this.orderIds = [];
      this.BillsList = val;
      this.flag = false;
      if (this.BillsList.length == 0) {
        this.flag = true;
      } else if (this.BillsList.length == 1) {
        for (let i = 0; i < this.BillsList.length; i++) {
          this.orderIds.push(this.BillsList[i].orderId);
          if (!this.BillsList[i].handBill) {
            this.flag = true;
            return;
          }
        }
      } else {
        this.flag = true;
      }
    },
    Bills() {
      this.groupHttp
        .post("FinApplyBill/CreateSupplierBillForSingleOrder", { OrderId: this.orderIds })
        .then(res => {
          if (res.data.isSuccess) {
            this.$message({
              type: "success",
              message: "申请对账成功"
            });
            this.queryData();
          } else {
            this.$message({
              type: "info",
              message: res.data.message
            });
          }
        });
    },
    editPrice(val) { //订单改价
    this.$prompt('目前订单应付价格:' + val.receivableFee, '修改订单应付价格', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/,
      inputErrorMessage: '输入金额格式不正确',
      inputPlaceholder: '请输入新的订单金额',
    }).then(({ value }) => {
      this.loading = true;
      this.groupHttp.post('SingleProductOrder/EditOrderPrice', { 'OrderId': val.orderId, 'EditAmount': value })
        .then(res => {
          if (res.data.isSuccess) {
            this.$message({
              type: 'success',
              message: '价格修改成功',
            });
            this.queryData();
          }
          else {
            this.$message.error(res.data.message);

          }
          this.loading = false;
        })
      }).catch(e => {
        console.log(e);
      });
      },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.queryData();
    },
        //取消审核
    cancelAudit(row) {
      this.$confirm("订单取消审核?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "通过",
        cancelButtonText: "拒绝",
        type: "warning"
      })
        .then(() => {
         this.cancel(row,true)
        }).catch((action) => {
          if(action == 'cancel'){
             this.cancel(row,false)
          }
      });
    },
    cancel(row,boolean){
        this.groupHttp.post("SingleProductOrder/CancelSingleProductOrder", {
        Id:row.orderId,
        Canceled:boolean
      })
        .then(res => {
          if (res.data.isSuccess == true) {
            if(boolean == true){
              this.$message({
              type: "success",
              message: "订单取消审核通过"});
            }else{
              this.$message({
              type: "warning",
              message: "订单取消审核拒绝"});
            }
            this.queryData();
          } else {
            this.$message({
              type: "info",
              message: "操作失败:" + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e)
        });
    },
    //查看
    check(row) {
      this.$router.push({
        path: "/singleItem/singleOrderDetail",
        query: { id: row.orderId }
      });
    },
    //拒绝通过
    rejective(row) {
      this.dialogFormVisible = true;
      this.orderId = row.orderId;
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.loading = true;
          this.groupHttp
            .post("SingleProductOrder/RefuseSingleProductOrder", {
              Reason: this.form.content,
              id: this.orderId
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "已拒绝"
                });
                this.loading = false;
                this.$refs[form].resetFields();
                this.dialogFormVisible = false;
                this.queryData();
              } else {
                this.message.error(res.data.message);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(form) {
      this.dialogFormVisible = false;
      this.$refs[form].resetFields();
    },
    //确认通过
    confirmed(row) {
      this.$confirm("确认是否通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupHttp
            .post("SingleProductOrder/ConfirmSingleProductOrder", {
              Id: row.orderId
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "确认成功!"
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
    }
  }
};
</script>

<style>
</style>
