var pages = [
  //跟团游商品列表
  {
    meta: {
      parentMenu: '销售中心',
      breadcrumb:[{ title:'销售中心',url:''},{ title:'跟团游',url:'/grouptour/productList'},{ title:'跟团游产品列表',url:'/grouptour/productList'}]
    },
    path: '/grouptour/productList',
    name: 'productList',
    component: (resolve) => require(['@/views/grouptour/branchWork/productList.vue'], resolve)
  },
  
]
export default pages
