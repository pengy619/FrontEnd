import Vue from 'vue'
import Router from 'vue-router'
import Frame from '@/view/frame'
import Pages from './content.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Frame',
      component: Frame,
      children:Pages
    }
  ]
})
