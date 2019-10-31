// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from "vuex"
import store from "./vuex/store"
import http from './utils/http.js'
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';
import './style/common.scss';
import flexible from './js/flexible.min.js'

flexible(375,750)
Vue.use(Vant);

Vue.prototype.http=http
Vue.config.productionTip = false

/* eslint-disable no-new */
var app=new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
export default app

//自定义指令
//按钮loading效果
Vue.directive('b-loading',function(el,binding){
	let loadingHtml=`<div class="van-loading van-loading--circular van-loading--white" style="width: 20px;height: 20px;display:  inline-block;vertical-align:  text-bottom;margin-right: 2px;"><span class="van-loading__spinner van-loading__spinner--circular"><svg viewBox="25 25 50 50" class="van-loading__circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></span></div>`
	if(binding.value){
		if(el.querySelector('.van-loading'))return false
		var dom = document.createElement("div");
		dom.innerHTML = loadingHtml;
		el.insertBefore(dom.childNodes[0],el.childNodes[0])
		el.setAttribute('disabled','true')
	}else{
		var toRemove = el.querySelector('.van-loading');
		if(!el.querySelector('.van-loading'))return false
		toRemove.parentNode.removeChild(toRemove);
		el.removeAttribute('disabled')
	}
})