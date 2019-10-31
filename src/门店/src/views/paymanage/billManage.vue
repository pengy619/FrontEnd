<template>
   <div class="view">
        <el-form  :inline="true" size="small" label-width="100px">
            <el-form-item label="状态" label-width="53px">
                <el-select size="small" v-model="EnumShopBillStatus" clearable class="inputs">
                    <el-option v-for="item in EnumshopbillObj" :key="item.key" :value="item.key" :label="item.value"></el-option>
                </el-select>
            </el-form-item>
                <el-form-item label="业务类型" label-width="80px">
                    <el-select size="small" v-model="BusinessType" clearable class="inputs">
                        <el-option v-for="item in BusinessObj" :key="item.key" :value="item.key" :label="item.value"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="订单编号" label-width="90px">
                <el-input class="inputs" v-model="OrderNo" size="small" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" icon="el-icon-search" size="small" @click="getBillmanagelist()">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
             <el-button type="primary" size="small" @click="dialogFormVisible=true">批量申请对账</el-button> 
            <el-button  @click="handleExport"  size="small">导出Excel</el-button>
        </el-row>
       
        <el-table  size="small" v-loading="loading2" :data="billmanagelistdata"
                    @select="getrowdata" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="编号" :selectable="billselect" type="selection" size="small" fixed="left" width="55" align="center"  >
                </el-table-column>
                <el-table-column prop="orderNo" label="订单编号" size="small" align="center" >
                </el-table-column>
                <el-table-column prop="businessTypeName"  size="small" align="center" label="业务类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="orderAmount" size="small" label="订单金额" align="center"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="receivedFee" size="small" label="已收金额" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="costPrice" size="small" label="同行结算价" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="encourageAmount" size="small" label="激励" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="poundageAmount"  size="small" label="手续费" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="profitsThan"  size="small" label="利润比(%)" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="incidentalAmount"  size="small" label="杂费" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="settlementAmount"  size="small" label="结算金额" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="enumShopBillStatuName" label="状态" size="small" align="center" show-overflow-tooltip>
                </el-table-column>
                    <el-table-column prop="id" v-if="flag" label="id" size="small" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="feeSerialNo" fixed="right" size="small" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type='text' size='small' @click="signOK(scope.row)"
                                   :disabled="(scope.row.enumShopBillStatus!==4&&scope.row.enumShopBillStatus!==3&&scope.row.enumShopBillStatus!==2&&scope.row.enumShopBillStatus!==null)" >
                      申请对账</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination"
                fixed="right"
                @size-change="sizeChange"
                @current-change="currentPageChange"
                :current-page="billmanageindex"
                :page-sizes="[5,10,20,50]"
                :page-size="billmanagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="billmanagetotal">
            </el-pagination>
          <el-dialog title="账单" :visible.sync="dialogFormVisible"  :modal-append-to-body="false" width="30%">
            <el-form   ref="adddemandform.Object">
                    <!-- <el-form-item label="申请时间"  size="small"  prop="Payer" label-width="120px">
                    <el-input  style="min-width:400px" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="申请人"  size="small"  prop="Payer" label-width="80px">
                    <el-input  style="width:200px" v-model="AccountName" auto-complete="off"></el-input>
                </el-form-item>
                
                <el-form-item label="备注"  size="small" label-width="80px">
                    <el-input type="textarea" v-model="Remark"  auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer mydialogfooter">
                <el-button @click="dialogFormVisible=false"  size="small">取 消</el-button>
                <el-button type="primary"  size="small" @click="proposerOK">确 定</el-button>
            </div>
         </el-dialog>
   </div>
</template>

<script>
export default {
   data(){
       return{
           loading2:false,
           dialogFormVisible:false,
           billmanagesize:10,
           billmanageindex:1,
           billmanagetotal:0,
           billmanagelistdata:[],
           OrderNo:'',//订单编号
           BusinessType:'',//业务类型
           BusinessObj:[],
           EnumShopBillStatus:'',//状态
           EnumshopbillObj:[],
           cusStatuName:[],//临时选中数组
          
           AccountName:'',
           Remark:'',
           flag: false,

           ShopBillDetail: [],

       }
   },mounted:function(){
      this.getBillmanagelist();
      this.getBillMessage();
      this.getBussinessType();
      this.getEnumShopBillStatus();
   },methods:{
       //导出
        handleExport(){
            //let WEB_API=process.env.WEB_API;
            //let url=WEB_API+"/Finance/ShopBillToExcel?PageSize="+this.billmanagesize+"&PageIndex="+this.billmanageindex+
            //    "&OrderNo="+this.OrderNo+"&BusinessType="+this.BusinessType+"&EnumShopBillStatus="+this.EnumShopBillStatus;
            //window.location.href=url
            // console.log(url)
            // this.shopHttp.get("/Finance/GetShopId").then(function(res){
            //     console.log(url+res.data)
            //     window.location.href=url+res.data;
            // })

           
             let WEB_API = process.env.WEB_API;
             let url = WEB_API
               + "/Finance/ShopBillToExcel?PageSize=" + this.billmanagesize
               + "&PageIndex=" + this.billmanageindex
               + "&OrderNo=" + this.OrderNo
               + "&BusinessType=" + this.BusinessType
               + "&EnumShopBillStatus=" + this.EnumShopBillStatus
               + "&CompanyInfoId=";
             this.shopHttp.get("/Finance/GetShopId").then(function (res) {
               window.location.href = url + res.data;
             })
        },
        getrowdata(val){//负责将所有的选中的数据放到数组中
                this.cusStatuName.length=0;
                
                this.ShopBillDetail = [];
            for(let i=0;i<val.length;i++){
                this.cusStatuName[i] = val[i].enumShopBillStatuName;
               
                var orderId = { OrderId:0 } 
                orderId.OrderId = val[i].orderId;
                this.ShopBillDetail.push(orderId)
            }
           
          
        },
         sizeChange(val) {
           this.billmanagesize = val;
           this.getBillmanagelist(this.billmanageindex);
        },
        currentPageChange(val) {
            this.billmanageindex = val;
            this.getBillmanagelist(this.billmanageindex);
        },
        getBillmanagelist(pageIndex=1){//获取列表数据
            var _this = this;
            _this.loading2 = true;
            _this.shopHttp.get('/Finance/GetShopBillPageList?PageSize='+_this.billmanagesize+"&PageIndex="+pageIndex+
                               "&OrderNo="+_this.OrderNo+"&BusinessType="+_this.BusinessType+"&EnumShopBillStatus="+_this.EnumShopBillStatus).then(res=>{
               // console.log(res);
                if(res.data.isSuccess){
                   _this.billmanagelistdata = res.data.objects;
                   _this.billmanagetotal = res.data.total;
                }else{
                    _this.$message({type:'info',message:res.data.message});
                }
                 _this.loading2 = false;
            }).catch(err=>{
                console.log(err);
                _this.loading2 = false;
                 _this.$message({type:'error',message:res.data.message});
            })
        },
        getBillMessage(){
            //获取弹窗数据
            var _this = this;
            _this.shopHttp.get('/Finance/GetAccountName').then(res=>{
               // console.log(res);
                if(res.statusText=='OK'){
                    _this.AccountName = res.data;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        getBussinessType(){//业务类型
            var _this = this;
            _this.shopHttp.post('/Finance/GetBusinessType').then(res=>{
                //console.log(res);
                if(res.data.isSuccess){
                   _this.BusinessObj = res.data.objects;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        getEnumShopBillStatus(){//状态
            var _this = this;
            _this.shopHttp.post('/Finance/GetEnumShopBillStatus').then(res=>{
                //console.log(res);
                if(res.data.isSuccess){
                    _this.EnumshopbillObj = res.data.objects;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        proposerOK(){
            //确认申请 多条件
        this.dialogFormVisible=false; 
        if(this.cusStatuName.length <= 0){
            this.$message({type:'info',message:'请至少选择一条对账单'});
        }else{
            for(let i =0;i< this.cusStatuName.length;i++){
               // console.log(this.cusStatuName);
              if (this.cusStatuName[i] != '已拒绝' && this.cusStatuName[i] != '未对账' && this.cusStatuName[i] != '已取消'){
                this.$message({ type: 'info', message:'只有已拒绝、未对账或已取消的账单可以申请，请重新选择'});
                    return;
                }
            }
            var _this = this;
            _this.shopHttp.post('/Finance/CreateShopBills', { AccountName: _this.AccountName, Remark: _this.Remark, ShopBillDetail : _this.ShopBillDetail }).then(res => {
                //console.log(res);  
                if(res.data.isSuccess){
                   _this.$message({type:'success',message:'操作成功'});
                   _this.$router.push({name:'reconciliationrecord'});
                } else {
                  _this.$message({ type: 'info', message: '出错了，' + res.data.message });
                }
            }).catch(err=>{
                console.log(err);
                _this.$message({ type: 'error', message: '请求失败'});
            })
            
         }
        },
        signOK(val){
            //单条数据选择
            this.cusStatuName.length = 0; 
            this.dialogFormVisible=true;
            this.cusStatuName[0] = val.enumShopBillStatuName;

            this.ShopBillDetail = [{ OrderId: 0 }]; 
            this.ShopBillDetail[0].OrderId = val.orderId;
        },
        billselect(val){
            //是否可选--已收金额<订单金额，不能申请对账
           if(val.orderAmount > val.receivedFee){
               return false;
           }else{
                return true;
           }
           
        }
   }
}
</script>

<style lang="scss" scoped>
</style>
