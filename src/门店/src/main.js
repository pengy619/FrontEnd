// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './vuex/store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/iconfont/iconfont.css'
import 'babel-polyfill'
import './style/common.scss'


import SSKindeditor from 'ss-kindeditor'
import {shopHttp,fileUpload,addressHttp,uploadHttp} from './utils/http.js'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(SSKindeditor)


Vue.prototype.shopHttp=shopHttp
Vue.prototype.addressHttp = addressHttp
Vue.prototype.fileUpload = fileUpload
Vue.prototype.uploadHttp=uploadHttp
/* eslint-disable no-new */
let main = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
export default main
