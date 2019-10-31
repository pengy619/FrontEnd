var pages = [{
    path: '/orderCenter/order',//订单中心
    alias: '/orderCenter/default',
    name: 'order',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '/orderCenter/order' }, { title: '跟团游订单', url: '/orderCenter/order' }]
    },
    component: (resolve) => require(['@/views/orderCenter/order.vue'], resolve)
}, {
    path: '/orderCenter/orderCheck',//查看订单
    name: 'orderCheck',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '跟团游订单管理', url: '/orderCenter/order' }, { title: '订单详情页', url: '/orderCenter/orderCheck' }]
    },
    component: (resolve) => require(['@/views/orderCenter/orderCheck.vue'], resolve)
}, {
    path: '/orderCenter/receivables',//收款页面
    name: 'receivables',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '跟团游订单管理', url: '/orderCenter/order' }, { title: '收款页', url: '/orderCenter/receivables' }]
    },
    component: (resolve) => require(['@/views/orderCenter/receivables.vue'], resolve)
}, {
    path: '/orderCenter/lineReservation',//跟团游预留单
    name: 'lineReservation',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '跟团游订单管理', url: '/orderCenter/order' }, { title: '预留单', url: '/orderCenter/lineReservation' }]
    },
    component: (resolve) => require(['@/views/orderCenter/lineReservation.vue'], resolve)
}, {
    path: '/orderCenter/changeOrder',//转换订单
    name: 'changeOrder',
    meta: {
        breadcrumb: [{ title: '门店管理', url: '/orderCenter/changeOrder' }]
    },
    component: (resolve) => require(['@/views/orderCenter/changeOrder.vue'], resolve)
}, {
    path: '/orderCenter/refund',//退款
    name: 'refund',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '跟团游订单管理', url: '/orderCenter/order' }, { title: '退款页', url: '/orderCenter/refund' }]
    },
    component: (resolve) => require(['@/views/orderCenter/refund.vue'], resolve)
}, {
    path: '/orderCenter/receivablesManagement',//收款管理
    name: 'receivablesManagement',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '收付款管理', url: '/orderCenter/receivablesManagement' }, { title: '收款管理', url: '/orderCenter/receivablesManagement' }]
    },
    component: (resolve) => require(['@/views/orderCenter/receivablesManagement.vue'], resolve)
}, {
    path: '/orderCenter/receiptDetails',//收款详情页
    name: 'receiptDetails',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '收付款管理', url: '/orderCenter/receivablesManagement' }, { title: '收款详情页', url: '/orderCenter/receiptDetails' }]
    },
    component: (resolve) => require(['@/views/orderCenter/receiptDetails.vue'], resolve)
}, {
    path: '/orderCenter/refundManage',//退款管理
    name: 'refundManage',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '收付款管理', url: '/orderCenter/receivablesManagement' }, { title: '退款管理', url: '/orderCenter/refundManage' }]
    },
    component: (resolve) => require(['@/views/orderCenter/refundManage.vue'], resolve)
}, {
    path: '/orderCenter/refundDetails/:id',//退款详情
    name: 'refundDetails',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '收付款管理', url: '/orderCenter/receivablesManagement' }, { title: '退款详情页', url: '/orderCenter/refundDetails' }]
    },
    component: (resolve) => require(['@/views/orderCenter/refundDetails.vue'], resolve)
}, {
    path: '/orderCenter/baoming',//暂用订单转换
    name: 'baoming1',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '跟团游订单管理', url: '/orderCenter/order' }, { title: '预留单转订单页', url: '/orderCenter/baoming' }]
    },
    component: (resolve) => require(['@/views/orderCenter/baoming.vue'], resolve)
}, {
    path: '/orderCenter/offlineOrderList',//线下订单列表
    name: 'offlineOrderList',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '线下订单列表', url: '/orderCenter/offlineOrderList' }]
    },
    component: (resolve) => require(['@/views/orderCenter/offlineOrderList.vue'], resolve)
}, 
//改价订单
{
    meta: {
      parentMenu: '订单中心',
      breadcrumb:[{ title:'订单中心',url:''},{ title:'跟团游订单管理',url:''},{title:'改价订单列表',url:'/orderCenter/changePriceOrder'}]
    },
    path: '/orderCenter/changePriceOrder',
    name: 'changePriceOrder',
    component: (resolve) => require(['@/views/orderCenter/changePriceOrder.vue'], resolve)
},
//订单变更
{
    path: '/orderCenter/grouplinechangeorder',
    name: 'grouplinechangeorder',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '跟团游变更订单列表', url: '/orderCenter/grouplinechangeorder' }]
    },
    component: (resolve) => require(['@/views/orderCenter/grouplinechangeorder.vue'], resolve)
}, 
{
    path: '/orderCenter/createOfflineOrder',//创建线下订单
    name: 'createOfflineOrder',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '创建线下订单', url: '/orderCenter/createOfflineOrder' }]
    },
    component: (resolve) => require(['@/views/orderCenter/createOfflineOrder.vue'], resolve)
}, {
    path: '/orderCenter/offlineOrderDetail',//线下订单详情
    name: 'offlineOrderDetail',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '线下订单详情', url: '/orderCenter/offlineOrderDetail' }]
    },
    component: (resolve) => require(['@/views/orderCenter/offlineOrderDetail.vue'], resolve)
}, {
    path: '/orderCenter/offlineOrderReceivables',//线下订单收款
    name: 'offlineOrderReceivables',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '线下订单收款', url: '/orderCenter/offlineOrderReceivables' }]
    },
    component: (resolve) => require(['@/views/orderCenter/offlineOrderReceivables.vue'], resolve)
},
{
    path: '/orderCenter/payList',//代付款列表
    name: 'payList',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '代付款列表', url: '/orderCenter/payList' }]
    },
    component: (resolve) => require(['@/views/orderCenter/payList.vue'], resolve)
}, {
    path: '/orderCenter/payDetail',//代付详情页
    name: 'payDetail',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '代付款列表', url: '/orderCenter/payDetail' }]
    },
    component: (resolve) => require(['@/views/orderCenter/payDetail.vue'], resolve)
}, {
    path: '/orderCenter/lineOrderPayment',//支付页面
    name: 'lineOrderPayment',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '订单支付', url: '/orderCenter/lineOrderPayment' }]
    },
    component: (resolve) => require(['@/views/orderCenter/lineOrderPayment.vue'], resolve)
}, {
    path: '/orderCenter/offlineOrderPayment',//线下订单支付页面
    name: 'offlineOrderPayment',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '线下订单支付', url: '/orderCenter/offlineOrderPayment' }]
    },
    component: (resolve) => require(['@/views/orderCenter/offlineOrderPayment.vue'], resolve)
}, {
    path: '/orderCenter/signContract',//签订电子合同
    name: 'signContract',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '签订电子合同', url: '/orderCenter/signContract' }]
    },
    component: (resolve) => require(['@/views/orderCenter/signContract.vue'], resolve)
},
// , {
//     path: '/orderCenter/signElectronicContract',//签订电子合同
//     name: 'signElectronicContract',
//     meta: {
//         parentMenu: '订单中心',
//         breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '签订电子合同', url: '/orderCenter/signElectronicContract' }]
//     },
//     component: (resolve) => require(['@/views/orderCenter/signElectronicContract.vue'], resolve)
// }
{
    path: '/orderCenter/electronicContractDetail',//电子合同详情
    name: 'electronicContractDetail',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '' }, { title: '跟团游订单管理', url: '' }, { title: '电子合同详情', url: '/orderCenter/electronicContractDetail' }]
    },
    component: (resolve) => require(['@/views/orderCenter/electronicContractDetail.vue'], resolve)
}, {
    path: '/orderCenter/hotelOrderList',//酒店订单列表
    name: 'hotelOrderList',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '酒店订单管理', url: '' }, { title: '酒店订单列表', url: '/orderCenter/hotelOrderList' }]
    },
    component: (resolve) => require(['@/views/orderCenter/hotel/hotelOrderList.vue'], resolve)
}, {
    path: '/orderCenter/hotelOrderDetail/:id',//酒店订单详情
    name: 'hotelOrderDetail',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '酒店订单列表', url: '/orderCenter/hotelOrderList' }, { title: '酒店订单详情', url: '' }]
    },
    component: (resolve) => require(['@/views/orderCenter/hotel/hotelOrderDetail.vue'], resolve)
}, {
    path: '/orderCenter/hotelPayment',//酒店订单支付
    name: 'hotelPayment',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '酒店订单列表', url: '/orderCenter/hotelOrderList' }, { title: '酒店订单支付', url: '' }]
    },
    component: (resolve) => require(['@/views/orderCenter/hotel/hotelPayment.vue'], resolve)
}, {
    path: '/orderCenter/hotelReceivables',//酒店订单收款
    name: 'hotelReceivables',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '酒店订单列表', url: '/orderCenter/hotelOrderList' }, { title: '酒店订单收款', url: '' }]
    },
    component: (resolve) => require(['@/views/orderCenter/hotel/hotelReceivables.vue'], resolve)
}, {
    path: '/orderCenter/hotelRefund',//酒店退款
    name: 'hotelRefund',
    meta: {
        parentMenu: '订单中心',
        breadcrumb: [{ title: '订单中心', url: '/orderCenter/default' }, { title: '酒店订单列表', url: '/orderCenter/hotelOrderList' }, { title: '酒店退款', url: '' }]
    },
    component: (resolve) => require(['@/views/orderCenter/hotel/hotelRefund.vue'], resolve)
}
]

export default pages
