<template>
  <div style="min-height: 100%;">
    <div class="ylt-top">
      <div class="am-fl am-padding-left-sm ylt-logo">
        <img :src="branchCompanyLogo||'./static/img/ylt_logo.png'" width="120">
        <span class="ylt-logo-text">{{branchCompanyName||'云旅通'}}</span>
      </div>
      <ul class="ylt-top-icongroup">
        <li v-for="item in menus" :key="item.url">
          <router-link :to="item.url" v-if="item.isSpa">
            <i class="icon iconfont" :class="item.iconCss"></i>
            <div class="am-padding-left-lg">{{item.menuName}}</div>
          </router-link>
          <template v-else>
            <a :href="item.url">
              <i class="icon iconfont" :class="item.iconCss"></i>
              <div class="am-padding-left-lg">{{item.menuName}}</div>
            </a>
          </template>
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
          :default-active="activeLeft"
          class="el-menu-vertical-demo"
          :router="true"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
        >
          <template v-for="item in currentLeft.childMenu">
            <el-menu-item :index="item.url" v-if="item.isSpa&&item.childMenu.length==0">
              <i class="icon iconfont" :class="item.iconCss"></i>
              <span slot="title">{{item.menuName}}</span>
            </el-menu-item>
            <div class="left-a-link" v-if="!item.isSpa&&item.childMenu.length==0">
              <a :href="item.url">
                <i class="icon iconfont" :class="item.iconCss"></i>
                {{item.menuName}}
              </a>
            </div>
          </template>

          <!-- <el-menu-item :index="item.url" v-if="item.childMenu.length==0" v-for="item in currentLeft.childMenu">
            <i class="icon iconfont" :class="item.iconCss"></i>
            <span slot="title">{{item.menuName}}</span>
          </el-menu-item>-->
          <el-submenu
            v-for="(item,num) in currentLeft.childMenu"
            :index="'leftMenu-'+num"
            :key="num"
            v-if="item.childMenu.length!=0"
          >
            <template slot="title">
              <i class="icon iconfont" :class="item.iconCss"></i>
              <span slot="title">{{item.menuName}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="(child,subnum) in item.childMenu">
                <el-menu-item :index="child.url" v-if="child.isSpa">{{child.menuName}}</el-menu-item>
                <div class="left-a-link left-a-link1" v-else>
                  <a :href="child.url">{{child.menuName}}</a>
                </div>
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
                  <li class="quit" @click="revisePW">修改密码</li>
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
    return {
      isCollapse: false,
      userName: "",
      visible2: false,
      copyright: "",
      branchCompanyLogo: "",
      branchCompanyName: "",
      count: 0
    };
  },
  computed: {
    //从vuex获取左侧菜单和当前面包屑导航、当前路由
    ...mapState({
      menus: state => state.menus.menu,
      currentLeft: state => state.currentLeft,
      breadcrumb: state => state.breadcrumb
    }),
    ...mapGetters({
      activeLeft: "getActiveLeft"
    })
  },
  watch: {
    //'isCollapse':function(){
    //  let activeLeft=this.activeLeft
    //  console.log(activeLeft)
    //  this.$store.dispatch("setActiveLeft",'')
    //  setTimeout(()=>{
    //    this.$store.dispatch("setActiveLeft",activeLeft)
    //  },400)
    //}
  },
  mounted() {
    //cesy001  a123456
    this.GetAccountName();
    this.getSettingInfomation("BranchCompanyLogo");
    this.getSettingInfomation("BranchCompanyName");
    this.getSettingInfomation("BranchCopyright");
    this.getUnReadNoticeCount();
    // this.groupHttp
    //   .post("/account/authorize", {
    //     username: "cesy001",
    //     password: "a123456",
    //     grant_type: "password"
    //   })
    //   .then(res => {
    //     localStorage.setItem(
    //       "token",
    //       res.data.token_type + " " + res.data.access_token
    //     );
    //   })
    //   .catch(e => {
    //     console.log(e, 1);
    //   });
  },
  methods: {
    childByValue: function(childValue) {
      this.count = childValue;
    },
    //修改密码
    revisePW() {
      location.href = "/SystemSetting/ResetPwd";
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    //退出登录
    cancelLogin() {
      localStorage.clear();
      location.href = "/account/logout";
    },
    //获取账户名
    GetAccountName() {
      this.groupHttp.get("/Account/GetAccountName").then(res => {
        if (res.status == 200) {
          this.userName = res.data;
        }
      });
    },
    //获取公告未读数
    getUnReadNoticeCount() {
      this.groupHttp
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
    //获取配置信息
    getSettingInfomation(SettingName) {
      this.groupHttp
        .post("/DropDownData/GetSettingInfomation", {
          SettingName: SettingName,
          CompanyType: 5
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            if (SettingName == "BranchCompanyName") {
              this.branchCompanyName = res.data.message;
            }
            if (SettingName == "BranchCopyright") {
              this.copyright = res.data.message;
            }
            if (SettingName == "BranchCompanyLogo") {
              this.branchCompanyLogo = res.data.message;
            }
          }
        });
    }
  }
};
</script>

<style>
@import "../style/frame.css";
@import "../style/iconfont/iconfont.css";

.page {
  padding-top: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.left-a-link {
  height: 50px;
}

.left-a-link a,
.left-a-link1 a {
  display: inline-block;
  padding-left: 20px;
  font-size: 14px;
  color: #2d2f33;
  line-height: 50px;
  width: 100%;
}
.left-a-link1 a {
  padding-left: 40px;
}

.left-a-link a:hover {
  outline: 0;
  background-color: #ecf5ff;
}

.m_top {
  margin-top: 10px;
}

.p_username {
  cursor: pointer;
  text-align: center;
  font-weight: 700;
}

.ul_margin {
  margin: 0px;
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
</style>
