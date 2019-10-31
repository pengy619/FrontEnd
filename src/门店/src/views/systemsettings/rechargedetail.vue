<template>
    <div class="view">
        <el-form :model="rechargedetailform"  label-width="120px">
          <el-form-item label="充值账号：" >
              <span>{{rechargedetailform.createByName}}</span>
          </el-form-item>
           <el-form-item label="单位名称：" >
              <span>{{rechargedetailform.unitName}}</span>
          </el-form-item>
           <el-form-item label="充值金额："  >
              <span>{{rechargedetailform.amount}}</span>
          </el-form-item>
           <el-form-item label="充值方式：" >
              <span>{{rechargedetailform.methodText}}</span>
          </el-form-item>
           <el-form-item label="选择银行：" >
              <span>{{rechargedetailform.bankName}}</span>
          </el-form-item>
          <el-form-item label="银行账号：" >
              <span>{{rechargedetailform.bankAccountNo != null ? rechargedetailform.bankAccountNo.replace(/^(\d{4})\d+(\d{4})$/,"$1****$2"):""}}</span>
          </el-form-item>
          <el-form-item label="四联单号：" >
              <span>{{rechargedetailform.documentNo}}</span>
          </el-form-item>
           <el-form-item label="附件：" >
              <el-button  type="primary" icon="el-icon-picture" @click="checkFj">点击查看附件</el-button>
              <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
                    <img width="100%" :src="dialogImageUrl" alt="">
               </el-dialog>
          </el-form-item>
           <el-form-item label="充值备注："  >
              <el-input type="textarea" style="width:300px" v-model="rechargedetailform.executeDesc"></el-input>
          </el-form-item>
          <el-form-item label="">
              <!-- <el-button type="primary"  style="margin-left:150px" @click="savedetailupdate">提交</el-button> -->
              <el-button   size="small" @click="canneldetail">返回</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return{
            dialogVisible:false,
            dialogImageUrl:"",
             rechargedetailform:{
                 createByName:"",//充值账号
                 bankAccountNo:"",
                 amount:"",
                 methodText:"",
                 bankName:"",
                 attachment:"",
                 executeDesc:"",
                 documentNo:""
             }
        }
    },
    mounted:function(){
      this.getrechargeDetail();
    },
    methods:{
        getrechargeDetail(){
         // console.log(this.$route.params);
          this.rechargedetailform = this.$route.params;
        },
        savedetailupdate(){
            //this.$router.push({path:'/systemsettings/rechargelist'});
        },
        canneldetail(){
            this.$router.go(-1);
        },
        checkFj(){//查看附件
            if(this.rechargedetailform.attachment != null && this.rechargedetailform.attachment != ""){
                this.dialogImageUrl = this.rechargedetailform.attachment;
                this.dialogVisible = true;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
