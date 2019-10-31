<template>
  <div>
    <div class="bg">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title"></h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号" required @keyup.native="EnterShow($event)">
        <template slot="prepend"><i class="iconfont icon-huiyuanzhongxin"></i></template>
      </el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码" required @keyup.native="EnterShow($event)">
        <template slot="prepend"><i class="iconfont icon-mima"></i></template>
      </el-input>
    </el-form-item>
    <el-form-item >
      <el-checkbox v-model="checked">记住用户名</el-checkbox>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:47%;" @click="submit" :loading="logining">登录</el-button>
      <el-button type="primary" style="width:47%;" @click="register">注册</el-button>
      <el-button type="text" @click="password">忘记密码?</el-button>
    </el-form-item>
    </el-form>
    </div>
    <div class="bg-bg"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      rules2: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      checked: false
    };
  },
 created() {
   this.ruleForm2.account = localStorage.getItem("account") || '';
 },
  methods: {
    submit(ev) {
      if (this.ruleForm2.account == "" || this.ruleForm2.checkPass == "") {
        this.$message("用户名或密码不能为空！");
      } else {
        this.postLogin();
      }
    },
    register(){
      this.$router.push({path:'/register'})
    },
    password(){
      this.$router.push({path:'/password'})
    },
    EnterShow: function(ev) {
      if (ev.keyCode == 13) {
        if (this.ruleForm2.account != "" && this.ruleForm2.checkPass != "") {
          this.postLogin();
        } else {
          this.$message("用户名或密码不能为空！");
        }
      }
    },
    postLogin() {
      this.logining = true;
      this.shopHttp
        .post("/account/authorize", {
          username: this.ruleForm2.account,
          password: this.ruleForm2.checkPass,
          grant_type: "password"
        })
        .then(res => {
          if (res.status == 200) {
            if(this.checked == true){
                 localStorage.setItem("account" , this.ruleForm2.account)
            }else {
                  localStorage.setItem("account" , '')
            }
            localStorage.setItem(
              "token",
              res.data.token_type + " " + res.data.access_token
            );
            this.getCompanyType();
            this.shopHttp
              .post("/Menu/AllMenu")
              .then(res => {
                var obj = JSON.stringify(res.data);
                localStorage.setItem("menus", obj);
                localStorage.setItem("username", this.ruleForm2.account);
                setTimeout(() => {
                  this.$router.push({
                    path: "/frame"
                  });
                }, 500);
              })
              .catch(e => {
                console.log(e);
              });
          }
        })
        .catch(error => {
          this.logining = false;
          if (error.response.data.error_uri != '' && error.response.data.error_uri != '0') {
            this.$confirm(error.response.data.error_description, '提示', {
              cancelButtonText: '取消',
              confirmButtonText: '重新提交审核',
              type: 'warning'
            }).then(() => {
              var errorType = error.response.data.error_description.indexOf('审核已被拒绝') >= 0;
              if (errorType) {
                this.$router.push({ name: 'repeatRegister', query: { disCompanyInfoId: error.response.data.error_uri } });
              }              
             
            })
          }
          
        });
    },
    //获取公司类型
    getCompanyType(){
      this.shopHttp
          .get("/Property/GetProperty")
          .then(res => {
            let companyType=res.data.objects[0].companyType;
            localStorage.setItem("companyType", companyType);
          })
          .catch(e => {
            console.log(e);
          });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  //margin: 180px auto;
  width: 394px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -160px;
  margin-top: -197px;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    width: 321px;
    height: 50px;
    // color: #505458;
    background: url('../assets/login_tittle.jpg') no-repeat;
  }
  .remember {
    width: 45%;
    margin: 0px 0px 30px 0px;
  }
  .status {
    width: 100%;
    .forget {
      width: 45%;
      float: right;
      font-size: 16px;
    }
  }
}
.bg{
  //background:url('.././assets/login-bg.jpg');
  position: relative;
  z-index: 100;
}
.bg-bg{
  background:url('.././assets/login-bg.jpg');
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  z-index: 1;
}
</style>
