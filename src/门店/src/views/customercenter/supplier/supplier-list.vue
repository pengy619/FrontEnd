<template>
  <div class="view">
        <el-form size="small" :inline="true" :model="table"  label-width="100px">
          <el-form-item label="供应商名称">
            <el-input v-model="keyword" placeholder="供应商名称" ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button size="small" type="warning" @click="getList()" icon="el-icon-search">查找</el-button>
            <el-button size="small" type="primary" @click="addSupplier()">新建</el-button>
          </el-form-item>
        </el-form>
          <el-table :data="table.list" style="width: 100%" v-loading="table.loading">
            <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
            <el-table-column align="center" prop="supplierName" label="供应商名称"></el-table-column>
            <el-table-column align="center" prop="linkName" label="联系人"></el-table-column>
            <el-table-column align="center" prop="linkPhone" label="联系方式"></el-table-column>
            <el-table-column prop="operation" label="操作" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="editSupplier(scope.row)">编辑</el-button>
                  <el-button type="text" :loading="scope.row.loading" size="mini" @click="deleteSupplier(scope.row)">删除</el-button>           
                </template>
            </el-table-column>
        </el-table>
        <el-row class="pagination" :gutter="20" >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="table.pageIndex"
            :page-sizes="[5,10,20,50]"
            :page-size="table.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.total">
          </el-pagination>
        </el-row>  
  </div>
</template>
<script>
  export default {
    data() {
        return {
            keyword:'',
            table:{
                list:[],
                loading: false,
                pageSize: 10,
                pageIndex: 1,
                total:0,
            },
        }
    },
    mounted () {
        this.getList()
    },
    methods: {
        getList(pageIndex=1){
            this.table.loading=true
            this.shopHttp.get('/SupplierManage/OftenSupplierPageList',{
                params:{
                    LikeName:this.keyword,
                    pageIndex:pageIndex,
                    pageSize:this.table.pageSize
                }
            })
            .then(res=>{
                this.table.loading=false
                this.table.list=res.data.objects
                this.table.list.forEach(item=>{
                    item.loading=false
                })
                this.table.total=res.data.total
            })
        },
        addSupplier(){
            this.$router.push('/customercenter/supplier-edit')
        },
        editSupplier(row){
            this.$router.push('/customercenter/supplier-edit?id='+row.id)
        },
        deleteSupplier(row){
            this.$confirm('确认删除该条记录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.loading=true
                this.shopHttp.post('/SupplierManage/DeleteSupplier',{
                    SupplierId:row.id
                })
                .then(res=>{
                    if(res.data.isSuccess){
                        this.$message.success('删除成功');
                        this.getList(this.table.pageIndex)
                    }else{
                        this.$message.error('删除失败，请重试！');
                    }
                    row.loading=false
                })
                .catch(e=>{
                    this.$message.error('删除失败，请重试！');
                    row.loading=false
                })
            })
            
        },
        handleCurrentChange(val){
            this.table.pageIndex = val;
            this.getList(this.table.pageIndex)
        },
        handleSizeChange(val){
            this.table.pageSize = val;
            this.getList(this.table.pageIndex)
        }
    },
  }
</script>
<style scoped lang="scss">
</style>
