<template>
  <div class='view'>
        <el-form  :inline="true" size="small" label-width="80px">
            <el-form-item label="结算单位" >
                <el-input  v-model="DisSettleClientName" ></el-input>
            </el-form-item>
            <el-form-item label="联系人" >
                <el-input  v-model="LinkMan" ></el-input>
            </el-form-item>
            <el-form-item label="收款编号" >
                <el-input  v-model="FeeNo" ></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="warning"  icon="el-icon-search" size="small" @click="queryData">搜索</el-button>
            </el-form-item> 
        </el-form>
            <el-table
              v-loading = 'loading'
              :data="invoiceList"
              style="width: 100%">
                  <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
                  <el-table-column align='center' prop="disSettleClientName" label="结算单位"></el-table-column>
                  <el-table-column align='center' prop="linkMan" label="联系人"></el-table-column>
                  <el-table-column min-width='150' align='center' prop="feeNo" label="收款编号"></el-table-column>
                  <el-table-column align='center' prop="feeAmount" label="收款金额"></el-table-column>
                  <el-table-column align='center' prop="currency" label="币种"></el-table-column>
                  <el-table-column align='center' prop="invoiceAmount" label="已开金额"></el-table-column>
                  <el-table-column align='center' prop="unInvoiceAmount" label="未开金额"></el-table-column>
                  <el-table-column align='center' label="收款方式">
                      <template slot-scope="scope">
                          {{scope.row.feeNo?scope.row.feeMethodName:''}}
                      </template>
                  </el-table-column>
                  <el-table-column align='center' label="收款时间">
                      <template slot-scope="scope">
                          {{scope.row.feeNo?scope.row.feeDateFormat:''}}
                      </template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="120" align="center" fixed="right">
                        <template slot-scope="scope">
                          <el-button type="text" size="mini" @click='goDetail(scope.row)'>详 情</el-button>
                          <el-button type="text" size="mini" @click='kaifapiao(scope.row)' :disabled = 'scope.row.invoiceAmount > 0 ? true : false'>申请开票</el-button>
                        </template>
                  </el-table-column>
            </el-table>
                <el-pagination class="pagination"
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
</template>
<script>
  import {dateFmt} from '@/utils/tools.js';
  export default {
    methods: {
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
            pageSize=this.pagination.size
            this.shopHttp.get('/Invoice/GetInvoiceApplyPageList?DisSettleClientName='+this.DisSettleClientName+'&LinkMan='+this.LinkMan+'&FeeNo='+ this.FeeNo+
            '&PageSize='+(pageSize || 10)+'&PageIndex=' + (pageIndex || 1))
                .then( (res) =>{
                    if (res.data.isSuccess == true) {
                        this.invoiceList = res.data.objects;
                        this.pagination.total =  res.data.total;
                    }else {
                        this.$message({
                        type: "info",
                        message: "出错了:" + res.data.message
                        });
                    }
                }).catch((e) =>{
                    console.log(e)
                })
        },
        goDetail(row){
            //console.log(row);
            var kaipiao = false;
            if(row.invoiceAmount > 0 ){
                kaipiao = true;
            }
            this.$router.push({name:'fapiaoshenqingDetail',query:{cusFeeId:row.id,kaipiao:kaipiao}});
        },
        kaifapiao(row){
            //console.log(row)
            this.$router.push({path:'/grouptour/kaifapiao',query:{cusFeeId:row.id}})
        },
        zidingyifapiao(){
            this.$router.push({path:'/grouptour/zidingyifapiao'});
        }
    },
    data() {
      return {
        loading : false,
        dates:[],
        DisSettleClientName:'',
        LinkMan:'',
        FeeNo:'',
        invoiceList:[
            
        ],
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
    }
};
</script>
<style scoped lang="scss">
  .view{
      padding:15px 25px;
  }
  .el-row{
    margin:15px 0 15px 10px;
  }
  .btn_div .el-button{
      margin:5px 0 15px 10px;
  }
  .el-row .el-col .el-input{
      width:200px;
      margin:0 30px 0 5px;
  }
</style>
