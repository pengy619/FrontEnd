<template>
	<div class='view'>
        <el-form  :inline="true" size="small" label-width="100px">
            <el-form-item label="状态" >
                <el-select v-model="InvoiceStatus" placeholder="请选择" >
                    <el-option label='不限' value = ''></el-option>
                    <el-option label='待开票' value = '1'></el-option>
                    <el-option label='已开票' value = '3'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户结算单位" >
                <el-input  v-model="DisSettleClientName" ></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="warning"  icon="el-icon-search" size="small" @click="queryData">搜索</el-button>
            </el-form-item> 
        </el-form>
        <el-table
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
                    prop="statusName"
                    label="开票状态"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="disSettleClientName"
                    label="客户结算单位"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="invoiceTitle"
                    label="发票抬头"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="invoiceType"
                    label="发票类型"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="invoiceAmount"
                    label="发票金额"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="taxAmount"
                    label="税费"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="receiveTypeName"
                    label="领取方式"
                    >
                  </el-table-column>
                  <el-table-column
                      label="操作"
                      min-width="100"
                      align="center"
                       fixed="right"
                      >
                        <template slot-scope="scope">
                          <el-button type="text" size="mini" @click='queryDetail(scope.row)'>详 细</el-button>
                          <el-button type="text" size="mini" @click='delete(scope.row)'>删 除</el-button>
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
	export default {
  		data() {
    		return {
                DisSettleClientName:'',
                InvoiceStatus:'',
                tableData:[
                    
                ],
                //分页
                pagination:{
                    sizes:[5,10,20,50],
                    size:10,
                    currentPage: 1,
                    total:0
                }
            }
		},
		methods: {
            queryData(size,index){
                this.shopHttp.get('/Invoice/GetInvoicePageList?InvoiceStatus='+this.InvoiceStatus+'&DisSettleClientName='+this.DisSettleClientName+'&InvoiceNo=&PageSize='+(size || 10) +'&PageIndex=' + (index || 1) )
                .then( (res) => {
                   // console.log(res)
                    if(res.data.isSuccess == true){
                        this.tableData = res.data.objects;
                        this.pagination.total = res.data.total;
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
            queryDetail(row){
                setTimeout(()=>{
                   this.$router.push({path:'/grouptour/kaipiaojiluxiangqing',query:{invoiceId:row.invoiceId}})
                 },500)
            },
            delete(row){},
            //分页
            sizeChange(val) {
                this.pagination.size = val;
                this.pagination.currentPage = 1;
                this.queryData(this.pagination.size,this.pagination.currentPage);
            },
            currentPageChange(val) {
                this.pagination.currentPage = val;
                this.queryData(this.pagination.size,this.pagination.currentPage);
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
        },
		mounted() {
            this.queryData();
        }
	}
</script>
<style scoped lang="scss">
    .el-row{
        margin:5px 0 20px 10px;
    }
    .el-row .el-select{
        margin-right:30px;
    }
    .el-row span{
        margin-right:5px;
    }
    .el-row .el-input{
        width:200px;
        margin-left:5px;
    }
    .el-row .el-button{
        margin-left:30px;
    }
</style>