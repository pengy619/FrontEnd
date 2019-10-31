<template>
    <div class="view">
      <el-header>
        <el-steps :active="5" align-center class="ui-step">
          <el-step title="线路信息" description=""></el-step>
          <el-step title="行程信息" description=""></el-step>
          <el-step title="小项目" description=""></el-step>
          <el-step title="预订说明" description=""></el-step>
          <el-step title="上传附件" description=""></el-step>
          <el-step title="特殊人群限制" description=""></el-step>
          <el-step title="退款说明"></el-step>
        </el-steps>
      </el-header>
      <el-upload
        class="upload-demo"
        action="/attachment/upload"
        :http-request="attachmentUpload"
        :multiple="true"
        :show-file-list="false"
        >
        <el-button size="small" type="primary" class="margin_bottom">点击上传</el-button>
      </el-upload>
      <el-row v-if="warnInfo.isActive">上传说明：<span class="danger">{{warnInfo.value}}</span> </el-row>
      <el-table
        :data="fileData"
        style="width: 100%">
        <el-table-column
          prop="AttrachmentName"
          label="附件名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="AttrachmentUrl"
          label="附件地址">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small" type="text"
              ><a :href='fileData[scope.$index].AttrachmentUrl' download="w3logo">下载</a></el-button>
            <el-button
              size="small"
              type="text"
              @click="fileDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-footer>
        <el-button type="primary" @click="saveRoute" class="margin_top" :loading='btn_loading' size="small" v-show="fileData.length > 0">保存，下一步</el-button>
        <el-button type="primary" @click="nextRoute" class="margin_top"  size="small" v-show="fileData.length == 0">下一步</el-button>
      </el-footer>
    </div>
</template>
<style scoped lang="scss">
  .el-button a{
    color: #409EFF;
  }
  .el-footer{
    /*text-align: center;*/
  }
  .color{
    color: rgb(64, 93, 255);
    margin-left: 10px;
  }
</style>

<script>
export default{
    data(){
        return {
          btn_loading: false,
          fileData: [],
          warnInfo:{}
        }
    },
    mounted () {
      this.getPromptText();
    },
  methods:{
    //附件说明
    getPromptText(){
      let companyType=localStorage.getItem('companyType');
      this.groupHttp.get('SystemSetting/GetLineGroupAttachmentTips').then(res => {
        this.warnInfo=res.data;
      })
    },
    fileDelete(index, row){
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
    attachmentUpload(val){
      var f= new FormData();
      f.append('FileData',val.file);
      f.append('Category','AirTicket');
      f.append('thumbnail',true);
      f.append('Folder','Airline');
      this.fileUpload.post(val.action,f)
        .then((res)=>{
          if(res.data.Status == true) {
            this.fileData.push({
              LineId: this.$route.query.lineId,
              AttrachmentName: res.data.FileName,
              AttrachmentUrl: res.data.Url,
              CreateTime: ''
            })
            this.$message({
              message: '上传成功',
              type: 'success'
            })
          }else{
            this.$message.error(res.data.Message);
          }
    })
    },
    nextRoute() {
      this.$router.push({
        path: "/grouptour/SpecialPerson",
        query: { lineId: this.$route.query.lineId,lineTypeId: this.$route.query.lineTypeId }
      });
      // setTimeout(()=>{
      //     //this.$router.push({path:'/grouptour/JourneyMessage/',query: { lineId: res.data.lineId,lineTypeId:this.ruleForm.EnumGroupLineType}})
      //     var url = location.href.substring(0,location.href.indexOf('grouptour'));
      //     location.replace(url + 'grouptour/SpecialPerson?lineId='+ this.$route.query.lineId);
      //   },500)
    },
    saveRoute(){
//        if(this.fileData.length == 0){
//          this.$alert('您还没有上传任何附件', '温馨提示', {
//              confirmButtonText: '确定',
//              callback: action => {
//              }
//            });
//            return;
//        }
        this.btn_loading = true;
        this.groupHttp.post('/GroupLine/AttrachmentSave',{Dto:this.fileData,LineId:this.$route.query.lineId}).then((res)=>{
          if(res.data.isSuccess==true){
            this.$message({
              type:'success',
              message:'保存成功'
            })
            this.btn_loading = false;
            this.$router.push({
              path: "/grouptour/SpecialPerson",
              query: { lineId: this.$route.query.lineId,lineTypeId: this.$route.query.lineTypeId }
            });
            // this.$router.push({path:'/grouptour/SpecialPerson',query:{lineId:this.$route.query.lineId}})
          }else{
              this.$message.error(res.data.message);
              setTimeout(() => {
                this.btn_loading = false;
              },500)
          }
        }).catch((e)=>{
            console.log(e)
        })

    }
  }
}
</script>
