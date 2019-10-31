<template>
    <div class="view">
          <el-form>
               <el-form-item label="姓名" label-width='100px'>
                    <span>{{Name}}</span>
               </el-form-item>
               <el-form-item label="英文名" label-width='100px'>
                    <span>{{EnglishName}}</span>
               </el-form-item>
               <el-form-item label="性别" label-width='100px'>
                    <span>{{SexDesc}}</span>
               </el-form-item>
                <el-form-item label="婚姻状况" label-width='100px'>
                    <span>{{MaritalStatusDesc}}</span>
               </el-form-item>
                <el-form-item label="人群" label-width='100px'>
                    <span>{{AgeGroupDesc}}</span>
               </el-form-item>
                <el-form-item label="出生日期" label-width='100px'>
                    <span>{{Birthdate}}</span>
               </el-form-item>
               <el-row :gutter="24">
                   <el-col :span="10">
                       <el-form-item label="身份证号" label-width='100px'>
                            <span>{{CredentialNo}}</span>
                        </el-form-item>
                   </el-col>
                    <el-col :span="10">
                       <el-form-item label="有效期" label-width='100px'>
                            <span>{{ExpireDate}}</span>
                        </el-form-item>
                   </el-col>
               </el-row>
               <el-row :gutter="24">
                   <el-col :span="10">
                       <el-form-item label="护照号" label-width='100px'>
                            <span>{{PassPortNo}}</span>
                        </el-form-item>
                   </el-col>
                    <el-col :span="10">
                       <el-form-item label="有效期" label-width='100px'>
                            <span>{{PassPortExpireDate}}</span>
                        </el-form-item>
                   </el-col>
               </el-row>
               <el-row :gutter="24">
                   <el-col :span="10">
                       <el-form-item label="港澳台通行证" label-width='100px'>
                            <span>{{HMCredentialNo}}</span>
                        </el-form-item>
                   </el-col>
                    <el-col :span="10">
                       <el-form-item label="有效期" label-width='100px'>
                            <span>{{HMCredentialExpireDate}}</span>
                        </el-form-item>
                   </el-col>
               </el-row>
                <el-form-item label="电话号码" label-width='100px'>
                    <span>{{Mobile}}</span>
               </el-form-item>
                <el-form-item label="出生地址" label-width='100px'>
                    <span>{{BirthPlace}}</span>
               </el-form-item>
                <el-form-item label="通信地址" label-width='100px'>
                    <span>{{Address}}</span>
               </el-form-item>
          </el-form>
          <el-row class="text-center">
                <el-button type="" @click="goback" size="small">返回</el-button>
          </el-row>
    </div>
</template>

<script>
export default {
     data(){
         return{
            id:this.$route.query.val,
            Name:this.$route.query.val.name,
            EnglishName:this.$route.query.val.englishName,
            SexDesc:this.$route.query.val.sexDesc,
            MaritalStatusDesc:this.$route.query.val.maritalStatusDesc,
            AgeGroupDesc:this.$route.query.val.ageGroupDesc,
            Birthdate:this.$route.query.val.birthdate,
            CredentialNo:this.$route.query.val.credentialNo,
            ExpireDate:this.$route.query.val.expireDate,
            PassPortNo:this.$route.query.val.passPortNo,
            PassPortExpireDate:this.$route.query.val.passPortExpireDate,
            HMCredentialNo:this.$route.query.val.hmCredentialNo,
            HMCredentialExpireDate:this.$route.query.val.hmCredentialExpireDate,
            Mobile:this.$route.query.val.mobile,
            BirthPlace:this.$route.query.val.birthPlace,
            Address:this.$route.query.val.address,
         }
     },mounted:function(){

     },methods:{
         goback(){
             this.$router.go(-1);
         }
     }
}
</script>

<style lang="scss" scoped>
.el-form-item {
        margin-bottom: 12px;
    }
</style>
