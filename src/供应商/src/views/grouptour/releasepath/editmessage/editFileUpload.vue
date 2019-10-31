<template>
    <div class="view" v-loading.fullscreen.lock="fullscreenLoading">
      <el-upload
        class="upload-demo"
        action="/attachment/upload"
        :before-upload="tripBeforeAvatarUpload"
        :http-request="attachmentUpload"
        :multiple="true"
        :show-file-list="false"
        >
        <el-button size="small" type="primary">点击上传</el-button><span class="el-upload__tip">(只能上传docx文件，且不超过15M)</span>
      </el-upload>
      <el-row v-if="warnInfo.isActive" class="margin_bottom margin_top">上传说明：<span class="danger">{{warnInfo.value}}</span> </el-row>
      <el-table
        :data="fileData"
        style="width: 100%">
        <el-table-column
          prop="attrachmentName"
          label="附件名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="attrachmentUrl"
          label="附件地址">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="small" type="text"
              ><a :href='fileData[scope.$index].attrachmentUrl' download="w3logo">下载</a></el-button>
            <el-button
              size="small"
              type="text"
              @click="fileDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<div class="pagination">-->
			<!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1,10,20,50,100]" layout="total, sizes, prev, pager, next, jumper" :page-size="1" :total="0">-->
			<!--</el-pagination>-->
		<!--</div>-->
      <el-footer>
        <el-button type="primary" @click="saveRoute" class="margin_top" :loading='btn_loading' size="small">保存</el-button>
        <el-button @click="goBack" size="small">返回</el-button>
      </el-footer>
    </div>
</template>
<style scoped lang="scss">
  .el-button a{
    color: #409EFF;
  }
</style>

<script>
export default {
  props:['status'],
  data() {
    return {
      fullscreenLoading:false,
      btn_loading: false,
      currentPage:1,
      fileData: [],
      warnInfo:{},
      lineId: this.$route.query.lineId,
    };
  },
  watch:{
    'status':function (val) {
      if (val == 'five'){
        this.getAttrahment()
      }
    }
  },
  mounted(){
    this.getIsActive();
  },
  methods: {
    tripBeforeAvatarUpload(file){      
      const isDoc = file.name.toLowerCase().indexOf('.docx')>0;
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isDoc) {
        this.$message.error('上传文件只能是docx格式!');
      }
      if (!isLt15M) {
        this.$message.error('上传文件大小不能超过 15MB!');
      }
      return isDoc && isLt15M;
		},
    goBack() {
      this.$router.push({
        path: "/grouptour/RouteTable"
      });
    },
    getAttrahment(){
      this.fullscreenLoading = true;
      this.groupHttp.post('/GroupLine/GetGroupLineAttrachment',{LineId:this.$route.query.lineId}).then(res=>{
        if(res.data.isSuccess==true){
          this.fullscreenLoading = false;
          this.fileData = res.data.objects
        }else{
          this.fullscreenLoading = false;
        }
      })
    },
    getIsActive(){
      this.groupHttp.get('/SystemSetting/GetLineGroupAttachmentTips')
      .then(res =>{
        this.warnInfo = res.data;
      })
    },
    fileDelete(index, row) {
      this.$confirm('此操作将删除该附件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fileData.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    attachmentUpload(val) {
      var f = new FormData();
      f.append("FileData", val.file);
      f.append("Category", "AirTicket");
      f.append("thumbnail", true);
      f.append("Folder", "Airline");
      this.fileUpload.post(val.action, f).then(res => {
        if (res.data.Status == true) {
          this.fileData.push({
            LineId: this.$route.query.lineId,
            attrachmentName: res.data.FileName,
            attrachmentUrl: res.data.Url,
            createTime: ""
          });
          this.$message({
            message: "上传成功",
            type: "success"
          });
        } else {
          this.$message.error(res.data.Message);
        }
      });
    },
    handleSizeChange(){},
    handleCurrentChange(){},
    saveRoute() {
      if (this.fileData.length == 0) {
        this.$message({
          type:'warning',
          message:'请上传至少一个附件'
        })
      }else{
       this.btn_loading = true;
       this.groupHttp.post('/GroupLine/AttrachmentSave',{Dto:this.fileData,LineId:this.lineId}).then((res)=>{
         if(res.data.isSuccess==true){
           this.$message({
             type:'success',
             message:'保存成功'
           })
           this.btn_loading = false;
         }else{
             this.$message.error(res.data.message);
             setTimeout(() => {
               this.btn_loading = false;
             },3000)
         }
       }).catch((e)=>{
           console.log(e)
       })
      }
    }
  }
};
</script>
