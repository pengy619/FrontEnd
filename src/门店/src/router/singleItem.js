var pages=[
    {
        meta: {
            parentMenu: '订单中心',
            breadcrumb: [{ title: '订单中心', url: '' }, { title: '单项订单管理', url: '/singleItem/singleOrderList' }, { title: '单项订单列表', url: '/singleItem/singleOrderList' }]
        },
        path: '/singleItem/singleOrderList',
        name: 'singleOrderList',
        component: (resolve) => require(['@/views/singleItem/singleOrderList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '订单中心',
            breadcrumb: [{ title: '订单中心', url: '' }, { title: '单项订单管理', url: '/singleItem/singleOrderDetail' }, { title: '单项订单详情', url: '/singleItem/singleOrderDetail' }]
        },
        path: '/singleItem/singleOrderDetail',
        name: 'singleOrderDetail',
        component: (resolve) => require(['@/views/singleItem/singleOrderDetail.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '销售中心',
            breadcrumb: [{ title: '销售中心', url: '' }, { title: '单项产品预定', url: '/singleItem/reservationsProductList' }, { title: '单项产品预定列表', url: '/singleItem/reservationsProductList' }]
        },
        path: '/singleItem/reservationsProductList',
        name: 'reservationsProductList',
        component: (resolve) => require(['@/views/singleItem/reservationsProductList.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '销售中心',
            breadcrumb: [{ title: '销售中心', url: '' }, { title: '单项产品预定', url: '/singleItem/reservationDetails' }, { title: '预定详情页', url: '/singleItem/reservationDetails' }]
        },
        path: '/singleItem/reservationDetails',
        name: 'reservationDetails',
        component: (resolve) => require(['@/views/singleItem/reservationDetails.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '销售中心',
            breadcrumb: [{ title: '销售中心', url: '' }, { title: '单项产品预定', url: '/singleItem/reservationsProduct' }, { title: '单项产品预定', url: '/singleItem/reservationsProduct' }]
        },
        path: '/singleItem/reservationsProduct',
        name: 'reservationsProduct',
        component: (resolve) => require(['@/views/singleItem/reservationsProduct.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '订单中心',
            breadcrumb: [{ title: '订单中心', url: '' }, { title: '单项订单管理', url: '/singleItem/singleOrderPayment' }, { title: '单项订单支付', url: '/singleItem/singleOrderPayment' }]
        },
        path: '/singleItem/singleOrderPayment',
        name: 'singleOrderPayment',
        component: (resolve) => require(['@/views/singleItem/singleOrderPayment.vue'], resolve)
    },
    {
        meta: {
            parentMenu: '订单中心',
            breadcrumb: [{ title: '订单中心', url: '' }, { title: '单项订单管理', url: '/singleItem/changePriceSingleOrder' }, { title: '单项改价列表', url: '/singleItem/changePriceSingleOrder'}]
        },
        path: '/singleItem/changePriceSingleOrder',
        name: 'changePriceSingleOrder',
        component: (resolve) => require(['@/views/singleItem/changePriceSingleOrder.vue'], resolve)
    }
]

export default pages