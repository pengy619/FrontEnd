<template>
<div id="box" class="view">
        <h4><span class="vercitals">| </span>员工信息</h4>
        <el-form size="small" :inline="true" ref="information" :rules="rules" :model="information" label-width="80px">
            <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="员工姓名" prop="name">
                        <el-input v-model="information.name" class="form-inline-input"></el-input>              
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="information.sex" >
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="联系电话" prop='telPhone'>
                        <el-input v-model.number="information.telPhone" class="form-inline-input"></el-input>
                    </el-form-item> 
                  </el-col>
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="职位" prop="postName" >
                        <el-input v-model="information.postName" class="form-inline-input"></el-input>              
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                      <el-form-item label="信用额度" prop="creditId"> 
                              <el-select v-model="information.creditId" class="form-inline-input">
                                    <el-option v-for="item in LevelList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                      <el-form-item label="入职日期" prop="joinDate">
                        <el-date-picker :editable="false"  size="small" v-model="information.joinDate" type="date" placeholder="选择日期"  class="form-inline-input"> </el-date-picker>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                      <el-form-item label="QQ" prop='QQ'>
                        <el-input :maxlength="15" v-model.number="information.qq" class="form-inline-input"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="Email" prop='email'>
                        <el-input v-model="information.email" class="form-inline-input"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="身份证号" prop='idCard'>
                        <el-input :maxlength="18" v-model="information.idCard"  class="form-inline-input"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="身份地址" prop='cardAddress'>
                        <el-input v-model="information.cardAddress"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  
              </el-row>
              <h4><span class="vercitals">| </span>登录账号</h4>
              <el-row :gutter="20" type="flex">
                  <el-col :span="8" style="height:60px">
                       <el-form-item label="角色" prop='roles'>
                            <el-select v-model="information.roles" class="form-inline-input">
                                <el-option v-for="item in RolesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                  </el-col>
                   <el-col :span="8" style="height:60px">
                       <el-form-item label="员工账号" prop="account">
                        <el-input  :disabled="true"  v-model="information.account"  class="form-inline-input"></el-input>              
                    </el-form-item>
                   </el-col>
              </el-row>
        </el-form>
              <h4><span class="vercitals">| </span>备注</h4>
              <el-form ref="form" :model="information" label-width="80px">
                <el-row  :gutter="20">
                        <el-form-item label="备注" style="width:500px">
                            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="information.desc"></el-input>
                        </el-form-item>
                </el-row>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="save">保存</el-button>
              <el-button size="small" type="info" @click="chance" >取消</el-button>
                </el-form-item>  
              </el-form>   
  </div>
</template>
<script>
  export default {
    data() {
        let TelPhoneCheck=(rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入联系电话'))
              }else if(!(/^1[0-9][0-9]\d{8}$/.test(value))){
                callback(new Error('您的电话号码有误'))
              }else{
                callback();
              }
         }
         let EmailCheck=(rule,value,callback)=>{
                  var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                  if(!value){
                  callback(new Error('请输入邮箱'));
                  }else if(!reg.test(value)){
                  callback(new Error('请输入正确的邮箱'));
                  }else{
                  callback();
                  }
            }
            let qqCheck=(rule,value,callback)=>{
                  if(!value){
                        callback(new Error('请输入QQ号码'))
                  }if (isNaN(Number(value))) {
                        callback(new Error('QQ号码必须为数字'));
                  } else{
                        callback();
                  }
            }
            let CredentialNo=(rule,value,callback)=>{
            if(!value){
                callback(new Error('请输入身份证号'))
              }else  if (!(/(^\d{15$}$)|(^\d{18}$|(^\d{17}(\d|X|x)))/.test(value))) {
                  callback(new Error('请输入正确的身份证号码'));
              }else{
                    callback();
              }
            }
      return {
          information:{},
              LevelList:[],
              RolesList:[],
              rolesObj:{},
              rules:{
                  name:[{ required: true,message:'请输入员工姓名',trigger: 'blur' }],
                  sex:[{ required: true,message:'请选择性别',trigger: 'blur' }],
                  postName:[{ required: true,message:'请输入员工职位',trigger: 'blur' }],
                  telPhone:[{ required: true, trigger: 'blur',validator:TelPhoneCheck}],
                  email:[{required:true,validator:EmailCheck,trigger:'blur'}],
                  qq:[{validator:qqCheck, required: true,trigger: 'blur' }],
                  idCard:[{ required: true,validator:CredentialNo,trigger: 'blur' }],
                  cardAddress:[{ required: true,message:'请输入身份地址',trigger: 'blur' }],
                  creditId:[{type:'number',required:true,message:'请选择信用额度',trigger:'change'}],
                  roles:[{type:'number',required:true,message:'请选择角色',trigger:'change'}]
              } 
          } 
      },
    created () {
        this.shopHttp.get("Member/GetCreditLevelList").then(res =>{
            if(res.data.isSuccess == true){
                this.LevelList = res.data.objects;
            }
        }).catch( e=> {
            console.log(e)
        });
        //获取角色
        this.shopHttp.get("ShopRoles/GetShopRolesList?Name=").then(res =>{
            this.RolesList = res.data;
        }).catch( e=> {
            console.log(e)
        })
    },
    mounted(){
         setTimeout(()=>{
             this.getList()
         },0)
    },
    methods: {
        //获取页面信息
        getList(){
           // console.log(this.$route.params.id)
            this.shopHttp.get("Member/GetShopSysAccountDto?ShopSysAccountId="+this.$route.params.id).then(res =>{
             if(res.data.isSuccess = true){ 
                 var obj=res.data;
                 obj.roles=parseInt(res.data.roles[0])
                 this.information = obj;
             }else{
                 this.$message({
                     type: 'info',
                    message: '加载失败：'+ res.data.message
                    })
                  }
                }).catch(e=>{ })
            },
            //保存
            save(){
                this.$refs['information'].validate((valid) =>{
                    if(valid){
                        this.information.password = 'a123456' //修改不能改密码，因此赋假值
                        this.shopHttp.post("Member/UpdateMember",this.information).then(res =>{
                        if(res.data.isSuccess == true){
                            this.$message({
                                type: 'success',
                                message: "成功：修改成功!"
                                    });
                            this.$router.push('/systemsettings/staffmanagement')
                        }else{
                            this.$message({
                                type: 'error',
                                message: "错误 ：" + res.data.message
                                    });
                                }
                            }).catch(e => {
                                console.log(e)
                                }) 
                    }else{
                        return false;
                    }
                })
                
            },
            chance(){
            this.$router.push('/systemsettings/staffmanagement')
            },
           },
  }
</script>
<style scoped lang=scss>
   @import "../../../style/common.scss";
   .form-inline-input {
        width: 200px
    }
</style>
