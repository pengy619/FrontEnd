<template>
  <div class="view">
    <div v-loading="pwdloading">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        class="demo-form-inline"
        v-if="isRegistPwd"
        label-width="120px"
        size="small">
        <el-form-item label="电话号码" prop="mobilePhone">
          <el-input
            type="text"
            v-model="form.mobilePhone"
            size="small"
            style="width:210px"
            disabled></el-input>
          <el-button
            type="primary"
            class="margin"
            v-show="timerSecond<=0"
            :loading="codeLoading"
            @click="getCode">获取验证码</el-button>
          <el-button
            size="small"
            type="info"
            v-show="timerSecond>0"
            class="count">重新发送（{{timerSecond}}）</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="Code">
          <el-input type="text" v-model="form.Code" size="small"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="PayPassword">
          <el-input type="password" v-model="form.PayPassword" size="small"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="AffirmPayPassword">
          <el-input type="password" v-model="form.AffirmPayPassword" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePwd('form')" size="small">确认</el-button>
          <el-button @click="cusback" size="small">返回</el-button>
        </el-form-item>
      </el-form>
      <el-form
        :model="setform"
        :rules="rules2"
        ref="setform"
        class="demo-form-inline"
        v-else
        label-width="120px"
        size="small"
      >
        <el-form-item label="密码" prop="onePayPassword">
          <el-input type="password" v-model="setform.onePayPassword" size="small"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="oneRepeatPayPassword">
          <el-input type="password" v-model="setform.oneRepeatPayPassword" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setPwd('setform')" size="small">确认</el-button>
          <el-button @click="cusback" size="small">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    let PhoneFormatter = (rule, value, callback) => {
      if (!value) callback(new Error("请输入手机号"));
      else if (!/^1[3|4|5|7|8]\d{9}$/.test(value))
        callback(new Error("手机号码格式错误!"));
      else callback();
    };
    let PasswordCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新的支付密码"));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
        callback(
          new Error("6-16位，不能包含空格；且必需包含字母以及数字至少各有一位")
        );
      } else {
        callback();
      }
    };
    let ConfirmPassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.form.PayPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let validateOldPwd = (rule,value,callback)=>{
       if(value == ''){
           callback(new Error('请输入旧密码'));
       }else{
           var _this = this;
          _this.shopHttp.post('/Finance/VerifyPayPassword',{
              OldPayPassword:_this.form.OldPayPassword,
              PayPassword:_this.form.OldPayPassword,
              AffirmPayPassword:_this.form.OldPayPassword
          }).then(res=>{
           // console.log(res);
            if(res.data.isSuccess){
               callback();
            }else{
               //callback(new Error(res.data.message));
               callback(new Error('旧密码输入错误'));
            }
          }).catch(err=>{
            console.log(err);
            callback(new Error('密码错误'));
          })
       }
    }
    let onePasswordCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新的支付密码"));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
        callback(
          new Error("6-16位，不能包含空格；且必需包含字母以及数字至少各有一位")
        );
      } else {
        callback();
      }
    };
    let oneConfirmPassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.setform.onePayPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      timerSecond: 0,
      codeLoading: false,
      form: {
        mobilePhone: "",
        Code: "",
        PayPassword: "",
        AffirmPayPassword: ""
      },
      setform: {
        onePayPassword: "",
        oneRepeatPayPassword: ""
      },
      isRegistPwd: false, //是否设置过支付密码
      pwdloading: false,
      rules: {
        mobilePhone: [
          { required: true, validator: PhoneFormatter, trigger: "blur" }
        ],
        Code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        PayPassword: [
          { required: true, validator: PasswordCheck, trigger: "blur" }
        ],
        AffirmPayPassword: [
          { required: true, validator: ConfirmPassword, trigger: "blur" }
        ]
      },
      rules2: {
        onePayPassword: [
          { required: true, validator: onePasswordCheck, trigger: "blur" }
        ],
        oneRepeatPayPassword: [
          { required: true, validator: oneConfirmPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //获取电话号码
    getMobilePhone() {
      this.shopHttp.get("/Member/GetShopInfo").then(res => {
        this.form.mobilePhone = res.data.hotLine;
      });
    },
    getCode() {
      //获取验证码
      var storageSeconds = localStorage.getItem("registerSeconds"); //先取存储里上次发送过没
      var surplusSeconds = new Date().getTime() - storageSeconds; //有的话取间隔秒数
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
        }, 1000);
        return false;
      }
      this.$refs.form.validateField("mobilePhone", errorMsg => {
        if (errorMsg == "") {
          this.codeLoading = true;
          this.shopHttp
            .post("/ShopAccount/GetVerifyCode", {
              PhoneNumber: this.form.mobilePhone
            })
            .then(res => {
              this.codeLoading = false;
              if (res.data.isSuccess == true) {
                //发送成功，执行倒数计时器
                if (!this.timer) {
                  localStorage.setItem("registerSeconds", new Date().getTime());
                  this.timerSecond = 120; //倒计时120秒
                  this.timer = setInterval(() => {
                    if (this.timerSecond > 0) {
                      this.timerSecond--;
                      if (this.timerSecond <= 0) {
                        clearInterval(this.timer);
                        this.timer = null;
                      }
                    }
                  }, 1000);
                }
              } else this.$message.error(res.data.message);
            });
        } else {
          this.$message.error(errorMsg);
        }
      });
    },
    havePayPassword() {
      //获取是否设置支付密码
      var _this = this;
      _this.pwdloading = true;
      _this.shopHttp
        .get("/Finance/GetIsSetPayPassword")
        .then(res => {
          // console.log(res);
          if (res.data.isSuccess) {
            _this.isRegistPwd = res.data.objects[0];
          }
          _this.pwdloading = false;
        })
        .catch(err => {
          _this.pwdloading = false;
        });
    },
    setPwd(setform) {
      //第一次设置密码
      var _this = this;
      _this.$refs[setform].validate(valitor => {
        if (valitor) {
          _this.shopHttp
            .post("/Finance/SetPayPassword", {
              PayPassword: _this.Trim(_this.setform.onePayPassword),
              AffirmPayPassword: _this.Trim(_this.setform.oneRepeatPayPassword)
            })
            .then(res => {
              if (res.data.isSuccess) {
                _this.$message({ type: "success", message: "设置成功" });
                _this.$router.push({ name: "accountproperty" });
              } else {
                _this.$message({ type: "info", message: res.data.message });
              }
            })
            .catch(err => {
              console.log(err);
              _this.$message({ type: "error", message: "请求失败" });
            });
        } else {
          return false;
        }
      });
    },
    updatePwd(form) {
      //修改密码
      var _this = this;
      _this.$refs[form].validate(valitor => {
        if (valitor) {
          _this.form.mobilePhone = _this.Trim(_this.form.mobilePhone);
          _this.form.Code = _this.Trim(_this.form.Code);
          _this.form.PayPassword = _this.Trim(_this.form.PayPassword);
          _this.form.AffirmPayPassword = _this.Trim(
            _this.form.AffirmPayPassword
          );
          _this.shopHttp
            .post("/Finance/UpdatePayPasswordByPhone", _this.form)
            .then(res => {
              if (res.data.isSuccess) {
                _this.$message({ type: "success", message: "修改成功" });
                _this.$router.push({ name: "accountproperty" });
              } else {
                _this.$message({ type: "info", message: res.data.message });
              }
            })
            .catch(err => {
              console.log(err);
              _this.$message({ type: "error", message: "请求失败" });
            });
        } else {
          return false;
        }
      });
    },
    Trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    cusback() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.havePayPassword();
    this.getMobilePhone();
  }
};
</script>
<style scoped lang=scss>
.input {
  width: 200px;
}
</style>