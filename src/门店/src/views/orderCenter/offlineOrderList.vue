<template>
  <div id="box" class="view">
      <el-form size="small" :inline="true" :model="order" class="demo-form-inline" label-width="80px">
        <el-form-item label="订单状态">
          <el-select v-model="order.OrderStatus" placeholder="请选择"  clearable multiple>
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="order.PaymentStatus" placeholder="请选择"  clearable>
            <el-option
              v-for="item in payStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出团状态">
          <el-select v-model="order.TeamStatus" placeholder="请选择"  clearable>
            <el-option
              v-for="item in teamStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="结算单位">
          <el-input v-model="order.CustomerName" placeholder="" ></el-input>
        </el-form-item> -->
        <el-form-item label="线路名称">
          <el-input v-model="order.LineName" placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="order.createUserName" placeholder="" ></el-input>
        </el-form-item>
        <el-form-item label="内部编码">
          <el-input v-model="order.InnerCode" placeholder="" ></el-input>
        </el-form-item>
        <!-- <el-form-item label="团号">
          <el-input v-model="order.TeamNo" placeholder="" ></el-input>
        </el-form-item> -->
        <el-form-item label="订单号">
          <el-input v-model="order.OrderNo" placeholder="" ></el-input>
        </el-form-item>
        <!-- <el-form-item label="销售渠道">
          <el-input v-model="order.teamNo" placeholder="" ></el-input>
        </el-form-item> -->
        <el-form-item label="供应商">
          <el-input v-model="order.SupplierName" placeholder="" ></el-input>
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
                    end-placeholder="结束日期" @change='handleDateChange' id="se">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click='queryData(pagination.size,1,order.OrderStatus)'>搜索</el-button>
        </el-form-item>
      </el-form>
    <div class="margin_bottom" >
      <el-button size="small" type="primary" @click="receivables" :disabled = '!canReceive' v-if="companyType==1">收款</el-button>
      <el-button size="small" type="primary" @click="handleToPay(false)" :disabled = '!canReceive' v-else-if="companyType==2">支付</el-button>
      <!-- <el-button size="small" type="primary"  :disabled = "!canPay" @click="handleReplacePay">申请代付</el-button> -->
       <el-button size="small" type="primary" @click="createOfflineOrder()" >创建线下订单</el-button>
      <el-button size="small" type="primary" @click="exportExcel" >订单导出</el-button>
    </div>
     <el-row class="margin_bottom" >
           <span>合计：</span>
           <span class="margin_left">人数：{{totalQuantity||0}}人</span>
           <span class="margin_left">应付：{{totalReceivableFee||0}}</span>
           <span class="margin_left">已付：{{totalReceivedFee||0}}</span>
      </el-row>
    <div class="table">
      <el-table size="small" algin="center" :data="tableData" style="width: 100%" v-loading ='table_loading' @selection-change="pathSelectionChange">
        <!-- <el-table-column align="center" prop="select" label="序号" ></el-table-column> -->
        <el-table-column size="small" type="selection" fixed></el-table-column>
        <el-table-column size="small" align="center" prop="payStatusName" label="支付状态" ></el-table-column>
        <el-table-column size="small" align="center" prop="teamStatusDesc" label="出团状态" > </el-table-column>
                <el-table-column size="small" align="center" prop="orderStatusName" label="订单状态" ></el-table-column>
        <el-table-column size="small" align="center" prop="orderNo" label="订单号" > </el-table-column>       
        <!-- <el-table-column size="small" align="center" prop="teamNo" label="团号" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="lineName" label="线路名称" show-overflow-tooltip> </el-table-column>
        <el-table-column size="small" align="center" prop="departureDateString" label="出团日期" > </el-table-column>
        <!-- <el-table-column size="small" align="center" prop="customerName" label="结算单位" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="quantity" label="人数" ></el-table-column>
        <el-table-column size="small" align="center" prop="receivableFee" label="应付" > </el-table-column>
        <el-table-column size="small" align="center" prop="receivedFee" label="已付" ></el-table-column>
        <el-table-column size="small" align="center" prop="paymentAmount" label="已申请代付" ></el-table-column>
        <el-table-column size="small" align="center" prop="supplierName" label="供应商" ></el-table-column>
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
        <!-- <el-table-column size="small" align="center" prop="orderSource" label="来源" ></el-table-column> -->
        <el-table-column size="small" align="center" prop="isComfirmStr" label="确认状态" ></el-table-column>
        <el-table-column size="small" align="center" prop="isPayForAnotherInvoice" label="发票" >
          <template slot-scope="scope">
            {{scope.row.isPayForAnotherInvoice?"已上传":"未上传"}}
          </template>
        </el-table-column>
        <el-table-column size="small" align="center" prop="innerCode" label="内部编码" > </el-table-column> 
        <el-table-column size="small" align="center"  label="操作" fixed="right" min-width='230'>
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="viewDetails(scope.row)">查看</el-button>
            <el-button type="text" size="mini" @click="createOfflineOrder(scope.row)" v-if="scope.row.canEdit">编辑</el-button>
            <el-button type="text" size="mini" @click="handleToPay(scope.row)" v-if="scope.row.canReceive">支付</el-button>
            <el-button type="text" size="mini" @click="handleReplacePay(scope.row)" v-if = "(scope.row.payStatus == 1 && scope.row.paymentAmount == 0) || (scope.row.payStatus == 2 && scope.row.isApplyPay != 1) || scope.row.canPay">申请代付</el-button>
            <el-button type="text" size="mini" @click='cancelOrder(scope.row)' v-if ='scope.row.canCancel'>取消订单</el-button>
            <el-button type="text" size="mini" @click='signContract(scope.row)' v-show='scope.row.showEleContractSign'>签订电子合同</el-button>
            <el-button type="text" size="mini" @click='handleViewDetail(scope.row)' v-show='scope.row.showViewEleContract'>查看电子合同</el-button>
            <el-button type="text" size="mini" @click='handleViewAgreement(scope.row)' v-show='scope.row.showMZXY'>免责协议</el-button>
            <el-button type="text" size="mini" @click='resignEContract(scope.row)' v-show='scope.row.showEleContractSign2'>重签电子合同</el-button>
            <el-button type="text" size="mini" @click='voidEContract(scope.row)' v-show='scope.row.showDiscardEleContract'>作废电子合同</el-button>
            <template v-if="scope.row.isApplyPay == 1">
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
    <el-dialog title="申请代付" :visible.sync="dialogFormVisible" @close="handleCloseDialog('payForm')" width="780px">
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
        <el-form-item label="应代付金额" >
          <el-input v-model="payForm.SumPaymentAmount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="已代付金额" >
          <el-input v-model="payForm.AlreadyPaymentAmount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="需代付金额" prop="PaymentAmount">
          <el-input  type="number" v-model="payForm.PaymentAmount" @keyup.native='paymentAmountKeyup()' :disabled="true"></el-input>
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
          <el-input class="input_comm" type="textarea" v-model="payForm.Comment" ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitReplacePay('payForm')" :loading="dfLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看/上传发票" :visible.sync="invoiceFormVisible" width="600px">
      <el-form size="small"  class="demo-form-inline"  label-width="150px" >
        <div v-for="item in invoiceFormList" :key="item.id">
          <el-form-item label="金额" >
          ￥{{item.paymentAmount}}
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
  import {dateFmt} from '@/utils/tools.js';
  export default {
    data () {
      return {
        rowOrderNo:'',
        contractUrl:'',
        showDialog:false,
        contract:1,
        userId:localStorage.getItem("userId"),
        dfLoading:false,
        companyType:localStorage.getItem("companyType"),
        dialogFormVisible:false,
        canReceive:false,
        canPay:false,
        table_loading:true,
        multipleSelection:[],
        orderStatusOptions:[],//订单状态
        payStatusOptions:[{name:'全部',key:''}],//支付状态
        teamStatusOptions:[{name:'全部',key:''}],//出团状态
        comfirmOptions:[{name:'全部',key:''},{name:'未确认',key:false},{name:'已确认',key:true}],//确认状态
        dates:[],
        order:{
          createUserName:'',
          PaymentStatus: '',
          CustomerName:'',
          TeamStatus:'',
          OrderStatus: '',
          TeamNo: '',
          LineName: '',
          BeginDate: '',
          EndDate: '',
          OrderNo:'',
          SupplierName:'',
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
          SumPaymentAmount:'',
          AlreadyPaymentAmount:'',
          PaymentAmount:'',
          Comment:'',
          InnerCode:'',
          // SubstituteInvoice:''
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
          PaymentAmount:[{
						required: true,
						message: "请输入代付金额",
						trigger: "change"
          }],
          // SubstituteInvoice:[{
					// 	required: true,
					// 	message: "请上传发票",
					// 	trigger: "change"
          // }],
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
    handleCheck(){
      if(this.contract == 1){
        this.$router.push({ path: '/orderCenter/signContract', query: { orderNo: this.rowOrderNo, isOfflineOrder: true, isRemark: false}})
      }else{
        window.location.href = this.contractUrl
      }
    },
    handleViewAgreement(row) {
      this.$router.push({ path: "/orderCenter/agreement/" + row.orderNo });
    },
      paymentAmountKeyup(){
        var paymentAmount = this.payForm.SumPaymentAmount - this.payForm.AlreadyPaymentAmount;
        if(this.payForm.PaymentAmount > paymentAmount){
          this.payForm.PaymentAmount = paymentAmount;
        }
      },
      //表格数据选择
      pathSelectionChange(val) {
        this.multipleSelection = val;
        if(this.multipleSelection.length == 0){
            this.canReceive = false;
            // this.canPay=false;
        }else if(this.multipleSelection.length == 1){
          //  this.canPay=true;
          if(this.multipleSelection[0].canReceive){
            this.canReceive = true;
          }
          // else if(this.multipleSelection[0].canPay){
          //   this.payForm.PaymentAmount=this.multipleSelection[0].receivableFee;
          //   this.canPay=true;
          // }
        }else{
            // this.canPay=false;
            this.canReceive = true;
            for(var i = 0;i < this.multipleSelection.length; i++){
              if(this.multipleSelection[i].customerId != this.multipleSelection[0].customerId){
                  this.canReceive = false;
                  return;
              }
              if(!this.multipleSelection[i].canReceive){
                  this.canReceive = false;
                  return;
              }
          }
        }

      },
      //上传图片
      imgUpload(val)
			{
        console.log(val)
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
      queryData(size=10,index=1,orderStatus=["1","4"]){
        if(this.dates && this.dates.length > 0){
          this.order.BeginDate = dateFmt(new Date(this.dates[0]),'yyyy-MM-dd');
          this.order.EndDate = dateFmt(new Date(this.dates[1]),'yyyy-MM-dd');
        }else{
          this.order.BeginDate='';
          this.order.EndDate='';
        }
        this.table_loading = true;
        this.shopHttp.get("/GroupLineOffline/GetGroupLineOfflineOrderList?PaymentStatus="+this.order.PaymentStatus
            +"&CustomerName="+ this.order.CustomerName
            +"&CreateUserName="+this.order.createUserName
            +"&TeamStatus="+ this.order.TeamStatus
            +"&orderStatusStr="+ orderStatus
            +"&TeamNo="+ this.order.TeamNo
            +"&LineName="+ this.order.LineName
            +"&BeginDate="+ this.order.BeginDate
            +"&EndDate="+ this.order.EndDate
            +"&OrderNo="+ this.order.OrderNo
            // +"&BranchId="+ this.order.BranchId
            +"&PageSize="+ size
            +"&PageIndex="+ index
            +"&SupplierName="+ this.order.SupplierName
            +"&IsComfirm="+ this.order.IsComfirm
            +"&IsPayForAnotherInvoice="+ this.order.IsPayForAnotherInvoice
            +"&InnerCode="+ this.order.InnerCode            
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
        this.showDialog = true;
        this.rowOrderNo = row.orderNo
        this.contractUrl= row.eleContract_12301_ResourcePlatform_Url
      },
      //重签电子合同
      resignEContract(row) {
        this.$router.push({ path: '/orderCenter/signContract', query: { orderNo: row.orderNo, isOfflineOrder: true, isRemark: true } })
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
                this.queryData(this.pagination.size,this.pagination.currentPage,);
                } else {
                  this.$message({
                    type: "info",
                    message: "失败:" + res.data.message
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
      handleViewDetail(row){
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
      receivables(){
          var arr = [];
          this.multipleSelection.forEach( (sel) => {
              arr.push(sel.orderId)
          });
          this.$router.push({name:'offlineOrderReceivables',query:{orderIds:arr}})
      },
      handleToPay(row){
          if(row){
              this.$router.push({name:'offlineOrderPayment',query:{orderIds:[row.orderId]}})
              return false
          }
          var arr = [];
          var hasReceivedFee=[],noReceivedFee=[]
          this.multipleSelection.forEach( (sel) => {
              arr.push(sel.orderId)
              if(sel.receivedFee!==0){
                  hasReceivedFee.push(sel.orderId)
              }else{
                  noReceivedFee.push(sel.orderId)
              }
          });
          if(hasReceivedFee.length>0&&noReceivedFee.length>0){
          //未付款和部分付款不能同时支付
          this.$message({
          message: '未付款和部分付款不能同时支付',
          type: 'warning'
          });
          }else{
          this.$router.push({name:'offlineOrderPayment',query:{orderIds:arr}})
          }
          // this.multipleSelection.forEach( (sel) => {
          //     arr.push(sel.orderId)
          // });
          // this.$router.push({name:'offlineOrderPayment',query:{orderIds:arr}})
          },
          createOfflineOrder(row){
            if(row){
              this.$router.push({path:'/orderCenter/createOfflineOrder',query:{orderId:row.orderId}})
            }else{
              this.$router.push('/orderCenter/createOfflineOrder')
              
            }
          },
          exportExcel(){
            let WEB_API = process.env.WEB_API;
            let url = WEB_API+"/GroupLineOffline/ExcelGroupLineOfflineOrderList?PaymentStatus="+this.order.PaymentStatus
            +"&CustomerName="+ this.order.CustomerName
            +"&UserId=" +this.userId
            +"&CreateUserName=" 
            +this.order.createUserName 
            +"&TeamStatus="+ this.order.TeamStatus
            +"&orderStatusStr="+ this.order.OrderStatus
            +"&TeamNo="+ this.order.TeamNo
            +"&LineName="+ this.order.LineName
            +"&BeginDate="+ this.order.BeginDate
            +"&EndDate="+ this.order.EndDate
            +"&OrderNo="+ this.order.OrderNo
            +"&SupplierName="+ this.order.SupplierName
            +"&IsComfirm="+ this.order.IsComfirm
            +"&IsPayForAnotherInvoice="+ this.order.IsPayForAnotherInvoice
            +"&InnerCode="+ this.order.InnerCode            
            +"&ShopId=";
          this.shopHttp.get("/Finance/GetShopId").then(function (res) {
            window.location.href = url+res.data;
          })
          },
          viewDetails(row){
          this.$router.push({path:'/orderCenter/offlineOrderDetail',query:{orderId:row.orderId}})
          },
         
        cancelOrder(row){
          this.$confirm('是否取消此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            this.shopHttp.post("GroupLineOffline/CancelGroupLineOfflineOrder", {
            OrderNo:row.orderNo,
            pageSize: 10,
            pageIndex: 1
            }).then(res => {
              if (res.data.isSuccess == true) {
              this.$message({
              type: "success",
              message: "订单取消申请成功"});
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
          //分页
          sizeChange(val) {
          this.pagination.size = val;
          this.queryData(this.pagination.size,this.pagination.currentPage,this.order.OrderStatus);
          },
          currentPageChange(val) {
          this.pagination.currentPage = val;
          this.queryData(this.pagination.size,this.pagination.currentPage,this.order.OrderStatus);
          },
          handleDateChange(){
          console.log(this.dates);
          },
          handleReplacePay(row){
          this.payForm.OrderId=row.orderId;
          this.payForm.SumPaymentAmount = row.receivableFee;
          this.payForm.AlreadyPaymentAmount= row.paymentAmount;
          this.payForm.InnerCode= row.innerCode;
          if(row.payStatus == 1 && row.paymentAmount == 0)
          {
          this.payForm.PaymentAmount = row.receivedFee;
          }
          else
          {
          this.payForm.PaymentAmount= row.receivableFee - row.paymentAmount;
          }

          this.dialogFormVisible=true;
          },
          handleCloseDialog(form){
          this.$refs[form].resetFields();
          this.payForm.Comment='';
          },
          submitReplacePay(form){
          this.$refs[form].validate(valid => {
          if(valid) {
          this.dfLoading = true;
          this.shopHttp
          .post("GroupLineOffline/CreateOfflineOrderPayAnother" , this.payForm)
          .then(res => {
          if(res.data.isSuccess == true) {
          this.$message.success("申请代付成功");
          this.dfLoading = false;
          this.queryData();
          this.dialogFormVisible=false;
          }
          });
          } else {
          this.dfLoading = false;
          // this.$message.error("您的信息还没有完善");
          }
          });

          },
          openInvoiceDialog(row){
          this.invoiceFormVisible=true
          this.shopHttp.get('GroupLineOffline/GetOfflineOrderPayAnother?orderId='+row.orderId)
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
          this.shopHttp.post('/GroupLineOffline/UpdateOfflineOrderPayAnother',form,{jsonData:true})
          .then(res=>{
          if(res.data.isSuccess){
          this.invoiceLoading=false,
          this.invoiceFormVisible=false
          this.$message.success("上传发票成功");
          this.queryData(this.pagination.size,this.pagination.currentPage,);
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
          this.shopHttp
          .post("GroupLine/GetOrderStatuslList", {})
          .then(res => {
          if (res.data.isSuccess == true) {
          this.orderStatusOptions = this.orderStatusOptions.concat(res.data.keyValueList);
          this.order.OrderStatus =['1','4']
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
          this.shopHttp
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
          this.shopHttp
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
