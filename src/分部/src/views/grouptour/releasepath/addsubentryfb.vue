<template>
     <div class="view">
        <el-form :model="searchform">
            <el-form-item label='小项目名称' size='small' label-width='100px'>
               <el-input size= "small" v-model="searchform.SmallItemsName" style="width:200px;"></el-input>
               <el-button type="warning" size="small" @click="getSmallitemlist" style="margin-left:20px;">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-button type="primary" size="small" style="margin-bottom:10px" @click="dialogFormVisible=true">添加</el-button>
        <el-dialog title="添加小项目" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="addform">
                <el-form-item label="小项目名称" label-width="100px">
                    <el-input v-model="addform.SmallItemsName" size="small" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSmallitemlist" size='small'>确 定</el-button>
            </div>
        </el-dialog>

        <el-table ooltip-effect="dark" v-loading="addsubentryloading"  size="small" :data='smalliteamData' style="width:100%">
            <el-table-column prop="smallItemsName" label="小项目名称" align="center" size='small'></el-table-column>
            <el-table-column prop="smallItemId" label="小项目id" v-if="hiddcloumn" align="center" size='small'></el-table-column>
            <el-table-column label="操作" align="center" size='small'>
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="updateSmallitemshow(scope.row)">编辑</el-button>
                    <el-dialog title="添加小项目" :visible.sync="dialogFormupdateVisible" width="30%">
                        <el-form :model="updateform">
                            <el-form-item label="小项目名称" label-width="100px">
                                <el-input v-model="updateform.SmallItemsName"  size="small"  auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="updataSmallitem(scope.row)" size='small'>确 定</el-button>
                        </div>
                    </el-dialog>
                    <el-button type="text" size="small" @click="deleteSmallitem(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

       <div class="pagination">
         <el-pagination @size-change="handleSizeChange"
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
   data(){
       return{
          addsubentryloading:false,
          hiddcloumn:false,
          smalliteamData:[],
          dialogFormVisible:false,
          dialogFormupdateVisible:false,
          addform:{
              SmallItemsName:''
          },
          updateform:{
              SmallItemsName:'',
              SmallItemId:''
          },
          searchform:{
              SmallItemsName:'',
          },
          form: {
            pageSize: 10,
            pageIndex: 1,
            total: 0
          }
       }
   },methods:{
       getSmallitemlist(){//获取列表
         //搜索列表数据
         var _this = this;
         //  GroupLineSmallItem/GroupLineSmallItemList?Id=0&SmallItemsName
         // http://172.16.2.24:82/GroupLineSmallItem/GroupLineSmallItemList?Id=0&SmallItemsName
         _this.addsubentryloading = true;
         _this.groupHttp.get('/GroupLineSmallItem/GroupLineSmallItemList?Id=0&SmallItemsName=' + _this.searchform.SmallItemsName
           + '&PageSize=' + this.form.pageSize +
           '&PageIndex=' + this.form.pageIndex).then(res => {
             // console.log(res);
             if (res.data.isSuccess) {
               _this.smalliteamData = res.data.objects;
               _this.form.total = res.data.total
             } else {
               _this.$message({ type: 'info', message: '出错了' });
             }
             _this.addsubentryloading = false;
           }).catch(err => {
             console.log(err);
             _this.$message({ type: 'error', message: '请求失败' });
             _this.addsubentryloading = false;
           })
       },
       
       addSmallitemlist(){
           //添加数据
          var _this = this;
          //   /GroupLineSmallItem/SaveOrUpdate
          _this.groupHttp.post('/GroupLineSmallItem/SaveOrUpdate',_this.addform).then(res=>{
             // console.log(res);
              if(res.data.isSuccess){
                  _this.addform.SmallItemsName = '';
                   _this.getSmallitemlist();
                  _this.$message({type:'success',message:'添加成功'});
              }else{
                _this.$message({type:'info',message:res.data.message});
              }
              _this.dialogFormVisible = false;
             
          }).catch(err=>{
              console.log(err);
             _this.$message({type:'error',message:'请求失败'});
          })
       },
       deleteSmallitem(val){
           //删除小项目
           this.$confirm('确定删除该小项目?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.groupHttp.post('/GroupLineSmallItem/Delete',{SmallItemId:val.smallItemId}).then(res=>{
                        // console.log(res);
                        if(res.data.isSuccess){
                            this.getSmallitemlist();
                            this.$message({ type: "success",message: "操作成功!" + res.data.message});
                        }else{
                            this.$message({ type: "info",message: "出错了!" + res.data.message});
                        } 
                    }).catch(err=>{
                        console.log(err);
                            this.$message({type:'error',message:'请求失败'});
                    })
                })
       },
       updateSmallitemshow(val){
           this.dialogFormupdateVisible=true;
           this.updateform.SmallItemId = val.smallItemId;
           this.updateform.SmallItemsName = val.smallItemsName;
       },
       updataSmallitem(val){//修改接口
           var _this = this;
           this.dialogFormupdateVisible=false;
          // console.log(_this.updateform.SmallItemId);
          // console.log(_this.updateform.SmallItemsName);
           //  /GroupLineSmallItem/SaveOrUpdate
           _this.groupHttp.post('/GroupLineSmallItem/SaveOrUpdate',_this.updateform).then(res=>{
              // console.log(res);
               if(res.data.isSuccess){
                  _this.$message({type:'success',message:'修改成功'});
                  _this.getSmallitemlist();
               }else{
                 _this.$message({type:'info',message:'出错了'});
               }
               
           }).catch(err=>{
               console.log(err);
                _this.$message({type:'error',message:'请求失败'});
           })
       },
       handleSizeChange(val) {
         this.form.pageSize = val
         this.getSmallitemlist()
         // console.log(`每页 ${val} 条`);
       },
       handleCurrentChange(val) {
         this.form.pageIndex = val;
         this.getSmallitemlist()
         // console.log(`当前页: ${val}`);
       },
       
   },mounted:function(){
         this.getSmallitemlist();
   }
}
</script>

<style  lang="scss" scoped>
 @import "../../../style/common.scss";
</style>
