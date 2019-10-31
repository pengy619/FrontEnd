<template>
  <div class='view'>
    <el-form :inline="true" size="small" label-width="100px">
      <el-form-item label="出团日期">
        <el-date-picker :editable='false'
                        size='small'
                        v-model="datePick"
                        type="daterange"
                        value-format='yyyy-MM-dd'
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="客户名称">
        <el-input v-model="customerName" size='small'></el-input>
      </el-form-item> -->
      <el-form-item label="订单状态">
        <el-select v-model="orderStatus" placeholder="请选择" size='small'>
          <el-option v-for="item in orderStatusOptions"
                     :key="item.key"
                     :label="item.name"
                     :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态">
        <el-select v-model="paymentStatus" placeholder="请选择" class="input">
          <el-option v-for="item in payStatusOptions"
                     :key="item.key"
                     :label="item.name"
                     :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="出团状态">
        <el-select v-model="teamStatus" placeholder="请选择" class="input">
          <el-option v-for="item in teamStatusOptions"
                     :key="item.key"
                     :label="item.name"
                     :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="结算单位">
        <el-input v-model="SettlemtName" size='small'></el-input>
      </el-form-item> -->
      <el-form-item label="线路名称">
        <el-input v-model="lineName" size='small'></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="OrderNo" size='small'></el-input>
      </el-form-item>
      <!-- <el-form-item label="门店">
        <el-input v-model="ShopName" size='small'></el-input>
      </el-form-item> -->
      <el-form-item label="提现状态">
        <el-select v-model="WithdrawStatus" placeholder="请选择" class="input">
          <el-option v-for="item in WithdrawStatusArray"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对账状态">
        <el-select v-model="SupplierBillStatus" placeholder="请选择" class="input">
          <el-option v-for="item in enumBillStatusOptions"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryData(pagination.size,1)" size='small'>查找</el-button>
      </el-form-item>
    </el-form>
    <el-row class="margin_bottom">
      <el-button type="primary" size="small" :disabled="flag" @click="Bills">申请对账</el-button>
      <el-button size="small" @click="handleExport">导出</el-button>
    </el-row>
    <el-table v-loading='loading'
              border
              :data="tableData"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55" fixed="left">
      </el-table-column>
      <el-table-column type="index"
                       label="序号"
                       align="center"
                       width="70">
      </el-table-column>
      <el-table-column prop="orderStatusName"
                       label="状态">
      </el-table-column>
      <el-table-column prop="payStatusName"
                       label="支付状态">
      </el-table-column>
      <el-table-column prop="teamStatusDesc"
                       label="出团状态">
      </el-table-column>
      <!-- <el-table-column prop="teamNo"
                       label="团号">
      </el-table-column> -->
      <el-table-column prop="lineName"
                       label="线路名称"
                       :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="departureDate"
                       label="出团日期">
      </el-table-column>
      <!-- <el-table-column prop="settlementUnit"
                       label="结算单位">
      </el-table-column>
      <el-table-column prop="shopName"
                       label="门店">
      </el-table-column> -->
      <el-table-column prop="orderNo"
                       label="订单号">
      </el-table-column>
      <!-- <el-table-column prop="customerName"
                       label="客户名称">
      </el-table-column> -->
      <el-table-column prop="quantity"
                       label="人数">
      </el-table-column>

      <el-table-column label="提现状态" prop="withdrawStatus">
      </el-table-column>

      <el-table-column label="对账状态" prop="supplierBillStatusString"> 
      </el-table-column>

      <el-table-column prop="supReceivableFee" label="应收款">
      </el-table-column>

      <el-table-column prop="withdrawAmount"
                       label="已收">
      </el-table-column>
      <el-table-column prop="receivedFee"
                       label="门店支付金额">
      </el-table-column>
      <el-table-column prop="orderSourceName"
                       label="销售渠道">
      </el-table-column>
      <el-table-column prop="creationTime"
                       label="下单日期">
      </el-table-column>
      <el-table-column label="操作"
                       min-width="180"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="checkMessage(scope.row)">查看</el-button>
          <el-button type="text" size="mini" v-if="scope.row.payStatus==0&&scope.row.supplierConfirmed&&scope.row.showEditPriceBtn" @click="editPrice(scope.row)">修改价格</el-button>
          <el-button type="text" size="mini" v-if="scope.row.showConfirm" @click="handleConfirmed(scope.row)">确认</el-button>
          <el-button type="text" size="mini" v-if="scope.row.showConfirm" @click="handleRefuseConfirmed(scope.row)">拒绝</el-button>
          <el-button type="text" size="mini" @click='cancelOrder(scope.row)' v-if ='scope.row.canCancel'>取消确认</el-button>
          <el-row style="font-size:12px;">
            <span v-if="scope.row.storeConfirmed" class="success">门店已确认</span>
            <span v-if="scope.row.branchConfirmed" class="success" style="margin-left:10px;">分部已确认</span>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination fixed="right"
                     :data='pagination'
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pagination.currentPage"
                     :page-sizes="pagination.sizes"
                     :page-size="pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { dateFmt } from '@/utils/tools.js'
  export default {
    data() {
      return {
        pickerOptions: {
          disabledDate: (date) => {
            return date.getTime() <= Date.now();
          }
        },
        loading: false,
        orderStatusOptions: [{key: "", name: "全部"}],
        payStatusOptions: [{key: "", name: "全部"}],
        teamStatusOptions: [{key: "", name: "全部"}],
        orderIds: [],
        orderStatus: '',
        datePick: '',
        customerName: '',
        lineName: '',
        SettlemtName: '',
        OrderNo: '',
        paymentStatus: '',
        teamStatus: '',
        ShopName: '',
        WithdrawStatusArray: ["全部","未提现", "部分提现", "已提现"],
        WithdrawStatus: '',
        tableData: [],
        pagination: {
          sizes: [5, 10, 20, 50],
          size: 10,
          currentPage: 1,
          total: 0
        },
        flag: true,
        BillsList: [],
        SupplierBillStatus:'',
        enumBillStatusOptions: [{ key: "", value: "全部" }]
      }
    },
    methods: {
      //导出
      handleExport() {
        let beginDate = '', endDate = '';
        if (this.datePick) {
          beginDate = this.datePick[0] || "";
          endDate = this.datePick[1] || "";
        }
        let WEB_API = process.env.WEB_API;
        let url = WEB_API + '/ExcelSupplierGroupLineOrderExcelList?OrderNo=' + this.OrderNo + "&OrderStatus=" + this.orderStatus +
          "&BeginDate=" + beginDate + '&PaymentStatus=' + this.paymentStatus + '&TeamStatus=' + this.teamStatus +
          "&EndDate=" + endDate + "&CustomerName=" + this.customerName + "&LineName=" + this.lineName + "&WithdrawStatus=" + this.WithdrawStatus+
          "&SettlemtName=" + this.SettlemtName + "&ShopName=" + this.ShopName + "&SupplierBillStatus=" + this.SupplierBillStatus + "&PageSize=" + this.pagination.size + "&PageIndex=" + this.pagination.currentPage +
          "&SupplierId=";
        this.groupHttp.get("GetSupplierId").then(function (res) {
          window.location.href = url + res.data;
        })
      },
      handleSizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      },
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size, this.pagination.currentPage);
      },
      //查看详情
      checkMessage(row) {
        this.$router.push({ path: '/grouptour/orderCheck', query: { orderId: row.orderId } })
      },
      //初始订单状态
      getStatusList() {
        this.groupHttp
          .post("GroupLine/GetOrderStatuslList")
          .then(res => {
            if (res.data.isSuccess == true) {
              this.orderStatusOptions =  this.orderStatusOptions.concat(res.data.keyValueList);
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
      queryData(pageSize, pageIndex) {
        this.loading = true;
        let beginDate = '', endDate = '';
        if (this.datePick) {
          beginDate = this.datePick[0] || "";
          endDate = this.datePick[1] || "";
        }
        let Size = pageSize || 10;
        let Index = pageIndex || 1

        this.groupHttp
          .get("GetSupplierGroupLineOrderList?OrderNo=" + this.OrderNo + "&OrderStatus=" + this.orderStatus +
          "&BeginDate=" + beginDate + '&PaymentStatus=' + this.paymentStatus + '&TeamStatus=' + this.teamStatus
          + "&EndDate=" + endDate + "&CustomerName=" + this.customerName + "&LineName=" + this.lineName + "&WithdrawStatus=" + this.WithdrawStatus +
          "&SettlemtName=" + this.SettlemtName + "&ShopName=" + this.ShopName + "&SupplierBillStatus=" + this.SupplierBillStatus + "&PageSize=" + Size + "&PageIndex=" + Index)
          .then(res => {
            // console.log(res);
            if (res.data.isSuccess == true) {
              res.data.objects.forEach((obj) => {
                let date1 = new Date(obj.creationTime);
                let date2 = new Date(obj.departureDate);
                obj.creationTime = dateFmt(date1, 'yyyy-MM-dd');
                obj.departureDate = dateFmt(date2, 'yyyy-MM-dd');
              });
              this.tableData = res.data.objects;
              this.pagination.currentPage = pageIndex || 1;
              this.pagination.total = res.data.total;
              this.loading = false;
            } else {
              this.$message({
                type: "info",
                message: "操作失败:"
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      cancelOrder(row){
        this.$confirm('线下订单取消审核?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '通过',
          cancelButtonText: '拒绝',
          type: 'warning'
        }).then(() => {
           this.cancel(row,true)
        }).catch((action) => {
          if(action == 'cancel'){
             this.cancel(row,false)
          }
        });
      },
      //取消确认
      cancel(row,boolean){
          this.groupHttp.post("CancelGroupLineOrder", {
          OrderNo:row.orderNo,
          OrderId:row.orderId,
          IsCanceled: row.canCancel,
          Canceled:boolean
        })
          .then(res => {
            if (res.data.isSuccess == true) {
              if(boolean == true){
                this.$message({
                type: "success",
                message: "线下订单取消审核通过"});
              }else{
                this.$message({
                type: "warning",
                message: "线下订单取消审核拒绝"});
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
      handleConfirmed(row) {
        this.$confirm('是否确认此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.groupHttp.get(`OrderConfirmed?OrderId=${row.orderId}`)
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "确认订单成功"
                });
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '未确认'
          });
        });
      },
      handleRefuseConfirmed(row) {
        this.$confirm("是否拒绝此订单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.groupHttp
              .get(`OrderConfrimFailed?OrderId=${row.orderId}`)
              .then(res => {
                if (res.data.isSuccess == true) {
                  this.$message({
                    type: "success",
                    message: "拒绝订单成功"
                  });
                  this.queryData();
                } else {
                  this.$message({
                    type: "info",
                    message: "操作失败:" + res.data.message
                  });
                }
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "未拒绝订单"
            });
          });
      },
      handleSelectionChange(val) {//选中的数据存储
        this.orderIds = [];
        this.BillsList = val;
        this.flag = false;
        if (this.BillsList.length == 0) {
          this.flag = true;
        }
        else if(this.BillsList.length == 1){
          for (let i = 0; i < this.BillsList.length; i++) {
            this.orderIds.push(this.BillsList[i].orderId)
            if (!this.BillsList[i].handBill) {
              this.flag = true;
              return;
            }
          }
        }else{
         this.flag=true;
        }
      },
      Bills() {
        this.groupHttp.post('/FinApplyBill/CreateSupplierBill', { 'OrderId': this.orderIds })
          .then(res => {
            if (res.data.isSuccess) {
              this.$message({
                type: 'success',
                message: '申请对账成功'
              });
              this.queryData(this.pagination.size, this.pagination.currentPage);
            }
            else {
              this.$message({
                type: 'info',
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
          this.groupHttp.post('EditOrderPrice', { 'OrderId': val.orderId, 'EditAmount': value })
            .then(res => {
              if (res.data.isSuccess) {
                this.$message({
                  type: 'success',
                  message: '价格修改成功',
                });
                this.queryData(this.pagination.size, this.pagination.currentPage);
              }
              else {
                this.$message.error(res.data.message);

              }
              this.loading = false;
            })
        }).catch(e => {
            console.log(e);
          });
      }
    },
    mounted() {
      this.getStatusList();
      this.queryData();
      //支付状态
      this.groupHttp
        .post("GroupLine/GetOrderPaymentStatusList", {})
        .then(res => {
          if (res.data.isSuccess == true) {
            this.payStatusOptions = this.payStatusOptions.concat(res.data.keyValueList);
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
      //出团状态
      this.groupHttp
        .post("GroupLine/GetOrderTeamStatusList", {})
        .then(res => {
          if (res.data.isSuccess == true) {
            this.teamStatusOptions = this.teamStatusOptions.concat(res.data.keyValueList);
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

      //对账状态
      this.groupHttp
        .get("GetEnumBillStatus", {})
        .then(res => {
          if (res.data.isSuccess == true) {
            this.enumBillStatusOptions = this.enumBillStatusOptions.concat(res.data.objects);
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
    }
  };

</script>
<style lang="scss" scoped>
</style>
