<template>
    <div class="view">
      <el-header>
        <el-steps :active="5" align-center class="ui-step">
          <el-step title="线路信息" description=""></el-step>
          <el-step title="行程信息" description=""></el-step>
          <el-step title="小项目"   description=''></el-step>
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
        :before-upload="tripBeforeAvatarUpload"
        :multiple="true"
        :show-file-list="false"
        >
        <el-button size="small" type="primary">点击上传</el-button><span class="el-upload__tip">(只能上传docx文件，且不超过15M)</span>
      </el-upload>
      <el-row v-if="warnInfo.isActive" class="margin_top">上传说明：<span class="danger">{{warnInfo.value}}</span> </el-row>
      <el-table
        :data="fileData"
        style="width: 100%" class="margin_top">
        <el-table-column
          prop="AttrachmentName"
          label="附件名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="AttrachmentUrl"
          label="附件地址">
        </el-table-column>
        <el-table-column label="操作" align="center">
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
      <el-footer class="text-center">
        <el-button type="primary" @click="saveRoute" class="margin_top" :loading='btn_loading' size="small">保存，下一步</el-button>
      </el-footer>
    </div>
</template>
<style scoped lang="scss">
</style>

<script>
export default {
  data() {
    return {
      btn_loading: false,
      fileData: [],
      warnInfo:{},
      lineId:this.$route.query.lineId
    };
  },
  mounted () {
    this.getIsActive();
  },
  methods: {
    getIsActive(){
      this.groupHttp.get('/SystemSetting/GetLineGroupAttachmentTips')
      .then(res =>{
        this.warnInfo = res.data;
      })
    },
    fileDownload(index, row) {},
    fileDelete(index, row) {
      this.$confirm("此操作将删除该附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.fileData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
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
            AttrachmentName: res.data.FileName,
            AttrachmentUrl: res.data.Url,
            CreateTime: ""
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
    nextRoute() {
        this.$router.push({
          path: "/grouptour/SpecialPerson",
          query: { lineId: this.$route.query.lineId,lineTypeId:this.$route.query.lineTypeId }
        });
      //  setTimeout(()=>{
      //     //this.$router.push({path:'/grouptour/JourneyMessage/',query: { lineId: res.data.lineId,lineTypeId:this.ruleForm.EnumGroupLineType}})
      //     // var url = location.href.substring(0,location.href.indexOf('grouptour'));
      //     // location.replace(url + 'grouptour/SpecialPerson?lineId='+ this.$route.query.lineId);
      //   },500)
    },
    saveRoute() {
      if (this.fileData.length == 0) {
        this.$message({
          type:'warning',
          message:'请上传至少一个附件'
        })
      }else{
        this.btn_loading = true;
        this.groupHttp
          .post("/GroupLine/AttrachmentSave", { Dto: this.fileData,LineId:this.lineId })
          .then(res => {
            if (res.data.isSuccess == true) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              this.btn_loading = false;
              // var url = location.href.substring(0,location.href.indexOf('grouptour'));
              // location.replace(url + 'grouptour/SpecialPerson?lineId='+this.$route.query.lineId + '&lineTypeId=' + this.$route.query.lineTypeId);
              // location.reload();
              this.$router.push({
                path: "/grouptour/SpecialPerson",
                query: { lineId: this.$route.query.lineId,lineTypeId:this.$route.query.lineTypeId }
              });
            } else {
              this.$message.error(res.data.message);
              setTimeout(() => {
                this.btn_loading = false;
              }, 3000);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  }
};
</script>
