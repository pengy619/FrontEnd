<template>
  <div class='view'>
      <el-form size="small" :inline="true" :model="order" class="demo-form-inline">
        <el-form-item label="出团日期">
          <el-date-picker
            v-model="order.DateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="线路名称">
          <el-input v-model="order.fullName" placeholder="线路名称"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="order.linkMan" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryData(pagination.size,1)">搜索</el-button>
        </el-form-item>
      </el-form>
        <div id='table'>
            <el-table
              v-loading = "loading"
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
                    prop="reservedStatusName"
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
                    prop="departureDateFormat"
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
                    prop="orderSourceString"
                    label="销售渠道"
                    align="center"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="purchaseDateFormat"
                    label="预留日期"
                    align="center"
                   >
                  </el-table-column>
                  <el-table-column
                    prop="comment"
                    label="备注"
                    align="center"
                    min-width="120"
                    >
                  </el-table-column>
                  <el-table-column
                      label="操作"
                      align="center"
                      fixed="right"
                      min-width="150"
                      >
                        <template slot-scope="scope">
                          <el-button type="text"  size="small" @click="convertOrder(scope.row)" :disabled = 'scope.row.reservedStatus == 0 && scope.row.orderSource == 8? false : true'>转化订单</el-button>
                          <el-button type="text"  size="small" @click="cancleOrder(scope.row)" :disabled = 'scope.row.reservedStatus != 2 && scope.row.orderSource == 8? false : true'>取消订单</el-button>
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
</template>
<script>
  import {dateFmt} from '@/utils/tools.js'
  export default {
    methods: {
      queryData(pageSize,pageIndex){
        this.loading = true;
        let BeginDate = '',EndDate = '';
        if(this.order.DateTime && this.order.DateTime.length > 0){
          BeginDate = dateFmt(new Date(this.order.DateTime[0]),'yyyy-MM-dd');
          EndDate = dateFmt(new Date(this.order.DateTime[1]),'yyyy-MM-dd');
        }
        this.groupHttp.get("/GroupLine/GetGroupLinePurchase",{
          params:{
            PageSize:pageSize || 10,
            PageIndex:pageIndex || 1,
            FullName:this.order.fullName,
            LinkMan:this.order.linkMan,
            StartDate:BeginDate,
            EndDate:EndDate,
          }
        }).then((res) => {
          if(res.data.isSuccess == true){
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
        this.$router.push({path:'/grouptour/OrderForm',query:{purchaseId:row.groupLinePurchaseId,quantity:row.quantity,lineId:row.lineId}})
      },
      //取消订单
      cancleOrder(row){
        this.$confirm("此操作将取消订单, 是否继续?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.groupHttp.post("GroupLine/CancelGroupLinePurchase",{
            GroupLinePurchaseId:row.groupLinePurchaseId
          }).then((res) => {
            console.log(res);
            if(res.data.isSuccess == true){
                this.$message({
                    type: "success",
                    message: "取消订单成功"
                });
                this.queryData(this.pagination.pageSize,this.pagination.currentPage)
            }else{
                this.$message({
                    type: "info",
                    message: "出错了！" + res.data.message
                });
              }
          }).catch(e => {
            console.log(e);
          });
        })
      }
    },
    data() {
      return {
        loading:true,
        order:{
          linkMan: '',
          DateTime: '',
          fullName: '',
        },
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
  @import "../../../style/common.scss";
  #table {
    margin-top: 15px;
  }
  .demonstration{
    display:inline-block;
    width:80px;

  }
</style>
