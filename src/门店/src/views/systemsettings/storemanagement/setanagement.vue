<template>
  <div id="box" class="view">
        <h4><span class="vercitals">| </span>员工信息</h4>
        <el-form size="small" :inline="true" ref="information" :rules="rules" :model="information" label-width="80px">
            <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="员工姓名" prop="Name">
                        <el-input v-model="information.Name" class="form-inline-input"></el-input>              
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="性别" prop="Sex">
                        <el-radio-group v-model="information.Sex" >
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="联系电话" prop='TelPhone'>
                        <el-input v-model.number="information.TelPhone" class="form-inline-input"></el-input>
                    </el-form-item> 
                  </el-col>
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="职位" prop="PostName" >
                        <el-input v-model="information.PostName" class="form-inline-input"></el-input>              
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                      <el-form-item label="信用额度" prop="CreditId"> 
                              <el-select v-model="information.CreditId" class="form-inline-input">
                                    <el-option v-for="item in LevelList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                              </el-select>
                        </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                      <el-form-item label="入职日期" prop="JoinDate">
                        <el-date-picker :editable="false"  size="small" v-model="information.JoinDate" type="date" placeholder="选择日期"  class="form-inline-input"> </el-date-picker>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                      <el-form-item label="QQ">
                        <el-input :maxlength="15" v-model.number="information.QQ" class="form-inline-input"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="Email">
                        <el-input v-model="information.Email" class="form-inline-input"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="身份证号">
                        <el-input :maxlength="18" v-model="information.IDCard"  class="form-inline-input"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" style="height:50px">
                    <el-form-item label="身份地址">
                        <el-input v-model="information.CardAddress"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" >
                  
              </el-row>
              <!-- <h4><span class="vercitals">| </span>银行信息</h4>
              <el-row style="margin-bottom:20px">
                  <el-button type="primary" @click="addBankInfo" icon='el-icon-plus' size='small'>添加行</el-button>
              </el-row>
              <el-row>
                  <el-table :data="information.BankList" border style="width: 100%">
                      <el-table-column align="center" prop="IsDefault" label="默认" width="100px">
                            <template slot-scope="scope">
                                 scope.row.ifDefault" @change="setIsDefaultAddress(scope.row) 
                                <el-checkbox v-model="IsDefault">&nbsp;</el-checkbox>
                            </template>
                      </el-table-column>
                      <el-table-column align="center" prop="BankName" label="银行名称">
                           <template slot-scope="scope">
                                <el-input size="small" v-model="BankName"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column align="center" prop="CardNO" label="银行账号">
                           <template slot-scope="scope">
                                <el-input size="small" v-model="CardNO"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column align="center" prop="Cardholder" label="开户名">
                           <template slot-scope="scope">
                                <el-input size="small" v-model="Cardholder"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column align="center" prop="Bank" label="开户行" >
                           <template slot-scope="scope">
                                <el-input size="small" v-model="Bank"></el-input>
                            </template>
                      </el-table-column>
                  </el-table>
              </el-row> -->
              <h4><span class="vercitals">| </span>登录账号</h4>
              <el-row :gutter="20" type="flex">
                  <el-col :span="8" style="height:60px">
                       <el-form-item label="角色" prop='Roles'>
                            <el-select v-model="information.Roles" class="form-inline-input">
                                <el-option v-for="item in RolesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                  </el-col>
                   <el-col :span="8" style="height:60px">
                       <el-form-item label="员工账号" prop="Account">
                        <el-input v-model="information.Account"  class="form-inline-input"></el-input>              
                    </el-form-item>
                   </el-col>
              </el-row>
              <el-row :gutter="20" type="flex" style="height:60px">
                    <el-col :span="8" style="height:60px">
                        <el-form-item label="登录密码" prop="Password">
                        <el-input type="password" v-model="information.Password" class="form-inline-input"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8" style="height:60px">
                        <el-form-item label="确认密码" prop="ConfirmPassword">
                        <el-input type="password" v-model="information.ConfirmPassword" class="form-inline-input"></el-input>
                    </el-form-item>
                    </el-col>
              </el-row>
        </el-form>
              <h4><span class="vercitals">| </span>备注</h4>
              <el-form ref="form" :model="information" label-width="80px">
                <el-row  :gutter="20">
                        <el-form-item label="备注" style="width:500px">
                            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="information.Desc"></el-input>
                        </el-form-item>
                </el-row>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="submintInfo">保存</el-button>
                    <el-button size="small" type="info" @click="cancel()" >取消</el-button>
                </el-form-item>  
              </el-form>   
  </div>
</template>
<script>
  export default {
    data() {
        let EmailCheck=(rule,value,callback)=>{
             var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
             if(!value){
                callback(new Error('请输入邮箱'));
             }else 
             if(!reg.test(value)){
                callback(new Error('请输入正确的邮箱'));
             }else{
                callback();
             }
         }
         let TelPhoneCheck=(rule,value,callback)=>{
                  if(!value){
                  callback(new Error('请输入手机号码'))
                  }else if(!(/^1[0-9][0-9]\d{8}$/.test(value))){
                  callback(new Error('您的手机号码有误'))
                  }else{
                  callback();
                  }
            }
          let AccountCheck=(rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入员工账号'))
                  }else if(!(/^(?=.*[0-9,a-z,A-Z].*)[^\s]{6,20}$/.test(value))){
                callback(new Error('中英文字母或数字组合，不区分大小写，长度：6-20个字符'))
              }else{
                callback();
              }
         }
         let PasswordCheck=(rule,value,callback)=>{
              if(!value){
                callback(new Error('请输入登录密码'))
              }else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value))){
                callback(new Error('6-16位，不能包含空格；且必需包含字母以及数字至少各有一位'))
              }else{
                callback();
              }
         }
         let ConfirmPassword=(rule,value,callback) =>{
             if(value == ''){
                 callback(new Error('请再次输入密码'));
             }else if(value !== this.information.Password){
                 callback(new Error('两次输入密码不一致!'));
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
        information: {
          Name: '',    //必填 员工姓名
          Sex: '1',
          QQ: '',
          TelPhone: '',
          Email: '',   //邮箱 ，必填
          JoinDate: '',   //日期必填
          IDCard: '',
          CardAddress: '',
          Account: '',  //员工账号 必填
          Desc: '',
          PostName: '',
          Password: '',   //登录密码 必填
          ConfirmPassword: '',    //必填 确认密码
          Status: 1,
          IfMain: false,
          CreditId:'',//信用额度 
          Roles: [], //对应的角色id集合
          BankList:{}
        },
        LevelList:[],
        RolesList:[{}], //获取角色
        rules:{
          Name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
          Sex:[{required: true,message: '请选择性别', trigger: 'change'},],
          QQ:[{required: true,validator:qqCheck, trigger: 'blur'}],
          TelPhone:[{required: true,trigger: 'blur' , validator:TelPhoneCheck}],
          IDCard:[{required: true,validator:CredentialNo, trigger: 'blur'}],
          CardAddress:[{required: true,message: '请输入身份证地址', trigger: 'blur'}],
          Email:[{required:true,trigger: 'blur' , validator:EmailCheck}],
          Account:[{ required: true, validator:AccountCheck, trigger: 'blur' }],
          PostName:[{required: true, message: '请输入员工职位', trigger: 'blur',}],//职位
          ConfirmPassword:[{ required: true,validator:ConfirmPassword, trigger: 'blur' }],
          CreditId:[{type:'number',required: true,message: '请选择信用额度', trigger: 'change'}],
          Password: [{required: true,validator:PasswordCheck, trigger: 'blur'}],   
          Roles:[{type:'number',required:true,message:'请选择角色',trigger: 'change'}]      
        }
      }    
    },
    mounted () {
        // 获取信用额度
        this.shopHttp.get("Member/GetCreditLevelList").then(res =>{
            if(res.data.isSuccess == true){
                this.LevelList = res.data.objects;
            }
        }).catch( e=> {
            console.log(e)
        })
        //获取角色
        this.shopHttp.get("ShopRoles/GetShopRolesList?Name=").then(res =>{
            this.RolesList = res.data;
            if(res.data.isSuccess == true){
                
            }
        }).catch( e=> {
            console.log(e)
        })
    },
    methods: {
        addBankInfo(){
            this.information.BankList.push({
                IsDefault: '',
                BankName: '',
                CardNO: '',
                Cardholder: '',
                Bank: '',
            })
        },
        submintInfo(){
            this.$refs['information'].validate((valid) =>{
                if(valid){
                    let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                    if(this.information.QQ && isNaN(Number(this.information.QQ))){
                        this.$message.error('QQ必须为数字')
                    }else if(this.information.Email && !reg.test(this.information.Email)){
                        this.$message.error('请输入正确的Email')
                    }else if(this.information.IDCard && !(/(^\d{15$}$)|(^\d{18}$|(^\d{17}(\d|X|x)))/.test(this.information.IDCard))){
                        this.$message.error('请输入正确的身份证号码')
                    }
                    else{
                        this.shopHttp.post("Member/CreateMember",this.information).then(res =>{
                        if(res.data.isSuccess == true){
                                this.$message({
                                    type: 'success',
                                    message: "成功：创建员工账号成功！"
                                        });
                                this.$router.push('/systemsettings/staffmanagement')
                            }
                        }).catch(e => {
                            console.log(e)
                    }) 
                }
                }else{
                    return false;
                }
            })
            },
            cancel(){
                this.$router.push('/systemsettings/staffmanagement')
            },
         },
  }
</script>
<style scoped lang=scss>
   @import "../../../style/common.scss";
   .form-inline-input {
        width: 200px;
    }
    #el-input__inner{
        width: 300px;
    }
</style>


