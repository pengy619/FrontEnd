var pages = [
    {
      meta: {
        parentMenu: '客商中心',
        breadcrumb:[{ title:'客商中心',url:''},{ title:'供应商管理',url:''},{ title:'结算单位管理',url:'/supplier/supSettleClientList'}]
      },
      path: '/supplier/supSettleClientList',
      name: 'supSettleClientList',
      component: (resolve) => require(['@/views/supplier/supSettleClientList.vue'], resolve)
    },
    //旅客资料
    {
      meta: {
        parentMenu: '客商中心'
      },
      path: '/grouptour/travellerMessage',
    },
    //分部门店开发票页面
    {
      meta: {
        parentMenu: '财务中心',
        breadcrumb:[{ title:'财务中心',url:''},{ title:'发票管理',url:''},{title:'发票页面',url:'/grouptour/kaifapiao'}]
      },
      path: '/grouptour/kaifapiao',
      name: 'kaifapiao',
      component: (resolve) => require(['@/views/grouptour/branchWork/kaifapiao.vue'], resolve)
    },
]
export default pages