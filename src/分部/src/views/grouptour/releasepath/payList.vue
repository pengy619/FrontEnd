<template>
  <div class="view">
        <el-form :inline="true" :model="form" size="small" >
            <el-form-item label="状态">
                <el-select v-model="form.Status" placeholder="请选择状态">
                    <el-option v-for="item in StatusList" :key="item.value" :label="item.name" :value="item.key"></el-option>
                </el-select>   
            </el-form-item>
            <el-form-item label="代付编号">
                <el-input v-model="form.payNo"></el-input>
            </el-form-item>
            <el-form-item label="订单编号">
                <el-input v-model="form.orderNo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-search" @click="getTable">查找</el-button>
            </el-form-item>
        </el-form>
        <el-row style="margin-top:10px;">
              <el-table :data="form.table" border style="width: 100%">
                <el-table-column align="center" prop="supplierName" label="结算单位">
                </el-table-column>
                <el-table-column align="center" prop="payNo" label="代付编号" width="120">
                </el-table-column>
                <el-table-column align="center" prop="orderNo" label="订单编号">
                </el-table-column>
                <el-table-column align="center" prop="amount" label="订单金额">
                </el-table-column>
                <el-table-column align="center" prop="paymentAmount" label="代付金额">
                </el-table-column>
                <el-table-column align="center" prop="strSettlementMethod" label="代付方式">
                </el-table-column>
                <!-- <el-table-column align="center" prop="voucher" label="付款凭证">
                    <template slot-scope="scope">
                        <el-button sinze="mini" type="text">点击查看</el-button>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" prop="strStatus" label="状态">
                </el-table-column>
                <el-table-column align="center" prop="name" label="操作" width="300px" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="Examine(scope.row)">查看</el-button>
                        <el-button size="mini" type="text" @click="cancel(scope.row)" :disabled='!(scope.row.status == 0 && scope.row.isBranch)'>取消代付</el-button>
                        <el-button size="mini" type="text" @click="payAgain(scope.row)" :disabled='!(scope.row.status == 2 && scope.row.isBranch)'>重新发起代付</el-button>
                    </template>
                </el-table-column>
               </el-table>
        </el-row>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="form.pageIndex"
                :page-sizes="[5,10,20,50]"
                :page-size="form.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="form.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        form:{
          pageSize: 10,
          pageIndex: 1,
          total: 0,
          Status: '',
          payNo: '',
          orderNo: '',
          table:[],
        },
         StatusList: [],
      }
    },
    mounted () {
      this.getTable();
      this.getStatus();
    },
    methods: {
      getTable(){
          this.groupHttp.get('/GroupLinePayForAnotherBranch/GetPayForAnotherList?Id=0'+
          "&pageSize="+this.form.pageSize+
          "&pageIndex="+this.form.pageIndex+
          "&total="+this.form.total+
          "&Status="+this.form.Status+
          "&payNo="+this.form.payNo+
          "&orderNo="+this.form.orderNo)
          .then(res =>{
              this.form.table = res.data.objects;
              this.form.total = res.data.total;
              
          })
      },
      getStatus(){
          this.groupHttp.post('/GroupLinePayForAnotherBranch/GetPayForAnotherStatus',{keys:[1,2,3]})
          .then(res =>{
              console.log(res.data.keyValueList)
              this.StatusList = res.data.keyValueList;
            //   this.console.log(this.form.StatusList)
          })
      },
      payAgain(row){//重新发起代付
        this.$confirm('确定重新发起代付?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.groupHttp.post('/GroupLinePayForAnotherBranch/OperationPayForAnother',{Status:0,PayNo:row.payNo})
            .then(res =>{
                this.getTable();
                this.$message({
                    type: 'success',
                    message: '发起代付成功！'
                })
            })
        })
      },
      Examine(row){
          console.log(row.payNo)
          this.$router.push({path:'/grouptour/payDetails',query:{'PayNo':row.payNo}})
      },
      cancel(row){
          this.$confirm('确定取消代付?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.groupHttp.post('/GroupLinePayForAnotherBranch/OperationPayForAnother',{Status:3,PayNo:row.payNo})
            .then(res =>{
                this.getTable();
                this.$message({
                    type: 'success',
                    message: '取消代付成功！'
                })
            })
        })  
      },
      handleSizeChange(val) {
          this.form.pageSize = val
          console.log(val)
          this.getTable();
          // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
          this.form.pageIndex = val;
          this.getTable();
          // console.log(`当前页: ${val}`);
      },
    }
  }
</script>
