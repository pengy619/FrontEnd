<template>
  <div class="view">
    <el-row class="margin_bottom">
        <el-button type="primary" size="small" @click="roleAdd()">新建</el-button>
    </el-row>
      
    <el-table :data="roleTable" border>
        <el-table-column prop="name" label="角色" align="center" >
        </el-table-column>
        <el-table-column  prop="isDeletedString" label="是否启用" align="center">
        </el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="mini" @click="convertOrder(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="delet(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        roleTable: [{
          name: '',
          isDeletedString:''
        }],
        pageSize:10,
        pageIndex:1,
        total:0,
        Ids:""
      }
    },
    methods: {
      roleAdd(){
        this.$router.push('/systemsettings/role-add')
      },
      convertOrder(row){
         this.$router.push({path:'/systemsettings/role-add',name:'role-add',query:{editd:row.id}});
      },
      delet(row){
         var _this = this;
            _this.$confirm('请确认是否删除?',"提示",{confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(()=>{
                _this.shopHttp.post('/ShopRoles/DeleteShopRoles',{ShopRolesId:row.id}).then(res=>{
                  //console.log(res);
                  if(res.data.isSuccess){
                      _this.$message({ type: 'success',message: '删除成功'});   
                      _this.getRoleList();
                  }else{
                      _this.$message({ type: 'error',message: '删除失败'});       
                  }
                }).catch(err=>{
                  console.log(err);
                  _this.$message({ type: 'error',message: '删除失败'});   
                });
            }).catch(()=>{
                 this.$message({ type: 'error',message: '已取消操作'});   
            })
      },
      getRoleList(){
         var _this = this;
         _this.shopHttp.get('/ShopRoles/GetShopRolesPageList?PageSize='+_this.pageSize+"&PageIndex="+_this.pageIndex).then(res=>{
           //console.log(res);
           if(res.data.isSuccess){
              _this.roleTable = res.data.objects;
           }
         }).catch(er=>{
           console.log(er);
         })
      },
    },
    mounted:function(){
       this.getRoleList();
    }

  }
</script>
<style scoped lang=scss>
</style>


