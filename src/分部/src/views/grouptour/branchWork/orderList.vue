<template>
  <div id="box" class="view">
    <div>
      <el-form size="small" :inline="true" :model="order" class="demo-form-inline" label-width="80px">
        <el-form-item label="订单状态">
          <el-select v-model="order.orderStatus" placeholder="请选择" class="input" clearable>
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="order.payStatus" placeholder="请选择" class="input">
            <el-option
              v-for="item in payStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出团状态">
          <el-select v-model="order.teamStatus" placeholder="请选择" class="input">
            <el-option
              v-for="item in teamStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出团日期">
          <el-date-picker
                    :editable = 'false'
                    size='small'
                    v-model="dates"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="order.customerName" placeholder="" class="input"></el-input>
        </el-form-item>
        <el-form-item label="供应商">
              <el-input v-model="order.supplierName" size='small'></el-input>
           </el-form-item>
           <!-- <el-form-item label="门店">
              <el-input v-model="order.shopName" size='small'></el-input>
           </el-form-item> -->
        <el-form-item label="线路名称">
          <el-input v-model="order.lineName" placeholder="" class="input"></el-input>
        </el-form-item>
        <!--<el-form-item label="团号">
          <el-input v-model="order.teamNo" placeholder="" class="input"></el-input>
        </el-form-item>-->
        <el-form-item label="订单号">
          <el-input v-model="order.orderNo" placeholder="" class="input"></el-input>
        </el-form-item>
        <el-form-item label="订单来源">
          <el-input v-model="order.orderSouceName" placeholder="" class="input"></el-input>
        </el-form-item>
        <el-form-item label="内部编码">
          <el-input v-model="order.innerCode" placeholder="" class="input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click='queryData(pagination.size,1)'>搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="margin_bottom">
      <el-button size="small" type="primary" @click="receivables()" :disabled = 'btn_receivables'>收款</el-button>
      <el-button size="small"  @click="handleExport" >导出</el-button>
    </div>
    <div class="table">
      <el-table size="small" algin="center" :data="order.table" style="width: 100%" :loading ='table_loading' @selection-change="pathSelectionChange">
        <!-- <el-table-column align="center" prop="select" label="序号" ></el-table-column> -->
        <el-table-column size="small" type="selection" fixed></el-table-column>
        <el-table-column size="small" align="center" prop="payStatusName" label="支付状态" ></el-table-column>
        <el-table-column size="small" align="center" prop="teamStatusDesc" label="出团状态" > </el-table-column>
        <el-table-column size="small" align="center" prop="orderNo" label="订单号" > </el-table-column>
        <el-table-column size="small" align="center" prop="innerCode" label="内部编码" > </el-table-column>        
        <!--<el-table-column size="small" align="center" prop="teamNo" label="团号" ></el-table-column>-->
        <el-table-column size="small" align="center" prop="lineName" label="线路名称" show-overflow-tooltip> </el-table-column>
        <el-table-column size="small" align="center" prop="departureDateString" label="出团日期" > </el-table-column>
        <el-table-column size="small" align="center" prop="settlementUnit" label="结算单位" ></el-table-column>
        <el-table-column size="small" align="center" prop="supplierName" label="供应商" ></el-table-column>
        <!-- <el-table-column size="small" align="center" prop="shopName" label="门店" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="quantity" label="人数" ></el-table-column>
        <el-table-column size="small" align="center" prop="receivableFee" label="应收" > </el-table-column>
        <el-table-column size="small" align="center" prop="receivedFee" label="已收" ></el-table-column>
        <el-table-column size="small" align="center" prop="creationTime" label="下单日期" ></el-table-column>
        <el-table-column size="small" align="center" prop="orderSouceName" label="订单来源" ></el-table-column>

        <!--<el-table-column size="small" align="center" prop="orderStatusName" label="订单状态"> </el-table-column>-->
        <el-table-column size="small" align="center"  label="操作" fixed="right" min-width='180'>
          <template slot-scope="scope">
            <el-button type="text"  size="mini" @click="checkMessage(scope.row)">查 看</el-button>
            <el-button type="text"  size="mini"  @click="refund(scope.row)"  :disabled = "!scope.row.showRefund">退 款</el-button>
            <el-button type="text"  size="mini" @click='cancelOrder(scope.row)' :disabled ='scope.row.payStatusName =="未付款" && scope.row.orderStatusName != "取消" ? false : true'>取消订单</el-button>
            <el-button type="text"  size="mini" @click='signContract(scope.row)' v-show='(scope.row.orderStatusName != "取消")&&!scope.row.isSignElectronicContract&&scope.row.categoryName=="电子合同"'>签订电子合同</el-button>
            <el-button type="text"  size="mini" @click='handleViewDetail(scope.row)'  v-show='scope.row.isSignElectronicContract&&scope.row.categoryName=="电子合同"&&scope.row.orderSource==8'>查看电子合同</el-button>
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
  import {dateFmt} from '@/utils/tools.js';
  export default {
    data () {
      return {
        btn_receivables:true,
        table_loading:false,
        multipleSelection:[],
        orderStatusOptions:[],//订单状态
        payStatusOptions:[{name:'全部',key:''}],//支付状态
        teamStatusOptions:[{name:'全部',key:''}],//出团状态
        dates:[],
        order:{
          lineName: '',
          teamNo:'',
          orderStatus:'',
          payStatus:'',
          teamStatus:'',
          customerName:'',
          orderNo:'',
          supplierName:'',
          // shopName:'',
          disCompanyInfoId:'',
          orderSouceName:'',
          innerCode:'',          
          BranchId:'',
          table:[{

          }]
        },
        //分页
        pagination:{
          sizes:[5,10,20,50],
          size:10,
          currentPage: 1,
          total:0
        },
      }
    },
    methods: {
      //全选
      pathSelectionChange(val) {
        this.multipleSelection = val;
          if(this.multipleSelection.length == 0){
              this.btn_disabled = true;
              this.btn_receivables = true;
              return;
          }
          this.btn_disabled = false;
          this.btn_receivables = false;
          for(var i = 0;i < this.multipleSelection.length; i++){
              if(this.multipleSelection[i].disSettleClientId != this.multipleSelection[0].disSettleClientId){
                  this.btn_disabled = true;
                  this.btn_receivables = true;
              }
              if(this.multipleSelection[i].payStatusName != '未付款' && this.multipleSelection[i].payStatusName != '部分付款'){
                  this.btn_receivables = true;
              }
          }
      },
      //查询数据
      queryData(size,index){
        let BeginDate = '',EndDate = '';
        if(this.dates && this.dates.length > 0){
          BeginDate = dateFmt(new Date(this.dates[0]),'yyyy-MM-dd');
          EndDate = dateFmt(new Date(this.dates[1]),'yyyy-MM-dd');
        }
        this.table_loading = true;
        this.groupHttp.post("GroupLine/GetSelfGroupLineOrderList", {
          PaymentStatus: this.order.payStatus,
          TeamStatus:this.order.teamStatus,
          OrderNo:this.order.orderNo,
          orderStatus: this.order.orderStatus, 
          customerName: this.order.customerName,
          teamNo: this.order.teamNo,
          lineName: this.order.lineName,
          BeginDate: BeginDate,
          EndDate: EndDate,
          disCompanyInfoId:this.order.disCompanyInfoId,
          // ShopName:this.order.shopName,
          SupplierName:this.order.supplierName,
          orderSouceName:this.order.orderSouceName,
          innerCode:this.order.innerCode,          
          pageSize: size || 10,
          pageIndex: index || 1
        })
          .then(res => {
            if (res.data.isSuccess == true) {
              res.data.objects.forEach((obj) => {
                  let data1 = new Date(obj.creationTime);
                  obj.creationTime = dateFmt(data1,'yyyy-MM-dd');
                  let data2 = new Date(obj.departureDate);
                  obj.departureDate = dateFmt(data2,'yyyy-MM-dd');
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
              },500)
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      receivables(){
                var arr = [];
                this.multipleSelection.forEach( (sel) => {
                    arr.push(sel.settlementId)
                });
                this.$router.push({name:'orderReceivables',query:{settlementIds:arr,disSettleClientId:this.multipleSelection[0].disSettleClientId}})
            },
      refund(row){
          this.$router.push({name: 'orderRefund',params:{settlementIds:[row.settlementId],disSettleClientId:row.disSettleClientId}})
      },
      checkMessage(row){
        this.$router.push({path:'/grouptour/orderCheck',query:{orderId:row.orderId}})
      },
      //导出
      handleExport(){
        let BeginDate = '',EndDate = '';
        if(this.dates && this.dates.length > 0){
          BeginDate = dateFmt(new Date(this.dates[0]),'yyyy-MM-dd');
          EndDate = dateFmt(new Date(this.dates[1]),'yyyy-MM-dd');
        }
        let WEB_API=process.env.WEB_API;
        let url=WEB_API+'/GroupLine/ExcelSelfGroupLineOrderList?PaymentStatus='+this.order.payStatus+
          "&TeamStatus="+ this.order.teamStatus +
          "&OrderNo="+ this.order.orderNo +
          "&orderStatus="+ this.order.orderStatus +
          "&customerName="+ this.order.customerName +
          "&teamNo="+ this.order.teamNo +
          "&lineName="+ this.order.lineName +
          "&BeginDate="+ BeginDate +
          "&EndDate="+ EndDate +
          "&disCompanyInfoId="+ this.order.disCompanyInfoId +
          // "&ShopName="+ this.order.shopName +
          "&SupplierName="+ this.order.supplierName +
          "&OrderSouceName="+ this.order.orderSouceName +
          "&InnerCode="+ this.order.innerCode +          
          "&pageSize="+ this.pagination.size +
          "&pageIndex="+ this.pagination.currentPage +
          "&BranchId=";
          this.groupHttp.get("GroupLine/GetBranchId").then(function(res){
            console.log(url+res.data)
              window.location.href=url+res.data;
          })
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
      cancelOrder(row){
        this.$confirm('是否取消此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.groupHttp.post("GroupLine/CancelGroupLineOrder", {
          OrderNo:row.orderNo,
          pageSize: 10,
          pageIndex: 1
        })
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: "success",
                message: "取消订单成功"});
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
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
        });
      },
      //分页
      sizeChange(val) {
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
      currentPageChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
    },
    mounted() {
      this.queryData();
      //订单状态
      this.groupHttp
        .post("GroupLine/GetOrderStatuslList", {})
        .then(res => {
          if (res.data.isSuccess == true) {
            this.orderStatusOptions = this.orderStatusOptions.concat(res.data.keyValueList);
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
    }
  }
</script>

<style scoped lang=scss>
  /* .table{
        margin-top: 30px;
    } */
  .input{
    width: 200px;
  }
</style>
