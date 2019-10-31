<template>
     <div class="view">
        <el-form>
            <el-form-item label='小项目名称' label-width='100px'>
               <el-input size= "smalll" v-model="SmallItemsName" style="width:200px;"></el-input>
               <el-button type="warning" size="small" @click="getSmallitemlist" style="margin-left:20px;">搜索</el-button>
            </el-form-item>
        </el-form>
       <el-table ooltip-effect="dark" v-loading="loading" :data="smalliteamData"  size="small" style="width:100%">
            <el-table-column prop="smallItemsName" label="小项目名称" align="center" size='small'></el-table-column>
            <!-- <el-table-column label="操作" align="center" size='small'>
                <template slot-scope="scope">
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
     </div>
</template>

<script>
export default {
   data(){
       return{
          smalliteamData:[],
          SmallItemsName:'',
          loading:false,
       }
   },methods:{
       getSmallitemlist(){//获取列表
           var _this = this;
           _this.loading = true;
           //                 GroupLineSmallItemSupplier/GroupLineSmallItemList?Id=0
           _this.groupHttp.get('/GroupLineSmallItemSupplier/GroupLineSmallItemList?Id=0&PageSize=99999&SmallItemsName='+_this.SmallItemsName).then(res=>{
              // console.log(res);
               if(res.data.isSuccess){
                   _this.smalliteamData = res.data.objects;
               }else{
                   _this.$message({type:'info',message:'出错了'});
               }
               _this.loading = false;
           }).catch(err=>{
               console.log(err);
               _this.$message({type:'error',message:'请求失败'});
               _this.loading = false;
           })
       },
       searchSmallitemlist(){
           //搜索列表数据
           var _this = this;
       },
       
   },mounted:function(){
         this.getSmallitemlist();
   }
}
</script>

<style  lang="scss" scoped>
 @import "../../style/common.scss";
</style>
