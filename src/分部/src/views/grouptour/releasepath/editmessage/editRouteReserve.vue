<template>
  <div class="view" v-loading.fullscreen.lock="fullscreenLoading">
    <el-form label-width="100px" class="demo-ruleForm"  style='margin-top:40px;'>
      <template>
        <el-form-item :label="item.bookingName" label-width="15%" v-for="(item,index) in BookingDescList"
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
      <el-button type="primary" @click="saveRoute" class="margin_top" :loading = 'btn_loading' size="small">保存</el-button>
      <el-button @click="goBack" size="small">返回</el-button>
    </el-footer>
  </div>
</template>
<style lang="scss" scoped>
.ql-editor p {
  height: 200px;
}
.el-footer {
  margin-left: 14%;
}
</style>
<script>
  export default {
    props:['status'],
    data() {
      return {
        btn_loading: false,
        fullscreenLoading:false,
        lineId:this.$route.query.lineId,
        BookingDescList:[]
      };
    },
    watch:{
      'status':function (val) {
        if (val == 'fourth'){
          this.getBookingDescList();
        }
      }
    },
    methods:{
      goBack() {
        this.$router.push({
          path: '/grouptour/RouteTable'
        })
      },
      onContentChange(data){
        let str = 'editor_id-';
        let index = data.id.replace(str,'')
        this.BookingDescList[index].bookingDesc = data.value;
      },
      getBookingDescList(){
        this.fullscreenLoading = true
        this.groupHttp.post('/GroupLine/GetBookingDescList',{LineId:this.$route.query.lineId}).then(res=>{
          if(res.data.isSuccess == true){
            this.fullscreenLoading = false
            this.BookingDescList = res.data.bookingDescList
          }else{
            this.fullscreenLoading = false
            this.$message.error(res.data.message)
          }
        }).catch(e => {

        })
      },
      saveRoute(){
//        var boo = true;
//        this.BookingDescList.forEach(item =>{
//            if(item.bookingDesc == ''){
//              boo = false;
//            }
//        })
//        if(boo == false){
//          this.$alert('您的信息还没有填完整', '温馨提示', {
//            confirmButtonText: '确定',
//            callback: action => {
//            }
//          });
//          return;
//        }
        this.btn_loading = true;
        this.groupHttp.post('/GroupLine/SaveBookingDesc',{LineId:this.lineId,BookingDescList:this.BookingDescList}).then(res=>{
          if(res.data.isSuccess == true){
            this.btn_loading = false;
            this.$message({
              type:'success',
              message:'保存成功'
            })
          }else{
            this.$message.error(res.data.message)
            setTimeout(()=>{
              this.btn_loading = false;
            },3000)
          }
        }).catch(e=>{

        })
      }
    },mounted:function(){
       this.getBookingDescList();
    }

  }
</script>
