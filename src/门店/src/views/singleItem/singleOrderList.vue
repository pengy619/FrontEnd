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
        <el-select v-model="order.orderStatus" placeholder="请选择" clearable multiple>
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
        <el-button size="small" type="warning" icon="el-icon-search" @click="queryData(1,order.orderStatus)">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="small"
      algin="center"
      :data="table"
      style="width: 100%"
      v-loading="table_loading"
    >
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
      <el-table-column align="center" label="操作" fixed="right" width="220">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="check(scope.row)">查看</el-button>
          <el-button type="text" size="mini" @click="handleToPay(scope.row)" v-if="scope.row.showPay">支付</el-button>
          <el-button type="text" size="mini" @click="refund(scope.row)" v-if="scope.row.showRefund">退款</el-button>
          <el-button type="text" size="mini" @click="cancelOrder(scope.row)" v-if ='scope.row.showCancel'>取消订单</el-button>
          <el-button type="text" size="mini" @click='signContract(scope.row)' v-show='scope.row.showEleContractSign'>签订电子合同</el-button>
          <el-button type="text" size="mini" @click='handleViewDetail(scope.row)' v-show='scope.row.showViewEleContract'>查看电子合同</el-button>
          <el-button type="text" size="mini" @click='handleViewAgreement(scope.row)' v-show='scope.row.showMZXY'>免责协议</el-button>
          <el-button type="text" size="mini" @click='resignEContract(scope.row)' v-show='scope.row.showEleContractSign2'>重签电子合同</el-button>
          <el-button type="text" size="mini" @click='voidEContract(scope.row)' v-show='scope.row.showDiscardEleContract'>作废电子合同</el-button>
          <el-row style="font-size:12px;">
            <span v-if="scope.row.supplierConfirmed" class="success">供应商已确认</span>
            <span v-if="scope.row.branchConfirmed" class="success"  style="margin-left:10px;">总社已确认</span>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
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


    <el-dialog title="合同选择" :visible.sync="showDialog" width="30%">
        <el-form>
          <el-form-item label="合同">
            <el-radio-group v-model="contract">
              <el-radio :label="1">画个押</el-radio>
              <el-radio :label="2">12301</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog=false" size="small">取 消</el-button>
          <el-button type="primary" @click="handleCheck" size="small">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      rowOrderNo:'',
      contractUrl:'',
      showDialog:false,
      contract:1,
      table_loading: false,
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      orderStatusOptions: [], //订单状态
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
      table: []
    };
  },
  mounted() {
    this.getOrderStatus();
    this.getOrderPaymentStatus();
    this.queryData();
  },
  methods: {
    handleCheck(){
      if(this.contract == 1){
        this.$router.push({
          path: "/orderCenter/signContract",
          query: { orderNo: this.rowOrderNo, orderType: 9, isRemark: false }
        });
      }else{
         window.location.href = this.contractUrl
      }
    },
    queryData(pageIndex=1,orderStatus=["1","4"]) {
      let BeginDate = "",
        EndDate = "";
      if (this.order.dates && this.order.dates.length > 0) {
        BeginDate = this.order.dates[0];
        EndDate = this.order.dates[1];
      }
      this.table_loading = true;
      this.shopHttp
        .post("SingleProductOrder/GetSingleProductOrderList", {
          PayStatus: this.order.payStatus,
          orderStatusArr: orderStatus,
          BeginDate: BeginDate,
          EndDate: EndDate,
          ProductName: this.order.productName,
          OrderNo: this.order.orderNo,
          SupplierName: this.order.supplierName,
          InnerCode: this.order.innerCode,
          OrderSourceType: this.order.orderSourceType,
          pageSize: this.pageSize,
          pageIndex: pageIndex
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.table_loading = false;
            res.data.objects.forEach(item => {
              item.orderDate = dateFmt(new Date(item.orderDate),'yyyy-MM-dd')
            });
            this.table = res.data.objects;
            this.total = res.data.total
          }else{
            this.table_loading = false;
          }
        }).catch(e=>{
          console.log(e)
        });
    },
    getOrderStatus() {
      this.shopHttp
        .post("GroupLine/GetOrderStatuslList", {})
        .then(res => {
          if (res.data.isSuccess == true) {
            this.orderStatusOptions = this.orderStatusOptions.concat(
              res.data.keyValueList
            );
            this.order.orderStatus =['1','4']
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
      this.shopHttp
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData(this.pageIndex,this.order.orderStatus);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.queryData(this.pageIndex,this.order.orderStatus);
    },
    //支付
    handleToPay(row){
      this.shopHttp.post("SingleProductOrder/CheckPriceChange", { OrderIds:row.orderId })//先检查是否有改价
        .then(res => {
          if (res.data.isSuccess) {
              this.$message({
                message: "分部改价审核中...",
                type: "warning"
              });
          }else{
            this.$router.push({
              name: "singleOrderPayment",
              query: { orderIds: row.orderId }
            });
          }
      })
    },
    //查看
    check(row){
      let {href} = this.$router.resolve({path:'/singleItem/singleOrderDetail',query:{id:row.orderId}})
      window.open(href);
    },
    //取消订单
    cancelOrder(row){
      this.$confirm('确定是否取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.shopHttp.post('SingleProductOrder/CancelSingleProductOrder',{
            id:row.orderId
          }).then(res=>{
            if(res.data.isSuccess == true){
                this.$message({
                type: 'success',
                message: '取消成功!'
              });
              this.queryData(this.pageIndex);
            }else{
              this.$message.error(res.data.message)
            }
          }).catch(e=>{
            console.log(e)
          })

        }).catch(() => {
          return false
        });
    },
     //签订电子合同
    signContract(row) {
    this.showDialog = true;
    this.rowOrderNo = row.orderNo
    this.contractUrl= row.eleContract_12301_ResourcePlatform_Url
    
    },
    //重签电子合同
    resignEContract(row) {
      this.$router.push({
        path: "/orderCenter/signContract",
        query: { orderNo: row.orderNo, orderType: 9, isRemark: true }
      });
    },
    //作废电子合同
    voidEContract(row) {
      let message1 
      let message2
      if(row.eleContractType ==2){
        message1 = '您确定要发送合同作废短信吗?'
        message2 = '发送成功'
      }else{
        message1 = '您确定是否作废合同?'
        message2 = '作废成功'
      }
      this.$confirm(message1, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.shopHttp.post("Contract/DiscardEleContract", {
            contractNo: row.contractNo,
            eleContractType:row.eleContractType
          }).then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: message2
                });
              this.queryData(this.pageIndex);
              } else {
                this.$message({
                  type: "info",
                  message: "发送失败:" + res.data.message
                });
              }
            })
            .catch(e => {
              console.log(e)
            });
        }).catch(() => {
        });
    },
    //查看电子合同
    handleViewDetail(row) {
      if(row.eleContractType == 2){
          let {href} = this.$router.resolve({
          path: "/orderCenter/electronicContractDetail",
          query: { contractNo: row.contractNo }
        });
        window.open(href)
      }else{
        window.open(row.eleContract12301Url)
      }
    },
    //免责协议
    handleViewAgreement(row) {
      this.$router.push({ path: "/orderCenter/agreement/" + row.orderNo });
    },
    //退款
    refund(row) {
      this.$router.push({
        name: "refund",
        query: {
          settlementIds: [row.settlementId],
          disSettleClientId: row.cusSettleClientId
        }
      });
    },
  }
};
</script>

<style>
</style>
