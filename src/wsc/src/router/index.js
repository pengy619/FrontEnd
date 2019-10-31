import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
import common from './common'
import groupLine from './groupLine'
import my from './my'

Vue.use(Router)

//合并所有路由页面
const pages = [...common,...groupLine,...my]

let router=new Router({
  routes: pages
})
export default router

//自定义路由历史记录与切入动画
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
	// const token=localStorage.getItem('token')
	// if(to.path!=='/login'&&!token){
	// 	next({ path: '/login' })
	// 	return false
	// }

	const toIndex = history.getItem(to.path)
	const fromIndex = history.getItem(from.path)
	if (toIndex) {
		if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
			let transition = to.query.transition ? to.query.transition : 'page'
			store.commit('useTransition', transition)
			store.commit('setDirection', 'forward')
		} else {
			let transition = from.query.transition ? from.query.transition : 'page'
			if(to.query.transition){
				transition=to.query.transition
			}
			store.commit('useTransition', transition)
			store.commit('setDirection', 'back')
		}
	} else {
		++historyCount
		history.setItem('count', historyCount)
		to.path !== '/' && history.setItem(to.path, historyCount)

		let transition = to.query.transition ? to.query.transition : 'page'
		store.commit('useTransition', transition)
		store.commit('setDirection', 'forward')
	}

	if (/\/http/.test(to.path)) {
		let url = to.path.split('http')[1]
		window.location.href = `http${url}`
	} else {
		next()
	}
})
