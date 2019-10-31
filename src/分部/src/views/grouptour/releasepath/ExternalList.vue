<template>
  <div id="box" class="view">
    <div>
      <el-form size="small" :inline="true" :model="order" class="demo-form-inline" label-width="120px">
        <el-form-item label="订单状态">
          <el-select v-model="order.orderStatus" placeholder="请选择" class="input" multiple  clearable>
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="order.payStatus" placeholder="请选择" class="input" clearable>
            <el-option
              v-for="item in payStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出团状态">
          <el-select v-model="order.teamStatus" placeholder="请选择" class="input" clearable>
            <el-option
              v-for="item in teamStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="线路类型">
          <el-select v-model="order.lineTypeName" placeholder="请选择" class="input" clearable>
            <el-option
              v-for="item in lineTypeList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路名称">
          <el-input v-model="order.lineName" placeholder="" class="input"></el-input>
        </el-form-item>
        <!-- <el-form-item label="团号">
          <el-input v-model="order.teamNo" placeholder="" class="input"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="销售渠道">
          <el-select v-model="order.orderSource" placeholder="请选择" class="input">
            <el-option
              v-show="item.key!=8"
              v-for="item in sourceList"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item> -->
       <!-- <el-form-item label="订单来源">
          <el-input v-model="order.orderSouceName" placeholder="" class="input"></el-input>
        </el-form-item> -->
        <el-form-item label="门市名称">
          <el-input v-model="order.shopName" placeholder="" class="input"></el-input>
        </el-form-item>
        <!-- <el-form-item label="资源来源">
          <el-select v-model="order.GroupLineSource" placeholder="请选择" class="input">
            <el-option
              v-for="item in orderSourceList"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item> -->
        <br>
        <el-form-item label="供应商">
              <el-input v-model="order.supplierName" size='small'></el-input>
           </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="order.orderNo" placeholder="" class="input"></el-input>
        </el-form-item>
        <el-form-item label="内部编码">
          <el-input v-model="order.innerCode" placeholder="" class="input"></el-input>
        </el-form-item>
        <br>
        <!-- <el-form-item label="类型">
        <el-select v-model="order.AirlineType" placeholder="请选择类型">
          <el-option
              v-for="item in supplierAreaTypeList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
          ></el-option>
        </el-select>
        </el-form-item> -->
        <el-form-item label="出团日期">
          <el-date-picker
            v-model="order.Date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="供应商所属区域">
        <el-select v-model="order.BoAreaInfoId" placeholder="请选择" size='small'>
          <el-option
            v-for="item in AreaOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item> -->
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click='queryData(pagination.size,1,order.orderStatus)'>搜索</el-button>
           <el-button size="small"  @click="handleExport" >导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table size="small" algin="center" :data="order.table" style="width: 100%" v-loading='table_loading' @selection-change="pathSelectionChange">
         <el-table-column align="center" type="index" label="序号" ></el-table-column>
        <!--<el-table-column size="small" type="selection" fixed></el-table-column>-->
        <el-table-column size="small" align="center" prop="orderStatusName" label="订单状态"> </el-table-column>
        <el-table-column size="small" align="center" prop="payStatusName" label="支付状态" ></el-table-column>
        <el-table-column size="small" align="center" prop="teamStatusDesc" label="出团状态" > </el-table-column>
        <el-table-column size="small" align="center" prop="orderNo" label="订单号" > </el-table-column>
        <!-- <el-table-column size="small" align="center" prop="teamNo" label="团号" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="lineName" label="线路名称" show-overflow-tooltip> </el-table-column>
        <el-table-column size="small" align="center" prop="departureDate" label="出团日期" > </el-table-column>
        <!-- <el-table-column size="small" align="center" prop="settlementUnit" label="结算单位" ></el-table-column> -->
        <!-- <el-table-column size="small" align="center" prop="orderSouceName" label="销售渠道" > </el-table-column> -->
        <!-- <el-table-column size="small" align="center" prop="groupLineSourceName" label="资源来源" > </el-table-column> -->
        <el-table-column size="small" align="center" prop="supplierName" label="供应商" ></el-table-column>
        <!-- <el-table-column size="small" align="center" prop="shopName" label="门店" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="quantity" label="人数" ></el-table-column>
        <el-table-column size="small" align="center" prop="receivableFee" label="应收" > </el-table-column>
        <el-table-column size="small" align="center" prop="unReceiveFee" label="未收" ></el-table-column>
        <el-table-column size="small" align="center" prop="creationTime" label="下单日期" ></el-table-column>
        <el-table-column size="small" align="center"  label="预订信息" width='140'>
          <template slot-scope="scope">
            <p>{{scope.row.createUserName}}</p>
            <p>{{scope.row.shopName}}</p>
          </template>
        </el-table-column>
        <el-table-column size="small" align="center" prop="innerCode" label="内部编码" > </el-table-column>
        <el-table-column size="small" align="center" prop="orderSouceName" label="订单来源" ></el-table-column>
        <!-- <el-table-column prop="areaName" label="供应商所属区域"  align="center" width="120"> </el-table-column> -->
        <el-table-column size="small" align="center"  label="操作" fixed="right" width='150'>
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="printOrder(scope.row)" v-show='(scope.row.payStatusName =="已付款"||scope.row.payStatusName =="部分付款")'>打 印</el-button> -->
            <el-button type="text" size="mini" @click="checkMessage(scope.row)">查 看</el-button>
            <el-button type="text" size="mini" v-if="scope.row.showConfirm" @click="handleConfirmed(scope.row)">确 认</el-button>
            <el-button type="text" size="mini" v-if="scope.row.showConfirm" @click="handleRefuseConfirmed(scope.row)">拒绝</el-button>
            <el-button type="text" size="mini" @click='cancelOrder(scope.row)' v-if = "scope.row.canCancel">取消订单</el-button>
            <el-button type="text" size="mini" @click='signContract(scope.row)' v-show='(scope.row.payStatusName =="已付款"||scope.row.payStatusName =="部分付款")&&!scope.row.isSignElectronicContract&&scope.row.categoryName=="电子合同"&&scope.row.orderSource==8'>签订电子合同</el-button>
            <el-button type="text" size="mini" @click='handleViewDetail(scope.row)'  v-show='scope.row.isSignElectronicContract&&scope.row.categoryName=="电子合同"&&scope.row.orderSource==8'>查看电子合同</el-button>
            <el-button type="text" size="mini" @click='resignEContract(scope.row)' v-show='scope.row.isSignElectronicContract&&scope.row.categoryName=="电子合同"&&scope.row.orderSource==8'>重签电子合同</el-button>
            <el-row style="font-size:12px;">
              <span v-if="scope.row.supplierConfirmed" class="success">供应商已确认</span>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
<script>
import { dateFmt } from "@/utils/tools.js";
export default {
  data() {
    return {
      lineTypeList:[],
      btn_disabled: true,
      table_loading: false,
      AreaOptions: [],
      multipleSelection: [],
      orderStatusOptions: [], //订单状态
      payStatusOptions: [], //支付状态
      teamStatusOptions: [], //出团状态
      sourceList: [], //资源来源
      orderSourceList: [],
      supplierAreaTypeList:[{key:'',name:"全部"}],
      order: {
        lineTypeName:'',
        Date: "",
        lineName: "",
        teamNo: "",
        orderStatus: "",
        payStatus: "",
        teamStatus: "",
        GroupLineSource: "",
        orderNo: "",
        orderSource: "",
        disCompanyInfoId: "",
        BranchId: "",
        BoAreaInfoId: 0,
        supplierName:'',
        shopName:'',
        orderSouceName:'',
        innerCode:'',
        AirlineType:'',
        table: [{}]
      },
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
     //导出
    handleExport(){
      let BeginDate = '',EndDate = '';
        if(this.order.Date && this.order.Date.length > 0){
          BeginDate = dateFmt(new Date(this.order.Date[0]),'yyyy-MM-dd');
          EndDate = dateFmt(new Date(this.order.Date[1]),'yyyy-MM-dd');
        }
      let WEB_API=process.env.WEB_API;
      let url=WEB_API+'/GroupLine/ExcelBranchOutGroupLineOrderList?PaymentStatus='+this.order.payStatus+
          "&TeamStatus="+ this.order.teamStatus +
          "&OrderSource="+ this.order.orderSource +
          "&OrderNo="+ this.order.orderNo +
          "&orderStatusStr="+ this.order.orderStatus +
          "&GroupLineSource="+ this.order.GroupLineSource +
          "&teamNo="+ this.order.teamNo +
          "&lineName="+ this.order.lineName +
          "&lineTypeName="+ this.order.lineTypeName +
          "&BeginDate="+ BeginDate +
          "&EndDate="+ EndDate +
          "&disCompanyInfoId="+ this.order.disCompanyInfoId +
          "&BoAreaInfoId="+ this.order.BoAreaInfoId +
          "&ShopName="+ this.order.shopName +
          "&SupplierName="+ this.order.supplierName +
          "&OrderSouceName="+ this.order.orderSouceName +
          "&InnerCode="+ this.order.innerCode +          
          "&pageSize="+ this.pagination.size +
          "&pageIndex="+ this.pagination.currentPage +
          "&BranchId="
        this.groupHttp.get("GroupLine/GetBranchId").then(function(res){
          window.location.href=url+res.data;
        })
        },
    //获取线路类型
    getLineTypeList(){
      this.groupHttp.post('GroupLine/GetExternalGroupLineTypeList').then(res=>{
        if(res.data.isSuccess == true){
          this.lineTypeList = JSON.parse(res.data.data) 
        }else{
          this.$message.error('线路类型获取失败')
        }
      }).catch(e=>{
        console.log(e);
      })
    },
   //获取国内国外
   getSupplierAreaType(){
     this.groupHttp.post('/GroupLine/GetSupplierAreaType').then(res=>{
      if(res.data.isSuccess == true){
        this.supplierAreaTypeList = this.supplierAreaTypeList.concat(res.data.keyValueList);
      }else{
        this.$message.error(res.data.message);
      }
     }).catch(e=>{
       console.log(e);
     })
   },
  //获取资源来源
  getSourceList() {
  this.groupHttp.post("/GroupLine/GetEnumOrderSourceList").then(res => {
  if (res.data.isSuccess == true) {
  this.sourceList = res.data.keyValueList;
  } else {
  this.$message.error(res.data.message);
  }
  });
  },
  //获取销售渠道
  getGroupLineSourceList() {
  this.groupHttp
  .post("/GroupLine/GetOrderEnumGroupLineSourceList")
  .then(res => {
  if (res.data.isSuccess == true) {
  this.orderSourceList = res.data.keyValueList;
  } else {
  this.$message.error(res.data.message);
  }
  });
  },
  //全选
  pathSelectionChange(val) {
  this.multipleSelection = val;
  if (this.multipleSelection.length > 0) {
  this.btn_disabled = false;
  } else {
  this.btn_disabled = true;
  }
  },
  //查询数据
  queryData(size, index,orderStatus=["1","4"]) {
  this.table_loading = true;
  this.groupHttp
  .post("/GroupLine/GetBranchOutGroupLineOrderList", {
  BranchId: "",
  PaymentStatus: this.order.payStatus,
  TeamStatus: this.order.teamStatus,
  OrderSource: this.order.orderSource,
  OrderNo: this.order.orderNo,
  orderStatusStr: orderStatus.join(','),
  GroupLineSource: this.order.GroupLineSource,
  teamNo: this.order.teamNo,
  lineName: this.order.lineName,
  LineTypeName: this.order.lineTypeName,
  BeginDate: this.order.Date[0],
  EndDate: this.order.Date[1],
  disCompanyInfoId: this.order.disCompanyInfoId,
  BoAreaInfoId: this.order.BoAreaInfoId,
  ShopName:this.order.shopName,
  SupplierName:this.order.supplierName,
  OrderSouceName:this.order.orderSouceName,
  InnerCode:this.order.innerCode,
  AirlineType:this.order.AirlineType,
  pageSize: size || 10,
  pageIndex: index || 1
  })
  .then(res => {
  if (res.data.isSuccess == true) {
  res.data.objects.forEach(obj => {
  let data1 = new Date(obj.creationTime);
  let data2 = new Date(obj.departureDate);
  obj.creationTime = dateFmt(data1, "yyyy-MM-dd");
  obj.departureDate = dateFmt(data2, "yyyy-MM-dd");
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
  signContract(row){
  this.$router.push({ path: '/grouptour/signContract', query: { orderNo: row.orderNo, isOfflineOrder: false, isRemark: false}})
  },
  //重签电子合同
  resignEContract(row) {
  this.$router.push({ path: '/grouptour/signContract', query: { orderNo: row.orderNo, isOfflineOrder: false, isRemark: true } })
  },
  //查看电子合同
  handleViewDetail(row){
  this.$router.push({path:'/ContractManage/electronicContractDetail',query:{contractNo:row.contractNo}})
  },
  receivables() {
  this.$router.push({
  path: "/orderCenter/receivables",
  query: {
  settlementIds: this.multipleSelection[0].settlementId,
  cusSettleClientId: this.multipleSelection[0].cusSettleClientId
  }
  });
  },
  refund() {
  this.$router.push({
  path: "/orderCenter/refund",
  query: {
  settlementIds: this.multipleSelection[0].settlementId,
  cusSettleClientId: this.multipleSelection[0].cusSettleClientId
  }
  });
  },
  lineOrder() {
  this.$router.push("/orderCenter/lineOrder");
  },
  checkMessage(row) {
  this.$router.push({
  path: "/grouptour/orderCheck",
  query: { orderId: row.orderId,save:true}
  });
  },
  printOrder(row) {
  location.href="http://"+window.location.host+"/GroupLine/BranchOutGroupLineOrderPrintVoucher?orderId="+ row.orderId + "&print=true";
    },
    handleConfirmed(row) {
      this.$confirm("是否确认此订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.groupHttp
            .get(`GroupLine/OrderConfirmed?OrderId=${row.orderId}`)
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
              console.log(e);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "未确认"
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
            .get(`GroupLine/OrderConfrimFailed?OrderId=${row.orderId}`)
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
          this.groupHttp.post("GroupLine/CancelGroupLineOrder", {
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
    //分页
    sizeChange(val) {
      this.pagination.size = val;
      this.pagination.currentPage = 1;
      this.queryData(this.pagination.size, this.pagination.currentPage,this.order.orderStatus);
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.queryData(this.pagination.size, this.pagination.currentPage,this.order.orderStatus);
    }
  },
  mounted() {
    this.queryData();
    this.groupHttp
      .get("Common/GetAreaInfoList")
      .then(res => {
        if (res.data.isSuccess == true) {
          this.AreaOptions = res.data.objects;
        } else {
          this.$message({
            type: "info",
            message: "加载失败: " + res.data.message
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
      this.getLineTypeList();
    //订单状态
    this.groupHttp
      .post("GroupLine/GetOrderStatuslList", {})
      .then(res => {
        console.log(res);
        if (res.data.isSuccess == true) {
          this.orderStatusOptions = res.data.keyValueList;
          this.order.orderStatus = ["1","4"]
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
    //结算状态
    this.groupHttp
      .post("GroupLine/GetOrderPaymentStatusList", {})
      .then(res => {
        console.log(res);
        if (res.data.isSuccess == true) {
          this.payStatusOptions = res.data.keyValueList;
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
        console.log(res);
        if (res.data.isSuccess == true) {
          this.teamStatusOptions = res.data.keyValueList;
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
    this.getSourceList();
    this.getGroupLineSourceList();
    this.getSupplierAreaType()
  }
};
</script>

<style scoped lang=scss>
/* .table{
        margin-top: 30px;
    } */
.input {
  width: 200px;
}
</style>
