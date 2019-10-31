<template>
  <div class="view">
            <el-row class="margin_bottom">
                <el-button size="small"  @click="handleExport">导出Excel</el-button>
            </el-row>
            <el-table  size="small" v-loading="loading2" :data="recordDetailist"
                       tooltip-effect="dark" style="width: 100%">
                    <el-table-column prop="orderNo" label="订单编号" size="small" align="center" >
                    </el-table-column>
                    <el-table-column prop="businessTypeName" size="small" label="业务类型" align="center"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="orderAmount" size="small" label="订单金额" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="receivedFee" size="small" label="已收金额" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="costPrice" size="small" label="同行结算价" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="encourageAmount"  size="small" label="激励" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="poundageAmount" label="手续费" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="profitsThan" label="利润比(%)" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="incidentalAmount" label="杂费" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="settlementAmount" label="结算金额" size="small" align="center" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination"
                    :data = 'pagination'
                    @size-change="sizeChange"
                    @current-change="currentPageChange"
                    :current-page="pagination.currentPage"
                    :page-sizes="pagination.sizes"
                    :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
                </el-pagination>
                <el-row class="text-center">
                    <el-button size="small"  @click="backrecord">返回</el-button>
                </el-row>
         </div>
</template>

<script>
export default {
   data(){
       return{
            loading2:false,
            recordDetailist:[],
            //分页
            pagination:{
                sizes:[5,10,20,50],
                size:10,
                currentPage: 1,
                total:0
            },
       }
   },
   mounted:function(){
      this.getRecordDetaillist();
   },
   methods:{
       //导出
        handleExport(){
            
            let WEB_API = process.env.WEB_API;
            let url = WEB_API
              + "/Finance/ShopBillRecordDetailToExcel?PageSize=" + this.pagination.size
              + "&PageIndex=" + this.pagination.currentPage
              + '&ShopBillId=' + this.$route.params.shopBillId
              + "&CompanyInfoId=";
            this.shopHttp.get("/Finance/GetShopId").then(function (res) {
              window.location.href = url + res.data;
            })

        },
       backrecord(){
           this.$router.go(-1);
       },
       getRecordDetaillist(){
           var _this = this;
           _this.loading2 = true;
           _this.shopHttp.get('/Finance/GetShopBillRecordDetail?ShopBillId=' + _this.$route.params.shopBillId).then(res=>{
               //console.log(res);
               if(res.data.isSuccess){
                   _this.recordDetailist = res.data.objects;
                   _this.pagination.total = res.data.total;
               }else{ 
                   _this.$message({type:'info',message:'出错了'+res.data.message});
               }
               _this.loading2 = false;
           }).catch(err=>{
               _this.$message({type:'error',message:'请求失败'+res.data.message});
               _this.loading2 = false;
           })
       },
       sizeChange(val){
           this.pagination.size = val;
            this.pagination.currentPage = 1;
           this.getRecordDetaillist();
       },
       currentPageChange(val){
           this.pagination.currentPage = val;
           this.getRecordDetaillist();
       }
   }
}
</script>

<style lang="scss" scoped>
</style>
