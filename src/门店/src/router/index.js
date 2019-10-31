import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'
import Frame from '@/views/frame.vue'
import Login from '@/views/login'
import SystemSetting from './systemsettings.js'
import CustomerCenter from './customercenter.js'
import Financenter from './financenter.js'
import orderCenter from './orderCenter.js'
import sellCenter from './sellcenter.js'
import agreement from './agreement.js'
import Test from './test.js'
import Register from '@/views/account/register.vue'
import Password from '@/views/account/password.vue'
import RepeatRegister from '@/views/account/repeatRegister.vue'
import UpdateQualification from '@/views/account/updateQualification.vue'
import singleItem from './singleItem'
Vue.use(Router);
  const pages=SystemSetting.concat(CustomerCenter).concat(Test).concat(Financenter).concat(orderCenter).concat(sellCenter).concat(agreement).concat(singleItem)
//创建路由实例
let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Login
    },
    {
      path: '/login',
      name: 'Hello',
      component: Login
    },
    {
      path: '/frame',
      name: 'frame',
      component: Frame,
      children:pages
    },
    {
      path: '/register',
      name: 'shopRegister',
      component: Register
    },
    {
      path: '/password',
      name: 'shopPassword',
      component: Password
    },
    {
      path: '/repeatRegister',
      name: 'repeatRegister',
      component: RepeatRegister
    },
    {
      path: '/updateQualification',
      name: 'updateQualification',
      component: UpdateQualification
    }  
  ]
})

//路由拦截
router.beforeEach((to,from,next)=>{
  let menu = localStorage.getItem('menus');
  let menusData = JSON.parse(menu)
  store.dispatch('setMenus',menusData);
  let menus = store.state.menus;
  let leftMenus=[];
  if (menus){
    let menulist = menus.menu
    for(var i=0;i<menulist.length;i++){
      if(menulist[i].menuName==to.meta.parentMenu){
        leftMenus=menulist[i]
        break
      }
    }
    if (leftMenus.length<=0) {
      store.dispatch("setLeftMenus", menus[0])
    }
    store.dispatch("setLeftMenus",leftMenus)
    let breadcrumb=to.meta.breadcrumb||[]
    store.dispatch("setBreadcrumb",breadcrumb)
    store.dispatch("setActiveLeft",breadcrumb)
    let titleArr=['门店系统']
    breadcrumb.forEach((item)=>{
      titleArr.push(item.title)
    })
    document.title=titleArr.join('-')
  }
  next();
})


export default router

