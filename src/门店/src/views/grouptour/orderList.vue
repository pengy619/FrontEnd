<template>
  <div class='view'>
    <div class="block">
         <el-row>
        <el-col :span="24">
          <span>出团日期: </span>
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
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
            <span>客户名称: </span>
            <el-input v-model="customerName" size='small'></el-input>
        </el-col>
        <el-col :span="7">
          <span>销售渠道: </span>
          <el-input  size='small'></el-input>
        </el-col>
        <el-col :span="8">
            <span>订单状态: </span>
            <el-select v-model="orderStatus" placeholder="请选择" size='small'>
              <el-option
                v-for="item in orderStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-col>
        
        <!-- <el-col :span="7">
            <span>支付状态: </span>
            <el-select v-model="payStatus" placeholder="请选择" size='small'>
              <el-option
                v-for="item in payStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="7">
            <span style='display:inline-block;width:60px;'>团号: </span>
            <el-input v-model="teamNo" size='small'></el-input>
        </el-col>
        <el-col :span="7">
            <span>线路名称: </span>
            <el-input v-model="lineName" size='small'></el-input>
        </el-col>
        <el-col :span="3">
            <el-button type="warning" icon="el-icon-search" @click="queryData(pagination.size,1)" size='small'>查找</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
        <el-button type='primary' size='small'>收 款</el-button>
        <el-button type='primary' size='small'>退 款</el-button>
        <el-button type='primary' size='small'>创建线下订单</el-button>
        <div id='table'>
            <el-table
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
                    prop="orderStatusName"
                    label="状态"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="payStatus"
                    label="结算状态"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="teamStatus"
                    label="出团状态"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="teamNo"
                    label="团号"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="lineName"
                    label="线路名称"
                    show-overflow-tooltip
                    >
                  </el-table-column>
                  <el-table-column
                    prop="departureDate"
                    label="出团日期"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="settlementUnit"
                    label="结算单位"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="customerName"
                    label="客户名称"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="quantity"
                    label="人数"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="receivableFee"
                    label="应收款"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="receivedFee"
                    label="已收"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="unReceiveFee"
                    label="未收"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="orderSourceName"
                    label="销售渠道"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="creationTime"
                    label="下单日期"
                   >
                  </el-table-column>
                  <el-table-column
                      label="操作"
                      min-width="150"
                      align="center"
                      >
                        <template slot-scope="scope">
                          <el-button type="text" size="mini">查 看</el-button>
                          <el-button type="text" size="mini" @click='cancelOrder(scope.row)' :disabled='scope.row.orderStatusName =="已取消" ? true : false'>取消订单</el-button>
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
  import {dateFmt} from '@/utils/tools.js'
  export default {
    methods: {
      //取消订单
      cancelOrder(row){
        //console.log(row);
        this.shopHttp.post("GroupLine/CancelGroupLineOrder", {
          OrderNo:row.orderNo,
          ShopId:'',
          BranchId:1,
          pageSize: 10, 
          pageIndex: 1
        })
        .then(res => {
         // console.log(res);
          if (res.data.isSuccess == true) {
            this.$message({
              type: "success",
              message: "订单取消成功"});
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
      dateFormat(date){

      },
      //分页
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
        this.shopHttp
        .post("GroupLine/GetGroupLineOrderList", {
          orderStatus: this.orderStatus,
          customerName: this.customerName,
          teamNo: this.teamNo,
          lineName: this.lineName,
          beginDate: this.datePick[0],
          endDate: this.datePick[1],
          pageSize: pageSize || 10, 
          pageIndex: pageIndex || 1
        })
        .then(res => {
         // console.log(res);
          if (res.data.isSuccess == true) {
            res.data.objects.forEach((obj) => {
              let date1 = new Date(obj.creationTime);
              let date2 = new Date(obj.departureDate);
              obj.creationTime = dateFmt(date1,'yyyy-MM-dd');
              obj.departureDate =  dateFmt(date2,'yyyy-MM-dd');
            });
            this.tableData = res.data.objects;
            this.pagination.currentPage = pageIndex || 1;
            this.pagination.total = res.data.total;
          } else {
            this.$message({
              type: "info",
              message: "操作失败:"
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
        pickerOptions:{
          disabledDate:(date) => {
            return  date.getTime() <= Date.now();
          }
        },

        orderStatusOptions:[], 
        orderStatus:'',
        payStatusOptions:[],
        payStatus:'',
        datePick: '',
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
      this.queryData();
      this.shopHttp
        .post("DropDownData/GetOrderStatus", {})
        .then(res => {
          //console.log(res);
          if (res.status == 200) {
            this.orderStatusOptions = res.data;
          } else {
            //console.log(res.data.message)
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
  .el-row .el-col .el-input{
    width:200px;
    margin-right:15px;
  }
</style>
