let pages=[
    {   //我的 首页
        path: '/My/Home',
        name: 'MyHome',
        component: (resolve)=>require(['@/views/my/Home.vue'],resolve)
    },
    {   //我的 订单列表
        path: '/My/OrderList',
        name: 'OrderList',
        component: (resolve)=>require(['@/views/my/OrderList.vue'],resolve)
    },
    {   //我的 订单详情
        path: '/My/OrderDetail/:id',
        name: 'OrderDetail',
        component: (resolve)=>require(['@/views/my/OrderDetail.vue'],resolve)
    },
    {   //我的 常用信息
        path: '/My/CommonInfo',
        name: 'CommonInfo',
        component: (resolve)=>require(['@/views/my/CommonInfo.vue'],resolve)
    },
    {   //我的 添加常用联系人
        path: '/My/AddTraveller',
        name: 'AddTraveller',
        component: (resolve)=>require(['@/views/my/AddTraveller.vue'],resolve)
    },
    {   //我的 添加发票
        path: '/My/AddInvoice',
        name: 'AddInvoice',
        component: (resolve)=>require(['@/views/my/AddInvoice.vue'],resolve)
    },
    {   //我的 开票记录
        path: '/My/TicketHistory',
        name: 'TicketHistory',
        component: (resolve)=>require(['@/views/my/TicketHistory.vue'],resolve)
    },
    {   //我的 设置
        path: '/My/Setting',
        name: 'Setting',
        component: (resolve)=>require(['@/views/my/Setting.vue'],resolve)
    },
]

export default pages;