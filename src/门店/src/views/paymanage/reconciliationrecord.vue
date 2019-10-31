<template>
   <div class="view">
        <el-form  :inline="true" size="small" label-width="90px">
            <el-form-item label="状态" >
                <el-select size="small" v-model="EnumShopBillStatus" clearable>
                    <el-option v-for="item in EnumshopbillObj" :key="item.key" :value="item.key" :label="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账单编号" >
                <el-input v-model="OrderNo" size="small" ></el-input>
            </el-form-item>
                <el-form-item size="small" label="出团日期" >
                    <el-date-picker
                        id="startime"
                        v-model="recordStartTime"
                        type="date" 
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始日期">
                        </el-date-picker>至
                        <el-date-picker
                        id="endtime"
                        v-model="recordEndTime"
                        type="date" 
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束日期">
                        </el-date-picker>
                </el-form-item>
            <el-form-item>
                <el-button type="warning" icon="el-icon-search" size="small" @click="getRrconcilicationlist()">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
            <el-button @click="handleExport"  size="small">导出Excel</el-button>
        </el-row>
        <div>
            <el-table  size="small" v-loading="loading2" :data="reconciliationlist"
                       tooltip-effect="dark" style="width: 100%">
                    <el-table-column prop="billCode" label="账单编号" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="billAmount" size="small" label="账单金额" align="center"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="accountName" size="small" label="申请人" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="billStartDate" :formatter="fixRecordTime" size="small" label="申请时间" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.billStartDate?scope.row.billStartDate.replace('T',' ').substr(0,22):''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="branchConfirmedName" size="small" label="确认人" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column size="small" label="确认时间" align="center" show-overflow-tooltip>
                         <template slot-scope="scope">
                            {{scope.row.billEndDate?scope.row.billEndDate.replace('T',' ').split('.')[0]:''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="enumShopBillStatuName" label="状态" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="id" size="small" label="id" v-if="flag" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column fixed="right" size="small" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="reviewDetail(scope.row)">查看</el-button>
                            <el-button  type="text" size="small" @click="canelReconciliation(scope.row)" v-if="scope.row.enumShopBillStatuName=='待确认'">取消对账</el-button>
                            <el-button type="text" size="small" @click="canelReconciliation" v-else disabled>取消对账</el-button>
                        </template>
                    </el-table-column>
                </el-table>
         </div>
        <el-pagination class="pagination"
            fixed="right"
            @size-change="sizeChange"
            @current-change="currentPageChange"
            :current-page="reconciliationpageindex"
            :page-sizes="[5,10,20,50]"
            :page-size="reconciliationpagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="reconciliationtotal">
        </el-pagination>
   </div>
</template>

<script>
import　{dateFmt}　from　'@/utils/tools'
export default {
   data(){
       return{
           flag:false,
           loading2:false,
           dialogFormVisible:false,
           EnumshopbillObj:[],
           EnumShopBillStatus:'',//状态
           OrderNo:'',//账单编号
           recordStartTime:'',//开始时间
           recordEndTime:'',//结束时间
           reconciliationpagesize:10,
           reconciliationpageindex:1,
           reconciliationtotal:0,
           reconciliationlist:[]
       }
   },mounted:function(){
        this.getEnumShopBillStatus();
        this.getRrconcilicationlist();
   },methods:{
        //导出
        handleExport(){
            //let WEB_API=process.env.WEB_API;
            //let url=WEB_API+"/Finance/ShopBillRecordToExcel?PageSize="+this.reconciliationpagesize+"&PageIndex="+this.reconciliationpageindex+"&BillCode="+this.OrderNo+
            //                    "&BillStartDate="+this.recordStartTime+"&BillEndDate="+this.recordEndTime+"&EnumShopBillStatus="+this.EnumShopBillStatus;
            //window.location.href=url
            //console.log(url)
            //// this.shopHttp.get("/Finance/GetShopId").then(function(res){
            ////     console.log(url+res.data)
            ////     window.location.href=url+res.data;
            //// })


            let WEB_API = process.env.WEB_API;
            let url = WEB_API
              + "/Finance/ShopBillRecordToExcel?PageSize=" + this.reconciliationpagesize
              + "&PageIndex=" + this.reconciliationpageindex
              + "&BillCode=" + this.OrderNo
              + "&StartDate=" + this.recordStartTime
              + "&EndDate=" + this.recordEndTime
              + "&EnumShopBillStatus=" + this.EnumShopBillStatus
              + "&CompanyInfoId=";
            this.shopHttp.get("/Finance/GetShopId").then(function (res) {
              window.location.href = url + res.data;
            })
        },
         sizeChange(val) {
            this.reconciliationpagesize = val;
            this.getRrconcilicationlist(this.reconciliationpageindex);
        },
        currentPageChange(val) {
            this.reconciliationpageindex =val;
            this.getRrconcilicationlist(this.reconciliationpageindex);
        },
        reviewDetail(val){
          this.$router.push({ name: 'reconciliationdetail', params: { shopBillId: val.id}});
        },
         getEnumShopBillStatus(){//状态
            var _this = this;
            _this.shopHttp.post('/Finance/GetEnumShopBillStatus').then(res=>{
               // console.log(res);
                if(res.data.isSuccess){
                    _this.EnumshopbillObj = res.data.objects;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        getRrconcilicationlist(pageIndex=1){
            //获取列表数据--分页--搜索
            var _this = this;
            _this.loading2 = true;
            if(_this.recordStartTime == "" || _this.recordStartTime== null){
                _this.recordStartTime = '';
            }
            if(_this.recordEndTime == '' || _this.recordEndTime == null){
               _this.recordEndTime = '';
            }
            _this.shopHttp.get('/Finance/GetShopBillRecordPageList?PageSize='+
                                _this.reconciliationpagesize+"&PageIndex="+
                                pageIndex+"&BillCode="+_this.OrderNo+
                                "&StartDate="+_this.recordStartTime+"&EndDate="+_this.recordEndTime+"&EnumShopBillStatus="+_this.EnumShopBillStatus).then(res=>{
                //console.log(res);
                if(res.data.isSuccess){
                   _this.reconciliationlist = res.data.objects;
                   _this.reconciliationtotal = res.data.total;
                }else{
                    _this.$message({type:'info',message:'出错了,'+res.data.message});
                }
                _this.loading2 = false;
            }).catch(err=>{
                _this.$message({type:'error',message:'请求失败'});
                this.loading2 = false;
            });
        },
        canelReconciliation(val){
            //取消对账
            var _this = this;
             _this.$confirm('此操作将永久取消对账, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                 _this.shopHttp.post('/Finance/CancelReconciliation?billId='+val.id,{}).then(res=>{
                     //console.log(res);
                     if(res.data.isSuccess){
                        _this.$message({type: 'success', message: '操作成功!' });
                        _this.getRrconcilicationlist(this.reconciliationpageindex);
                     }else{
                         _this.$message({type: 'success', message: res.data.message });
                     }
                     
                 }).catch(err=>{
                     console.log(err);
                      _this.$message({type: 'success', message: '请求失败' });
                 });
                

            }).catch(() => {
                _this.$message({type: 'info', message: '已取消操作'});          
            });
        },
        fixRecordTime(val){
            let oTime = val.billStartDate;
            if(oTime != null && oTime != ''){
                let tTime = oTime.substring(0,oTime.lastIndexOf('T'));
                let sTime = oTime.substring(oTime.indexOf('T')+1,oTime.lastIndexOf('.'));
                return tTime+" "+sTime;
            }
        }
   }
}
</script>

<style lang="scss" scoped>
</style>
