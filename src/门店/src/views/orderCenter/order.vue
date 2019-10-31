<template>
  <div class="view">
    <!-- <price-table :price-data="priceData"></price-table>
        <el-button size="small" type="warning"  @click='changeTable'>改变table</el-button>
    <el-button size="small" type="warning"  @click='changeTable1'>改变table1</el-button>-->
    <el-form size="small" :inline="true" :model="order" label-width="80px">
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
      <el-form-item label="出团状态">
        <el-select v-model="order.teamStatus" placeholder="请选择" clearable>
          <el-option
            v-for="item in teamStatusOptions"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="客户名称">
                <el-input v-model="order.customerName" placeholder=""></el-input>
      </el-form-item>-->
      <el-form-item label="线路类型">
        <el-select v-model="order.lineTypeName" placeholder="请选择" class="input" clearable>
          <el-option
            v-for="item in lineTypeList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线路名称">
        <el-input v-model="order.lineName" placeholder></el-input>
      </el-form-item>
      <!-- <el-form-item label="团号">
                <el-input v-model="order.teamNo" placeholder=""></el-input>
      </el-form-item>-->
      <el-form-item label="订单号">
        <el-input v-model="order.orderNo" placeholder></el-input>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="order.supplierName" placeholder></el-input>
      </el-form-item>
      <el-form-item label="内部编码">
        <el-input v-model="order.innerCode" placeholder></el-input>
      </el-form-item>
      <el-form-item label="订单来源">
        <el-select v-model="order.orderSourceType" placeholder="请选择" clearable>
          <el-option
            v-for="item in communityList"
            :key="item.key"
            :label="item.text"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建者">
        <el-input v-model="order.createUserName" placeholder></el-input>
      </el-form-item>
      <el-form-item label="出团日期">
        <el-date-picker
          :editable="false"
          size="small"
          v-model="dates"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          id="se"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="warning"
          icon="el-icon-search"
          @click="queryData(pagination.size,1,order.orderStatus)"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row class="margin_bottom">
      <el-button
        size="small"
        type="primary"
        @click="receivables"
        :disabled="btn_receivables"
        v-if="companyType==1"
      >收款</el-button>
      <el-button
        size="small"
        type="primary"
        @click="handleToPay(false)"
        :disabled="btn_receivables"
        v-else-if="companyType==2"
      >支付</el-button>
      <el-button
        size="small"
        type="primary"
        @click="handlePreOpenInvoice"
        :disabled="btn_preOpenInvoice"
      >预开发票</el-button>
      <el-button size="small" @click="handleExport">导出Excel</el-button>
    </el-row>
    <el-table
      size="small"
      algin="center"
      :data="order.table"
      style="width: 100%"
      v-loading="table_loading"
      @selection-change="pathSelectionChange"
    >
      <el-table-column size="small" type="selection" fixed></el-table-column>
      <el-table-column size="small" align="center" prop="payStatusName" label="支付状态"></el-table-column>
      <el-table-column size="small" align="center" prop="teamStatusDesc" label="出团状态"></el-table-column>
      <!-- <el-table-column size="small" align="center" prop="teamNo" label="团号" ></el-table-column> -->
      <el-table-column size="small" align="center" prop="orderStatusName" label="订单状态"></el-table-column>
      <el-table-column size="small" align="center" prop="orderNo" label="订单号"></el-table-column>
      <el-table-column
        size="small"
        align="center"
        prop="lineName"
        label="线路名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column size="small" align="center" prop="departureDate" label="出团日期"></el-table-column>
      <el-table-column size="small" align="center" prop="latestPaymentTime" label="最晚支付时间"></el-table-column>
      <!-- <el-table-column size="small" align="center" prop="settlementUnit" label="结算单位" ></el-table-column> -->
      <el-table-column size="small" align="center" prop="supplierName" label="供应商"></el-table-column>
      <el-table-column size="small" align="center" prop="quantity" label="人数"></el-table-column>
      <el-table-column size="small" align="center" prop="receivableFee" label="应付"></el-table-column>
      <el-table-column size="small" align="center" prop="receivedFee" label="已付"></el-table-column>
      <el-table-column size="small" align="center" prop="creationTime" label="下单日期"></el-table-column>
      <el-table-column size="small" align="center" label="预订信息" width="140">
        <template slot-scope="scope">
          <p>{{scope.row.createUserName}}</p>
          <p>{{scope.row.shopName}}</p>
        </template>
      </el-table-column>
      <el-table-column size="small" align="center" prop="innerCode" label="内部编码" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.showUpInnerCode">
            <el-input v-model="scope.row.innerCode" placeholder="内部编码" size="mini"></el-input>
            <el-button
              type="text"
              size="mini"
              @click="changeCode(scope.row.orderNo,scope.row.innerCode)"
            >确认</el-button>
          </div>
          <span v-else>{{scope.row.innerCode}}</span>
        </template>
      </el-table-column>
      <el-table-column size="small" align="center" prop="orderSouceName" label="订单来源"></el-table-column>
      <el-table-column size="small" align="center" label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="check(scope.row)">查看</el-button>
          <el-button
            type="text"
            size="mini"
            @click="handleToPay(scope.row)"
            v-if="scope.row.showPay"
          >支付</el-button>
          <el-button
            type="text"
            size="mini"
            @click="refund(scope.row)"
            :disabled="!scope.row.showRefund"
            v-if="scope.row.showRefund"
          >退款</el-button>
          <el-button
            type="text"
            size="mini"
            @click="openTimeLateApply(scope.row)"
            v-if="scope.row.showTimeLateApply"
          >申请延期支付</el-button>
          <el-button
            type="text"
            size="mini"
            @click="cancelOrder(scope.row)"
            v-if="scope.row.canCancel"
          >取消订单</el-button>
          <el-button
            type="text"
            size="mini"
            @click="signContract(scope.row)"
            v-show="scope.row.showEleContractSign"
          >签订电子合同</el-button>
          <el-button
            type="text"
            size="mini"
            @click="handleViewDetail(scope.row)"
            v-show="scope.row.showViewEleContract"
          >查看电子合同</el-button>
          <el-button
            type="text"
            size="mini"
            @click="handleViewAgreement(scope.row)"
            v-show="scope.row.showMZXY"
          >免责协议</el-button>
          <el-button
            type="text"
            size="mini"
            @click="resignEContract(scope.row)"
            v-show="scope.row.showEleContractSign2"
          >重签电子合同</el-button>
          <el-button
            type="text"
            size="mini"
            @click="voidEContract(scope.row)"
            v-show="scope.row.showDiscardEleContract"
          >作废电子合同</el-button>
          <el-row style="font-size:12px;">
            <span v-if="scope.row.supplierConfirmed" class="success">供应商已确认</span>
            <span v-if="scope.row.branchConfirmed" class="success" style="margin-left:10px;">总社已确认</span>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :data="pagination"
      @size-change="sizeChange"
      @current-change="currentPageChange"
      :current-page="pagination.currentPage"
      :page-sizes="pagination.sizes"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    ></el-pagination>

    <el-dialog title="合同选择" :visible.sync="showDialog" width="30%">
      <el-form>
        <el-form-item label="合同">
          <el-radio-group v-model="contract">
            <el-radio :label="1" :disabled='eC_HGY_Enabled'>画个押</el-radio>
            <el-radio :label="2" :disabled='eC_12301_Enabled'>12301</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog=false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleCheck" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="延期支付" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="延期日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="time"
            :picker-options="sDisableDate"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="timeLateApply" size="small" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import priceTable from "@/components/priceTable";
import { dateFmt } from "@/utils/tools.js";
export default {
  components: {
    priceTable
  },
  data() {
    return {
      eC_12301_Enabled:false,
      eC_HGY_Enabled:false,
      btnLoading:false,
      orderID: "",
      sDisableDate: "",
      dialogFormVisible: false,
      time: "",
      rowOrderNo: "",
      contractUrl: "",
      contract: 1,
      showDialog: false,
      userId: localStorage.getItem("userId"),
      lineTypeList: [],
      priceData: {},
      companyType: localStorage.getItem("companyType"),
      dates: [],
      btn_receivables: true,
      btn_toPay: true,
      btn_refund: true,
      btn_preOpenInvoice: true,
      table_loading: false,
      multipleSelection: [],
      orderStatusOptions: [], //订单状态
      payStatusOptions: [{ name: "全部", key: "" }], //支付状态
      teamStatusOptions: [{ name: "全部", key: "" }], //出团状态
      order: {
        createUserName: "",
        lineTypeName: "",
        lineName: "",
        teamNo: "",
        orderStatus: "",
        payStatus: "",
        teamStatus: "",
        customerName: "",
        orderNo: "",
        disCompanyInfoId: "",
        BranchId: "",
        supplierName: "",
        innerCode: "",
        orderSourceType: "",
        table: []
      },
      communityList: [],
      //分页
      pagination: {
        sizes: [5, 10, 20, 50],
        size: 10,
        currentPage: 1,
        total: 0
      }
    };
  },
  methods: {
    beginDate(d) {
      return {
        disabledDate(date) {
          return date.getTime() < d 
          //- 3600 * 1000 * 24;
        }
      };
    },
    //延期支付
    timeLateApply() {
      if (!this.time) {
        this.$message.error("请输入延期时间");
        return;
      }
      this.btnLoading = true;
      this.shopHttp
        .post("/ResourcePlatform/TimeLateApply", {
          orderId: this.orderID,
          lastPayTime: this.time
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.$message({
              type: "success",
              message: "延期申请成功"
            });
          } else {
            this.$message.error(res.data.info);
          }
          this.dialogFormVisible = false;
          this.btnLoading = false;
          this.queryData(this.pagination.size, this.pagination.currentPage);
        });
    },
    openTimeLateApply(row) {
      this.dialogFormVisible = true;
      this.orderID = row.orderId;
      let departureDate = new Date(row.departureDate).getTime();
      let today = new Date().getTime();
      if (departureDate > today) {
        this.sDisableDate = this.beginDate(departureDate);
      } else {
        this.sDisableDate = this.beginDate(today);
      }
    },
    getECEnableSettingInfo(){
      this.shopHttp.post('/GroupLine/GetECEnableSettingInfo').then(res=>{
        if(res.data.isSuccess == true){
         if(!res.data.data.showSelect){
          if(res.data.data.eC_12301_Enabled){
            this.eC_HGY_Enabled = true;
            this.contract = 2
          }else{
            this.eC_12301_Enabled = true;
          }
        }
        }else{
          this.$message.error(res.data.message)
        }
      })
    },
    handleCheck() {
      if (this.contract == 1) {
        this.$router.push({
          path: "/orderCenter/signContract",
          query: {
            orderNo: this.rowOrderNo,
            isOfflineOrder: false,
            isRemark: false
          }
        });
      } else {
        window.location.href = this.contractUrl;
      }
    },
    //获取线路类型
    getLineTypeList() {
      this.shopHttp
        .post("GroupLine/GetExternalGroupLineTypeList")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.lineTypeList = JSON.parse(res.data.data);
          } else {
            this.$message.error("线路类型获取失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //修改内部编码
    changeCode(orderNo, newCode) {
      if (newCode) {
        this.shopHttp
          .get(
            "GroupLine/UpGroupLineOrderInnerCode?orderNo=" +
              orderNo +
              "&innerCode=" +
              newCode
          )
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: "success",
                message: "内部编码修改成功"
              });
            } else {
              this.$message({
                type: "info",
                message: "操作失败:" + res.data.message
              });
            }
          });
      } else {
        this.$message({
          type: "info",
          message: "请填写内容"
        });
      }
    },
    changeTable() {
      this.priceData = {
        price1: 1,
        price2: 11,
        price3: 222,
        dateStr: "",
        nowStock: 30,
        totalStock: 50,
        isHadPrice: true,
        dateRng: ["2018-05-11T12:15:18", "2018-05-13T12:15:18"]
      };

      // this.priceData=[
      //     {price1:1,price2:11,price3:111,dateStr:'',nowStock:30,totalStock:50,isHadPrice:true,dateString:'2018-05-11T12:15:18'},
      //     {price1:1,price2:11,price3:111,dateStr:'',nowStock:20,totalStock:40,isHadPrice:true,dateString:'2018-05-12T12:15:18'},
      // ]
    },
    changeTable1() {
      this.priceData = {
        price1: 2,
        price2: 11,
        price3: 333,
        dateStr: "",
        nowStock: 30,
        totalStock: 50,
        isHadPrice: true,
        dateRng: ["2018-05-12T12:15:18", "2018-05-16T12:15:18"]
      };
      // this.priceData=[
      //     {price1:1,price2:11,price3:111,dateStr:'',nowStock:30,totalStock:50,isHadPrice:false,dateString:'2018-05-11T12:15:18'},
      //     {price1:1,price2:11,price3:111,dateStr:'',nowStock:20,totalStock:40,isHadPrice:true,dateString:'2018-05-14T12:15:18'},
      // ]
    },
    //导出
    handleExport() {
      let BeginDate = "",
        EndDate = "";
      if (this.dates && this.dates.length > 0) {
        BeginDate = dateFmt(new Date(this.dates[0]), "yyyy-MM-dd");
        EndDate = dateFmt(new Date(this.dates[1]), "yyyy-MM-dd");
      }
      let WEB_API = process.env.WEB_API;
      let url =
        WEB_API +
        "/GroupLine/ExportGroupLineOrderList?PaymentStatus=" +
        this.order.payStatus +
        "&UserId=" +
        this.userId +
        "&TeamStatus=" +
        this.order.teamStatus +
        "&CreateUserName=" +
        this.order.createUserName +
        "&OrderNo=" +
        this.order.orderNo +
        "&orderStatusStr=" +
        this.order.orderStatus +
        "&customerName=" +
        this.order.customerName +
        "&teamNo=" +
        this.order.teamNo +
        "&lineTypeName=" +
        this.order.lineTypeName +
        "&lineName=" +
        this.order.lineName +
        "&BeginDate=" +
        BeginDate +
        "&EndDate=" +
        EndDate +
        "&SupplierName=" +
        this.order.supplierName +
        "&OrderSourceType=" +
        this.order.orderSourceType +
        "&InnerCode=" +
        this.order.innerCode +
        "&pageSize=" +
        this.pagination.size +
        "&pageIndex=" +
        this.pagination.currentPage +
        "&DisCompanyInfoId=";
      this.shopHttp.get("/Finance/GetShopId").then(function(res) {
        window.location.href = url + res.data;
      });
    },
    //订单来源
    getOrderSource() {
      this.shopHttp
        .get("/Member/GetOrderSourceByShopId")
        .then(res => {
          if (res.data.isSuccess) {
            this.communityList = res.data.objects;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //全选
    pathSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length == 0) {
        // this.btn_refund = true;
        this.btn_receivables = true;
        this.btn_toPay = true;
        this.btn_preOpenInvoice = true;
        return;
      } else if (this.multipleSelection.length == 1) {
        if (val[0].payStatusName == "未付款" && !val[0].hasPreposeInvoice) {
          this.btn_preOpenInvoice = false;
        }
      } else {
        this.btn_preOpenInvoice = true;
      }
      this.btn_receivables = false;
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (
          this.multipleSelection[i].disSettleClientId !=
          this.multipleSelection[0].disSettleClientId
        ) {
          this.btn_receivables = true;
          // this.btn_refund = true;
          return false;
        }
        //资源平台订单只能单笔支付
        if (
          this.multipleSelection[i].orderSource == 11 &&
          this.multipleSelection.length > 1
        ) {
          this.btn_receivables = true;
          return false;
        }
        if (this.multipleSelection[i].confirmType == 2) {
          if (
            this.multipleSelection[i].supplierConfirmed &&
            this.multipleSelection[i].branchConfirmed
          ) {
            if (
              this.multipleSelection[i].payStatusName != "未付款" &&
              this.multipleSelection[i].payStatusName != "部分付款"
            ) {
              this.btn_receivables = true;
            }
          } else {
            this.btn_receivables = true;
          }
        } else if (this.multipleSelection[i].confirmType == 3) {
          if (this.multipleSelection[i].supplierConfirmed) {
            if (
              this.multipleSelection[i].payStatusName != "未付款" &&
              this.multipleSelection[i].payStatusName != "部分付款"
            ) {
              this.btn_receivables = true;
            }
          } else {
            this.btn_receivables = true;
          }
        } else {
          if (
            this.multipleSelection[i].payStatusName != "未付款" &&
            this.multipleSelection[i].payStatusName != "部分付款"
          ) {
            this.btn_receivables = true;
          }
        }
      }
    },
    //预开发票
    handlePreOpenInvoice() {
      this.$confirm("是否预开发票?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        let orderIds = [this.multipleSelection[0].orderId];
        this.shopHttp
          .post("CustomerFee/PreposeInvoice", {
            OrderIds: orderIds
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: "success",
                message: "预开发票成功"
              });
              this.queryData(this.pagination.size, this.pagination.currentPage);
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
      });
    },
    //查询数据
    queryData(size, index, orderStatus = ["1", "4"]) {
      let BeginDate = "",
        EndDate = "";
      if (this.dates && this.dates.length > 0) {
        BeginDate = dateFmt(new Date(this.dates[0]), "yyyy-MM-dd");
        EndDate = dateFmt(new Date(this.dates[1]), "yyyy-MM-dd");
      }
      this.table_loading = true;
      this.shopHttp
        .post("GroupLine/GetGroupLineOrderList", {
          CreateUserName: this.order.createUserName,
          lineTypeName: this.order.lineTypeName,
          PaymentStatus: this.order.payStatus,
          TeamStatus: this.order.teamStatus,
          orderStatusStr: orderStatus.join(","),
          customerName: this.order.customerName,
          teamNo: this.order.teamNo,
          lineName: this.order.lineName,
          BeginDate: BeginDate,
          EndDate: EndDate,
          disCompanyInfoId: this.order.disCompanyInfoId,
          OrderNo: this.order.orderNo,
          SupplierName: this.order.supplierName,
          InnerCode: this.order.innerCode,
          OrderSourceType: this.order.orderSourceType,
          pageSize: size || 10,
          pageIndex: index || 1
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            res.data.objects.forEach(obj => {
              let data1 = new Date(obj.creationTime);
              obj.creationTime = dateFmt(data1, "yyyy-MM-dd");
              let data2 = new Date(obj.departureDate);
              obj.departureDate = dateFmt(data2, "yyyy-MM-dd");
              let data3 = new Date(obj.latestPaymentTime);
              obj.latestPaymentTime = dateFmt(data3, "yyyy-MM-dd");
            });
            this.order.table = res.data.objects;
            this.table_loading = false;
            this.pagination.total = res.data.total;
          } else {
            this.$message({
              type: "info",
              message: "出错了!" + res.data.message
            });
            setTimeout(() => {
              this.table_loading = false;
            }, 500);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //签订电子合同
    signContract(row) {
      this.showDialog = true;
      this.rowOrderNo = row.orderNo;
      this.contractUrl = row.eleContract_12301_ResourcePlatform_Url;
    },
    //重签电子合同
    resignEContract(row) {
      this.$router.push({
        path: "/orderCenter/signContract",
        query: { orderNo: row.orderNo, isOfflineOrder: false, isRemark: true }
      });
    },
    //作废电子合同
    voidEContract(row) {
      let message1;
      let message2;
      if (row.eleContractType == 2) {
        message1 = "您确定要发送合同作废短信吗?";
        message2 = "发送成功";
      } else {
        message1 = "您确定是否作废合同?";
        message2 = "作废成功";
      }
      this.$confirm(message1, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.shopHttp
            .post("Contract/DiscardEleContract", {
              contractNo: row.contractNo,
              eleContractType: row.eleContractType
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: message2
                });
                this.queryData(
                  this.pagination.size,
                  this.pagination.currentPage
                );
              } else {
                this.$message({
                  type: "info",
                  message: "失败:" + res.data.message
                });
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    //查看电子合同
    handleViewDetail(row) {
      if (row.eleContractType == 2) {
        let { href } = this.$router.resolve({
          path: "/orderCenter/electronicContractDetail",
          query: { contractNo: row.contractNo }
        });
        window.open(href);
      } else {
        window.open(row.eleContract12301Url);
      }
    },
    handleViewAgreement(row) {
      this.$router.push({ path: "/orderCenter/agreement/" + row.orderNo });
    },
    receivables() {
      var arr = [];
      this.multipleSelection.forEach(sel => {
        arr.push(sel.settlementId);
      });
      this.$router.push({
        name: "receivables",
        query: {
          settlementIds: arr,
          disSettleClientId: this.multipleSelection[0].disSettleClientId
        }
      });
    },
    handleToPay(row) {
      if (row) {
        this.isPriceChange(row.orderId);
        return false;
      }
      var arr = [];
      var hasReceivedFee = [],
        noReceivedFee = [];
      this.multipleSelection.forEach(sel => {
        arr.push(sel.orderId);
        if (sel.receivedFee !== 0) {
          hasReceivedFee.push(sel.orderId);
        } else {
          noReceivedFee.push(sel.orderId);
        }
      });
      if (hasReceivedFee.length > 0 && noReceivedFee.length > 0) {
        //未付款和部分付款不能同时支付
        this.$message({
          message: "未付款和部分付款不能同时支付",
          type: "warning"
        });
      } else {
        this.isPriceChange(arr);
      }
    },
    isPriceChange(orderIds) {
      this.shopHttp
        .post("CustomerFee/CheckPriceChange", { OrderIds: orderIds }) //先检查是否有改价
        .then(res => {
          if (res.data.isSuccess) {
            this.$message({
              message: "分部改价审核中...",
              type: "warning"
            });
          } else {
            this.$router.push({
              name: "lineOrderPayment",
              query: { orderIds: orderIds }
            });
          }
        });
    },
    refund(row) {
      this.$router.push({
        name: "refund",
        query: {
          settlementIds: [row.settlementId],
          disSettleClientId: row.disSettleClientId
        }
      });
    },
    lineOrder() {
      this.$router.push("/orderCenter/lineOrder");
    },
    check(row) {
      this.$router.push({
        path: "/orderCenter/orderCheck",
        query: { orderId: row.orderId, orderNo: row.orderNo }
      });
    },
    //取消订单
    cancelOrder(row) {
      this.$confirm("是否取消此订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.shopHttp
            .post("GroupLine/CancelGroupLineOrder", {
              OrderNo: row.orderNo,
              pageSize: 10,
              pageIndex: 1
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "订单取消申请成功"
                });
                this.queryData(
                  this.pagination.size,
                  this.pagination.currentPage
                );
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
          // this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          // });
        });
    },
    //分页
    sizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(
        this.pagination.size,
        this.pagination.currentPage,
        this.order.orderStatus
      );
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryData(
        this.pagination.size,
        this.pagination.currentPage,
        this.order.orderStatus
      );
    }
  },
  mounted() {
    //合同配置
    this.getECEnableSettingInfo();
    //订单状态
    this.shopHttp
      .post("GroupLine/GetOrderStatuslList", {})
      .then(res => {
        if (res.data.isSuccess == true) {
          this.orderStatusOptions = this.orderStatusOptions.concat(
            res.data.keyValueList
          );
          this.order.orderStatus = ["1", "4"];
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
    //支付状态
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
    //出团状态
    this.shopHttp
      .post("GroupLine/GetOrderTeamStatusList", {})
      .then(res => {
        if (res.data.isSuccess == true) {
          this.teamStatusOptions = this.teamStatusOptions.concat(
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
    this.getLineTypeList();
    this.getOrderSource();
    this.queryData();
  }
};
</script>

<style scoped lang='scss'>
</style>
