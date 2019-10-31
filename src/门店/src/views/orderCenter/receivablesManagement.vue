<template>
  <div class="view" id="box">
      <div>
        <el-form size="small" :inline="true" :model="receivables" class="demo-form-inline" label-width="80px">
            <el-form-item label="状态" >
                <el-select v-model="receivables.FeeStatus" placeholder="请选择" class="input" clearable>
                        <el-option v-for="item in status" :key="item.value"  :label="item.value" :value="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算单位">
                <el-input v-model="receivables.disSettleClientName" placeholder="结算单位"></el-input>
            </el-form-item>
            <el-form-item label="收款编号">
                <el-input v-model="receivables.feeNo" placeholder="收款编号"></el-input>
            </el-form-item>
            <el-form-item label="收款方式">
                <el-select v-model="receivables.feeMethod" placeholder="结算方式" style="width:200px" clearable>
                    <el-option v-for="item in receivables.Dictionary" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收款人">
                <el-input v-model="receivables.handler" placeholder="收款人"></el-input>
            </el-form-item>
             <el-form-item label="订单号">
                <el-input v-model="receivables.OrderNo" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="warning" icon="el-icon-search" @click="receivablesList()">搜索</el-button>
            </el-form-item>
        </el-form>
      </div>
      <div id="table">
        <el-table v-loading="receivables.loading" size="small" algin="center" :data="receivables.table"  style="width: 100%">
            <el-table-column size="small" align="center" type="index" label="序号" > </el-table-column>
            <el-table-column size="small" align="center" prop="disSettleClientName" label="结算单位" > </el-table-column>
            <el-table-column size="small" align="center" prop="linkMan" label="联系人" ></el-table-column>
            <el-table-column size="small" align="center" prop="orderNo" label="订单号" ></el-table-column>
            <el-table-column size="small" align="center" prop="feeNo" label="收款编号" > </el-table-column>
            <el-table-column size="small" align="center" prop="currency" label="币种" ></el-table-column>
            <el-table-column size="small" align="center" prop="feeAmount" label="收款金额" > </el-table-column>
            <el-table-column size="small" align="center" prop="confirmAmount" label="财务确认金额" ></el-table-column>
            <el-table-column size="small" align="center" prop="invoiceAmount" label="开票金额" > </el-table-column>
            <el-table-column size="small" align="center" prop="feeMethodName" label="收款方式" > </el-table-column>
            <el-table-column size="small" align="center" prop="feeDateFormat" label="收款时间" ></el-table-column>
            <el-table-column size="small" align="center" prop="handler" label="收款人" > </el-table-column>
            <el-table-column size="small" align="center" prop="feeStatusName" label="状态" ></el-table-column>
            <el-table-column size="small" align="center"  label="操作" fixed="right" width="150px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="Details(scope.row)">详情</el-button>
                    <el-button type="text" size="mini" @click='cancelFee(scope.row)' :disabled ='!scope.row.canCancelReceive'>取消收款</el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
        <el-pagination class="pagination"
                @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="receivables.pageIndex"
            :page-sizes="[5,10,20,50]"
            :page-size="receivables.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="receivables.total">
        </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
      return {
          cusFeeIds:[],
          receivables:{
              pageSize:10,
              pageIndex: 1,
              total:0,
              loading:false,
              FeeStatus:'',
              feeNo: '',
              OrderNo:'',
              feeMethod: '',
              handler: '',
              disSettleClientName:'',
          table:[{
              
          }],
          status:[],
          Dictionary:[]
          },
      }
  },
  mounted () {
      this.receivablesList();
      this.status();
      this.DictionaryList(); //结算方式下拉
  },
  methods: {
      status(){
          this.shopHttp.get("CustomerFee/GetCustomerFeeStatus").then(res =>{
                       this.status = res.data.objects ;
                           }).catch(e => {
                              console.log(e);
                               this.$message({
                                          type: 'info',
                                          message: "加载失败 ：" + res.data.message
                                    });
                              })
      },
      receivablesList(pageIndex=1){
          this.receivables.loading = true;    
          this.shopHttp.get("CustomerFee/GetCusReceivePageList?"+
                            "pageSize="+this.receivables.pageSize+
                            "&pageIndex="+pageIndex+
                            "&total="+this.receivables.total+
                            "&FeeStatus="+this.receivables.FeeStatus+
                            "&feeNo="+this.receivables.feeNo+
                            "&feeMethod="+this.receivables.feeMethod+
                            "&DisSettleClientName="+this.receivables.disSettleClientName+
                            "&OrderNo="+this.receivables.OrderNo+
                            "&handler="+this.receivables.handler).then(res =>{
            this.receivables.loading=false
            console.log(res)
            if(res.data.isSuccess == true){
                console.log(res.data.objects.CusFeeId)
                this.receivables.table = res.data.objects,
                this.receivables.total = res.data.total
            }else{
                this.$message({
                    type: 'info',
                    message: "加载失败 ：" + res.data.message
                });
            }
        }).catch(e => {
            this.receivables.loading=false
        })
      },
      Details(row){
          this.$router.push({path:'/orderCenter/receiptDetails',query:{id:row.id,invoiceStatus:row.invoiceStatus}})
      },
      DictionaryList(){
          this.shopHttp.get("SettleClient/GetDictionaryList").then(res =>{
            this.receivables.Dictionary = res.data.objects;
        }).catch(e => {
              this.$message({
                        type: 'info',
                        message: "加载失败 ：" + res.data.message
                  });
            })    
      }, 
      //取消收款
      cancelFee(row){
        this.cusFeeIds[0] = row.id;
        this.$confirm('是否取消收款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.shopHttp.post("CustomerFee/CancelCustomerFee",{
            CusFeeIds:this.cusFeeIds[0]
          }).then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type:'success',
                message:'取消收款成功!'
              });
              this.receivablesList(this.receivables.pageIndex);
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
      handleSizeChange(val) {
          this.receivables.pageSize = val;
          this.receivablesList(this.receivables.pageIndex);
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.receivables.pageIndex = val;
        this.receivablesList(this.receivables.pageIndex)
        // console.log(`当前页: ${val}`);
      },
  }
}
</script>

<style scoped lang='scss'>
</style>
