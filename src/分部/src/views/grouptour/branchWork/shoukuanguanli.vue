<template>
  <div class='view'>
    <el-form :inline="true" class="demo-form-inline" size='small' label-width="100px">
      <el-form-item label="客户名称">
            <el-input v-model="customerName" ></el-input>
      </el-form-item>
      <el-form-item label="收款编号">
            <el-input v-model="FeeNo" ></el-input>
       </el-form-item>
       <el-form-item label="收款状态">
            <el-select v-model="FeeStatus" placeholder="请选择" >
              <el-option
                v-for="(item,index) in StatusOptions"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
       
         </el-form-item>
      	<el-form-item label="收款方式">
			<el-select v-model="FeeMethod" placeholder="请选择" >
              <el-option
                v-for="(item,index) in FeeMethodOptions"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
        </el-form-item>
      	<el-form-item label="收款人">
            <el-input v-model="Handler"></el-input>
		</el-form-item>
		<el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="queryData()" >查找</el-button>
          </el-form-item>
        </el-form>
    <div>
        <div id='table'>
            <el-table
              v-loading = 'loading'
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
                    prop="disSettleClientName"
                    label="结算单位"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="linkMan"
                    label="联系人"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="feeNo"
                    label="收款编号"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="currency"
                    label="币种"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="feeAmount"
                    label="收款金额"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="confirmAmount"
                    label="财务确认金额"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="invoiceAmount"
                    label="开票金额"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="feeMethodName"
                    label="收款方式"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="feeDateFormat"
                    label="收款时间"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="handler"
                    label="收款人"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="feeStatusName"
                    label="状态"
                    >
                  </el-table-column>
                  
                  <el-table-column
                      label="操作"
                      min-width="150"
                      align="center"
                      >
                        <template slot-scope="scope">
                          <el-button type="text" size="mini" @click='goDetail(scope.row)'>详 细</el-button>
                          <el-button type="text" size="mini" @click='cancelFee(scope.row)' :disabled =' !scope.row.canCancelReceive || scope.row.feeChannel!=8'>取消收款</el-button>
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
      //详情
      goDetail(row){
        this.$router.push({path:'/grouptour/orderReceiptDetails',query:{id:row.id,invoiceStatus:row.invoiceStatus}})
      },
      //取消收款
      cancelFee(row){
        console.log(row)
        this.cusFeeIds[0] = row.id;
        this.$confirm('是否取消收款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.groupHttp
          .post("CustomerFee/CancelCustomerFee",{
            CusFeeIds:this.cusFeeIds[0]
          }).then(res => {
            console.log(res);
            if (res.data.isSuccess == true) {
              this.$message({
                type:'success',
                message:'取消收款成功!'
              });
              this.queryData(this.pagination.size,this.pagination.currentPage);
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
        }).catch((e) => {
          console.log(e)
        })
        
      },
      queryData(pageSize,pageIndex){
        this.loading = true;
        this.groupHttp
        .get("CustomerFee/GetCusReceivePageList?FeeMethod="
        +this.FeeMethod+"&FeeStatus="+this.FeeStatus+"&FeeNo="
        +this.FeeNo+"&DisSettleClientName="+this.customerName+"&Handler="+
        this.Handler+"&PageSize="+(pageSize || 10)+"&PageIndex="+(pageIndex || 1))
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.tableData = res.data.objects;
            this.pagination.total = res.data.total;
            this.loading = false;
          } else {
            this.$message({
              type: "info",
              message: "出错了！"
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
        cusFeeIds:[],
        FeeStatus:'',
        FeeMethod:'',
        FeeNo:'',
        Handler:'',
        customerName:'',
        loading : false,
		StatusOptions:[],
		FeeMethodOptions:[],
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
      this.groupHttp
        .get("CustomerFee/GetCustomerFeeStatus")
        .then(res => {
          if (res.status == 200) {
            this.StatusOptions = res.data.objects;
          } else {
            this.$message({
              type: "info",
              message: "出错了！"
            });
          }
        })
        .catch(e => {
          console.log(e);
		});
		this.groupHttp
        .get("Supplier/GetDictionaryList")
        .then(res => {
          if (res.status == 200) {
            this.FeeMethodOptions = res.data.objects;
          } else {
            this.$message({
              type: "info",
              message: "出错了！"
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
  @import "../../../style/common.scss";
  #table{
    margin-top:15px;
  }
  .el-row{
    margin:15px 0;
  }
  .el-row span{
    display:inline-block;
    width:70px;
    text-align:right;
    margin-right:5px;
  }
  .el-row .el-col .el-input{
    width:200px;
    padding-right:15px;
  }
</style>
