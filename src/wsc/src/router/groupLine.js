let pages=[
    {   //线路首页
        path: '/GroupLine/GroupLineIndex',
        name: 'GroupLineIndex',
        component: (resolve)=>require(['@/views/groupLine/GroupLineIndex.vue'],resolve)
    },{ //线路详情
        path: '/GroupLine/GroupLineDetail',
        name: 'GroupLineDetail',
        component: (resolve)=>require(['@/views/groupLine/GroupLineDetail.vue'],resolve)
    },{ //选择日期和人数
        path: '/GroupLine/GroupLineChoiceDate',
        name: 'GroupLineChoiceDate',
        component: (resolve)=>require(['@/views/groupLine/GroupLineChoiceDate.vue'],resolve)
    },{ //填写资料
        path: '/GroupLine/OrderInfo',
        name: 'OrderInfo',
        component: (resolve)=>require(['@/views/groupLine/OrderInfo.vue'],resolve)
    },{ //支付
        path: '/GroupLine/Payment',
        name: 'Payment',
        component: (resolve)=>require(['@/views/groupLine/Payment.vue'],resolve)
    },{ //支付结果
        path: '/GroupLine/PayResult',
        name: 'PayResult',
        component: (resolve)=>require(['@/views/groupLine/PayResult.vue'],resolve)
    },
]

export default pages;