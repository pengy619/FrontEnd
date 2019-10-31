<template>
  <div class="view">
    <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <h4><span class="vercitals">| </span>修改密码</h4>
      <el-form-item label="登录账号" prop="Account">
        <el-input v-model="ruleForm.Account" class="form-inline-input"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="MobilePhone">
        <el-input v-model="ruleForm.MobilePhone" class="form-inline-input"></el-input>
        <el-button class="margin" v-show="timerSecond<=0" type="primary" :loading="codeLoading" @click="getCode">获取验证码</el-button>
        <el-button size="small" type="info" v-show="timerSecond>0" class="count">重新发送（{{timerSecond}}）</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="Code">
        <el-input v-model="ruleForm.Code" class="form-inline-input"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="Password">
        <el-input type="password" v-model="ruleForm.Password" class="form-inline-input"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="ConfirmPassword">
        <el-input type="password" v-model="ruleForm.ConfirmPassword" class="form-inline-input"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">确认</el-button>
        <el-button size="small" type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      let TelPhoneCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号码'))
        } else if (!(/^1[0-9][0-9]\d{8}$/.test(value))) {
          callback(new Error('您的手机号码有误'))
        } else {
          callback();
        }
      }
      let PasswordCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入登录密码'))
        } else if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value))) {
          callback(new Error('6-16位，不能包含空格；且必需包含字母以及数字至少各有一位'))
        } else {
          callback();
        }
      }
      let ConfirmPassword = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.Password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        codeLoading: false, //发送验证码loading
        submitLoading: false,//提交表单loading
        ruleForm: {
          Account: '',
          MobilePhone: '',
          Code: '',
          Password: '',
          ConfirmPassword: '',
        },
        timer: null,
        timerSecond: 0,
        rules: {
          Account: [{
            required: true,
            message: "请输入账号",
            trigger: 'blur'
          }],
          MobilePhone: [{
            required: true,
            validator: TelPhoneCheck,
            trigger: 'blur'
          }],
          Code: [{
            required: true,
            message: "请输入验证码",
            trigger: 'blur'
          }],
          Password: [{
            required: true,
            validator: PasswordCheck,
            trigger: 'blur'
          }],
          ConfirmPassword: [{
            required: true,
            validator: ConfirmPassword,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      getCode() { //获取验证码
        this.codeLoading = true;
        //----防止刷新页面重置倒计时
        var storageSeconds = localStorage.getItem('resetPwdSeconds'); //先取存储里上次发送过没
        var surplusSeconds = (new Date()).getTime() - storageSeconds;//有的话取间隔秒数
        if (surplusSeconds < 120000) {
          this.timerSecond = 120 - Math.round(surplusSeconds / 1000);
          this.timer = setInterval(() => {
            if (this.timerSecond > 0) {
              this.timerSecond--;
              if (this.timerSecond <= 0) {
                clearInterval(this.timer);
                this.timer = null;
              }
            }
          }, 1000)
          this.codeLoading = false;
          return false;
        }
        //---请求短信接口
        this.$refs.ruleForm.validateField('MobilePhone', (errorMsg) => {
          if (errorMsg == '') {
            this.codeLoading = true;
            this.shopHttp.post("/ShopAccount/GetVerifyCode", { 'PhoneNumber': this.ruleForm.MobilePhone })
              .then((res) => {
                this.codeLoading = false;
                if (res.data.isSuccess == true) {  //发送成功，执行倒数计时器
                  if (!this.timer) {
                    localStorage.setItem('resetPwdSeconds', (new Date()).getTime())
                    this.timerSecond = 120;//倒计时120秒
                    this.timer = setInterval(() => {
                      if (this.timerSecond > 0) {
                        this.timerSecond--;
                        if (this.timerSecond <= 0) {
                          clearInterval(this.timer);
                          this.timer = null;
                        }
                      }
                    }, 1000)
                  }
                }
                else
                  this.$message.error(res.data.message)
              })
          }
          else {
            this.$message.error(errorMsg);
          }
        });
      },
      //提交
      onSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            this.shopHttp.post('/ShopAccount/ResetPwd', this.ruleForm)
              .then(res => {
                this.submitLoading = false;
                if (res.data.isSuccess == true) {
                  this.$message.success('修改密码成功');
                  this.$router.push({ path: '/login' })
                } else {//错误信息
                  if (res.data.message.indexOf(",") >= 0) {
                    let error = res.data.message.split(",");
                    let firstError = error.length > 0 ? error[0] : "修改密码失败!";
                    this.$message.error(firstError);
                  } else
                    this.$message.error(res.data.message);
                }
              })
          } else {
            this.$message.error(errorMsg);
          }
        })
      },
      //取消
      cancel() {
        this.$router.push({ path: '/login' })
      },
    }
  }
</script>
<style>
  @import '../../style/common.scss';

  .form-inline-input {
    width: 200px;
  }

  .margin {
    margin: 5px;
  }

  .view {
    padding: 10px 20% 0px 20%;
  }
</style>

