<template>
  <div id="box" class="view">
    <div>
      <el-form size="small" :inline="true" :model="order" class="demo-form-inline" label-width="80px">
        <el-form-item label="订单状态">
          <el-select v-model="order.OrderStatus" placeholder="请选择" class="input" multiple clearable>
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="order.PaymentStatus" placeholder="请选择" class="input">
            <el-option
              v-for="item in payStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出团状态">
          <el-select v-model="order.TeamStatus" placeholder="请选择" class="input">
            <el-option
              v-for="item in teamStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="结算单位">
          <el-input v-model="order.CustomerName" placeholder="" class="input"></el-input>
        </el-form-item>-->
        <el-form-item label="线路名称">
          <el-input v-model="order.LineName" placeholder="" class="input"></el-input>
        </el-form-item>
        <el-form-item label="内部编码">
          <el-input v-model="order.InnerCode" placeholder="" class="input"></el-input>
        </el-form-item>
        <!-- <el-form-item label="团号">
          <el-input v-model="order.TeamNo" placeholder="" class="input"></el-input>
        </el-form-item> -->
        <el-form-item label="供应商">
          <el-input v-model="order.supplierName" size='small'></el-input>
        </el-form-item>
        <el-form-item label="门市名称">
          <el-input v-model="order.shopName" size='small'></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="order.OrderNo" placeholder="" class="input"></el-input>
        </el-form-item>
        <el-form-item label="确认状态">
          <el-select v-model="order.IsComfirm" placeholder="请选择" class="input">
            <el-option
              v-for="item in comfirmOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票状态">
          <el-select v-model="order.IsPayForAnotherInvoice" placeholder="请选择" class="input">
            <el-option
              key=""
              label="全部"
              value="">
            </el-option>
            <el-option
              :key="true"
              label="已上传"
              :value="true">
            </el-option>
            <el-option
              :key="false"
              label="未上传"
              :value="false">
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
                    end-placeholder="结束日期" @change='handleDateChange'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click='queryData(pagination.size,1,order.OrderStatus)'>搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:10px">
      <el-button size="small" type="primary" @click="receivables" :disabled = '!canReceive'>收 款</el-button>
      <!-- <el-button size="small" type="primary"  :disabled = "!canPay" @click="handleReplacePay">申请代付</el-button> -->
       <!-- <el-button size="small" type="primary" @click="createOfflineOrder" >创建线下订单</el-button> -->
      <el-button size="small" type="primary" @click="exportExcel" >订单导出</el-button>
       <!-- <el-button size="small" type="primary" @click="handleConfirmOrder" :disabled = '!canConfirm' >确认订单</el-button> -->
    </div>
     <el-row class="margin_bottom" >
           <span>合计：</span>
           <span class="margin_left">人数：{{totalQuantity||0}}人</span>
           <span class="margin_left">应收：{{totalReceivableFee||0}}</span>
           <span class="margin_left">已收：{{totalReceivedFee||0}}</span>
      </el-row>
    <div class="table">
      <el-table size="small" algin="center" :data="tableData" style="width: 100%" v-loading ='table_loading' @selection-change="pathSelectionChange">
        <el-table-column size="small" type="selection" fixed></el-table-column>
        <el-table-column size="small" align="center" prop="orderStatusName" label="订单状态" ></el-table-column>
        <el-table-column size="small" align="center" prop="payStatusName" label="支付状态" ></el-table-column>
        <el-table-column size="small" align="center" prop="teamStatusDesc" label="出团状态" > </el-table-column>
        <el-table-column size="small" align="center" prop="orderNo" label="订单号" > </el-table-column>     
        <!-- <el-table-column size="small" align="center" prop="teamNo" label="团号" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="lineName" label="线路名称" show-overflow-tooltip> </el-table-column>
        <el-table-column size="small" align="center" prop="departureDateString" label="出团日期" > </el-table-column>
        <!-- <el-table-column size="small" align="center" prop="customerName" label="结算单位" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="supplierName" label="供应商" ></el-table-column>
        <!-- <el-table-column size="small" align="center" prop="shopName" label="门店" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="quantity" label="人数" ></el-table-column>
        <el-table-column size="small" align="center" prop="receivableFee" label="应收" > </el-table-column>
        <el-table-column size="small" align="center" prop="receivedFee" label="已收" ></el-table-column>
        <el-table-column size="small" align="center"  label="下单日期" >
          <template slot-scope="scope">
            {{scope.row.orderDate?scope.row.orderDate.split('T')[0]:''}}
          </template>
        </el-table-column>
        <el-table-column size="small" align="center"  label="预订信息" width='140'>
          <template slot-scope="scope">
              <p>{{scope.row.createUserName}}</p>
              <p>{{scope.row.shopName}}</p>
            </template>
        </el-table-column>
        <el-table-column size="small" align="center" prop="innerCode" label="内部编码" > </el-table-column>  
        <el-table-column size="small" align="center" prop="isComfirmStr" label="确认状态" ></el-table-column>
        <el-table-column size="small" align="center" prop="isPayForAnotherInvoice" label="发票" >
          <template slot-scope="scope">
            {{scope.row.isPayForAnotherInvoice?"已上传":"未上传"}}
          </template>
        </el-table-column>
        <el-table-column size="small" align="center"  label="操作" fixed="right" min-width='180'>
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="printOrder(scope.row)" v-show='(scope.row.payStatusName =="已付款"||scope.row.payStatusName =="部分付款")'>打 印</el-button> -->
            <el-button type="text"  size="mini" @click="viewDetails(scope.row)">{{scope.row.isComfirm?"查 看":"审 核"}}</el-button>
            <el-button type="text"  size="mini" @click='handleReplacePay(scope.row)' v-if ='scope.row.canPay'>申请代付</el-button>
            <el-button type="text" size="mini" @click='forceCancelOfflineOrder(scope.row)' v-if="scope.row.showForceCancel">强制取消</el-button>
            <el-button type="text" size="mini" @click='cancelOrder(scope.row)' v-if ='scope.row.canCancel'>取消确认</el-button>
            <el-button type="text"  size="mini" @click='signContract(scope.row)' v-show='(scope.row.payStatusName =="已付款"||scope.row.payStatusName =="部分付款")&&!scope.row.isSignElectronicContract&&scope.row.categoryName=="电子合同"&&scope.row.enumOrderSource==8'>签订电子合同</el-button>
            <el-button type="text"  size="mini" @click='handleViewDetail(scope.row)'  v-show='scope.row.isSignElectronicContract&&scope.row.categoryName=="电子合同"'>查看电子合同</el-button>
            <el-button type="text" size="mini" @click='resignEContract(scope.row)' v-show='scope.row.isSignElectronicContract&&scope.row.categoryName=="电子合同"'>重签电子合同</el-button>
            <template v-if="scope.row.isApplyPay&&scope.row.enumOrderSource==8">
              <el-button type="text" size="mini" @click='openInvoiceDialog(scope.row)'>{{scope.row.isPayForAnotherInvoice?'查看发票':'上传发票'}}</el-button>
            </template>
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
    <el-dialog title="申请代付" :visible.sync="dialogFormVisible" @close="handleCloseDialog('payForm')" width="800px">
      <el-form ref="payForm" :model="payForm" size="small" :inline="true"  class="demo-form-inline"  label-width="150px" :rules="payFormRules">
        <el-form-item label="银行名称" prop="BankName" >
          <el-input v-model="payForm.BankName"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="OpeningBank" >
          <el-input v-model="payForm.OpeningBank" ></el-input>
        </el-form-item>
        <el-form-item label="开户人" prop="AccountHolder" >
          <el-input v-model="payForm.AccountHolder"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="BankAccount" >
          <el-input v-model="payForm.BankAccount" ></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="Currency" >
          <el-select class="inputs" v-model="payForm.Currency">
              <el-option
                  v-for='(item,index) in currencyTypes'
                  :value="item.currencyName"
                  :label="item.currencyName"
                  :key='index'>
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代付金额"  >
          <el-input v-model="payForm.PaymentAmount" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item  label="发票上传" size="small" prop="SubstituteInvoice">
							<span>（图片格式为jpg/png/bmp，最大为2M。）</span>
              <el-upload
                class="avatar-uploader"
                action="/image/upload"
                :show-file-list="false"
								:http-request="imgUpload"
                :before-upload="beforeAvatarUpload">
                  <img v-if="payForm.SubstituteInvoice" :src="payForm.SubstituteInvoice" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
						</el-form-item> -->
        <el-form-item label="备注" >
          <el-input class="input_comm" type="textarea" v-model="payForm.Comment" style="width: 560px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitReplacePay('payForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看/上传发票" :visible.sync="invoiceFormVisible" width="600px">
      <el-form size="small"  class="demo-form-inline"  label-width="150px" >
        <div v-for="(item,index) in invoiceFormList" :key="item.id">
          <el-form-item :label="'代付'+(index+1)" >
          金额￥{{item.paymentAmount}}
        </el-form-item>
        <el-form-item  label="发票" size="small">
              <template v-if="item.nopic">
                  <span>（图片格式为jpg/png/bmp，最大为2M。）</span>
                <el-upload
                  class="avatar-uploader"
                  action="/image/upload"
                  :data="item"
                  :show-file-list="false"
                  :http-request="imgUpload"
                  :before-upload="beforeAvatarUpload">
                    <img v-if="item.substituteInvoice" :src="item.substituteInvoice" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </template>
							<img v-if="!item.nopic" :src="item.substituteInvoice" class="avatar">
						</el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="invoiceFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="invoiceLoading" @click="saveInvoice()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {dateFmt} from '@/utils/tools.js';
  export default {
    data () {
      return {
        dialogFormVisible:false,
        canReceive:false,
        canConfirm:false,
        canPay:false,
        table_loading:true,
        multipleSelection:[],
        orderStatusOptions:[{name:'全部',key:''}],//订单状态
        payStatusOptions:[{name:'全部',key:''}],//支付状态
        teamStatusOptions:[{name:'全部',key:''}],//出团状态
        comfirmOptions:[{name:'全部',key:''},{name:'未确认',key:false},{name:'已确认',key:true}],//确认状态
        dates:[],
        order:{
          PaymentStatus: '',
          CustomerName:'',
          TeamStatus:'',
          OrderStatus: '',
          TeamNo: '',
          LineName: '',
          BeginDate: '',
          EndDate: '',
          OrderNo:'',
          BranchId:'',
          ShopId:'',
          supplierName:'',
          shopName:'',
          IsComfirm:'',
          IsPayForAnotherInvoice:'',
          InnerCode:''
        },
        payForm:{
          OrderId:'',
          BankName:'',
          OpeningBank:'',
          AccountHolder:'',
          BankAccount:'',
          Currency:'',
          PaymentAmount:'',
          Comment:'',
          InnerCode:'',
          // SubstituteInvoice:'',
        },
        payFormRules:{
          BankName:[{
						required: true,
						message: "请输银行名称",
						trigger: "blur"
          }],
          OpeningBank:[{
						required: true,
						message: "请输开户行",
						trigger: "blur"
          }],
          AccountHolder:[{
						required: true,
						message: "请输开户人",
						trigger: "blur"
          }],
          BankAccount:[{
						required: true,
						message: "请输银行账号",
						trigger: "blur"
          }],
          Currency:[{
						required: true,
						message: "请选择币种",
						trigger: "change"
          }],
        },
        tableData:[],
        //分页
        pagination:{
          sizes:[5,10,20,50],
          size:10,
          currentPage: 1,
          total:0
        },
        //总计
        totalQuantity:0,
        totalReceivableFee:0,
        totalReceivedFee:0,
        currencyTypes:[],//币种列表

        //上传/查看发票
        invoiceFormVisible:false,
        invoiceLoading:false,
        hasNewUpload:false,
        invoiceFormList:[]
      }
    },
    methods: {
          exportExcel(){
            let WEB_API = process.env.WEB_API;
            let url = WEB_API+"/GroupLineOffline/ExcelGroupLineOfflineOrderList?PaymentStatus="+this.order.PaymentStatus
            +"&CustomerName="+ this.order.CustomerName
            +"&TeamStatus="+ this.order.TeamStatus
            +"&orderStatusStr="+ this.order.OrderStatus
            +"&TeamNo="+ this.order.TeamNo
            +"&LineName="+ this.order.LineName
            +"&BeginDate="+ this.order.BeginDate
            +"&EndDate="+ this.order.EndDate
            +"&OrderNo="+ this.order.OrderNo
            +"&ShopId="+ this.order.ShopId
            +"&ShopName="+this.order.shopName
            +"&SupplierName="+this.order.supplierName
            +"&IsComfirm="+ this.order.IsComfirm
            +"&IsPayForAnotherInvoice="+ this.order.IsPayForAnotherInvoice
            +"&InnerCode="+ this.order.InnerCode            
            +"&PageSize="+ this.order.PageSize
            +"&PageIndex="+ this.order.PageIndex
            +"&BranchId=";
            this.groupHttp.get("/GroupLine/GetBranchId").then(function (res) {
              window.location.href = url + res.data;
            })
          },
      //表格数据选择
      pathSelectionChange(val) {
        this.multipleSelection = val;
        if(this.multipleSelection.length == 0){
            this.canReceive = false;
            this.canConfirm=false;
            // this.canPay=false;
        }else if(this.multipleSelection.length == 1){
          if(this.multipleSelection[0].canReceive){
            this.canReceive = true;
          }
          if(!this.multipleSelection[0].isComfirm){
            this.canConfirm = true;
          }
        }else{
            this.canReceive = true;
            this.canConfirm = true;
            for(var i = 0;i < this.multipleSelection.length; i++){
              if(this.multipleSelection[i].disSettleClientId != this.multipleSelection[0].disSettleClientId){
                  this.canReceive = false;
              }
              if(!this.multipleSelection[i].canReceive){
                  this.canReceive = false;
              }
              if(this.multipleSelection[i].isComfirm){
                  this.canConfirm = false;
              }
          }
        }
               
      },
       //强制取消
        forceCancelOfflineOrder(row){
           this.$confirm('是否强制取消此订单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              this.groupHttp.post("/GroupLineOffline/ForceCancelOfflineOrder", {
              orderId:row.orderId
              }).then(res => {
                if (res.data.isSuccess == true) {
                this.$message({
                type: "success",
                message: "订单强制取消成功"});
                this.queryData(this.pagination.size,this.pagination.currentPage,);
                } else {
                  this.$message({
                  type: "info",
                  message: "操作失败:" + res.data.message
                });
              }
            }).catch(e => {
            console.log(e)
            });
          }).catch(() => {
          });
        },
      //确认订单
      handleConfirmOrder(){
        this.$confirm('确认是否取消订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids=[];
          this.multipleSelection.forEach(item=>{
            ids.push(item.orderId);
          })
          this.groupHttp.post("GroupLineOffline/UpdateOrderComfirm", {
            orderIds:ids,
          })
          .then(res => {
            if (res.data.isSuccess) {
              this.$message({
                type: "success",
                message: "确认订单成功"});
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
        }).catch(() => {});
      },
      //打印
      printOrder(row) {
        location.href="http://"+window.location.host+"/GroupLine/GroupLineOfflineOrderPrintVoucher?orderId="+ row.orderId + "&print=true";
      },
      //上传图片
      imgUpload(val)
			{
				var f = new FormData();
				f.append('FileData', val.file);
				f.append('Category', 'AirTicket');
				f.append('thumbnail', true);
				f.append('Folder', 'Airline');
				this.fileUpload.post(val.action, f)
					.then((res) => {
						if (res.data.state == false) {
							this.$message.error(res.data.message);
            }else {
              this.invoiceFormList.forEach(item=>{
                if(item.id==val.data.id){
                  item.substituteInvoice=res.data.url
                  this.hasNewUpload=true
                }
              })
            }

					})
      },
      //限制图片
			beforeAvatarUpload(file){
				const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isImg) {
					this.$message.error('上传图片只能是 JPG/PNG/BMP 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isImg && isLt2M;
			},
      //查询数据
      queryData(size,index,orderStatus=["1","4"]){
        if(this.dates && this.dates.length > 0){
          this.order.BeginDate = dateFmt(new Date(this.dates[0]),'yyyy-MM-dd');
          this.order.EndDate = dateFmt(new Date(this.dates[1]),'yyyy-MM-dd');
        }else{
          this.order.BeginDate='';
          this.order.EndDate='';
        }
        this.order.PageSize= size || 10;
        this.order.PageIndex= index || 1;
        this.table_loading = true;
        this.groupHttp.get("/GroupLineOffline/GetGroupLineOfflineOrderList?PaymentStatus="+this.order.PaymentStatus
            +"&CustomerName="+ this.order.CustomerName
            +"&TeamStatus="+ this.order.TeamStatus
            +"&orderStatusStr="+ orderStatus
            +"&TeamNo="+ this.order.TeamNo
            +"&LineName="+ this.order.LineName
            +"&BeginDate="+ this.order.BeginDate
            +"&EndDate="+ this.order.EndDate
            +"&OrderNo="+ this.order.OrderNo
            +"&BranchId="+ this.order.BranchId
            +"&ShopId="+ this.order.ShopId
            +"&ShopName="+this.order.shopName
            +"&SupplierName="+this.order.supplierName
            +"&IsComfirm="+ this.order.IsComfirm
            +"&IsPayForAnotherInvoice="+ this.order.IsPayForAnotherInvoice
            +"&InnerCode="+ this.order.InnerCode            
            +"&PageSize="+ this.order.PageSize
            +"&PageIndex="+ this.order.PageIndex
          )
          .then(res => {
            if (res.data.isSuccess == true) {
              this.tableData = res.data.objects;
              this.table_loading = false;
              this.pagination.total = res.data.total;
              this.totalQuantity=res.data.totalQuantity;
              this.totalReceivableFee=res.data.totalReceivableFee;
              this.totalReceivedFee=res.data.totalReceivedFee;
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
      //签订电子合同
      signContract(row){
        this.$router.push({ path: '/grouptour/signContract', query: { orderNo: row.orderNo, isOfflineOrder: true, isRemark: false}})
      },
      //重签电子合同
      resignEContract(row) {
        this.$router.push({ path: '/grouptour/signContract', query: { orderNo: row.orderNo, isOfflineOrder: true, isRemark: true } })
      },
      //查看电子合同
      handleViewDetail(row){
        this.$router.push({path:'/ContractManage/electronicContractDetail',query:{contractNo:row.contractNo}})
      },
      receivables(){
          var arr = [];
          this.multipleSelection.forEach( (sel) => {
              arr.push(sel.orderId)
          });
          this.$router.push({name:'offlineOrderReceivables',query:{orderIds:arr}})
      },
      createOfflineOrder(){
        this.$router.push('/grouptour/createOfflineOrder')
      },
      viewDetails(row){
        this.$router.push({path:'/grouptour/offlineOrderDetail',query:{orderId:row.orderId}})
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
          this.groupHttp.post("GroupLineOffline/CancelGroupLineOfflineOrder", {
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
        this.queryData(this.pagination.size,this.pagination.currentPage,this.order.OrderStatus);
      },
      currentPageChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size,this.pagination.currentPage,this.order.OrderStatus);
      },
      handleDateChange(){
        // console.log(this.dates)
      },
      handleReplacePay(row){
        this.payForm.OrderId=row.orderId;
        this.payForm.PaymentAmount=row.receivableFee;
        this.dialogFormVisible=true;
        this.payForm.InnerCode= row.innerCode;
      },
      handleCloseDialog(form){
        this.$refs[form].resetFields();
        this.payForm.Comment='';
      },
      submitReplacePay(form){
        this.$refs[form].validate(valid => {
          if(valid) {
            this.groupHttp
						.post("GroupLineOffline/CreateOfflineOrderPayAnother" , this.payForm)
						.then(res => {
							if(res.data.isSuccess == true) {
                this.$message.success("申请代付成功");
                this.queryData();
                this.dialogFormVisible=false;
							}
						});
          }
				});
          
      },
      openInvoiceDialog(row){
        this.invoiceFormVisible=true
        this.groupHttp.get('GroupLineOffline/GetOfflineOrderPayAnother?orderId='+row.orderId)
        .then(res=>{
          res.data.objects.forEach(item=>{
            if(!item.substituteInvoice){
              item.nopic=true
            }
          })
          this.invoiceFormList=res.data.objects
        })
      },
      saveInvoice(){
        if(!this.hasNewUpload){
          this.invoiceFormVisible=false
          return false
        }
        this.invoiceLoading=true
        var form=JSON.parse(JSON.stringify(this.invoiceFormList))
        form.forEach(item=>{
          delete item.nopic
        })
        this.groupHttp.post('/GroupLineOffline/UpdateOfflineOrderPayAnother',form,{jsonData:true})
        .then(res=>{
          if(res.data.isSuccess){
            this.invoiceLoading=false,
            this.invoiceFormVisible=false
            this.$message.success("上传发票成功");
            this.queryData();
          }else{
            this.invoiceLoading=false,
            this.$message.error(res.data.message);
          }
        })
      }
    },
    mounted() {
      this.queryData();
      //订单状态
      this.groupHttp
        .post("GroupLine/GetOrderStatuslList")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.orderStatusOptions = this.orderStatusOptions.concat(res.data.keyValueList);
            this.order.OrderStatus = ["1","4"]
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

       //币种下拉列表
        this.groupHttp
          .get("Finance/GetCurrency", {})
          .then(res => {
              if (res.data.isSuccess == true) {
                  this.currencyTypes = res.data.objects;
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
  .input{
    width: 200px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
