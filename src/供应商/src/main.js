// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import store from './vuex/store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/iconfont/iconfont.css'
import './style/common.scss'
import http from './utils/http'
import SSKindeditor from 'ss-kindeditor'
import 'babel-polyfill'
import { airHttp, groupHttp,fileUpload,ticketHttp,addressHttp } from './utils/http'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(SSKindeditor)

Vue.prototype.airHttp=airHttp
Vue.prototype.groupHttp=groupHttp
Vue.prototype.ticketHttp=ticketHttp
Vue.prototype.fileUpload=fileUpload
Vue.prototype.addressHttp=addressHttp
/* eslint-disable no-new */
let main=new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

export default main
