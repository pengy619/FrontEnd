<template>
  <div style="border:1px solid transparent;height:100%">
    <div class="pw" v-show="pw_show">
      <div class="pwPage">
        <el-form
          :model="pwForm"
          :rules="rules"
          ref="pwForm"
          status-icon
          label-width="100px"
          class="demo-ruleForm"
          style="width:305px;"
        >
          <el-form-item label="旧密码" prop="oldPw">
            <el-input
              type="password"
              v-model.number="pwForm.oldPw"
              auto-complete="off"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPw">
            <el-input type="password" v-model="pwForm.newPw" auto-complete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPW">
            <el-input type="password" v-model="pwForm.checkPW" auto-complete="off" size="small"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="revisePW('addDialogForm')"
          size="small"
          style="margin-left:120px;"
        >提 交</el-button>
        <el-button type="primary" @click="cancle" size="small" style="margin-left:20px;">取 消</el-button>
      </div>
    </div>
    <div class="ylt-top">
      <div class="am-fl am-padding-left-sm ylt-logo">
        <img :src="shopCompanyLogo||'./static/img/ylt_logo.png'" width="120">
        <span class="ylt-logo-text">{{shopCompanyName||'云旅通'}}</span>
      </div>
      <ul class="ylt-top-icongroup">
        <li v-for="item in menus" :key="item.url">
          <router-link :to="item.url">
            <i class="icon iconfont" :class="item.iconCss"></i>
            <div class="am-padding-left-lg">{{item.menuName}}</div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="ylt-container">
      <div class="ylt-left-bar">
        <div class="left-bar-title">
          <i class="iconfont" :class="currentLeft.iconCss"></i>
          <transition name="fade" mode="out-in">
            <span v-if="!isCollapse">{{currentLeft.menuName}}</span>
          </transition>
        </div>
        <el-menu
          :default-active="test"
          class="el-menu-vertical-demo"
          :router="true"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          background-color="#f9f9f9"
          active-text-color="#48c8f7"
        >
          <el-menu-item
            :index="item.url"
            v-if="item.childMenu.length==0"
            v-for="item in currentLeft.childMenu"
          >
            <i class="icon iconfont" :class="item.iconCss"></i>
            <span slot="title">{{item.menuName}}</span>
          </el-menu-item>
          <el-submenu
            v-for="(item,num) in currentLeft.childMenu"
            :index="'leftMenu-'+num"
            :key="num"
            v-if="item.childMenu.length!=0"
          >
            <template slot="title">
              <i class="icon iconfont" :class="item.iconCss"></i>
              <span>{{item.menuName}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="child in item.childMenu">
                <el-menu-item :index="child.url" :key="child.url">{{child.menuName}}</el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>

      <div class="ylt-main" :class="{'el-menu-open':!isCollapse}">
        <el-row class="status-bar">
          <div class="status-main">
            <i class="close-left-bar el-icon-menu" @click="isCollapse=!isCollapse"></i>
            <el-breadcrumb separator="/" class="breadcrumb">
              <el-breadcrumb-item
                v-for="(item,index) in breadcrumb"
                :to="{ path: item.url }"
                :key="index"
              >{{item.title}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="status-icon">
            <el-badge :value="count" class="item">
              <el-button
                size="small"
                icon="icon iconfont icon-xinxi"
                type="text"
                @click="$router.push({path:'/systemSettings/bulletinBoard'})"
              ></el-button>
            </el-badge>
          </div>
          <div class="status-user">
            <el-popover ref="popover" placement="bottom-start" width="160" v-model="visible2">
              <div style="text-align: right; margin: 0">
                <ul class="ul_margin">
                  <li class="quit" @click="cancelLogin">退出登录</li>
                  <li class="quit" @click="pw_show = true">修改密码</li>
                  <li
                    class="quit"
                    @click="$router.push({path:'/systemSettings/bulletinBoard'})"
                  >公告板块</li>
                  <li
                    class="quit"
                    @click="$router.push({path:'/systemSettings/learningPlate'})"
                  >学习板块</li>
                </ul>
              </div>
            </el-popover>
            <p v-popover:popover size="small" class="m_top p_username">
              {{userName}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </p>
          </div>
        </el-row>
        <div class="page">
          <transition name="fade" mode="out-in">
            <router-view v-on:childByValue="childByValue"></router-view>
          </transition>
          <div class="ylt-footer">
            <p>{{copyright}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    var validate_oldPw = (rule, value, callback) => {
      if (this.errMsg) {
        callback(new Error(this.errMsg));
        this.errMsg = "";
        return;
      }
      if (!value) {
        return callback(new Error("旧密码不能为空"));
      } else {
        callback();
      }
    };
    var validate_newPw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([^\s]{6,16})$/.test(value)) {
          if (this.pwForm.checkPW !== "") {
            this.$refs.pwForm.validateField("checkPW");
          }
          callback();
        } else {
          callback(new Error("6-16位，不能有空格，包含数字和字母"));
        }
      }
    };
    var checkAge_checkPW = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.pwForm.newPw) {
        callback(new Error("密码和重复密码不匹配!"));
      } else {
        callback();
      }
    };
    return {
      count: 0,
      pw_show: false,
      test: "",
      copyright: "",
      shopCompanyLogo: "",
      shopCompanyName: "",
      pwForm: {
        oldPw: "",
        newPw: "",
        checkPW: ""
      },
      errMsg: "",
      rules: {
        oldPw: [{ validator: validate_oldPw, trigger: "blur" }],
        newPw: [{ validator: validate_newPw, trigger: "blur" }],
        checkPW: [{ validator: checkAge_checkPW, trigger: "blur" }]
      },
      isCollapse: false,
      visible2: false,
      userName: ""
    };
  },
  computed: {
    ...mapState({
      menus: state => state.menus.menu,
      currentLeft: state => state.currentLeft,
      breadcrumb: state => state.breadcrumb
    }),
    ...mapGetters({
      activeLeft: "getActiveLeft"
    })
  },
  mounted() {
    this.GetAccountName();
    this.getSettingInfomation("ShopCompanyLogo");
    this.getSettingInfomation("ShopCompanyName");
    this.getSettingInfomation("ShopCopyright");
    this.getUnReadNoticeCount();
    this.getShopUserId();
  },
  watch: {
    activeLeft: function(val) {
      setTimeout(() => {
        this.test = val;
      }, 200);
    }
  },
  methods: {
    //获取用户id
    getShopUserId(){
      this.shopHttp.get('ShopAccount/GetShopUserId').then(res=>{
        localStorage.setItem("userId", res.data);
      })
    },
    childByValue: function(childValue) {
      this.count = childValue;
    },
    //修改密码
    revisePW() {
      this.$refs["pwForm"].validate(valid => {
        if (valid) {
          this.shopHttp
            .post("/Member/UpdateShopPassword", {
              Password: this.pwForm.newPw,
              OldPassword: this.pwForm.oldPw
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "密码修改成功!"
                });
                setTimeout(() => {
                  this.cancle();
                }, 500);
              } else if (res.data.message == "旧密码错误") {
                this.errMsg = "您输入的旧密码错误！请重新输入";
                this.$refs.pwForm.validateField("oldPw");
              }
            })
            .catch(e => {
              console.log(e);
            });
        }
      });
    },
    //取消修改
    cancle() {
      this.pw_show = false;
      this.$refs.pwForm.resetFields();
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    cancelLogin() {
      localStorage.clear();
      this.$router.push({ path: "/login" });
    },
    //获取公告未读数
    getUnReadNoticeCount() {
      this.shopHttp
        .get("/Notice/GetUnReadNoticeCount")
        .then(res => {
          if (res.data.isSuccess == true) {
            this.count = res.data.count;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //获取账户名
    GetAccountName() {
      this.shopHttp.get("/Account/GetAccountName").then(res => {
        if (res.status == 200) {
          this.userName = res.data;
        }
      });
    },
    //获取配置信息
    getSettingInfomation(SettingName) {
      this.shopHttp
        .post("/DropDownData/GetSettingInfomation", {
          SettingName: SettingName,
          CompanyType: 1
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            if (SettingName == "ShopCompanyName") {
              this.shopCompanyName = res.data.message;
            }
            if (SettingName == "ShopCopyright") {
              this.copyright = res.data.message;
            }
            if (SettingName == "ShopCompanyLogo") {
              this.shopCompanyLogo = res.data.message;
            }
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/frame.css";
.page {
  // padding-top: 20px;
  height: 100%;
}
.view {
  background: #fff;
  height: 100%;
}
.ul_margin {
  margin: 0px;
}
.m_top {
  margin-top: 10px;
}
.p_username {
  cursor: pointer;
  text-align: center;
  font-weight: 700;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.quit {
  text-align: center;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
}
.quit:hover {
  background: #f5f7fa;
  color: #409eff;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.pw {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  z-index: 20005;
}
.pwPage {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -175px;
  width: 400px;
  height: 280px;
  padding: 30px 20px 10px;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 20006;
}
</style>
