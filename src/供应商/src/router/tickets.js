//基本信息
var pages = [{
    meta: {
        parentMenu: '资源中心',
        breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:'/grouptour/RouteTable'},{ title:'门票信息',url:'/Tickets/ticketsInfo'}]
      },
      path: '/Tickets/ticketsInfo',
      name: 'ticketsInfo',
      component: (resolve) => require(['@/views/tickets/ticketsInfo.vue'], resolve)
    },
      //销售设置
      {
        meta: {
          parentMenu: '资源中心',
          breadcrumb: [{title: '资源中心', url: ''}, {title: '门票管理', url: '/grouptour/RouteTable'}, {
            title: '门票销售设置',
            url: '/Tickets/ticketsMarket'
          }]
        },
        path: '/Tickets/ticketsMarket',
        name: 'ticketsMarket',
        component: (resolve) => require(['@/views/tickets/ticketsMarket.vue'], resolve)
      },
      //预定设置
      {
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:'/grouptour/RouteTable'},{ title:'门票预定设置',url:'/Tickets/ticketsReserve'}]
        },
        path: '/Tickets/ticketsReserve',
        name: 'ticketsReserve',
        component: (resolve) => require(['@/views/tickets/ticketsReserve.vue'], resolve)
      },
      //验证设置
      {
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:'/grouptour/RouteTable'},{ title:'门票验证设置',url:'/Tickets/ticketsVerification'}]
        },
        path: '/Tickets/ticketsVerification',
        name: 'ticketsVerification',
        component: (resolve) => require(['@/views/tickets/ticketsVerification.vue'], resolve)
      },
      //退款
      {
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:'/grouptour/RouteTable'},{ title:'门票退款设置',url:'/Tickets/ticketsRefund'}]
        },
        path: '/Tickets/ticketsRefund',
        name: 'ticketsRefund',
        component: (resolve) => require(['@/views/tickets/ticketsRefund.vue'], resolve)
      },
      //详细资料
      {
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:'/grouptour/RouteTable'},{ title:'门票退款设置',url:'/Tickets/ticketsMessage'}]
        },
        path: '/Tickets/ticketsMessage',
        name: 'ticketsMessage',
        component: (resolve) => require(['@/views/tickets/ticketsMessage.vue'], resolve)
      },
      //库存价格设置
      {
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:'/grouptour/RouteTable'},{ title:'门票退款设置',url:'/Tickets/inventoryPrice'}]
        },
        path: '/Tickets/inventoryPrice',
        name: 'inventoryPrice',
        component: (resolve) => require(['@/views/tickets/inventoryPrice.vue'], resolve)
      },
       {//供应商门票 单票产品列表
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'单票产品列表',url:''}]
        },
        path: '/tickets/singleTicketList',
        name: 'singleTicketList',
        component: (resolve) => require(['@/views/tickets/singleTicketList.vue'], resolve)
      },
      {//供应商门票  创建景点
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'创建景点',url:''}]
        },
        path: '/tickets/createAttraction',
        name: 'createAttraction',
        component: (resolve) => require(['@/views/tickets/createAttraction.vue'], resolve)
      },
      {//供应商门票 景点管理列表
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'景点管理',url:''}]
        },
        path: '/tickets/attractionManageList',
        name: 'attractionManageList',
        component: (resolve) => require(['@/views/tickets/attractionManageList.vue'], resolve)
      },
      {//供应商门票 selectAttraction
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'景点详情',url:''}]
        },
        path: '/tickets/attractionDetail',
        name: 'attractionDetail',
        component: (resolve) => require(['@/views/tickets/attractionDetail.vue'], resolve)
      },
      {//供应商门票 选取景点
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'选取景点',url:''}]
        },
        path: '/tickets/selectAttraction',
        name: 'selectAttraction',
        component: (resolve) => require(['@/views/tickets/selectAttraction.vue'], resolve)
      },
      {//供应商门票 单票产品列表
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'单票产品列表',url:''}]
        },
        path: '/tickets/singleTicketList',
        name: 'singleTicketList',
        component: (resolve) => require(['@/views/tickets/singleTicketList.vue'], resolve)
      },
      {//供应商门票 套票产品列表
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'套票产品列表',url:''}]
        },
        path: '/tickets/multipleTicketList',
        name: 'multipleTicketList',
        component: (resolve) => require(['@/views/tickets/multipleTicketList.vue'], resolve)
      },
      {//供应商门票 单票详情
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'单票详情',url:''}]
        },
        path: '/tickets/singleDetail',
        name: 'singleDetail',
        component: (resolve) => require(['@/views/tickets/singleDetail.vue'], resolve)
      },
      {//供应商门票 套票详情
        meta: {
          parentMenu: '资源中心',
          breadcrumb:[{ title:'资源中心',url:''},{ title:'门票管理',url:''},{ title:'套票详情',url:''}]
        },
        path: '/tickets/multipleDetail',
        name: 'multipleDetail',
        component: (resolve) => require(['@/views/tickets/multipleDetail.vue'], resolve)
      }
]

export default pages
