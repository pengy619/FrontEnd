<template>
  <div id="box">
        <el-form size="small" :inline="true" :model="order" class="demo-form-inline">
            <el-form-item label="出团日期">
               <el-date-picker
            v-model="order.DateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            size="small"
            end-placeholder="结束日期" id="se">
          </el-date-picker>                 
            </el-form-item>
            <el-form-item label="线路名称">
                <el-input v-model="order.fullName" placeholder="线路名称"></el-input>
            </el-form-item>
            <el-form-item label="客户名称">
                <el-input v-model="order.linkMan" placeholder="客户名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" icon="el-icon-search" @click="getChangeList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="order.loading" algin="center" :data="order.table" style="width: 100%">
            <el-table-column align="center" prop="select" label="序号" type="index" width="50"></el-table-column>
            <el-table-column align="center" prop="reservedStatusName" label="状态" > </el-table-column>
            <el-table-column align="center" prop="teamNo" label="团号" ></el-table-column>
            <el-table-column align="center" prop="fullName" label="线路名称" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="departureDateFormat" label="出团日期" ></el-table-column>
            <el-table-column align="center" prop="linkMan" label="客户名称" > </el-table-column>
            <el-table-column align="center" prop="linkPhone" label="联系方式" ></el-table-column>
            <el-table-column align="center" prop="quantity" label="预留人数" > </el-table-column>
            <el-table-column align="center" prop="purchaseDateFormat" label="预留日期" > </el-table-column>
            <el-table-column align="center" prop="comment" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column align="center"  label="操作" fixed="right" min-width="100px">
                <template slot-scope="scope">
                     <el-button type="text" size="mini" @click="transformation(scope.row)" :disabled = 'scope.row.reservedStatus == 0 ? false : true'>转换订单</el-button>
                     <el-button type="text" size="mini" @click="cancel(scope.row)" :disabled = 'scope.row.reservedStatus == 0 ? false : true'>取消</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="order.pageIndex"
            :page-sizes="[5,10,20,50]"
            :page-size="order.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="order.total">
        </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
      return {
          order:{
              pageSize: 10,
              pageIndex: 1,
              total:0,
              loading:false,
              linkMan: '',
              DateTime: '',
              fullName: '',
          table:[{}]
          },
      }
  },
  mounted () {
      this.getChangeList()
  },
  methods: {
     // 获取预留单列表
      getChangeList(){
          this.order.loading = true
           let startDate='',endDate ='';
          if(this.order.DateTime){
              startDate = this.order.DateTime[0]
              endDate = this.order.DateTime[1]
          }
         
          this.shopHttp.get("GroupLine/GetGroupLinePurchase?"+
          "pageSize="+this.order.pageSize+
          "&pageIndex="+this.order.pageIndex+
          "&total="+this.order.total+
          "&fullName="+this.order.fullName+
          "&LinkMan="+this.order.linkMan+
          "&StartDate="+ startDate +
          "&EndDate="+ endDate
          ).then(res =>{
            this.order.loading=false
            if(res.data.isSuccess == true){
                this.order.table = res.data.objects,
                this.order.total = res.data.total
            }else{
                this.$message({
                    type: 'info',
                    message: "加载失败 ：" + res.data.message
                });
            }
        }).catch(e => {
            this.order.loading=false
        })
      },
      transformation(data){
          this.$router.push({path:'/orderCenter/baoming',query:{purchaseId:data.groupLinePurchaseId,quantity:data.quantity,lineId:data.lineId,confirmType:data.confirmType}})
      },
      cancel(row){
          console.log(row)
          this.$confirm('确定取消该预留单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.shopHttp.post("GroupLine/CancelGroupLinePurchase",{GroupLinePurchaseId:row.groupLinePurchaseId}).then(res =>{
                if(res.data.isSuccess == true){
                    this.getChangeList()
                }else{
                    this.$message({
                        type: 'info',
                        message: "加载失败 ：" + res.data.message
                    });
                }
            }).catch(e => {
                console.log(e)
            }) 
        }).catch(() => {
                 
        });
      },
      handleSizeChange(val) {
          this.order.pageSize = val
          this.getChangeList()
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.order.pageIndex = val;
        this.getChangeList()
        // console.log(`当前页: ${val}`);
      },
  }
}
</script>

<style scoped lang='scss'>
</style>
