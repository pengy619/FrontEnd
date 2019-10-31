<template>
    <div class="view">
        <h4>线路信息</h4>
        <el-form>
            <el-form-item label="信用金额" label-width="80px">
            <el-select style="margin-left:10px" v-model="creditline" size="small" class="inputs" placeholder="请选择金额">
                <el-option v-for="item in CreditLineObj" :key="item.key" :value="item.key" :label="item.value"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item style="margin-left:82px">
                <el-button size="small" type="primary" @click="setCreditLine">保存</el-button>
                <el-button size="small" type="info" @click="channelLine">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data(){
      return{
          DisSettleClientId:1,
          CreditLineObj:[{}],
          creditline:""
      }
  },methods:{
      getDisSettleClientID(){
         // console.log(this.$route.params.DisSettleClientId);
        //   if(this.$route.params.DisSettleClientId==undefined){
        //         this.DisSettleClientId = 1;
        //   }else{
        //         this.DisSettleClientId = this.$route.params.DisSettleClientId;
        //   }
           if(this.$route.params.DisSettleClientId==undefined){
               //如果是直接刷新页面，那就拿历史数据
                let sessionStoranges = window.sessionStorage.getItem('SettleClientId');
                this.DisSettleClientId = sessionStoranges;
          }else{
               this.$store.commit("setgetClientID",this.$route.params.DisSettleClientId);
               this.DisSettleClientId = this.$route.params.DisSettleClientId;
          } 
      },
       getCreditList(){
           var _this = this;
           _this.shopHttp.get('/SettleClient/GetCreditLevelList').then(res=>{
              // console.log(res);
               if(res.data.isSuccess){
                _this.getHistoryCredit();
                _this.CreditLineObj = res.data.objects;
               }
           }).catch(err=>{
               console.log(err);
           })
       },
       setCreditLine(){
           var _this = this;
           _this.shopHttp.get("/SettleClient/UpdateSettleClientCreditLimit?DisSettleClientId="+_this.DisSettleClientId+"&DisLevelId="+_this.creditline).then(res=>{
              // console.log(res);
               if(res.data.isSuccess){
                  _this.$message("保存成功");
                   this.$router.go(-1);
               }else{
                   _this.$message("保存失败");
               }
           }).catch(err=>{
               console.log(err);
               _this.$message("保存失败");
           })
       },
       getHistoryCredit(){
        var _this = this;  
        _this.shopHttp.get('/SettleClient/GetSettleClientCreditLimitId?DisSettleClientId='+_this.DisSettleClientId).then(res=>{
            //console.log(res);
            if(res.data.isSuccess){
               for(let i=0;i<_this.CreditLineObj.length;i++){
                   if(_this.CreditLineObj[i].key == res.data.object){
                      _this.creditline = res.data.object;
                      return;
                   }else{
                       _this.creditline="";
                   }
               }
               // console.log("获取到了："+_this.creditline);
            }
            // _this.creditline = res.data.object;
            // _this.creditline = 2061;
        }).catch(err=>{
            console.log(err);
        })
       },
       nextLine(){
           //下一步
       },
       channelLine(){
           //取消
           this.$router.go(-1);
       }
  },mounted:function(){
     this.getCreditList();
     
     this.getDisSettleClientID();
  }
}
</script>

<style lang="scss" scoped>
</style>
