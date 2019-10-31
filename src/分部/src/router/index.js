import Vue from 'vue'
import Router from 'vue-router'
import Frame from '@/views/frame.vue'
import store from '@/vuex/store'
// import AirplanePages from './airplane.js'
// import GroupTourPages from './grouptour.js'
import orderCenter from './orderCenter'
import resourcesCenter from './resourcesCenter'
import saleCenter from './saleCenter'
import Tickets from './tickets'
import Test from './test.js'
import menusdata from '../utils/menu'
import supplier from './settleclientlist'
import announcement from './announcement'
import report from './report'
import singleItem from './singleItem'
import test from './test'

let menusData=menusdata?menusdata:{menu:[]}
Vue.use(Router)

//合并所有路由页面
const pages = [...resourcesCenter,...saleCenter,...supplier,...Tickets,...test,...orderCenter,...announcement,...report,...singleItem];
//创建路由实例
let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Frame,
      children:pages
    },
  ]
})

//匹配本地路由与mvc路由
function mapSetUrl(menus){
  menus.forEach(function(k){
    if(k.url.indexOf('dist/#')!==-1){
      k.url=k.url.substring(k.url.indexOf('#')+1)
      k['isSpa']=true
    }else{
      k['isSpa']=false
    }
    if(k.childMenu.length>0){
      mapSetUrl(k.childMenu)
    }
  })
}
mapSetUrl(menusData.menu)
//设置菜单数据
store.dispatch("setMenus",menusData);

//路由拦截
router.beforeEach((to, from, next) => {
  //根据路由配置中的parentMenu，抽取对应的左侧菜单
  let menus=store.getters.getMenus;
  menus = menus.menu||[];
  let leftMenus=[]
  if(menus){
    for (var i=0;i<menus.length;i++){
      if(menus[i].menuName==to.meta.parentMenu){
        leftMenus=menus[i]
        break
      }
    }
    store.dispatch("setLeftMenus",leftMenus)
    let breadcrumb=to.meta.breadcrumb||[]
    store.dispatch("setBreadcrumb",breadcrumb)
    store.dispatch("setActiveLeft",breadcrumb)
    //设置页面title
    let titleArr=['区域分部']
    breadcrumb.forEach((item)=>{
      titleArr.push(item.title)
    })
    document.title=titleArr.join('-')
  }
  next()
})

export default router
