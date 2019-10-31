<template>
  <div class="view">
      
    <el-form :inline="true" :model="table" size="small" label-width="80px">
        <el-form-item label="员工姓名">
            <el-input v-model="table.name"   placeholder="输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
            <el-input v-model="table.idCard"   placeholder="输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="">
            <el-button  size="small" type="warning" @click="getList" icon="el-icon-search">搜索</el-button>
        </el-form-item>
    </el-form>
      <el-row class="margin_bottom">
          <el-button size="small" type="primary" @click="create()">创建员工</el-button>
      </el-row>
      <el-table v-loading="table.loading" :data="table.anagementList">
        <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="account" align="center" label="员工账号" width="100"></el-table-column>
        <el-table-column prop="name" align="center" label="员工姓名"></el-table-column>
        <el-table-column prop="postName" align="center" label="职位" width="150"> </el-table-column>
        <el-table-column prop="sexDesc" label="性别" align="center" width="50"> </el-table-column>
        <el-table-column prop="telPhone" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="idCard" label="身份证" align="center"> </el-table-column>
        <el-table-column prop="quota" label="信用额度" align="center"> </el-table-column>
        <el-table-column show-overflow-tooltip prop="desc" label="备注" align="center"></el-table-column>
        <el-table-column prop="operation" label="操作" align="center" width="200px" fixed="right">
            <template slot-scope="scope">
                <el-button type="text" size="mini" @click="converttable(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="details(scope.row)">查看</el-button>
                <el-button type="text" size="mini" @click="delet(scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>      
         <div class="pagination">
            <el-pagination
                fixed="right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="table.pageIndex"
                :page-sizes="[5,10,20,50]"
                :page-size="table.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.total">
            </el-pagination>
        </div>
  </div>
</template>
<script>
export default {
  data() {
      return{
          table:{
            pageSize: 10,
            pageIndex: 1,
            total:0,
            idCard:'',
            name:'',
            loading:false,
            anagementList:[{}],
          },
        }       
  },
  mounted () {
       this.getList()
  },
  methods: {
      getList(){
          //获取员工资料列表  赋值给
        this.table.loading=true
        this.shopHttp.get("Member/GetMemberPageList?"+
            "&pageSize="+this.table.pageSize+
            "&pageIndex="+this.table.pageIndex+
            "&total="+this.table.total+
            "&IDCard="+this.table.idCard+
            "&name="+this.table.name
        ).then(res =>{
            this.table.loading=false
            if(res.data.isSuccess == true){
                this.table.anagementList = res.data.objects,
                this.table.total = res.data.total
            }else{
                this.$message({
                    type: 'info',
                    message: "加载失败 ：" + res.data.message
                });
            }
        }).catch(e => {
            this.table.loading=false
        })
      },
      create () {
        this.$router.push('./setanagement')
      },
      delet(row){
          //console.log(row)
          this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.shopHttp.post("Member/DeleteMember",{ContactId:row.id}).then(res =>{
                if(res.data.isSuccess == true){
                    this.getList();
                    this.$message({
                        type:'success',
                         message:'成功： 删除员工账号成功'
                    })
                }else{
                    this.$message({
                        type: 'info',
                        message: "加载失败 ：" + res.data.message
                    });
                }
            }).catch(e => {
            }) 
        }).catch(() => {
                 this.$message({
                    type:'info',
                    message:'已取消'
                })
        }); 
      },
      converttable(row) {
          this.$router.push({path:`/systemsettings/convertOrder/${row.id}`})
      },
      details(row){
          this.$router.push({path:`/systemsettings/details/${row.id}`})
      },
      handleSizeChange(val) {
          this.table.pageSize = val
          this.getList()
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.table.pageIndex = val;
        this.getList()
        // console.log(`当前页: ${val}`);
      },
  }
}
</script>
<style scoped >
</style>




