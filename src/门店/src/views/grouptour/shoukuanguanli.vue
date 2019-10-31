<template>
  <div class='view'>
    <div class="block">
        <el-row>
            <span class='width_label'>收款时间: </span>
            <el-date-picker
                    :editable = 'false'
                    :picker-options='pickerOptions'
                    size='small'
                    v-model="datePick"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <span class='width_label'>客户名称: </span>
            <el-input v-model="customerName" size='small'></el-input>
            <span class='width_label'>收款编号: </span>
            <el-input v-model="teamNo" size='small'></el-input>
      </el-row>
      <el-row>
            <span class='width_label'>状态: </span>
            <el-select v-model="FeeStatus" placeholder="请选择" size='small'>
              <el-option
                v-for="item in StatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          <span class='width_label'>收款方式: </span>
          <el-select v-model="shoukuanType" placeholder="全部" size='small'>
              <el-option label="全部" value="全部"></el-option>
              <el-option label="微信" value="微信"></el-option>
              <el-option label="支付宝" value="支付宝"></el-option>
              <el-option label="银联" value="银联"></el-option>
              <el-option label="转账" value="转账"></el-option>
              <el-option label="现金" value="现金"></el-option>
            </el-select>
            <span class='width_label'>收款人: </span>
            <el-input v-model="lineName" size='small'></el-input>
            <el-button type="warning" icon="el-icon-search" @click="queryData()" size='small'>查找</el-button>
      </el-row>  
    </div>
    <div>
        <div id='table'>
            <el-table
              v-loading = 'loading'
              border
              :data="tableData"
              style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="70"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="enumOrderStatus"
                    label="客户名称"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="state"
                    label="结算单位"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="state"
                    label="联系人"
                    >
                  </el-table-column>
                  <el-table-column
                    prop=""
                    label="收款编号"
                    >
                  </el-table-column>
                  <el-table-column
                    prop=""
                    label="业务类型"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="teamNo"
                    label="订单金额"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="teamNo"
                    label="币种"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="lineName"
                    label="收款金额"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="departureDate"
                    label="财务确认金额"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="peopleNum"
                    label="开票金额"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="customerName"
                    label="收款方式"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    label="收款时间"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="receivable"
                    label="收款人"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="peopleNum"
                    label="状态"
                    >
                  </el-table-column>
                  
                  <el-table-column
                      label="操作"
                      min-width="150"
                      align="center"
                      >
                        <template slot-scope="scope">
                          <el-button type="text" size="mini">详 细</el-button>
                          <el-button type="text" size="mini">取消收款</el-button>
                        </template>
                  </el-table-column>
            </el-table>
            <div>
                <div class="pagination">
                    <el-pagination
                        fixed="right"
                        :data = 'pagination'
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
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      GMTToStr(time){
            let date = new Date(time);
            let year = date.getFullYear();
            let mouth = (date.getMonth() + 1);
            mouth = (String(mouth).length == 1 ? 0 + '' + mouth : mouth);
            let day = date.getDate();
            day = (String(day).length == 1 ? 0 + '' + day  : day);
            // date.getHours() + ':' +
            // date.getMinutes() + ':' +
            // date.getSeconds()
            return year + '-' + mouth + '-' + day
        },
      handleSizeChange(val) { 
        this.pagination.size = val;
        this.pagination.currentPage = 1;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.queryData(this.pagination.size,this.pagination.currentPage);
      },
      queryData(pageSize,pageIndex){
        pageSize = pageSize || 10;
        pageIndex = pageIndex || 1;
        var FeeDateBegin = '',FeeDateEnd='';
        if(this.datePick){
          FeeDateBegin = this.GMTToStr(this.datePick[0]);
          FeeDateEnd = this.GMTToStr(this.datePick[1]);
        }
        //this.loading = true;
        this.shopHttp
        .get("CustomerFee/GetCusReceivePageList?BranchId=&DisCompanyId=&FeeType="+this.FeeType+
          "&FeeStatus="+this.FeeStatus+"&StorePayNo="+this.shoukuanType+"&FeeDateBegin="+FeeDateBegin+
          "&FeeDateEnd="+FeeDateEnd+"&IsHQCollect="+this.IsHQCollect+
          "&FeeChannel=&FeeNo&StorePayId=&DisSettleClientName=&LinkMan=&Id=&PageSize="+pageSize+
          "&PageIndex="+pageIndex+"&SkipCount=&MaxResultCount=")
        .then(res => {
         // console.log(res);
          if (res.data.isSuccess == true) {
            this.tableData = res.data.objects;
            this.pagination.total = res.data.total;
            this.loading = false;
          } else {
            this.$message({
              type: "info",
              message: "出错了" + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
      }
    },
    data() {
      return {
        loading : false,
        datePick:'',
        pickerOptions: {
          disabledDate:(date) => {
            return  date.getTime() <= Date.now();
          }
        },
        StatusOptions:[
          
        ], 
        IsHQCollect:true,
        IsFilterShop:true,
        shoukuanType:'',
        FeeStatus:'',
        FeeType:1,//1 : nomal  2 : Refund 退款
        customerName:'',
        lineName:'', 
        teamNo:'',

        tableData:[],
        pagination:{
          sizes:[5,10,20,50],
          size:10,
          currentPage: 1,
          total:0
        }
      }
    },
    mounted() {
      this.queryData(10,1);
      this.shopHttp
        .get("/CustomerFee/GetCustomerFeeStatus")
        .then(res => {
         // console.log(res);
          if (res.data.isSuccess == true) {
            this.StatusOptions = res.data.objects;
          } else {
            this.$message({
              type: "info",
              message: "出错了！" + res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
   }
  };

</script>
<style scoped lang="scss">
  @import "../../style/common.scss";
  .view{
      padding:15px;
  }
  #table{
    margin-top:15px;
  }
  .el-row{
    margin:15px 0;
  }
  .el-row .el-input,.el-row .el-select{
    width:200px;
    padding-right:15px;
  }
  .el-row .el-button{
    margin-left:30px;
  }
  .width_label{
    display:inline-block;
    width:80px;
    text-align:right;
    margin-right:10px;
  }
</style>
