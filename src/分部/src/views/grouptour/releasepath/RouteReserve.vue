<template>
  <div class="view" v-loading.fullscreen.lock="fullscreenLoading">
    <el-header>
      <el-steps :active="4" align-center class="ui-step">
        <el-step title="线路信息" description=""></el-step>
        <el-step title="行程信息" description=""></el-step>
        <el-step title="小项目" description=""></el-step>
        <el-step title="预订说明" description=""></el-step>
        <el-step title="上传附件" description=""></el-step>
        <el-step title="特殊人群限制" description=""></el-step>
        <el-step title="退款说明"></el-step>
      </el-steps>
    </el-header>
    <el-form label-width="100px" class="demo-ruleForm"  style='margin-top:40px;'
    >
      <template>
        <el-form-item :label="item.bookingName" label-width="15%" prop="bookingDesc" v-for="(item,index) in BookingDescList"
             :key="index">
          <editor :id="'editor_id-'+index" height="300px" width="700px" :content="item.bookingDesc" uploadJson="/Home/UploadImage"
                  pluginsPath="/static/kindeditor/plugins/"
                  :allowFileManager="false"
                  :loadStyleMode="false"
                  @on-content-change="onContentChange">
          </editor>
        </el-form-item>
      </template>
    </el-form>
    <el-footer>
      <el-button type="primary" @click="saveRoute" class="margin_top" :loading = 'btn_loading' size="small">保存，下一步</el-button>
    </el-footer>
  </div>
</template>
<style lang="scss" scoped>
  .ql-editor p {
    height: 200px;
  }
  .el-button{
    margin-left:35%;
  }
</style>
<script>
  export default {
    data() {
      return {
        btn_loading: false,
        fullscreenLoading:false,
        lineId:this.$route.query.lineId,
        BookingDescList:[],
      };
    },
    methods:{
      onContentChange(data){
        let str = 'editor_id-';
        let index = data.id.replace(str,'')
        this.BookingDescList[index].bookingDesc = data.value;
      },
      getBookingDescList(){
        // this.fullscreenLoading = true;
        this.groupHttp.post('/GroupLine/GetBookingDescList',{LineId:this.$route.query.lineId}).then(res=>{
          if(res.data.isSuccess == true){
            this.fullscreenLoading = false;
            this.BookingDescList = res.data.bookingDescList
          }else{
            this.fullscreenLoading = false;
            this.$message.error(res.data.message)
          }
        }).catch(e => {

        })
      },
      saveRoute(){
        var boo = true;
        this.BookingDescList.forEach(item =>{
            var content = item.bookingDesc.replace(/^\s*|\s*$/g,'');
            if(!content){
              boo = false;
            }
        })
        if(boo == false){
          this.$message({
              type:'error',
              message:'您的信息还没有填完整'
            })
          return;
        }
        this.btn_loading = true;
        this.groupHttp.post('/GroupLine/SaveBookingDesc',{LineId:this.lineId,BookingDescList:this.BookingDescList}).then(res=>{
          if(res.data.isSuccess == true){
            this.$message({
              type:'success',
              message:'保存成功'
            })
            // setTimeout(()=>{
            //   var url = location.href.substring(0,location.href.indexOf('grouptour'));
            //   location.replace(url + 'grouptour/FileUpload?lineId='+this.lineId);
            // },300)
            this.$router.push({
              path: "/grouptour/FileUpload",
              query: { lineId: this.$route.query.lineId,lineTypeId: this.$route.query.lineTypeId }
            });
          }else{
            this.$message.error(res.data.message)
          }
        }).catch(e=>{

        })
      }
    },
    mounted() {
      this.getBookingDescList();
    }


  }
</script>
