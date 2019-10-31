<template>
  <div class="view" id="box">
    <el-form size="small" :inline="true" :model="receivables" class="demo-form-inline" label-width="120px">
        <el-form-item label="订单状态">
            <el-select v-model="receivables.FeeStatus" placeholder="请选择" clearable>
                <el-option v-for="item in statusList" :key="item.value" :label="item.value" :value="item.key"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="结算单位">
            <el-input v-model="receivables.disSettleClientName" placeholder="客户结算单位"></el-input>
        </el-form-item>
        <el-form-item label="退款编号">
            <el-input v-model="receivables.feeNo" placeholder="退款编号"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="退款方式">
             <el-select v-model="receivables.feeMethod" placeholder="结算方式" style="width:200px" clearable>
              <el-option v-for="item in Dictionary" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
        </el-form-item>
            <el-button size="small" type="warning" icon="el-icon-search" @click="receivablesList()">搜索</el-button>
    </el-form>
    <el-table size="small" algin="center" v-loading="receivables.loading" :data="receivables.table" style="width: 100%">
        <el-table-column size="small" align="center" type="index" label="序号" > </el-table-column>
        <el-table-column size="small" align="center" prop="disSettleClientName" label="结算单位" > </el-table-column>
        <el-table-column size="small" align="center" prop="linkMan" label="联系人" ></el-table-column>
        <el-table-column size="small" align="center" prop="feeNo" label="退款编号" > </el-table-column>
        <el-table-column size="small" align="center" prop="feeAmount" label="退款金额" > </el-table-column>
        <el-table-column size="small" align="center" prop="currency" label="币种" ></el-table-column>
        <el-table-column size="small" align="center" prop="confirmAmount" label="财务确认金额" ></el-table-column>
        <el-table-column size="small" align="center" prop="feeMethodName" label="退款方式" > </el-table-column>
        <el-table-column size="small" align="center" prop="feeDateFormat" label="申请时间" ></el-table-column>
        <el-table-column size="small" align="center" prop="feeStatusName" label="状态" ></el-table-column>
        <el-table-column size="small" align="center"  label="操作" fixed="right" width="150px">
            <template slot-scope="scope">
                <el-button type="text" size="mini" @click="Details(scope.row)">详情</el-button>
                <!-- <el-button type="text" size="mini" @click='cancelFee(scope.row)' :disabled ='scope.row.feeStatusName =="待确认" || scope.row.feeStatusName =="待审核"? false : true'>取消退款</el-button> -->
            </template>
        </el-table-column>
    </el-table>
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
              pageSize: 10,
              pageIndex: 1,
              total: 0,
              disSettleClientName: '',
              feeNo :'',
              feeMethod: '',
              loading: false,
              FeeStatus: '',
          table:[{}],
          },
          statusList: [],
          Dictionary: [],
      }
  },
  mounted (){
      this.receivablesList();
      this.getstatusList();
      this.DictionaryList(); //结算方式下拉
  },
  methods: {
      //获取订单状态
      getstatusList(){
          this.shopHttp.get("CustomerFee/GetCustomerFeeStatus").then(res =>{
                       console.log(res);
                       this.statusList = res.data.objects ;
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
          this.shopHttp.get("CustomerFee/GetCusRefundPageList?"+
                            "pageSize="+this.receivables.pageSize+
                            "&pageIndex="+pageIndex+
                            "&total="+this.receivables.total+
                            "&DisSettleClientName="+this.receivables.disSettleClientName+
                            "&feeNo="+this.receivables.feeNo+
                            "&feeMethod="+this.receivables.feeMethod+
                            "&FeeStatus="+this.receivables.FeeStatus
                            ).then(res =>{
                            this.receivables.loading=false
            if(res.data.isSuccess == true){
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
          this.$router.push({path:`/orderCenter/refundDetails/${row.id}`})
      },
      DictionaryList(){
          this.shopHttp.get("SettleClient/GetDictionaryList").then(res =>{
            this.Dictionary = res.data.objects;
        }).catch(e => {
              this.$message({
                        type: 'info',
                        message: "加载失败 ：" + res.data.message
                  });
            })    
      }, 
      //取消退款
      cancelFee(row){
        console.log(row)
        this.cusFeeIds[0] = row.id;
        this.$confirm('是否取消退款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.shopHttp
          .post("CustomerFee/CancelCustomerFee",{
            CusFeeIds:this.cusFeeIds[0]
          }).then(res => {
            console.log(res);
            if (res.data.isSuccess == true) {
              this.$message({
                type:'success',
                message:'取消退款成功!'
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
          this.receivables.pageSize = val
          this.receivablesList(this.receivables.pageIndex)
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