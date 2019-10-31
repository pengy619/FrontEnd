<template>
  <div class='view'>
    <div class="block">
      <span class="demonstration">出团日期: </span>
      <el-date-picker
          :editable = 'false'
          :picker-options='pickerOptions'
          size='small'
          v-model="dates"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
      <span class="demonstration">线路名称: </span>
      <el-input style='width:20%' size="small"></el-input>
      <el-button type="warning" icon="el-icon-search" size="small" @click='queryData(pagination.size,1)'>查找</el-button>
    </div>
    <div>
        <div id='table'>
            <el-table
              v-loading = "loading"
              border
              :data="reverseList"
              style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="70"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="reservedStatus"
                    label="状态"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="teamNo"
                    label="团号"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="fullName"
                    label="线路名称"
                    align="center"
                    show-overflow-tooltip
                    >
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="出团日期"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="linkMan"
                    label="客户名称"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="linkPhone"
                    label="联系方式"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="quantity"
                    label="预留人数"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="distribtionChannel"
                    label="销售渠道"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="purchaseDate"
                    label="预留日期"
                    align="center"
                   >
                  </el-table-column>
                  <el-table-column
                    prop="comment"
                    label="备注"
                    align="center"
                    min-width="150"
                    >
                  </el-table-column>
                  <el-table-column
                      label="操作"
                      min-width="100"
                      align="center"
                      >
                        <template slot-scope="scope">
                          <el-button type="text" size="mini" @click="convertOrder(scope.row)">转化订单</el-button>
                          <el-button type="text" size="mini" @click="cancelOrder(scope.row)">取消订单</el-button>
                        </template>
                  </el-table-column>
            </el-table>
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
  </div>
</template>
<script>
  import {dateFmt} from '@/utils/tools.js'
  export default {
    methods: {
      queryData(pageSize,pageIndex){
        this.shopHttp.post("/GroupLine/GetGroupLinePurchase", {
          pageSize:pageSize || 10,
          pageIndex: pageIndex || 1
        }).then(res => {
         // console.log(res);
          if(res.data.isSuccess == true){
            res.data.objects.forEach((obj) => {
              let date1 = new Date(obj.date);
              let date2 = new Date(obj.purchaseDate);
              obj.date = dateFmt(date1,'yyyy-MM-dd');
              obj.purchaseDate =  dateFmt(date2,'yyyy-MM-dd');
            });
            this.reverseList = res.data.objects;
            this.pagination.currentPage = pageIndex || 1;
            this.pagination.total = res.data.total;
            this.loading = false;
          }else{
              this.$message({
                  type: "info",
                  message: "出错了！" + res.data.message
                });
            }
        }).catch(e => {
          console.log(e);
        });
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
      //转化订单
      convertOrder(row){
       // console.log(row);
      },
      //取消订单
      cancelOrder(row){
       // console.log(row);
      },
      //删除订单
      deleteOrder(){
        //console.log(row);
      }
    },
    data() {
      return {
        pickerOptions:{
          disabledDate:(date) => {
            return  date.getTime() <= Date.now();
          }
        },
        loading:false,
        dates: [],
        reverseList: [],
        pagination:{
            sizes:[5,10,20,50],
            size:10,
            currentPage: 1,
            total:0
        },
      };
    },
    mounted() {
      this.queryData()
    }
  };
</script>
<style scoped lang="scss">
  @import "../../style/common.scss";  
  .view{
    padding:15px;
  }
  #table {
    margin-top: 15px;
  }
</style>
